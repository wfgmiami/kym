import React from 'react';

import DayMacroSummary from '../reuse/DayMacroSummary';
import Panel from '../reuse/Panel';
import RecordList from '../FoodRecord/RecordList';
import ChangeDayContainer from '../reuse/ChangeDayContainer';

import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import ReactHighcharts  from 'react-highcharts';
import bardataFunc from './bardata';
import WeightChart from './WeightChart';

import { getCalories, calculateDayMacros } from '../../redux/reducers/foodrecord';

function macrosByMeal(records, meal, macro) {
  let mealRecords = records.filter(food => food.Meal * 1 === meal);
  return Math.round(mealRecords.reduce((total, food) => total + food[macro], 0) * 10) / 10;
}

const MainDash = ({ date, foodrecord, user, calories }) => {

  if ( !user.mealGoals.length ) {
    browserHistory.push( '/modify-goals' );
    return null;
  }

  const isToday = date.toDateString() === new Date().toDateString();
  const bardata = bardataFunc(foodrecord, macrosByMeal);
  const titleStyle = isToday ? {} : { color: '#f8d104' };
  const dateStr = isToday ? 'Today' : date.toDateString();
  const consumed = calculateDayMacros(foodrecord).raw.calories;

  return (
  <div className="container-fluid">
    Calories burned: { calories }
    { ' | ' }
    Calories consumed: { consumed }
    { ' | ' }
    Balance: { calories - consumed }
    <div className="row">
        <div className="col-md-3">
          <Panel title={ dateStr } type="primary" titleStyle={ titleStyle }>
            <DayMacroSummary />
          </Panel>
          <Panel title="Macronutrients By Meal" type="primary">
            <ReactHighcharts config={ bardata } />
          </Panel>
        </div>
        <div className="col-md-5" style={{ maxHeight: '700px', overflowY: 'scroll' }}>
          <RecordList />
        </div>
        <div className="col-md-4">
          <Panel title="Change Day" type="primary">
            <ChangeDayContainer />
          </Panel>
          <Panel title="Weight Progress" type="primary">
            <WeightChart />
          </Panel>
        </div>
      </div>
    </div>
    );
};

MainDash.defaultProps = {
  date: new Date()
};

const mapStateToProps = ({ root, foodrecord }) => ({
  date: root.date,
  foodrecord: root.foodrecord,
  user: root.user,
  calories: foodrecord.calories
});

const mapDispatchToProps = dispatch => ({
  getCalories: startDate => dispatch(getCalories(startDate))
});

export default connect(mapStateToProps, mapDispatchToProps)(MainDash);
