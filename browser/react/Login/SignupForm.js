import React, { Component } from 'react';
import { login } from '../../redux/reducers/root';
import { connect } from 'react-redux';
import axios from 'axios';

class SignupForm extends Component{
    constructor(props){
    super(props);

    this.state = {
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      email: '',
      birthdate: '',
      gender: 'male',
      height: '',
      hunit: 'inch',
      weight: '',
      wunit: 'lbs',
      bodyfat: '30',
      lifestyle: 'Normal',
      goal: 'Lose Fat'
    };

    this.onNameChange = this.onNameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onFirstNameChange = this.onFirstNameChange.bind(this);
    this.onLastNameChange = this.onLastNameChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onBirthDateChange = this.onBirthDateChange.bind(this);
    this.onGenderChange = this.onGenderChange.bind(this);
    this.onHeightChange = this.onHeightChange.bind(this);
    this.onHUnitChange = this.onHUnitChange.bind(this);
    this.onWeightChange = this.onWeightChange.bind(this);
    this.onWUnitChange = this.onWUnitChange.bind(this);
    this.onBodyFatChange = this.onBodyFatChange.bind(this);
    this.onLifeStyleChange = this.onLifeStyleChange.bind(this);
    this.onGoalChange = this.onGoalChange.bind(this);

    this.newAccount = this.newAccount.bind(this);
  }

  onNameChange(ev) {
    this.setState({ username: ev.target.value });
  }

  onPasswordChange(ev) {
    this.setState({ password: ev.target.value });
  }

  onFirstNameChange(ev) {
    this.setState({ firstname: ev.target.value });
  }

  onLastNameChange(ev) {
    this.setState({ lastname: ev.target.value });
  }

   onEmailChange(ev) {
    this.setState({ email: ev.target.value });
  }

  onBirthDateChange(ev) {
    this.setState({ birthdate: ev.target.value });
  }

  onGenderChange(ev) {
    this.setState({ gender: ev.target.value });
  }

  onHeightChange(ev) {
    this.setState({ height: ev.target.value });
  }

  onHUnitChange(ev) {
    this.setState({ hunit: ev.target.value });
  }

  onWeightChange(ev) {
    this.setState({ weight: ev.target.value });
  }

  onWUnitChange(ev) {
    this.setState({ wunit: ev.target.value });
  }

  onBodyFatChange(ev) {
    this.setState({ bodyfat: ev.target.value });
  }

  onLifeStyleChange(ev) {
    this.setState({ lifestyle: ev.target.value });
  }

  onGoalChange(ev) {
    this.setState({ goal: ev.target.value });
  }

  newAccount(ev){
    ev.preventDefault();
    axios.post('api/user/signup', this.state)
    .then( user => {
      if (user) {
        return this.props.login({ username: this.state.username, password: this.state.password });
      }
    } )
    .then( () => {
      if ( !this.props.invalidLogin ){
        let newState = {};
        Object.keys(this.state).map( key => {
          newState[key] = '';
        } );
        this.setState( newState );
        this.props.hide();
        this.props.hideLogin();

      } else {
        console.log('Error logging in new user', err);
      }
    })
    .catch( (err) => console.log('Error signing up new user', err));
  }

  render(){
    return (
        <div>
            <div className="buffer">
              <div>
                <h3><i>Account Info</i></h3>
                  <div>
                    <div className="form-group">
                      <input className="form-control" placeholder="user name" value={ this.state.username } onChange={ this.onNameChange } />
                    </div>
                    <div className="form-group">
                      <input className="form-control" type="password" placeholder="password" value={ this.state.password } onChange={ this.onPasswordChange } />
                    </div>
                    <div className="form-group">
                      <input className="form-control" placeholder="first name" value={ this.state.firstname } onChange={ this.onFirstNameChange} />
                    </div>
                    <div className="form-group">
                      <input className="form-control" placeholder="last name" value={ this.state.lastname } onChange={ this.onLastNameChange} />
                    </div>
                    <div className="form-group">
                      <input className="form-control" type="email" placeholder="email" value={ this.state.email } onChange={ this.onEmailChange } />
                    </div>

                    <div className="buffer forms"></div>
                    <h3><i>Tell Us About Yourself</i></h3>
                    <i>Gender</i>
                    <div className="form-group">
                      <select className="form-control" placeholder="gender" onChange={ this.onGenderChange} >
                      { ['male', 'female'].map( (gender, id) => <option key={ id }>{ gender }</option> )} </select>
                    </div>

                    <i>Birthdate</i>
                    <div className="form-group">
                      <input className="form-control" id="date" type="date" placeholder="birth date" value={ this.state.birthdate } onChange={ this.onBirthDateChange} />
                    </div>

                    <div className="form-inline">
                      <input className="form-control" type="number" style={{ maxWidth: "130px" }} placeholder="height" value={ this.state.height } onChange={ this.onHeightChange} />

                      <select className="form-control" style={{ width: "75px" }} placeholder="gender" onChange={ this.onHUnitChange} >
                      { ['inch', 'cm'].map( (measure, id) => <option key={ id }>{ measure }</option> )} </select>
                    </div>

                    <div className="form-inline">
                      <input className="form-control" type="number" style={{ maxWidth: "130px" }} placeholder="weight" value={ this.state.weight } onChange={ this.onWeightChange} />

                       <select className="form-control" style={{ width: "75px" }} placeholder="gender" onChange={ this.onWUnitChange} >
                      { ['lbs', 'kg'].map( (measure, id) => <option key={ id }>{ measure }</option> )} </select>
                    </div>
                    <br />

                    <div className="form-group">
                      <input className="form-control" placeholder="body fat" value={ this.state.bodyFat } onChange={ this.onBodyFatChange} />
                    </div>

                    <div className="form-group">
                      <i>Your Lifestyle</i>
                      <select className="form-control"  onChange={ this.onGoalChange} >
                      {  [ 'Normal', 'Active', 'Sedentary' ].map( (lifestyle, id) => <option key={ id }>{ lifestyle }</option> )} </select>
                    </div>

                    <div className="form-group">
                      <i>Your Goal</i>
                      <select className="form-control" style={{ minWidth: "50px" }} placeholder="goal" onChange={ this.onGoalChange} >
                      {  [ 'Lose Fat', 'Gain Muscle', 'Maintain' ].map( (goal, id) => <option key={ id }>{ goal }</option> )} </select>
                    </div>
                  </div>
                  <div className="buffer forms"></div>
                  <div className="buffer">
                    <button onClick = { this.newAccount } className="btn btn-primary btn-social">
                    <i className="fa fa-caret-square-o-up" /><span>Sign Up</span></button>
                  </div>

              </div>
            </div>
        </div>

    );
    }
  }
//export default SignupForm;

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

export default connect(mapStateToProps, mapDispatchToProps)(SignupForm);
