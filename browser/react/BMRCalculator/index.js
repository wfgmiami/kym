import React from 'react';
import { connect } from 'react-redux';
import MeasurementsForm from './MeasurementsForm';

import { saveMeasurements, bmrCalories  } from '../../redux/reducers/root';
import { caloriesCache } from '../../redux/reducers/foodrecord';

class BMRCalculator extends React.Component {
  constructor() {
    super();
    this.state = {
      units: 'imperial',
      weight: '',
      height: '',
      gender: 'Male',
      age: '',
      lifestyle: 1.375,
      BMR: '',
      recommendation: {
        calories: null,
        protein: null,
        carbs: null,
        fat: null
      }
    };

    this.calculateBMR = this.calculateBMR.bind(this);
    this.makeUserState = this.makeUserState.bind(this);
    this.onSaveMeasurements = this.onSaveMeasurements.bind(this);
    this.updateBMR = this.updateBMR.bind(this);
    this.updateAge = this.updateAge.bind(this);
    this.updateGender = this.updateGender.bind(this);
    this.updateHeight = this.updateHeight.bind(this);
    this.updateLifestyle = this.updateLifestyle.bind(this);
    this.updateUnits = this.updateUnits.bind(this);
    this.updateWeight = this.updateWeight.bind(this);
  }

  onSaveMeasurements(ev) {
    if (ev) {
      ev.preventDefault();
    }
    let lifestyle;
    switch (this.state.lifestyle) {
      case 1.375:
        lifestyle = 'Normal';
      break;
      case 1.55:
        lifestyle = 'Active';
      break;
      default:
        lifestyle = 'Sedentary';
      break;
    }
    let toSend = Object.assign(this.state, { lifestyle });
    delete toSend.id;
    this.props.saveMeasurements(toSend, this.props.user);
  }

  updateLifestyle(ev) {
    this.setState({ lifestyle: ev.target.value }, this.calculateRecommendation);
  }

  updateBMR(ev) {
    this.setState({ BMR: ev.target.value }, this.calculateRecommendation );
  }

  updateAge(ev) {
    this.setState({ age: ev.target.value } );
  }

  updateGender(ev) {
    this.setState({ gender: ev.target.value } );
  }

  updateWeight(ev) {
    this.setState({ weight: ev.target.value } );
  }

  updateHeight(ev) {
    this.setState({ height: ev.target.value } );
  }

  updateUnits(ev) {
    this.setState({ units: ev.target.value });
  }

  calculateRecommendation() {
    const calories = Math.round( this.state.BMR * this.state.lifestyle );
    const protein = Math.round( calories * 0.3 / 4 );
    const carbs = Math.round( calories * 0.4 / 4 );
    const fat = Math.round( calories * 0.3 / 9 );
    this.setState({ recommendation: {
      calories,
      protein,
      carbs,
      fat
    } });
    this.props.bmrCalories( calories )
  }

  makeUserState(nextUser) {
    let { user } = this.props;
    if (nextUser) {
      user = nextUser;
    }
    let measurements = user.userMeasurements;
    console.log(measurements);
    let lifestyle;
    switch (user.lifestyle) {
      case 'Normal':
        lifestyle = 1.375;
      break;
      case 'Active':
        lifestyle = 1.55;
      break;
      default:
        lifestyle = 1.2;
      break;
    }
    this.setState( Object.assign(this.state,
      measurements[measurements.length - 1],
      { age: user.birthdate.slice(0, 10) },
      { lifestyle }
    ), /*() => {*/
      this.calculateBMR
      // this.setState({ age: Math.floor((new Date() - new Date(this.props.user.birthdate)) / 86400000 / 364.25) }, () => {
      // this.setState({ age: this.props.user.age }, () => {
        // this.setState({ lifestyle }, this.calculateBMR);
      // });
    /*}*/);
  }

  calculateBMR(ev) {
    const age = Math.floor((new Date() - new Date(this.state.age)) / 86400000 / 364);
    if (ev) {
      ev.preventDefault();
    }
    let height, weight, gender;
    if ( this.state.gender === 'MALE' ) {
      gender = 5; }
    else {
      gender = -161;
    }
    if ( this.state.units === 'imperial' ) {
      height = 2.54 * this.state.height / 100;
    } else {
      height = this.state.height / 100;
    }
    if ( this.state.units === 'imperial' ) {
      weight = this.state.weight * 0.45359237;
    } else {
      weight = this.state.weight;
    }
    console.log('age', age );
    this.setState({ BMR: Math.round( 10 * weight + 625 * height - 5 * age + gender ) }, this.calculateRecommendation);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && nextProps.user.userMeasurements && nextProps.user.userMeasurements[0]) {
      this.makeUserState(nextProps.user);
    }
  }

  componentDidMount() {
    if (this.props.user && this.props.user.userMeasurements && this.props.user.userMeasurements[0]) {
      this.makeUserState();
    }
  }

  render() {

    return (
      <div>
        <MeasurementsForm
          age={ this.state.age }
          btnTxt={ this.props.saveMeas ? 'Save' : 'Calculate' }
          gender={ this.state.gender }
          height={ this.state.height }
          submitForm={ this.props.saveMeas ? this.onSaveMeasurements : this.calculateBMR }
          units={ this.state.units }
          weight={ this.state.weight }
          updateAge={ this.updateAge }
          updateGender={ this.updateGender }
          updateHeight={ this.updateHeight }
          updateUnits={ this.updateUnits }
          updateWeight={ this.updateWeight }
        />
        {
          this.props.saveMeas ? '' : (
            <div>
              <div className="form-group">
                <label>BMR:</label>
                <input type="number" className="form-control" value={ this.state.BMR } onChange={ this.updateBMR } />
                <label>Lifestyle:</label>
                <select id="lifestyle" className="form-control" value={ this.state.lifestyle } onChange={ this.updateLifestyle }>
                  <option value={ 1.2 }>Sedentary</option>
                  <option value={ 1.375 }>Normal</option>
                  <option value={ 1.55 }>Active</option>
                </select>
              </div>
              { this.state.recommendation.calories ? (
                <div className="alert alert-info">
                  <h4>Daily Maintenance Values</h4>
                  <b>Calories:</b> { this.state.recommendation.calories }<br />
                  <b>Protein:</b> { this.state.recommendation.protein } g<br />
                  <b>Carbs:</b> { this.state.recommendation.carbs } g<br />
                  <b>Fat:</b> { this.state.recommendation.fat } g<br />
                </div>
                ) : ''}
          </div>
          )
        }
      </div>
      );
  }
}

const mapStateToProps = ({ root }) => ({
  user: root.user
});

const mapDispatchToProps = dispatch => ({
  saveMeasurements: ( measurements, user ) => dispatch(saveMeasurements( measurements, user )),
  bmrCalories: ( calories ) => dispatch( bmrCalories( calories ))
});

export default connect(mapStateToProps, mapDispatchToProps)( BMRCalculator );
