const React = require('react');
const api = require('../utils/api');
import update from 'immutability-helper';

class Pharmacy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logged_in: true

        };
    };

    render() {
        let logged_in = this.state.logged_in;
        return (
            <div className="container-flex">
                <div className="content-container">
                    {!logged_in &&
                        <Login />}
                    {logged_in &&
                        <Welcome />}
                    {logged_in &&
                        <DrugsStock />}

                </div>
            </div>
        )
    };
};

class Login extends React.Component {
    constructor(props) {
        super(props);
    };

    render() {
        return (
                <div className="login-container">
                    <div className="postCard verticalCard fullWidthCard">
                        <h2 className="login-title">Login with your Pharmacy phone number*</h2>
                        <p className="asterisk-point">* Numbers only, no spaces or dashes</p>
                        <input className="login-input" autocomplete="off" placeholder="Phone Number" type="text" />
                        <button className="submit-button btn-blue" type="submit">Login</button>
                    </div>
                </div>
        )
    };
};

function Welcome (props) {
    return (
            <div className="column-container welcome-container">
                <h1>Welcome Nazs Pharmacy</h1>
                <p>6410 Main Street Vancouver, BC</p>
                <p>6043253241</p>
            </div>
    )
};

function DrugCheckbox (props) {
    let drugName = props.drugName;
    let checked = props.checked;
    let drugID = props.drugID;
    let checkedState = props.checkedState;
    let handleInputChange = props.handleInputChange;
    return (
              <div className="control-checkbox">
                <label className="control">
                    <input type="checkbox" 
                        checked={checkedState}
                        name={drugID}
                        value={drugName} 
                        onChange={handleInputChange}
                        type="checkbox" />
                    <span></span>
                    {drugName}
                </label>
              </div>
        )
};

class DrugsStock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inStock: [],
            newInStock: [],
            noStock: [],
            drugRequests: []
        };

        this.createDrugCheckbox = this.createDrugCheckbox.bind(this);
        this.addInStockState = this.addInStockState.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    };

    componentDidMount() {
        api.drugRequests()
           .then(function (drugRequests) {
               let updatedDrugRequests = this.addInStockState(drugRequests.data);
               this.setState(function() {
                   return {
                       drugRequests: updatedDrugRequests
                   }
               });
           }.bind(this));
    };

    handleInputChange(event) {
        let target = event.target;
        let value = target.checked;
        let drug_id = target.name;

        function findIndex (myArr, drug_id) {
            let result = myArr.findIndex(function (drug) {
                return drug.drug_id == drug_id;
            });
            return result;
        };

        function removeByKey (myObj, deleteKey) {
            return Object.keys(myObj)
                .filter(key => key !== deleteKey)
                .reduce((result, current) => {
                    result[current] = myObj[current];
                    return result;
                }, {});
        };

        function removeByIndex (myArr, deleteIndex) {
            const newArr = myArr.filter(function (el, index) {
                return index !== deleteIndex;
            });
            return newArr;
        };

        const index = findIndex(this.state.drugRequests, drug_id);

        const drugRequests = update(this.state.drugRequests,
                {[index]: {in_stock: {$apply: function(x) {return !x;}}}});

        if (drugRequests[index].in_stock == false) {
            /* If user unclicks a checkbox, 
             *     * add drug to noStock state
             *     * remove drug from inStock and newInStock states
             */

            let noStock = update(this.state.noStock, 
                    {$push: [drugRequests[index]]});
            let newInStock = removeByIndex(this.state.newInStock, findIndex(this.state.newInStock, drug_id));
            let inStock = removeByIndex(this.state.inStock, findIndex(this.state.inStock, drug_id));
            this.setState({
                newInStock: newInStock, 
                inStock: inStock,
                drugRequests: drugRequests, 
                noStock: noStock
            }, function() { return console.log(this.state);});
        };
        if (drugRequests[index].in_stock == true) {
            /* If user clicks a checkbox, 
             *     * remove drug from noStock state
             *     * add drug to inStock and newInStock states
             */
            let newInStock = update(this.state.newInStock,
                    {$push: [drugRequests[index]]});
            let inStock = update(this.state.inStock,
                    {$push: [drugRequests[index]]});
            let noStock = removeByIndex(this.state.noStock, findIndex(this.state.noStock, drug_id));
            this.setState({
                newInStock: newInStock, 
                inStock: inStock,
                drugRequests: drugRequests, 
                noStock: noStock
            }, function() { return console.log(this.state);});
        };
       
    };

    handleSubmit(event) {
        event.preventDefault();
        let json_data = {
            //TODO: Set pharma_id
            newInStock: this.state.newInStock,
            noStock: this.state.noStock
        };
        console.log(json_data);
        api.setAvailability(json_data);
    };

    createDrugCheckbox(drug) {
        return <DrugCheckbox
                    checkedState={drug.in_stock}
                    drugID={drug.drug_id}
                    drugName={drug.name}
                    key={drug.drug_id}
                    handleInputChange={this.handleInputChange}
                />;
    };

    addInStockState(drugRequests) {
        /*
         * Adds the in_stock property for each drug in drugRequests, sets the default in_stock to false
         *
         * @param {array of objects} drugRequests is the array that is returned from api.drugRequests()
         *
         * @returns {array of objects} Returns drugRequests but each drug object has a new property in_stock that defaults to false
         */
        drugRequests.map(function (drug) {
            drug.in_stock = false;
        });
        return drugRequests;
    };

        

    render() {
        let createDrugCheckbox = this.createDrugCheckbox;
        let drugCheckboxes = this.state.drugRequests.map(createDrugCheckbox);
        let handleSubmit = this.handleSubmit;
        return (
            <div>
                <div className="column-container width-full align-left">
                    <h2>What do you have in stock?</h2>
                </div>
                <div className="post">
                    <div className="postCard width-full drug-checkboxes">
                        {drugCheckboxes}
                    </div>
                </div>
                <div className="column-container width-full">
                    <button className="submit-button btn-blue" type="submit" onClick={handleSubmit}>Save</button>
                </div>
            </div>
        )
    };
};

module.exports = Pharmacy;
