(function () {
    'use strict';

        /**
         * Sets up a brand new /patient app
         *
         * @param {string} name The name of your new /patient app
         */

    function PatientApp(name) {
        //this.storage = new app.Store(name);
        //this.model = new app.Model(this.storage);
        this.helper = new app.Helper();
        this.model = new app.Model();
        this.view = new app.View(this.model, this.helper);
        this.controller = new app.Controller(this.model, this.view);
    }

    var patientapp = new PatientApp('ineedmymeds');

    function setView() {
        patientapp.controller.setView();
    }

    // Initializes setView when DOM is loaded
    $(setView());

})();

