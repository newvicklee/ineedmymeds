const React = require('react');
const api = require('../utils/api');


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
            drugsInStock: [],
            drugRequests: []
        };

        this.createDrugCheckbox = this.createDrugCheckbox.bind(this);
        this.addInStockState = this.addInStockState.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
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
        let name = target.name;

        let index = this.state.drugRequests.findIndex(function (drug) {
            return drug.drug_id == name;
        });
        const drugRequests = [...this.state.drugRequests];
        drugRequests[index].in_stock = !drugRequests[index].in_stock;
        
        this.setState(function() {
            return { drugRequests };
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

    addInStockState(drugRequests) {
        /*
         * Adds the in_stock property for each drug in drugRequests, sets the default in_stock to false
         *
         * @param {array of objects} drugRequests is the array that is returned from api.drugRequests()
         *
         * @returns {array of objects} Returns drugRequests but each drug object has a new property in_stock that defaults to false
         */
        drugRequests.map(function (drug) {
            drug.in_stock = true;
        });
        return drugRequests;
    };

        

    render() {
        let createDrugCheckbox = this.createDrugCheckbox;
        let drugCheckboxes = this.state.drugRequests.map(createDrugCheckbox);
        console.log(this.state.drugRequests);
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
            </div>
        )
    };
};

module.exports = Pharmacy;
