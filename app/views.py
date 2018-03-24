import sqlite3
import re
import datetime
import json

from flask import render_template, abort, request, g, jsonify
from app import app


# TODO move to config.py
DATABASE = 'ineedmy.db'


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db


def now_int():
    epoch = datetime.datetime.utcfromtimestamp(0)
    now = datetime.datetime.utcnow()
    return (now - epoch).total_seconds()


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    return


@app.route('/api/v1/search', methods=['GET'])
def search():
    drug = request.args.get('drug').lower()
    location = request.args.get('location')

    # get DB
    db = get_db()
    cur = db.cursor()

    # store search
    now = now_int()
    cur.execute('INSERT INTO Searches VALUES(?,?)', (drug, now))
    db.commit()

    # find drug in DB
    cur.execute('SELECT drug_id FROM DrugNames WHERE Name = ?', (drug,))
    exact_row = cur.fetchone()
    found = exact_row is not None

    # find variants
    no_spaces = re.sub('\\s+', '', drug)
    id_counts = dict()
    for idx in range(len(no_spaces)-2):
        trigram = no_spaces[idx:(idx+3)]
        for drug_id in cur.execute("""SELECT drug_id
FROM DrugNameParts
WHERE Part = ?
LIMIT 100""", (trigram,)):
            id_counts[drug_id[0]] = id_counts.get(drug_id[0], 0) + 1

    sorted_id_counts = sorted(list(id_counts.items()),
                              key=lambda tup: -1 * tup[1])

    result = {'known': found}
    if found:
        drug_id = exact_row[0]
        result['drug-id'] = drug_id

        # TODO get location using https://bcgov.github.io/ols-devkit/ale/
        loc_lat = 49.28202
        loc_long = -123.11875

        # record request
        cur.execute('INSERT INTO DrugRequests VALUES (?,?,?,?)',
                    (drug_id, now, loc_lat, loc_long))
        db.commit()

        # fetch availability
        pharmacies = list()
        for row in cur.execute("""SELECT pharma_id,
(lat - ?) * (lat - ?) + (long - ?) * (long - ?) AS distance
FROM PharmaLoc
ORDER BY distance ASC
LIMIT 10""", (loc_lat, loc_lat, loc_long, loc_long)):
            pharma_id = row[0]
            pharmacies.append({'id': pharma_id})

        for idx in range(len(pharmacies)):
            pharma_id = pharmacies[idx]['id']
            doc = json.loads(cur.execute(
                'SELECT doc FROM PharmaDoc WHERE oid = ?',
                (pharma_id,)).fetchone()[0])
            doc['id'] = pharma_id
            pharmacies[idx] = doc

            cur.execute(
                """SELECT availability, when_reported, by_pharmacist
FROM Availabilities
WHERE pharma_id = ?
AND drug_id = ?
ORDER BY when_reported""", (pharma_id, drug_id))
            row = cur.fetchone()
            if row is None:
                pharmacies[idx]['available'] = 'unknown'
            else:
                if row[0]:
                    pharmacies[idx]['available'] = 'yes'
                else:
                    pharmacies[idx]['available'] = 'no'

        result['pharmacies'] = pharmacies

    variants = []
    for variant_id, count in sorted_id_counts[:10]:
        cur.execute('SELECT name FROM DrugNames WHERE drug_id = ?',
                    (variant_id,))
        variants.append({
            'id': variant_id,
            'name': cur.fetchone()[0]
        })

    result['other-drugs'] = variants

    return jsonify(result)


@app.route('/api/v1/drug/<int:drug_id>/at/<int:pharma_id>/available',
           methods=['GET'])
def is_available(drug_id, pharma_id):
    # get DB
    db = get_db()
    cur = db.cursor()
    cur.execute("""SELECT availability, when_reported, by_pharmacist
FROM Availabilities
WHERE pharma_id = ?
AND drug_id = ?
ORDER BY when_reported""", (pharma_id, drug_id))
    probability = None
    last_seen = None
    last_seen_by_pharmacist = None
    # TODO compute availability with a better algo
    for row in cur:
        if probability is None:
            if row[0]:
                probability = 0.0
            else:
                probability = 1.0
                last_seen = row[1]
                if row[2]:
                    last_seen_by_pharmacist = row[1]
                    break
        else:
            if row[0]:
                if last_seen is None:
                    probability = (probability + 1.0) / 2.0
                    last_seen = row[1]
                if row[2]:
                    probability = (probability + 1.0) / 2.0
                    last_seen_by_pharmacist = row[1]
                    break
    return jsonify({
        'probability': probability,
        'last_seen': last_seen,
        'last_seen_by_pharmacist': last_seen_by_pharmacist
    })


