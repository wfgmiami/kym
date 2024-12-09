import React, { Component } from 'react';
import { login, logout } from '../../redux/reducers/root';
import { connect } from 'react-redux';

class LoginForm extends Component{
    constructor(props){
    super(props);

    this.state = {
      username: '',
      password: '',
      oauth: ''
    };

    this.onNameChange = this.onNameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.submitCredentials = this.submitCredentials.bind(this);
    this.showSignUp = this.showSignUp.bind(this);
  }

  onNameChange(ev) {
    this.setState({ username: ev.target.value });
  }

  onPasswordChange(ev) {
    this.setState({ password: ev.target.value });
  }


  submitCredentials(ev){
    ev.preventDefault();
    this.props.login(this.state)
    .then( () => {
      if ( !this.props.invalidLogin ){
        this.setState({ username: '', password: ''});
        this.props.hide();
      }
    });
  }

  showSignUp(){
    this.refs.signUp.show();
  }

  render(){

    let invalidLogin = this.props.invalidLogin;
    let user = this.props.user;
    let username = this.state.username;
    let password = this.state.password;
    let onNameChange = this.onNameChange;
    let onPasswordChange = this.onPasswordChange;

    return (

        <div>
            <div className="buffer">
              <div id="loginForm">
                <h3><i>Log in to My Account</i></h3>
                <div className="buffer forms"></div>
                { invalidLogin ? <div style={{ color: 'red' }}>Invalid Login</div> : null }
                  <div>
                    <div className="form-group">
                      <input className="form-control" placeholder="name" value={ username } onChange={ onNameChange } />
                    </div>
                    <div className="form-group">
                      <input className="form-control" type="password" placeholder="password" value={ password } onChange={ onPasswordChange } />
                    </div>
                  </div>

                  <div className="buffer forms"></div>
                  <div className="buffer">
                    <button  type="button" id="loginButton" onClick = { this.submitCredentials } className="btn btn-primary btn-social">
                    <i className="fa fa-sign-in" /><span>Log In</span></button>
                  </div>
                    <div className="buffer local">
                     <div className="buffer forms"></div>
                      <div className="back-line">
                        <span>OR</span><br />
                      </div>
                    <div className="buffer forms"></div>
                  </div>
                  <div className="buffer">
                    <a href="/api/auth/google" className="btn btn-social btn-google">
                    <i className="fa fa-google" /><span>Log In With Google</span></a>
                  </div>
                  <div className="buffer">
                    <a href="/api/auth/fitbit" className="btn btn-social btn-fitbit">
                    <img src="/images/Fitbit_app_icon.png" /><span>Log In With Fitbit</span></a>
                  </div>
              </div>
            </div>

            {/*<div>
              <div className="buffer local">
                <div className="back-line">
                  <span>OR</span><br />
                </div>
              </div>

              <div className="buffer local">
                <h3><i>Sign up for an Account</i></h3>
                <div className="buffer">
                    <button onClick={ this.showSignUp } className="btn btn-primary btn-social">
                    <i className="fa fa-caret-square-o-up" /><span>Sign Up</span></button>
                </div>
              </div>
            </div>
            <SignupPage ref="signUp" alignment="top" hideLogin = { this.props.hide }>
              <SignupForm />
            </SignupPage>*/}
        </div>
      );
    }
  }

const mapStateToProps = ({ root }) => {
  return {
    user: root.user,
    invalidLogin: root.invalidLogin
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (credentials) => dispatch(login(credentials)),
    logout: () => dispatch(logout()),

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
