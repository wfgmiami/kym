import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import BMRCalculator from '../BMRCalculator';
import GoalsReport from './GoalsReport';
import { saveGoals } from '../../redux/reducers/root';

class SetGoals extends React.Component {
  constructor() {
    super();
    this.state = {
      goals: {
        pGoal: 150,
        cGoal: 150,
        fGoal: 72
      },
      numMeals: 4,
      schedule: [ 1, 1, 'Workout', 1, 1 ],
      workoutId: 2,
      beforeAfter: 'after',
      maintenanceCal: 0,
      goal: 'Lose Fat',
      trainingGoals: null,
      restingGoals: null,
      bmrCals: 0
    };

    this.changeSchedule = this.changeSchedule.bind(this);
    this.changeNumberMeals = this.changeNumberMeals.bind(this);
    this.changeBeforeAfter = this.changeBeforeAfter.bind(this);
    this.changeWorkoutId = this.changeWorkoutId.bind(this);
    this.calculateGoals = this.calculateGoals.bind(this);
    this.changeMaintenanceCal = this.changeMaintenanceCal.bind(this);
    this.changeGoal = this.changeGoal.bind(this);
    this.onSaveGoals = this.onSaveGoals.bind(this);
  }

  changeSchedule(mealId) {
    if (this.state.schedule.indexOf(mealId) > -1) {
      this.setState({ schedule: this.state.schedule.filter(item => item !== mealId) });
    } else {
      let schedule = this.state.schedule.slice();
      schedule.push(mealId);
      schedule = schedule.sort();
      this.setState({ schedule });
    }
  }

  changeNumberMeals(ev) {
    this.setState({ numMeals: ev.target.value }, () => this.changeWorkoutId({ target: { value: this.state.workoutId }}));
  }

  changeBeforeAfter(ev) {
    this.setState({ beforeAfter: ev.target.value });
  }

  changeWorkoutId(ev) {
    let schedule = [];
    console.log(this.state.numMeals);
    for ( let i = 0; i < this.state.numMeals; i++) {
      schedule[i] = 1;
    }
    if (this.state.beforeAfter === 'before') {
      schedule.splice(ev.target.value * 1, 0, 'Workout');
    } else {
      schedule.splice(ev.target.value * 1 + 1, 0, 'Workout');
    }
    console.log(schedule);
    this.setState({ schedule });
  }

  changeMaintenanceCal(ev) {
    console.log(ev.target.value);
    this.setState({ bmrCals: this.props.bmrCalories });
    this.setState({ maintenanceCal: ev.target.value });
  }

  changeGoal(ev) {
    this.setState({ goal: ev.target.value });
  }

  onSaveGoals() {
    this.props.saveGoals(this.state)
      .then(() => browserHistory.push('/shopping-list'));
  }

  calculateGoals(maintenanceCal, schedule, goal) {
    if ( !maintenanceCal ) maintenanceCal = this.props.bmrCalories;

    let pGoal = Math.round( maintenanceCal * 3 / 4 ) / 10;
    let cGoal = Math.round( maintenanceCal * 4 / 4 ) / 10;
    let fGoal = Math.round( maintenanceCal * 3 / 9 ) / 10;

    this.setState( { trainingGoals: getGoals( schedule, { pGoal, cGoal, fGoal }, true ) } );
    this.setState( { restingGoals: getGoals( schedule.filter( item => item !== 'Workout' ), { pGoal, cGoal, fGoal } ) } );

    function getGoals( schedule, goals, training ) {
      let { pGoal, cGoal, fGoal } = goals;

      if ( training ) {
        if ( goal === 'Lose Fat' ) {
          cGoal -= 60;
        }
        if ( goal === 'Gain Muscle' ) {
          pGoal += 75;
        }
      } else {
        if ( goal === 'Lose Fat' ) {
          cGoal -= 100;
        }
        if ( goal === 'Gain Muscle' ) {
          pGoal += 25;
        }
      }

      let mSix = [ 40, 37, 53, 60, 44, 20 ];
      let mFive = [ 40, 37, 53, 60, 44, 0 ];
      let mFour = [ 44, 0, 60, 53, 40, 0 ];
      let mThree = [ 40, 0, 53, 0, 44, 0 ];

      let numMeals = 0;
      let numWorkouts = 0;
      let workoutIndex = 0;
      for ( let i = 0; i < schedule.length; i++ ) {
        if ( schedule[ i ] === 'Workout' ) {
          numWorkouts++;
          workoutIndex = i;
        } else {
          numMeals++;
        }
      }
      let arr;
      if ( numMeals === 6 ) arr = mSix;
      if ( numMeals === 5 ) arr = mFive;
      if ( numMeals === 4 ) arr = mFour;
      if ( numMeals === 3 ) arr = mThree;

      let inc = 0;
      for ( let i = 0; i < 6; i++ ) {
        if ( numWorkouts > 0 ) {
          if ( arr[ i ] === 0 ) {
            continue;
          }
          if ( inc === workoutIndex ) {
            // Swap the relative size of the post-workout meal and the largest meal
            let mSub = arr[ i ];
            let max = Math.max.apply( null, arr );
            let maxIndex = arr.indexOf( max );

            arr[ maxIndex ] = mSub;
            arr[ i ] = max;
          }
          inc++;
        }
      }

      let total = arr.reduce( ( memo, item ) => memo + item, 0 );

      return arr.map( ( size, ix ) => ( {
        id: ix,
        pGoal: Math.round( pGoal * size * 10 / total ) / 10,
        cGoal: Math.round( cGoal * size * 10 / total ) / 10,
        fGoal: Math.round( fGoal * size * 10 / total ) / 10
      } ) );
    }

  }

