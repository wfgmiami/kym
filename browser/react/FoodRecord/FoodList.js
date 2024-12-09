import React from 'react';
import { connect } from 'react-redux';
import {
  calculateDayMacros,
  makeMealPublic
} from '../../redux/reducers/foodrecord';

import FoodListItem from './FoodListItem';

const FoodList = ({ foods, makeMealPublic }) => {
  const macros = calculateDayMacros(foods);
  const macroSummary = (
    <div className="row">
      <div className="col-sm-3">
        Calories: { macros.raw.calories }
      </div>
      <div className="col-sm-3">
        Protein: { macros.raw.protein }
      </div>
      <div className="col-sm-3">
        Carbs: { macros.raw.carbs }
      </div>
      <div className="col-sm-3">
        Fat: { macros.raw.fat }
      </div>
    </div>
  );

  if (!foods.length) return macroSummary;

  function threeConfirmed() {
    return foods.filter(food => food.confirmed).length >= 3;
  }

  return (
    <div>
      { macroSummary }
      <ul className="list-group">
        { foods.map(food => (
          <li key={ `${food.id}_${food.confirmed}` } className="list-group-item">
            <FoodListItem food={ food } />
          </li>
          )
        ) }
      </ul>
      {/* threeConfirmed() && <div className="text-right">
        <button className={ foods[0].meal.public ? 'btn btn-success btn-sm' : 'btn btn-default btn-sm'} onClick={ () => makeMealPublic( foods[0].mealId ) }>
          <span className="glyphicon glyphicon-globe text-primary" />
          { ' ' }
          { foods.length && foods[0].meal.public ? 'Public Meal' : 'Make Public' }
        </button>
      </div>*/}
    </div>
  );
};

FoodList.propTypes = {
  foods: React.PropTypes.array.isRequired,
  makeMealPublic: React.PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  makeMealPublic: (mealId, postWorkout) => dispatch(makeMealPublic(mealId, postWorkout))
});

export default connect(null, mapDispatchToProps)(FoodList);
