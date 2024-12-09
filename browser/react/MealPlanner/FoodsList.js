import React from 'react';
import { connect } from 'react-redux';

const FoodsList = ({ searchedFoods, selectFood }) => (
  <div className="list-group">
    { searchedFoods.map(fd => (
      <button
        onClick={ () => selectFood(fd) }
        className="list-group-item"
        key={fd.id}
      >
        { fd.longname }
        <span className="badge badge-default">{ fd.maxMacro }</span>
      </button>
    ))}
  </div>
);

FoodsList.propTypes = {
  searchedFoods: React.PropTypes.array.isRequired,
  selectFood: React.PropTypes.func.isRequired
};

const mapStateToProps = ({ mealplanner }) => ({
  searchedFoods: mealplanner.searchedFoods,
});

export default connect(mapStateToProps)(FoodsList);
