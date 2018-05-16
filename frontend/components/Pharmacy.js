const React = require('react');
const api = require('../utils/api');
import update from 'immutability-helper';

class Pharmacy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logged_in: false,
            pharmacy_info: null,
            pharmacy_drugs: null,
            drug_requests: null

        };

        this.handleLogin = this.handleLogin.bind(this);
    };

    handleLogin(pharmacy_info, pharmacy_drugs) {
        this.setState(function () {
            return {
                logged_in: true,
                pharmacy_info: pharmacy_info,
                pharmacy_drugs: pharmacy_drugs
            }
        });
    };



    render() {
        let logged_in = this.state.logged_in;
        let pharmacy_info = this.state.pharmacy_info;
        let pharmacy_drugs = this.state.pharmacy_drugs;
        return (
            <div className="container-flex">
                <div className="content-container">
                    {!logged_in &&
                        <Login 
                            logged_in={logged_in}
                            handleLogin={this.handleLogin}
                            />}
                    {logged_in &&
                        <Welcome 
                            pharmacy_info={pharmacy_info}
                            />}
                    {logged_in &&
                        <DrugStock 
                            pharmacy_drugs={pharmacy_drugs}
                            pharmacy_info={pharmacy_info}
                            />}

                </div>
            </div>
        )
    };
};

function Notification (props) {
    let error = props.notification.errorMsg;
    let success = props.notification.successMsg;
    return (
        <div className="notification-container">
            <div className="notification-card">
                {error &&
                    <div className="notification-error">
                        <h4 className="notification-error-title">{error}</h4>
                    </div>
                }
                {success &&
                    <div className="notification-success">
                        <h4 className="notification-success-title">{success}</h4>
                    </div>
                }
                {/*<div className="notification-message"></div>
                     TODO: Implement notification-dismiss control 
                        <span className="notification-dismiss">x</span>*/}
            </div>
        </div>
    )
};
        
            


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: null,
            notification: null
        };

        this.handleLogin = this.handleLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.notificationReset = this.notificationReset.bind(this);
    };

    notificationReset(seconds) {
        // Resets the notification state to null after 'seconds'
        let self = this;
        setTimeout(function () {
            self.setState({ notification: null });
        }, seconds * 1000);
    };

    handleChange(event) {
        let phone = event.target.value;
        this.setState(function () {
            return { phone: phone }
        });
    };

    handleLogin(event) {
        event.preventDefault();
        self = this;
        let phone = this.state.phone;
        api.logIn(phone)
            .then(function (response) {
                if (response.data.errorMsg) {
                    self.setState({ notification: response.data });
                    self.notificationReset(2);
                } else {
                    self.setState({ notification: null });
                    let pharmacy_info = response.data.info;
                    let pharmacy_drugs = response.data.drugs;
                    self.props.handleLogin(pharmacy_info, pharmacy_drugs);
                };
            });
    };

    render() {
        let handleChange = this.handleChange;
        let notification = this.state.notification;
        return (
                <div className="login-container">
                    <div className="postCard verticalCard fullWidthCard">
                        <h2 className="login-title">Log in with your Pharmacy phone number*</h2>
                        <p className="asterisk-point">* Numbers only, no spaces or dashes</p>
                        <input className="login-input" autoComplete="off" placeholder="Phone Number" type="text" onChange={this.handleChange}/>
                        <button className="submit-button btn-blue" type="submit" onClick={this.handleLogin}>Login</button>
                    </div>
                    {notification &&
                    <Notification 
                        notification={notification}
                        />}
                </div>
        )
    };
};

