import React from 'react';
import { connect } from 'react-redux';
import Panel from '../reuse/Panel';

import { getMeals } from '../../redux/reducers/meals';
import { retainFood } from '../../redux/reducers/mealplanner';

class PublicMeals extends React.Component {
  constructor(props) {
    super();
    this.state = {
      keyword: '',
      meals: [],
      postWorkout: false
    };
    props.getMeals(this.state);

    this.onUpdateKeyWord = this.onUpdateKeyWord.bind(this);
    this.searchPublicMeals = this.searchPublicMeals.bind(this);
    this.changePostWorkout = this.changePostWorkout.bind(this);
    this.useThisMeal = this.useThisMeal.bind(this);
  }

  onUpdateKeyWord(ev) {
    this.setState({ keyword: ev.target.value });
  }

  onUpdateMeal(mealId) {
    if (this.state.meals.indexOf(mealId) > -1) {
      this.setState({ meals: this.state.meals.filter(meal => meal !== mealId) });
    } else {
      const meals = this.state.meals.slice();
      meals.push(mealId);
      this.setState({ meals });
    }
  }

  searchPublicMeals(ev) {
    ev.preventDefault();
    this.props.getMeals(this.state);
  }

  changePostWorkout() {
    this.setState({ postWorkout: !this.state.postWorkout });
  }

  useThisMeal(ix) {
    const meal = this.props.meals[ix];
    meal.foodRecords.forEach(record => {
      this.props.retainFood(record.abbrev);
    });
  }

  render() {
    const mealNames = [ 'Breakfast', 'Morning Snack', 'Lunch', 'Afternoon Snack', 'Dinner', 'Evening Snack' ];
    return (
      <div className="container">
        <div className="text-center">
          <h3>Public Meals</h3>
          <h4>Meals recently published by other members</h4>
        </div>
        <form onSubmit={ this.searchPublicMeals }>
          <div className="form-group">
            <input
              type="text"
              placeholder="Meals With Foods Containing This Phrase"
              className="form-control"
              value={ this.state.keyword }
              onChange={ this.onUpdateKeyWord }
            />
          </div>
          <div className="row form-group">
            { mealNames.map((meal, ix) => (
            <div className="col-md-2 text-center" key={ ix }>
              <label>
                <input type="checkbox" className="btn btn-default" selected={ this.state.meals.indexOf(ix + 1) > -1 } onChange={ () => this.onUpdateMeal(ix + 1) } />
                <br />
                { mealNames[ix] }
              </label>
            </div>
              )) }
          </div>
          <div className="form-group">
            <button className="btn btn-primary">Filter</button>
          </div>
          <label>
            <input type="checkbox" selected={ this.state.postWorkout } onChange={ this.changePostWorkout } />
            Post Workout
          </label>
        </form>
        <div className="row">
        { this.props.meals.map((meal, ix) => (
          <div key={ meal.id } className="col-md-4" style={{ height: '250px', overflowY: 'hidden' }}>
            <Panel type="info" title={ mealNames[meal.meal - 1] }>
              <button className="btn btn-default btn-xs" onClick={ () => this.useThisMeal(ix) }>
                <span className="glyphicon glyphicon-thumbs-up" />
              </button>
              {/*<button className="btn btn-default btn-xs">
                  <span className="glyphicon glyphicon-thumbs-down" />
                </button>*/}
              { meal.foodRecords.map(record => (
                <h5 key={ record.id }>
                  { record.abbrev.longname }
                </h5>
              )) }
            </Panel>
          </div>
        )) }
        </div>
      </div>
    );
  }
}

PublicMeals.propTypes = {
  getMeals: React.PropTypes.func.isRequired,
  retainFood: React.PropTypes.func.isRequired,
  meals: React.PropTypes.array.isRequired,
};

const mapStateToProps = ({ meals }) => ({
  meals: meals.meals
});

const mapDispatchToProps = dispatch => ({
  getMeals: filter => dispatch(getMeals(filter)),
  retainFood: food => dispatch(retainFood(food))
});

export default connect(mapStateToProps, mapDispatchToProps)(PublicMeals);
