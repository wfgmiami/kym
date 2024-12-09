import React from 'react';

const MealCaloriesReport = ({ mealCalories }) => (
  <div className="row" id="mealCals">
    <div className="col-xs-2 text-center">
      Meal 1
      <div>{ mealCalories[0] }</div>
    </div>
    <div className="col-xs-2 text-center">
      Meal 2
      <div>{ mealCalories[1] }</div>
    </div>
    <div className="col-xs-2 text-center">
      Meal 3
      <div>{ mealCalories[2] }</div>
    </div>
    <div className="col-xs-2 text-center">
      Meal 4
      <div>{ mealCalories[3] }</div>
    </div>
    <div className="col-xs-2 text-center">
      Meal 5
      <div>{ mealCalories[4] }</div>
    </div>
    <div className="col-xs-2 text-center">
      Meal 6
      <div>{ mealCalories[5] }</div>
    </div>
  </div>
);

MealCaloriesReport.propTypes = {
  mealCalories: React.PropTypes.array
};

MealCaloriesReport.defaultProps = {
  mealCalories: [ 'TBD', 'TBD', 'TBD', 'TBD', 'TBD', 'TBD' ]
};

export default MealCaloriesReport;
