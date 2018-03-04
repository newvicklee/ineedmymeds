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

    Model.prototype.searchMed = function(medName, callback) {
        $.ajax({
            dataType: "json",
            url: "/api/v1/search",
            type: "GET",  
            contentType: "application/json",
            data: JSON.stringify({drug: medName}),
            success: function(successData){    
                //console.log("Successfully made an ajax call");
                //console.log(successData.update_msg);
                callback(successData);
            },
            error: function(error) {
            }
        });
    };




    // Export to window

    window.app = window.app || {};
    window.app.Model = Model;

})(window);