function Welcome (props) {
    let name = props.pharmacy_info.name;
    let address = props.pharmacy_info.address;
    let phone = props.pharmacy_info.phone;
    return (
            <div className="column-container welcome-container">
                <h1>{name}</h1>
                <p>{address}</p>
                <p>{phone}</p>
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

class DrugStock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            /* Each of the states newInStock, noStock, drugList is an Array of Objects.
             * 
             * Each object in an array has three properties:
             *          drug_id: {integer},
             *          name: {string},
             *          in_stock: {boolean}
             * 
             * drugs is an array with both drug requests and drugs in stock (initialized in componentDidMount)
             * noStock contains drugs that the pharmacy no longer has in stock compared to last time
             * newInStock contains drugs that the pharmacy has in stock compared to the last time. 
             *
             * Both newinStock and noStock are sent to the backend once the user 'Saves' the data
             * 
             */
            newInStock: [],
            noStock: [],
            drugList: [],
            notification: null,
        };

        this.createDrugCheckbox = this.createDrugCheckbox.bind(this);
        this.addInStockState = this.addInStockState.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.removeDuplicates = this.removeDuplicates.bind(this);
        this.notificationReset = this.notificationReset.bind(this);
    };

    componentDidMount() {
        /* Initializes the drugList state with drugs the pharmacy has in stock, and also drug requests from clients
         *
         *      Adds a in_stock property to each drug. 
         *
         */
        let inStock = this.props.pharmacy_drugs;
        let updatedInStock = this.addInStockState(inStock, true);

        api.drugRequests()
           .then(function (response) {
               // response.data is the drugRequests data, an array of objects
               let drugRequests = this.removeDuplicates(inStock, response.data, 'drug_id');
               let updatedDrugRequests = this.addInStockState(drugRequests, false);
               let drugList = [].concat(updatedInStock, updatedDrugRequests);
               this.setState(function() {
                   return {
                       drugList: drugList
                   }
               });
           }.bind(this));
    };

    notificationReset(seconds) {
        // Resets the notification state to null after 'seconds'
        let self = this;
        setTimeout(function () {
            self.setState({ notification: null });
        }, seconds * 1000);
    };

    removeDuplicates(arr1, arr2, property) {
         /* Creates a new array that is a copy of arr2 but without the elements in arr1 that have the same {property} value as the elements in arr2
         * @param {array of objects} arr1
         * @param {array of objects} arr2
         * @param {string} property: the property that is used to compare between arr1 and arr2 elements
         *
         * @return {array of objects} newArr
         */
        let newArr = arr2.filter(function (element2) {
            let result = true;
            arr1.forEach(function (element1) {
                if (element1[property] == element2[property]) {
                    result = false;
                    return result;
                };
            });
            return result;
        });
        return newArr;
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

        let index = findIndex(this.state.drugList, drug_id);

        const drugList = update(this.state.drugList,
                {[index]: {in_stock: {$apply: function(x) {return !x;}}}});

        if (drugList[index].in_stock == false) {
            /* If user unclicks a checkbox, 
             *     * add drug to noStock state
             *     * remove drug from newInStock states if applicable
             */

            let noStock = update(this.state.noStock, 
                    {$push: [drugList[index]]});
            let newInStock = removeByIndex(this.state.newInStock, findIndex(this.state.newInStock, drug_id));
            this.setState({
                newInStock: newInStock, 
                drugList: drugList, 
                noStock: noStock
            });
        };
        if (drugList[index].in_stock == true) {
            /* If user clicks a checkbox, 
             *     * remove drug from noStock state
             *     * add drug to inStock and newInStock states
             */
            let newInStock = update(this.state.newInStock,
                    {$push: [drugList[index]]});
            let noStock = removeByIndex(this.state.noStock, findIndex(this.state.noStock, drug_id));
            this.setState({
                newInStock: newInStock, 
                drugList: drugList, 
                noStock: noStock
            });
        };
       
    };

    handleSubmit(event) {
        event.preventDefault();
        let self = this;
        let data = {
            pharma_id: this.props.pharmacy_info.pharma_id,
            newInStock: this.state.newInStock,
            noStock: this.state.noStock
        };
        api.setAvailability(data)
            .then(function (response) {
                self.setState({ notification: response.data });
                self.notificationReset(2);
            });

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

    addInStockState(drugRequests, trueOrFalse) {
        /*
         * Adds the in_stock property for each drug in drugRequests
         *
         * @param {array of objects} drugRequests is the array that is returned from api.drugRequests()
         *
         * @returns {array of objects} Returns drugRequests but each drug object has a new property in_stock 
         */
        drugRequests.map(function (drug) {
            drug.in_stock = trueOrFalse;
        });
        return drugRequests;
    };

        

    render() {
        let createDrugCheckbox = this.createDrugCheckbox;
        let drugCheckboxes = this.state.drugList.map(createDrugCheckbox);
        let handleSubmit = this.handleSubmit;
        let notification = this.state.notification;
        return (
            <div>
                {notification &&
                    <Notification 
                        notification={notification}
                        />}
                <div className="column-container width-full align-left">
                    <h2>What do you have in stock?</h2>
                </div>
                <div className="post-container">
                    <div className="post">
                        <div className="postCard width-full drug-checkboxes">
                            {drugCheckboxes}
                        </div>
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
