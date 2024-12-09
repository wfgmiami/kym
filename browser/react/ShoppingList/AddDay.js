import React from 'react';
import { connect } from 'react-redux';
import { handleAddDay } from '../../redux/reducers/foodrecord';

class AddToMeals extends React.Component {
  constructor() {
    super();
    this.onChangeMealId = this.onChangeMealId.bind(this);
    this.onSaveDay = this.onSaveDay.bind(this);
  }

  onChangeMealId(ev) {
    this.setState({ mealId: ev.target.value });
  }

  onSaveDay() {
    this.props.handleAddDay(this.props.meals, this.props.day);
    this.props.clickAddDay();
  }

  render() {
    return (
      <button className="btn btn-default btn-xs" title="Add to Food Record" onClick={ this.onSaveDay }>
        <span className="glyphicon glyphicon-plus text-success" />
      </button>
    );
  }
}

AddToMeals.propTypes = {
  clickAddDay: React.PropTypes.func.isRequired,
  day: React.PropTypes.string.isRequired,
  handleAddDay: React.PropTypes.func.isRequired,
  meals: React.PropTypes.array.isRequired,
};

const mapDispatchToProps = dispatch => ({
  handleAddDay: (meals, day) => dispatch(handleAddDay(meals, day))
});

export default connect(null, mapDispatchToProps)(AddToMeals);
