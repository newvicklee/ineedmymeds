from flask import render_template, flash, abort, redirect, session, url_for, request, g, jsonify, make_response
from app import app


search_stub = {
    'drug-id': 5,
    'other-drugs': [  { 'id': 2, 'name': 'other' }, {'id':3, 'name': 'yet another'} ],
    'pharmacies': [ 5, 2, 9 ],
    'known': True
}

availability_stub = {
    'probability': 70,
    'last_seen_date': 1520107909,
    'last_seen_by_pharmacist': 1520107909
}

pharmacy_info_stub = {
    'name': 'Super Drugs',
    'address': 'Hastings on Hudson',
    'phone-number': 'Hastings on Hudson',
    'drugs': [ 5, 8, 11, 12 ]
}

drug_stub = {
    'name': 'Happy Pill',
    'last_requested': 1520107909
}


@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    return



@app.route('/api/v1/search', methods=['GET'])
def search():
    drug = request.args.get('drug')
    location = request.args.get('location')
    #TODO find drug in DB
    #TODO find locatio through web-service
    return jsonify(search_stub)

@app.route('/api/v1/drug/<int:drug_id>/at/<int:pharmacy_id>/available', methods=['GET'])
def is_available(drug_id, pharmacy_id):
    #TODO compute availability
    return jsonify(search_stub)

@app.route('/api/v1/drug/<int:drug_id>/at/<int:pharmacy_id>/available', methods=['POST'])
def set_available(drug_id, pharmacy_id):
    drug = request.args.get('by-pharmacist')
    #TODO get POST
    #TODO set availability    
    return ""

@app.route('/api/v1/drug', methods=['POST'])
def drug_onboarding():
    if not request.json or not 'name' in request.json:
        abort(400)
    #TODO drug on-boarding
    return "5"

@app.route('/api/v1/pharmacy', methods=['POST'])
def pharmacy_onboarding():
    if not request.json or not 'name' in request.json:
        abort(400)
    #TODO pharmacy on-boarding
    return "5"

@app.route('/api/v1/pharmacy/<int:pharmacy_id>', methods=['GET'])
def pharmacy_info(pharmacy_id):
    #TODO get pharmacy info
    return jsonify(pharmacy_info_stub)

@app.route('/api/v1/drug/<int:drug_id>', methods=['GET'])
def get_drug(drug_id):
    #TODO get name of drug for id
    return jsonify(drug_stub)

@app.route('/api/v1/drug/requested', methods=['GET'])
def drugs_requested():
    #TODO get recently requested drugs
    return jsonify([ 5, 7, 11, 12 ])

