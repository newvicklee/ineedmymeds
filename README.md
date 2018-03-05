# ineedmymeds
Open Data BC Hackathon 2018 Project

## Setup

```shell
cat create_db.sql | sqlite3 ineedmy.db
python import_drugs.py /usr/share/freemedforms/datapacks/appinstalled/drugs/master.db ./ineedmy.db
python import_pharmacies.py hlbcpharmaciesfeb282018.csv ineedmy.db  
```