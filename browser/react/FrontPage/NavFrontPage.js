import React, { Component } from 'react';
import LoginPage from '../Login/LoginPage';
import LoginForm from '../Login/LoginForm';
import SignupPage from '../Login/SignupPage';
import SignupForm from '../Login/SignupForm';

class Nav extends Component {
  constructor(props){
    super();
    this.showLogin = this.showLogin.bind(this);
    this.showSignup = this.showSignup.bind(this);
  }

  showLogin(){
    this.refs.slideLogin.show();
  }

  showSignup(){
    this.refs.slideSignup.show();
  }

  render() {

    return (
      <div>
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container">
              <div className="navbar-header">
                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                  <span className="icon-bar" />
                  <span className="icon-bar" />
                  <span className="icon-bar" />
                </button>
                <a id="navbar-brand-front" href="#">KnowYourMacros</a>
              </div>
              <div className="collapse navbar-collapse" id="myNavbar">
                <ul className="nav navbar-nav navbar-right">
                  <li>
                    <a id="logInClick" onClick= {this.showSignup} >
                      <span className="glyphicon glyphicon-user" />
                      { ' ' }
                      Sign Up
                    </a>
                  </li>
                  <li>
                    <a id="logInClick" onClick= {this.showLogin } >
                      <span className="glyphicon glyphicon-log-in" />
                      { ' ' }
                      Log In
                    </a>
                  </li>
                </ul>
              </div>
          </div>
        </nav>

        <LoginPage ref={'slideLogin'} alignment="top">
         <LoginForm />
        </LoginPage>

        <SignupPage ref={'slideSignup'} alignment="top">
         <SignupForm />
        </SignupPage>
        <div id="mainImgDiv" style={{ height: "500px" }}>
          <div id="announcementDiv">
            <h2 id="announcement">You Set Your Goal - We Set Your Diet</h2>
            <h2 id="mainMessage">Resources to Improve your Nutrition</h2>
            <h2 id="mainMessage">Reach Macronutrients Goals to the Exact Gram</h2>
          </div>
        </div>

      </div>
    );
  }
}




export default Nav;

