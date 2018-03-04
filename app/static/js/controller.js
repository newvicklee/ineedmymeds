(function (window) {
    'use strict';

        /**
         * Takes a model and view and acts as the controller between them
         *
         * @constructor
         * @param {object} model The model instance
         * @param {object} view The view instance
         */

    function Controller(model, view) {
        var self = this;
        self.model = model;
        self.view = view;


	self.view.bind('showPharmacies', function(medName) {
            self.showPharmacies(medName);
        });



    }


    Controller.prototype.setView = function() {
        //this.view.render('patientList');
    };

    Controller.prototype.showPharmacies = function(medName) {
        self.model.searchMed(medName, function(pharmacyList) {
            self.view.render('showPharmacies', pharmacyList);
        });
    };

    Controller.prototype.searchList = function(searchPattern) {
        var self = this;
        var matchedList = [];
        var patientList = self.model.dataPatientList;
        var searchedPatients = {
            searchedList: []
        };


        var search = function(pattern) {
            var pattern = pattern;
            var regpattern = new RegExp(pattern, 'i');
            for (var i in patientList) {
                var fullName = patientList[i].firstname + ' ' + patientList[i].lastname;
                if (regpattern.test(fullName)) {
                    matchedList.push(patientList[i].phn);
                };
            };
        };

        search(searchPattern);

        for (var i in patientList) {
            for (var q in matchedList) {
                if (patientList[i].phn === matchedList[q]) {
                    searchedPatients.searchedList.push(patientList[i]);
                };
            };
        };


        self.view.render('searchList', searchedPatients);
        self.view.render('hidePatientList');
        self.view.render('removeSelectedPatientTemplate');

    };


    Controller.prototype.showSelectedPatient = function(selectedPatientPhn, tableID) {
        var self = this;
        self.model.readPatientInfo(selectedPatientPhn, function(selectedPatientInfo) {
            self.model.tablePaginator(selectedPatientInfo, 'default', 1, 5, function(paginated_patientViewData) {
                self.view.render('clearSearch');
                self.view.render('hidePatientList');
                self.view.render('showSelectedPatient', paginated_patientViewData);
            });
        });
    };




    //Export to window

    window.app = window.app || {};
    window.app.Controller = Controller;

})(window);

