import csv
import sys
import json
import sqlite3

# Usage:
# python import_pharmacies.py /path/to/pharmacies_list.csv
#   (from http://www.bcpharmacists.org/list-community-pharmacies)
#   /path/to/ineedmy.db (for example ./ineedmy.db)

if __name__ == '__main__':
    tgt_conn = sqlite3.connect(sys.argv[2])

    with open(sys.argv[1], 'r') as csvfile:
        csvreader = csv.reader(csvfile)
        next(csvreader) #skip header
        for row in csvreader:
            name = row[0]
            address = row[1].replace('\n', ' ')
            manager = row[2]
            phone = row[3]
            fax = row[4]

            cur = tgt_conn.cursor()
            cur.execute('INSERT INTO PharmaDoc (name, address, phone, fax, manager) VALUES(?, ?, ?, ?, ?)', ((name, address, phone, fax, manager)))

    tgt_conn.commit()