@app.route('/api/v1/drug/<int:drug_id>/at/<int:pharma_id>/available',
           methods=['POST'])
def set_available(drug_id, pharma_id):
    by_pharmacist = request.args.get('by-pharmacist') or 0
    # get POST
    availability = 1 if '1' in str(request.get_data()) else '0'

    # get DB
    db = get_db()
    cur = db.cursor()

    # set availability
    now = now_int()
    cur.execute('INSERT INTO Availabilities VALUES(?,?,?,?,?)',
                (pharma_id, drug_id, availability, now, by_pharmacist))
    db.commit()

    return ""


@app.route('/api/v1/drug', methods=['POST'])
def drug_onboarding():
    if not request.json or 'name' not in request.json:
        abort(400)
    base_name = request.json['name']

    # get DB
    db = get_db()
    cur = db.cursor()

    # drug on-boarding
    doc = json.dumps({
        'name': base_name,
    })
    cur.execute('INSERT INTO DrugDoc VALUES(?)', (doc,))
    drug_id = cur.lastrowid

    # character 3-grams
    no_spaces = re.sub('\\s+', '', base_name)
    for idx in range(len(no_spaces)-2):
        trigram = no_spaces[idx:(idx+3)]
        cur.execute('INSERT INTO DrugNameParts VALUES(?,?)',
                    (trigram, drug_id))
    db.commit()

    return str(drug_id)


@app.route('/api/v1/pharmacy', methods=['POST'])
def pharmacy_onboarding():
    if not request.json or 'name' not in request.json or \
          'address' not in request.json or 'phone' not in request.json or \
          'lat' not in request.json or 'long' not in request.json:
        abort(400)

    # get DB
    db = get_db()
    cur = db.cursor()

    # pharmacy on-boarding
    doc = json.dumps({
        'name': request.json['name'],
        'address': request.json['address'],
        'lat': request.json['lat'],
        'long': request.json['long'],
        'phone': request.json['phone']
    })

    cur.execute('INSERT INTO PharmaDoc VALUES(?)', (doc,))
    pharma_id = cur.lastrowid

    cur.execute('INSERT INTO PharmaLoc VALUES(?,?,?)',
                (pharma_id,
                 float(request.json['lat']),
                 float(request.json['long'])))
    db.commit()

    return str(pharma_id)


@app.route('/api/v1/pharmacy/<int:pharma_id>', methods=['GET'])
def pharmacy_info(pharma_id):
    # get DB
    db = get_db()
    cur = db.cursor()

    # get pharmacy info
    doc = json.loads(cur.execute(
        'SELECT doc FROM PharmaDoc WHERE oid = ?', (pharma_id,)).fetchone()[0])
    doc['id'] = pharma_id

    # get drug availability
    cur.execute("""SELECT drug_id
FROM Availabilities
WHERE pharma_id = ?
AND availability = 1
ORDER BY when_reported
LIMIT 20""", (pharma_id,))
    drugs = list()
    for row in cur:
        drugs.append(row[0])
    doc['drugs'] = drugs

    return jsonify(doc)


@app.route('/api/v1/drug/<int:drug_id>', methods=['GET'])
def get_drug(drug_id):
    # get DB
    db = get_db()
    cur = db.cursor()

    # get name of drug for id
    row = cur.execute("""SELECT name, when_requested
FROM DrugNames
INNER JOIN DrugRequests ON DrugNames.drug_id = DrugRequests.drug_id
WHERE DrugNames.drug_id = ?
ORDER BY when_requested
LIMIT 1""", (drug_id,)).fetchone()

    return jsonify({
        'name': row[0],
        'last_requested': row[1]
    })


@app.route('/api/v1/drug/requested', methods=['GET'])
def drugs_requested():
    # get DB
    db = get_db()
    cur = db.cursor()

    # get recently requested drugs
    cur.execute("""SELECT DISTINCT drug_id
FROM DrugRequests
ORDER BY when_requested
LIMIT 30""")
    result = list()
    for row in cur:
        result.append(row[0])
    return jsonify(result)
