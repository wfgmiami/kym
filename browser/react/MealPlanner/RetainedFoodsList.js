import React from 'react';
import { connect } from 'react-redux';

const RetainedFoodsList = ({ retainedFoods, removeFood }) => (
  <div className="list-group">
    { retainedFoods.map(fd => <li key={fd.id} className="list-group-item list-group-item-info">
      <button className="btn btn-default btn-xs glyphicon glyphicon-remove" onClick={() => removeFood(fd.id) } />
      { ' ' }
      { fd.longname }
      <span className="badge badge-default">{ fd.maxMacro }</span>
    </li>)}
  </div>
);

RetainedFoodsList.propTypes = {
  retainedFoods: React.PropTypes.array.isRequired,
  removeFood: React.PropTypes.func.isRequired,
};

const mapStateToProps = ({ mealplanner, root }) => ({
  retainedFoods: mealplanner.retainedFoods,
});

export default connect(mapStateToProps)(RetainedFoodsList);
