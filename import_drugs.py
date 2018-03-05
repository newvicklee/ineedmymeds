import sqlite3
import sys
import re
import json


# Usage:
# python import_drugs.py /path/to/freemedforms-freedata/master.db (for example /usr/share/freemedforms/datapacks/appinstalled/drugs/master.db) /path/to/ineedmy.db (for example ./ineedmy.db)

if __name__=='__main__':
    src_conn = sqlite3.connect(sys.argv[1])
    tgt_conn = sqlite3.connect(sys.argv[2])

    seen = set()

    for row in src_conn.execute('SELECT * FROM t3'):
        name = row[2]
        base_name = name.lower()

        if base_name in seen:
            continue

        seen.add(base_name)

        # insert in DrugDoc, get ID
        cur = tgt_conn.cursor()
        doc = json.dumps({
            'name': base_name,
        })
        cur.execute('INSERT INTO DrugDoc VALUES(?)', (doc,))
        drug_id = cur.lastrowid

        # names
        cur.execute('INSERT INTO DrugNames VALUES(?,?)', (base_name, drug_id))

        # character 3-grams
        no_spaces = re.sub('\\s+', '', base_name)
        for idx in range(len(no_spaces)-2):
            trigram = no_spaces[idx:(idx+3)]
            cur.execute('INSERT INTO DrugNameParts VALUES(?,?)', (trigram, drug_id))
        
    tgt_conn.commit()

        
    

        

        
