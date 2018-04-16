# ineedmymeds

Open Data BC Hackathon 2018 Project. ineedmymeds crowdsources information about medication availability from different pharmacies.


## Why this is needed?

* Medication shortages happen all the time.
* There’s no way to predict these shortages
* What happens if you need a medication but it’s not available in your pharmacy?
    * The pharmacy calls the nearest X pharmacies to see if anyone has it
    * It's unrealistic for your pharmacy to call the hundreds of other pharmacies in the city so the patient is left without access to that medication

## Built With

* [Flask](https://github.com/pallets/flask) - Our backend API is a Flask App which responds to requests in JSON
* [React.js](https://github.com/facebook/react/) - Our front end is a React.js app that communicates with the Flask API.

## Setting up the database

There are two open source databases that we use. Download them here:
    * BC After Hours Pharmacies [List](https://catalogue.data.gov.bc.ca/dataset/after-hours-pharmacies-in-bc/resource/681b4fa5-13a5-4273-a189-fc101f0f8356)
    * Free Drugs [Database](https://packages.debian.org/sid/freemedforms-freedata)

```shell
cat create_db.sql | sqlite3 ineedmy.db
python import_drugs.py /usr/share/freemedforms/datapacks/appinstalled/drugs/master.db ./ineedmy.db
python import_pharmacies.py hlbcpharmaciesfeb282018.csv ineedmy.db  
```

## Installing Dependencies

Python:

```shell
(venv) pip3 install -r requirements.txt
```

NPM:

```shell
npm install
```

## Start the App

Python:

```shell
(venv) python run.py
````

React:

```shell
npm run start
```

## Contributors

* [Pablo Duboue](http://duboue.net/)
* Newvick Lee








