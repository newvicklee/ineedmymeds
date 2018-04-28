const React = require('react');
const ReactDOM = require('react-dom');
const api = require('./utils/api');
require('./style.scss');
import logo from './imgs/logo.png';

//var App = require('./components/App');





class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            submitted: false,
            drugIsKnown: null,
            pharmacyInfo: null,
            otherDrugs: null
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateKnownDrugPharmacies = this.updateKnownDrugPharmacies.bind(this);
    };

    handleSubmit(newSearchText) {
        const self = this;
        this.setState(function () {
            return {
                searchText: newSearchText,
                submitted: true,
            }
        }, function () {
            api.search(this.state.searchText)
                .then(function (response) {
                    self.updateKnownDrugPharmacies(response);
                });
        });
    };


    updateKnownDrugPharmacies(response) {
        /* Takes the promise returned from api.search() and updates whether drugIsKnown and pharmacyInfo
         *
         * Parameters
         * ----------
         *
         *  response (json): returned from api.search()
         *
         */
        let newPharmacyInfo;
        if (response.data.pharmacies === undefined) {
            newPharmacyInfo = null;
        } else {
            newPharmacyInfo = response.data.pharmacies;
        };

        this.setState(function () {
            return {
                drugIsKnown: response.data.known,
                pharmacyInfo: newPharmacyInfo,
                otherDrugs: response.data['other-drugs']
            };
        });
    };




    render () {
        let submitted = this.state.submitted;
        let drugIsKnown = this.state.drugIsKnown;
        let otherDrugs = this.state.otherDrugs;
        return (
            <div>
                <Header />
                <div className="container-flex">
                    <div className="content-container">
                        <Question />
                        <SearchBar 
                            onSubmit={this.handleSubmit}
                            submitted={this.state.submitted}
                            searchText={this.state.searchText}
                        />
                        {!drugIsKnown && otherDrugs &&
                            <OtherDrugs
                                otherDrugs={this.state.otherDrugs}
                                onSubmit={this.handleSubmit}
                                searchText={this.state.searchText}
                            />}
                        {drugIsKnown &&   
                            <Card 
                                pharmacyInfo={this.state.pharmacyInfo}
                                searchText={this.state.searchText}
                            />}
                    </div>
                </div>
            </div>
        )
    };
};

class Header extends React.Component {
    render() {
        return (
            <nav className="menu-container">
                <div className="menu">
                    <a className="navbar-brand" href="/">
                        <span className="navbar-logo"><img className="logo" src={logo}/></span>
                    </a>
                    <div>
                        <a href="#" className="login">Log In</a>
                    </div>
                </div>
            </nav>
        )
    };
};

class Question extends React.Component {
    render () {
        return (
            <div className="question-container">
                <h1 className="header-title">Which medication are you looking for?</h1>
            </div>
        )
    };
};


class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newSearchText: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    };
    handleChange(event) {
        let value = event.target.value;
        this.setState(function () {
            return {
                newSearchText: value
            }
        });
    };
    handleSubmit(event) {
        event.preventDefault();
        let newSearchText = this.state.newSearchText;
        this.props.onSubmit(newSearchText);
    };
    render () {
        let newSearchText = this.state.newSearchText;
        let handleChange = this.handleChange;
        let handleSubmit = this.handleSubmit;
        let submitted = this.props.submitted;
        let searchText = this.props.searchText;
        return (
        <div>
            <div className="search-container">
                <form className="search-bar" onSubmit={handleSubmit}>
                    <input className="input-cta" type="text" id="input-med" value={newSearchText} onChange={handleChange} autoComplete='off'/>
                    <div className="btn-cta" id="search-med" onClick={handleSubmit}>
                        <span className="cta-text">Search</span>
                    </div>
                </form>
            </div>
        </div>
        )
    };
};
 

class OtherDrugs extends React.Component {
    constructor(props) {
        super(props);
        
        this.handleClick = this.handleClick.bind(this);

    };

    handleClick(event) {
        event.preventDefault();
        let newSearchText = event.target.id;
        //let newSearchText = this.state.newSearchText;
        this.props.onSubmit(newSearchText);
    };

    render () {
        let otherDrugs = this.props.otherDrugs;
        let handleClick = this.handleClick;
        let searchText = this.props.searchText;
        return (
            <div className="post-container">
                <h2 className="match-found">Sorry, we do not have <span className="badge badge--medName">{searchText}</span> in our records. Did you mean: </h2>
                <div className="post">
                    <div className="postCard miniCard">
                        <div className="postRow otherDrugs">
                            {otherDrugs.map(function (otherDrug) {
                                return (
                                <div 
                                    className="badge badge--medName badge--otherDrug"
                                    id={otherDrug.name}
                                    key={otherDrug.name}
                                    onClick={handleClick}>
                                        {otherDrug.name}
                                </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )

    };
}


class CardRow extends React.Component {
    render () {
        const pharmacy = this.props.pharmacy;
        const pharmacyName = pharmacy.name;
        const pharmacyAddress = pharmacy.address;
        const pharmacyPhone = pharmacy.phone;
        const pharmacyRating = pharmacy.available;

        return (
                <div className="post">
                    <div className="postCard">
                        <div className="postInfo">
                            <div className="postName">{pharmacyName}</div>
                            <div className="postStreetAdress">{pharmacyAddress}</div>
                            <div className="postPhone">{pharmacyPhone}</div>
                            <div className="postHours">Hours: </div>
                        </div>
                        <div className="postRating">
                            <i className="fas fa-thumbs-up fa-2x"></i>
                            <div className="postRatingNum">{pharmacyRating}</div>
                        </div>
                    </div>
                    <div className="postThumbs">
                        <a href="#" className="rate-thumbs-up" title="Thumbs Up"><i className="far fa-thumbs-up fa-3x thumbs"></i></a>
                        <a href="#" className="rate-thumbs-down" title="Thumbs Down"><i className="far fa-thumbs-down fa-3x"></i></a>
                    </div>
                </div>
        )
    };
};



class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            results: null,
        }
    };


    render () {
        let cardRows = [];
        let pharmacyInfo = this.props.pharmacyInfo;
        let searchText = this.props.searchText;
        pharmacyInfo.forEach(function(pharmacy) {
            cardRows.push(
                    <CardRow
                        pharmacy={pharmacy}
                        key={pharmacy.name + pharmacy.phone}
                    />
                    )
        });
                        
        return (
            <div className="post-container">
                <h2 className="match-found">You might find <span className="badge badge--medName">{searchText}</span> at these locations:</h2>
                {cardRows}
            </div>
        )
    };
};

class Footer extends React.Component {
    render () {
        return (
                <div className="footer-container">
                    <div className="footer">
                        <div className="footer-credits">
                            <p className="footer-credit"><a href="https://github.com/newvicklee/ineedmymeds">Source code</a> released under the MIT license.</p>
                        </div>
                    </div>
                </div>
            )
    };
};



ReactDOM.render(
  <App />, 
  document.getElementById('app')
);
