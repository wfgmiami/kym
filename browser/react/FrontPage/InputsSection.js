import React, { Component } from 'react';
import NutrientsSection from './NutrientsSection';
import MealSection from './MealSection';
import { connect } from 'react-redux';
import { generateFood, calculateFood } from '../../redux/reducers/fpdietgenerator';
import filteredMeals from '../../../filteredmeals.json';

class InputsSection extends Component {
  constructor(props){
    super(props);

    this.state = {
      age: '',
      gender: 'Male',
      height: '',
      hunit: 'inch',
      weight: '',
      wunit: 'lbs',
      lifestyle: 'Normal',
      goal: 'lose 4 pounds',
      BMR: '',
      recommendation: {
        calories: null,
        protein: null,
        carbs: null,
        fat: null,
        foodChoice: null
      },
      generatedFood: filteredMeals
    };
    this.onGenderChange = this.onGenderChange.bind(this);
    this.onAgeChange = this.onAgeChange.bind(this);
    this.onHeightChange = this.onHeightChange.bind(this);
    this.onHUnitChange = this.onHUnitChange.bind(this);
    this.onWeightChange = this.onWeightChange.bind(this);
    this.onWUnitChange = this.onWUnitChange.bind(this);
    this.onLifeStyleChange = this.onLifeStyleChange.bind(this);
    this.onGoalChange = this.onGoalChange.bind(this);
    this.onCreateNutrients = this.onCreateNutrients.bind(this);
    this.calculateRecommendation = this.calculateRecommendation.bind(this);
    this.onCreateMeals = this.onCreateMeals.bind(this);
  }


