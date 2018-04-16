var React = require('react');
var ReactDOM = require('react-dom');
require('./style.scss');
import logo from './imgs/logo.png';

//var App = require('./components/App');

const CARDINFO = [
    {pharmacyName: 'London Drugs #1', pharmacyAddress: '888 International Village', pharmacyCity: 'Vancouver', pharmacyPhone: '604-111-2222', pharmacyHours: '8AM-10PM', pharmacyRating: '96%'},
    {pharmacyName: 'London Drugs #2', pharmacyAddress: '888 International Village', pharmacyCity: 'Vancouver', pharmacyPhone: '604-111-2222', pharmacyHours: '8AM-10PM', pharmacyRating: '96%'},
    {pharmacyName: 'London Drugs #3', pharmacyAddress: '888 International Village', pharmacyCity: 'Vancouver', pharmacyPhone: '604-111-2222', pharmacyHours: '8AM-10PM', pharmacyRating: '96%'},
];

const SEARCHRESULT = 'Fluoxetine 20mg';



class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchBarText: 'Fluoxetine 20mg',
        };
    };
    render (props) {
        return (
            <div>
                <Header />
                <div className="container-flex">
                    <div className="content-container">
                        <Question />
                        <SearchBar 
                            searchBarText={this.state.searchBarText} 
                        />
                            
                        <Card 
                            pharmacyInfo={this.props.pharmacyInfo}
                        />
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
    render (props) {
        let searchBarText = this.props.searchBarText;
        return (
        <div>
            <div className="search-container">
                <div className="search-bar">
                    <input className="input-cta" type="text" id="input-med" value={searchBarText}/>
                    <div className="btn-cta" id="search-med">
                        <span className="cta-text">Search</span>
                    </div>
                </div>
            </div>
            <div className="match-container">
                <SearchResult 
                    searchBarText={searchBarText}
                />
            </div>
        </div>
        )
    };
};
 
class SearchResult extends React.Component {
    render (props) {
        let searchBarText = this.props.searchBarText;
        return (
                <h2 className="match-found">We found <span className="badge badge--medName">{searchBarText}</span> at these locations:</h2>
        )
    };
};


class CardRow extends React.Component {
    render () {
        const pharmacy = this.props.pharmacy;
        const pharmacyName = pharmacy.pharmacyName;
        const pharmacyAddress = pharmacy.pharmacyAddress;
        const pharmacyCity = pharmacy.pharmacyCity;
        const pharmacyPhone = pharmacy.pharmacyPhone;
        const pharmacyHours = pharmacy.pharmacyHours;
        const pharmacyRating = pharmacy.pharmacyRating;

        return (
                <div className="post">
                    <div className="postCard">
                        <div className="postInfo">
                            <div className="postName">{pharmacyName}</div>
                            <div className="postStreetAdress">{pharmacyAddress}</div>
                            <div className="postCityProv">{pharmacyCity}</div>
                            <div className="postPhone">{pharmacyPhone}</div>
                            <div className="postHours">{pharmacyHours}</div>
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
    render () {
        let cardRows = [];
        let pharmacyInfo = this.props.pharmacyInfo;
        pharmacyInfo.forEach(function(pharmacy) {
            cardRows.push(
                    <CardRow
                        pharmacy={pharmacy}
                        key={pharmacy.pharmacyName}
                    />
                    )
        });
                        
        return (
            <div className="post-container">
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
  <App 
    pharmacyInfo={CARDINFO}
    searchResult={SEARCHRESULT}
  />, 
  document.getElementById('app')
);
