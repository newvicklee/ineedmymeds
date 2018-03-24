# ineedmymeds

Open Data BC Hackathon 2018 Project. Helps crowdsource information relative to medication shortages.

More info, see the [API](API.md).

## Why this is needed?

* Medication shortages happen all the time.
* There’s no way to predict these shortages
* What happens if you need a medication but it’s not available in your pharmacy?
** The pharmacy calls the nearest 5 pharmacies to see if anyone has it

## Setup

```shell
cat create_db.sql | sqlite3 ineedmy.db
python import_drugs.py /usr/share/freemedforms/datapacks/appinstalled/drugs/master.db ./ineedmy.db
python import_pharmacies.py hlbcpharmaciesfeb282018.csv ineedmy.db  
```