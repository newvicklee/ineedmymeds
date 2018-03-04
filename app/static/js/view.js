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


        if($('head').hasClass('client-view')) {
            this.showPharmaciesTemplate = Handlebars.compile($('#template-showPharmacies').html());
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

            /*
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
            */
            showPharmacies: function() {
                let pharmaciesData = data;
                $('#show-pharmacies').html(self.showPharmaciesTemplate(pharmaciesData));
            },


        };

        viewCommands[viewCmd]();
    };

    
    View.prototype.bind = function(event, handler, extraParameter) {
        var self = this;

        /*
        if (event === 'searchList') {
            $('#search-patient').keypress(function(event) {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                var searchPattern = $('#search-patient').val().trim();
                handler(searchPattern);
            });
        };
        */

        if (event === 'showPharmacies') {

            $('#show-pharmacies-button').on('click', function(el) {
                let medName = $('#search-med').val();
                handler(medName);
            });
        };




    };

// Export to window

    window.app = window.app || {};
    window.app.View = View;

}(window));



