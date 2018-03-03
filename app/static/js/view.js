(function (window) {
    'use strict';

            /**
             * View that abstracts away the browser's DOM completely.
             * It has two simple entry points:
             *
             *   - bind(eventName, handler)
             *     Takes a  application event and registers the handler
             *   - render(command, parameterObject)
             *     Renders the given command with the options
             */

    function View(model, helper) {

        this.model = model;
        this.helper = helper;


        if($('head').hasClass('patient-view')) {
            this.patientListTemplate = Handlebars.compile($('#template-patientlist').html());
            this.showSelectedPatientTemplate = Handlebars.compile($('#template-showSelectedPatient').html());
        };


    }


    View.prototype.render = function(viewCmd, data) {
        /*
         * @param (viewCmd)
         * @param (data) -> pass through the data you wish to render
         *
         */

        var self = this;

	var viewCommands = {

            patientList: function() {
                var patientList = self.model.read();
                if(self.patientListTemplate) {
                    $('#patient-list').html(self.patientListTemplate(patientList));
                };
            },

            searchList: function() {
                if (self.patientListTemplate) {
                    $('#patient-list').html(self.patientListTemplate(data));
                };
            },

            showSelectedPatient: function() {
                var selectedPatientInfo = data;
                $('#show-selected-patient').html(self.showSelectedPatientTemplate(selectedPatientInfo));
                self.render('showLabChart', selectedPatientInfo);
            },


        };

        viewCommands[viewCmd]();
    };

    
    View.prototype.bind = function(event, handler, extraParameter) {
        var self = this;


        if (event === 'searchList') {
            $('#search-patient').keypress(function(event) {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                var searchPattern = $('#search-patient').val().trim();
                handler(searchPattern);
            });
        };

        if (event === 'showSelectedPatient') {

            $('#patient-list, #patientname-list').on('click', '.patient-name-tag', function(el) {
                var phn = el.target.id;
                var patientNameList = self.model.dataPatientList;
                var selectedPatientPhn = '';

                for (var i = 0; i < patientNameList.length; i++) {
                    if (parseInt(patientNameList[i].phn) === parseInt(phn)) {
                        selectedPatientPhn = patientNameList[i].phn;
                    };
                };
                handler(selectedPatientPhn);
            });
        };




    };

// Export to window

    window.app = window.app || {};
    window.app.View = View;

}(window));



