import re
import requests
from bs4 import BeautifulSoup
import csv
import time


def pharmacy_list():

    url = "http://www.bcpharmacists.org/list-community-pharmacies"
    page = requests.get(url)
    soup = BeautifulSoup(page.content, 'html.parser')


    table = soup.find_all('table')[0]
    table_rows = table.find_all('tr')
    del table_rows[0]

    with open('pharmacies_list.csv', 'w') as csvfile:
        fieldnames = ['name', 'address', 'manager', 'phone', 'fax']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()

        for index, table_row in enumerate(table_rows, 0):
            cells = table_row.findAll('td')
            #Finding name
            name = cells[0].text.strip()

            #Finding address
            address = cells[1].text.strip()

            #Manager
            manager = cells[2].text.strip()

            #Phone
            raw_phone = cells[3].text.strip()
            phone = re.sub("\D", "", raw_phone)

            #Fax
            raw_fax = cells[4].text.strip()
            fax = re.sub("\D", "", raw_fax)

            writer.writerow({'name': name, 'address': address, 'manager': manager, 'phone': phone, 'fax': fax})



pharmacy_list()
