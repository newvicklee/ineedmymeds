(function (window) {
    'use strict';

        /**
         * Creates a new Model instance and hooks up the storage.
         *
         * @constructor
         * @param {object} storage A reference to the client side storage class
         */

    //function Model(storage) {
    $( document ).ajaxError(function( event, jqxhr, settings, thrownError ) {
        window.location.replace("https://www.labitor.com/500");
    });
    function Model() {
        var self = this;
        //this.storage = storage;

        if($('head').hasClass('patient-view')) {
            this.dataPatientList = patientList;
        };


    }




    // Export to window

    window.app = window.app || {};
    window.app.Model = Model;

})(window);


