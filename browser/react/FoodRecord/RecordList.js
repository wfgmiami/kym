import React from 'react';
import { connect } from 'react-redux';

import FoodList from './FoodList';
import Header from './Header';
import SelectFoodContainer from './SelectFoodContainer';

const RecordList = ({ foodrecord }) => {
  if (!foodrecord) return null;
  const meals = ['Breakfast', 'Morning Snack', 'Lunch', 'Afternoon Snack', 'Dinner', 'Evening Snack'];
  return (
    <div>
      <div>
      { meals.map((meal, idx) => (
        <div key={ idx } className="well well-sm">
          <Header title={ meal } mealIdx={ idx + 1 } />
          <FoodList foods={ foodrecord.filter(record => record.Meal - 1 === (idx)) } />
        </div>
      )) }
      </div>
      <SelectFoodContainer />
    </div>
  );
};

RecordList.propTypes = {
  foodrecord: React.PropTypes.array.isRequired,
};

RecordList.defaultProps = {
  foodrecord: [],
  calculateDayMacros: () => ({ raw: {}, percentCals: {} })
};

const mapStateToProps = ({ root }) => ({
  foodrecord: root.foodrecord,
});

export default connect(mapStateToProps)(RecordList);