  onAgeChange(ev) {
    this.setState({ age: ev.target.value });
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

  onLifeStyleChange(ev) {
    this.setState({ lifestyle: ev.target.value });
  }

  onGoalChange(ev) {
    this.setState({ goal: ev.target.value });
  }

  calculateRecommendation() {
    // console.log('...bmr,lifestyle, goal', this.state.BMR, this.state.lifestyle, this.state.goal)
    const calories = Math.round( this.state.BMR * this.state.lifestyle + this.state.goal );
    const protein = Math.round( calories * 0.3 / 4 );
    const carbs = Math.round( calories * 0.4 / 4 );
    const fat = Math.round( calories * 0.3 / 9 );
    this.setState({ recommendation: {
      calories,
      protein,
      carbs,
      fat
    } });
  }

  onCreateNutrients(ev) {
    if (ev) {
      ev.preventDefault();
    }
    let height, weight, gender;
    if ( this.state.gender === 'Male' ) {
      gender = 5; }
    else {
      gender = -161;
    }
    if ( this.state.hunit === 'inch' ) {
      height = 2.54 * this.state.height / 100;
    } else {
      height = this.state.height / 100;
    }
    if ( this.state.wunit === 'lbs' ) {
      weight = this.state.weight * 0.45359237;
    } else {
      weight = this.state.weight;
    }

    let lifestyle;
    switch (this.state.lifestyle) {
      case 'Normal':
        lifestyle = 1.375;
        break;
      case 1.375:
        lifestyle = 1.375;
        break;
      case 'Active':
        lifestyle = 1.55;
        break;
      case 1.55:
        lifestyle = 1.55;
        break;
      default:
        lifestyle = 1.2;
    }

    let goal;
    switch (this.state.goal){
      case 'lose 4 pounds':
        goal = -500;
        break;
      case -500:
        goal = -500;
        break;
      case 'lose 8 pounds':
        goal = -1000;
        break;
      case -1000:
        goal = -1000;
        break;
      default:
        goal = 0;
    }

    this.setState({ lifestyle: lifestyle, goal: goal, BMR: Math.round( 10 * weight + 625 * height - 5 * this.state.age + gender ) }, this.calculateRecommendation);

  }

  onCreateMeals(ev){
    if (ev) {
      ev.preventDefault();
    }

    this.props.calculateFood({
      proteinGoal: this.state.recommendation.protein,
      carbGoal: this.state.recommendation.carbs,
      fatGoal: this.state.recommendation.fat
    });
  }


  render(){
//console.log('meal......',this.props.meal)
    return (
        <div id="inputs_section" className="container">
          <br />
          <div className="col-xs-12">
            <div className="col-xs-6">

              <div style={{ display:"inline" }}>
                <h3 style={{ display:"inline" }}><i>I want to</i></h3> { ' ' }
                <select className="form-control"  style={{ width: "215px", display:"inline" }} onChange={ this.onGoalChange }>
                  <option selected value="lose 4 pounds">lose 4 pounds in 1 month</option>
                  <option value="lose 8 pounds">lose 8 pounds in 1 month</option>
                </select>
              </div>

              <div><br /></div>

              <div className="form-inline">
                <h3 style={{ display:"inline" }}><i>I am</i></h3> { ' ' }
                <select className="form-control" style={{ width: "130px", display:"inline" }} onChange={ this.onGenderChange }>
                { ["Male", "Female"].map( (gender, id) => <option key={ id }>{ gender }</option> )} </select> { ' ' }
                <h3 style={{ display:"inline" }}><i>age</i></h3> { ' ' }
                  <input className="form-control" type="number" min="0" style={{ maxWidth: "75px" }} placeholder="age" onChange={ this.onAgeChange}/>
              </div>


              <div><br /></div>

              <div className="form-inline">
                <h3 style={{ display:"inline" }}><i>My height is</i></h3> { ' ' }
                <input className="form-control" type="number" min="0" style={{ maxWidth: "130px" }} placeholder="height" value={ this.state.height } onChange={ this.onHeightChange} />
                <select className="form-control" style={{ width: "75px" }} >
                { ["inch", "cm"].map( (measure, id) => <option key={ id }>{ measure }</option> )} </select>
              </div>

              <div><br /></div>

              <div className="form-inline">
                <h3 style={{ display:"inline" }}><i>My weight is</i></h3> { ' ' }
                <input className="form-control" type="number" min="0" style={{ maxWidth: "130px" }} placeholder="weight" value={ this.state.weight } onChange={ this.onWeightChange} />

                <select className="form-control" style={{ width: "75px" }} >
                { ["lbs", "kg"].map( (measure, id) => <option key={ id }>{ measure }</option> )} </select>
              </div>
                <br />

              <div className="form-inline">
                <h3 style={{ display:"inline" }}><i>My lifestyle is</i></h3> { ' ' }
                <select className="form-control" style={{ width: "130px" }} onChange={ this.onLifeStyleChange} >
                {  [ 'Normal', 'Active', 'Sedentary' ].map( (lifestyle, id) => <option key={ id }>{ lifestyle }</option> )} </select>
              </div>
            </div>

            <div className="col-xs-6">

                <button style={{ marginTop: "10px" }} className="btn btn-info btn-block" onClick = { this.onCreateNutrients }><h3> Calculate My Nutrients </h3></button>

              { this.state.BMR  ?
                <div>
                  <NutrientsSection diet = { this.state.recommendation } />
                </div> : null }
            </div>

          </div>

          <div className="col-xs-12">
             { this.state.BMR  ?
              <div className="col-xs-12 buffer forms" style = {{ display: 'inline-block' }}>
                <button style={{ marginTop: "20px" }} className="btn btn-info btn-block" onClick = { this.onCreateMeals }><h3> Create My Diet </h3></button>
              </div> : null }

            <div className ="buffer forms">
              { this.state.BMR && this.props.meal.length ?
                <div>
                  <MealSection foods = { this.props.generatedFoods } meal={ this.props.meal } error={ this.props.error }/>
                </div>
              : null }
            </div>

          </div>
        </div>
      );
  }

}

const mapStateToProps = ({ fpdietgenerator }) => ({

  generatedFoods: fpdietgenerator.generatedFoods,
  meal: fpdietgenerator.meal,
  error: fpdietgenerator.error

});

const mapDispatchToProps = dispatch => ({

  generateFood: foodChoice => dispatch(generateFood( foodChoice ) ),
  calculateFood: params => dispatch(calculateFood( params ) )

});

export default connect(mapStateToProps, mapDispatchToProps)(InputsSection);
