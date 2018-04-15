
var medSearch = new Vue({
    el: '#search-med',
    methods: {
        searchMed: function (event) {
            let medName = document.getElementById('input-med');
            let vm = this;
            axios.get('/api/v1/search', {
                params: {
                    drug: medName,
                    location: 'Vancouver'
                }
            })
            .then(function (response) {
                vm.            


