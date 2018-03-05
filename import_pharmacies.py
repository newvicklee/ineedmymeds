import csv
import sys
import re
import json
import sqlite3

# Usage:
# python import_pharmacies.py /path/to/hlbcpharmaciesfeb282018.csv (from https://catalogue.data.gov.bc.ca/dataset/after-hours-pharmacies-in-bc/resource/681b4fa5-13a5-4273-a189-fc101f0f8356) /path/to/ineedmy.db (for example ./ineedmy.db)

if __name__=='__main__':
    tgt_conn = sqlite3.connect(sys.argv[2])
    
    with open(sys.argv[1], 'r') as csvfile:
        csvreader = csv.reader(csvfile)
        header_dict = None
        for row in csvreader:
            if header_dict is None:
                header_dict = dict()
                for idx in range(len(row)):
                    header_dict[row[idx]] = idx
            else:
                name = row[header_dict['RG_NAME']]
                address = "{} {} {} {} {} {}".format(
                    row[header_dict['STREET_NUMBER']],
                    row[header_dict['STREET_NAME']], 
                    row[header_dict['STREET_TYPE']], 
                    row[header_dict['STREET_DIRECTION']], 
                    row[header_dict['CITY']], 
                    row[header_dict['POSTAL_CODE']])
                loc_lat = float(row[header_dict['LATITUDE']])
                loc_long = float(row[header_dict['LONGITUDE']])
                phone = str(row[header_dict['PHONE_NUMBER']])

                doc = json.dumps({
                    'name': name,
                    'address': address,
                    'lat': loc_lat,
                    'long': loc_long,
                    'phone': phone
                })
                    
                cur = tgt_conn.cursor()
                cur.execute('INSERT INTO PharmaDoc VALUES(?)', (doc,))
                pharma_id = cur.lastrowid

                cur.execute('INSERT INTO PharmaLoc VALUES(?,?,?)', (pharma_id,loc_lat,loc_long))
                    
    tgt_conn.commit()
                                
            
