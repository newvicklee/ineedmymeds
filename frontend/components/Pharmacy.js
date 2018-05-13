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
                            />}

                </div>
            </div>
        )
    };
};

function Notification (props) {
    let error = props.error_msg;
    return (
        <div className="notification-container">
            <div className="notification-card">
                <div className="notification-error">
                    <h4 className="notification-title">{error}</h4>
                    <div className="notification-message"></div>
                    {/* TODO: Implement notification-dismiss control 
                        <span className="notification-dismiss">x</span>*/}
                </div>
            </div>
        </div>
    )
};
        
            


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: null,
            error: null
        };

        this.handleLogin = this.handleLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);
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
                if (response.data.unsuccessful) {
                    self.setState(function () {
                        return {
                            error: response.data.unsuccessful
                        }
                    });
                } else {
                    self.setState(function () {
                        return { error: null }
                    });
                    let pharmacy_info = response.data.info;
                    let pharmacy_drugs = response.data.drugs;
                    self.props.handleLogin(pharmacy_info, pharmacy_drugs);
                };
            });
    };

    render() {
        let handleChange = this.handleChange;
        let error = this.state.error;
        return (
                <div className="login-container">
                    <div className="postCard verticalCard fullWidthCard">
                        <h2 className="login-title">Log in with your Pharmacy phone number*</h2>
                        <p className="asterisk-point">* Numbers only, no spaces or dashes</p>
                        <input className="login-input" autoComplete="off" placeholder="Phone Number" type="text" onChange={this.handleChange}/>
                        <button className="submit-button btn-blue" type="submit" onClick={this.handleLogin}>Login</button>
                    </div>
                    {error &&
                    <Notification 
                        error_msg={error}
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
            inStock: [],
            newInStock: [],
            noStock: [],
            drugRequests: [],
        };

        this.createDrugCheckbox = this.createDrugCheckbox.bind(this);
        this.addInStockState = this.addInStockState.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    };

    componentDidMount() {
        /* Initializes the drugRequests and inStock state. 
         *
         *      Adds the default in_stock propery to each drug. 
         *
         */
        let inStock = this.props.pharmacy_drugs;
        let updatedInStock = this.addInStockState(inStock, true);

            


        api.drugRequests()
           .then(function (drugRequests) {
               let updatedDrugRequests = this.addInStockState(drugRequests.data, false);
               this.setState(function() {
                   return {
                       drugRequests: updatedDrugRequests,
                       inStock: updatedInStock
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
            });
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
            });
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
        let drugRequests = this.state.drugRequests.map(createDrugCheckbox);
        let drugsInStock = this.state.inStock.map(createDrugCheckbox);
        let drugCheckboxes = [].concat(drugsInStock, drugRequests);
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
