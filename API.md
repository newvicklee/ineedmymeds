# API

The API endpoint is [http://ineedmymeds.ca/api/v1/](http://ineedmymeds.ca/api/v1/)

## search

`GET /search?drug=<drug strings>&location=<location string>`

returns JSON object with fields:

* drug-id: integer, the drug being searched
* other-drugs: [ array of objects { id: integer, name: string } ]
* pharmacies: [ array of objects {pharmacy-id: integer, pharmacy-name: string, pharmacy-address: string, pharmacy-phone: string} ]
* known: boolean (whether the drug is known or not)

The array of pharmacies is ranked by proximity / availability

## availability

`GET /drug/<Int (drug-id)>/at/<Int (pharmacy-id)>/available`

returns JSON object with fields

* probability: float, likelihood it will be available (algorithm TBD)
* last_seen: date, in seconds after epoch in UTC-0
* last_seen_by_pharmacist: date, in seconds after epoch in UTC-0

`POST /drug/<Int (drug-id)>/at/<Int (pharmacy-id)>/available?by-pharmacist=(0|1)`

post a 1 or a 0

returns HTTP 200 on success 

## onboarding

`POST /pharmacy`

JSON object with fields:

* name
* address
* phone number

returns Int (pharmacy-id)

`POST /drug`

JSON object with fields:

* name: string
* last_requested: seconds from epoch, UTC-0

returns Int (drug-id)

## pharmacy

`GET /pharmacy/<Int (pharmacy-id)>`

return JSON object with fields:

* name
* address
* phone number
* drugs: [ array of <Int (drug-id)> ]

## drugs

`GET /drug/<Int (drug-id)>`

return JSON object with fields:

* name

`GET /drug/requested`

returns a JSON array of drug-id for the top-N (30?) most recently requested drugs

# DB

Tables:

* DrugDoc (id, doc)
* PharmaDoc (id, doc)
* DrugNames (name, drug_id)
* DrugNameParts (part, drug_id)
* DrugRequests (drug_id, when_requested, location_lat, location_long)
* PharmaLoc (pharma_id, lat, long)
* Searches (search_str, when_requested)
* Availabilities (pharma_id, drug_id, availability, when_updated, by_pharmacist)

Comments:

"Doc" is unnormalized (json doc)
"Parts" will be character 3 grams
"Loc" is gps location. We need the correction factor for Vancouver as don't want to install a GIS

# Data sources

* Data Drug database from Debian package [freemedforms-freedata](https://packages.debian.org/sid/freemedforms-freedata) (free extra-data for the FreeMedForms project). SQLite3 file at `/usr/share/freemedforms/datapacks/appinstalled/drugs/master.db`.
* BC Open Data Set [after-hours-pharmacies](https://catalogue.data.gov.bc.ca/dataset/after-hours-pharmacies-in-bc/resource/681b4fa5-13a5-4273-a189-fc101f0f8356)
* BC Geocoder Address List Editor (https://bcgov.github.io/ols-devkit/ale/)