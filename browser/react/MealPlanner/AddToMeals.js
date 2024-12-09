import React from 'react';
import { connect } from 'react-redux';
import { handleAddMeal } from '../../redux/reducers/foodrecord';

class AddToMeals extends React.Component {
  constructor() {
    super();
    this.state = { mealId: 1 };
    this.onChangeMealId = this.onChangeMealId.bind(this);
    this.onSaveMeal = this.onSaveMeal.bind(this);
  }

  onChangeMealId(ev) {
    this.setState({ mealId: ev.target.value });
  }

  onSaveMeal() {
    this.props.handleAddMeal(this.props.meal, this.state.mealId, this.props.day);
  }

  render() {
    return (
      <div className="clearfix form-inline">
      <button className="btn btn-success pull-right" onClick={ this.onSaveMeal }>
        Add To Daily Meals
      </button>
      <select className="form-control pull-right" onChange={ this.onChangeMealId }>
        <option value={ 1 }>Breakfast</option>
        <option value={ 2 }>Morning Snack</option>
        <option value={ 3 }>Lunch</option>
        <option value={ 4 }>Afternoon Snack</option>
        <option value={ 5 }>Dinner</option>
        <option value={ 6 }>Evening Snack</option>
      </select>
      </div>
    );
  }
}

AddToMeals.propTypes = {
  handleAddMeal: React.PropTypes.func.isRequired,
  meal: React.PropTypes.array.isRequired,
  day: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  day: state.root.date
});

const mapDispatchToProps = dispatch => ({
  handleAddMeal: (meal, mealId, day) => dispatch(handleAddMeal(meal, mealId, day))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddToMeals);