  setGoals( { maintenanceCal, goal, weight, units } ) {
    let pGoal, cGoal, fGoal, wght, cal;
    wght = units === 'metric' ? weight * 2.2 : weight;
    if ( goal === 'Build Muscle' ) {
      pGoal = wght * 1.2;
      cal = maintenanceCal + 300;
    } else if ( goal === 'Maintain' ) {
      pGoal = wght * 1;
      cal = maintenanceCal;
    } else {
      pGoal = wght * 0.8;
      cal = maintenanceCal - 500;
    }
    fGoal = Math.round( ( cal * 0.32 ) * 10 / 9 ) / 10;

    cGoal = Math.round( ( cal - fGoal * 9 - pGoal * 4 ) * 10 / 4 ) / 10;
    this.setState( {
      maintenanceCal: cal,
      goals: {
        pGoal,
        cGoal,
        fGoal
      }
    } );
    return { cal, pGoal, cGoal, fGoal };
  }

  render() {
    const mealNames = [ 'first', 'second', 'third', 'fourth', 'fifth', 'sixth' ];
    let meals = [];
    for (let i = 0; i < this.state.numMeals; i++) {
      meals.push(mealNames[i]);
    }
 //console.log('........thisprops in setgoals....',this.props, this.state.maintenanceCal, this.state.bmrCals, this.props.bmrCalories)
    return (
      <div className="container">
        <div className="col-md-3">
          <div className="well well-sm">
            <BMRCalculator />
          </div>
        </div>
        <div className="col-md-9">
          <div className="well well-sm">
            <div className="form-group row">
              <div className="col-md-6">
                Maintenance Calories:
                { this.state.maintenanceCal === 0 || ( this.state.bmrCals !== this.props.bmrCalories && this.state.bmrCals ) ? (
                <input type="number" className="form-control" value={ this.props.bmrCalories } onChange={ this.changeMaintenanceCal } /> ) :
                 (
                <input type="number" className="form-control" value={ this.state.maintenanceCal } onChange={ this.changeMaintenanceCal } /> )
                }
              </div>
              <div className="col-md-6">
                I want to:
                <select className="form-control" value={ this.state.goal } onChange={ this.changeGoal }>
                  <option>Lose Fat</option>
                  <option>Gain Muscle</option>
                  <option>Maintain</option>
                </select>
              </div>
            </div>
          </div>
          <div className="well well-sm form-inline">
            I eat
            { ' ' }
            <select className="form-control input-sm" value={ this.state.numMeals } onChange={ this.changeNumberMeals }>
              <option value={ 3 }>three</option>
              <option value={ 4 }>four</option>
              <option value={ 5 }>five</option>
              <option value={ 6 }>six</option>
            </select>
            { ' ' }
            meals per day
          </div>
          <div className="form-inline well well-sm">
            I workout
            { ' ' }
            <select className="form-control input-sm" value={ this.state.beforeAfter } onChange={ this.changeBeforeAfter }>
              <option>before</option>
              <option>after</option>
            </select>
            { ' ' }
            my
            { ' ' }
            <select className="form-control input-sm" defaultValue={ 1 } onChange={ this.changeWorkoutId }>
              { meals.map((meal, ix) => <option key={ meal } value={ ix }>{ meal }</option>) }
            </select>
            { ' ' }
            meal
          </div>
          <button className="btn btn-primary" onClick={ () => this.calculateGoals(this.state.maintenanceCal, this.state.schedule, this.state.goal) }>Determine Goals</button>
          <GoalsReport goals={ this.state.trainingGoals } title="Training Goals" />
          <GoalsReport goals={ this.state.restingGoals } title="Resting Goals" />
          { this.state.trainingGoals && this.state.restingGoals && <button className="btn btn-primary" onClick={ this.onSaveGoals }>Save Meal Goals</button> }
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ root }) => ({
  bmrCalories: root.bmrCalories
});

const mapDispatchToProps = dispatch => ({
  saveGoals: st => dispatch(saveGoals(st))
});

export default connect(mapStateToProps, mapDispatchToProps)(SetGoals);
