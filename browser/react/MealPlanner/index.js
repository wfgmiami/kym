import React from 'react';
import { connect } from 'react-redux';

import {
  searchFood,
  retainFood,
  removeFood,
  calculateFood,
  checkPossibility
} from '../../redux/reducers/mealplanner';

import ReportTable from './ReportTable';
import FoodsList from './FoodsList';
import RetainedFoodsList from './RetainedFoodsList';
import GoalForm from './GoalForm';
import SearchForm from './SearchForm';

export class MealPlanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      retainedFoods: [],
      searchVal: '',
      proteinGoal: 20,
      carbGoal: 30,
      fatGoal: 10,
      err: null
    };
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.changeSearchTerm = this.changeSearchTerm.bind(this);
    this.calculateFood = this.calculateFood.bind(this);
    this.updateGoal = this.updateGoal.bind(this);
    this.selectFood = this.selectFood.bind(this);
    this.removeFood = this.removeFood.bind(this);
  }

  onSearchSubmit(ev) {
    ev.preventDefault();
    if (this.state.searchVal.length > 2) {
      this.props.searchFood( this.state.searchVal );
    }
  }

  changeSearchTerm(ev) {
    this.setState({ searchVal: ev.target.value });
  }

  removeFood(id) {
    this.props.removeFood(id);
    this.setState({ retainedFoods: this.state.retainedFoods.filter( fd => fd.id !== id ) }, () => {
      checkPossibility({ foods: this.state.retainedFoods, goals: this.state });
    });
  }

  updateGoal(ev, goal) {
    switch (goal) {
      case 'proteinGoal':
        this.setState({ proteinGoal: ev.target.value }, check);
      break;
      case 'carbGoal':
        this.setState({ carbGoal: ev.target.value }, check);
      break;
      case 'fatGoal':
        this.setState({ fatGoal: ev.target.value }, check);
      break;
      default:
      break;
    }

    function check() {
      this.setState({ err: null }, () => {
        this.props.checkPossibility({ foods: this.state.retainedFoods, goals: this.state })
          .catch(err => this.setState({ err }));
      });
    }
  }

  selectFood(fd) {
    const { retainedFoods } = this.props;
    if (retainedFoods.filter(rfd => rfd.id === fd.id).length) return;
    this.props.retainFood(fd)
      .then(() => this.setState({ retainedFoods: this.props.retainedFoods }, () => {
        this.props.checkPossibility({ foods: this.state.retainedFoods, goals: this.state });
      }));
  }

  calculateFood() {
    const { retainedFoods } = this.props;
    this.props.calculateFood({
      id: retainedFoods.map(food => food.id),
      proteinGoal: this.state.proteinGoal,
      carbGoal: this.state.carbGoal,
      fatGoal: this.state.fatGoal
    })
    .catch(err => this.setState({ err }));
  }

  render() {
    const { retainedFoods } = this.props;
    return (
      <div className="container">
        <h3>Meal Planner</h3>
        <ReportTable error={ this.state.err } />
        { retainedFoods.length >= 3 && (
          <div>
            <GoalForm
              proteinGoal={ this.state.proteinGoal }
              carbGoal={ this.state.carbGoal * 1 }
              fatGoal={ this.state.fatGoal * 1 }
              calculateFood={ this.calculateFood * 1 }
              updateGoal={ this.updateGoal }
            />
          </div>
        )}
        <br />
        <RetainedFoodsList removeFood={ this.removeFood } />
        <SearchForm
          onSearchSubmit={ this.onSearchSubmit }
          searchVal={ this.state.searchVal }
          changeSearchTerm={ this.changeSearchTerm }
        />
        <FoodsList selectFood={ this.selectFood } />
      </div>
    );
  }
}

MealPlanner.propTypes = {
  calculateFood: React.PropTypes.func.isRequired,
  checkPossibility: React.PropTypes.func.isRequired,
  removeFood: React.PropTypes.func.isRequired,
  retainedFoods: React.PropTypes.array.isRequired,
  retainFood: React.PropTypes.func.isRequired,
  searchFood: React.PropTypes.func.isRequired,
};

const mapStateToProps = ({ mealplanner, root }) => ({
  retainedFoods: mealplanner.retainedFoods,
  date: root.date
});

const mapDispatchToProps = dispatch => ({
  searchFood: searchTerm => dispatch(searchFood(searchTerm)),
  retainFood: food => dispatch(retainFood(food)),
  removeFood: id => dispatch(removeFood(id)),
  calculateFood: params => dispatch(calculateFood(params)),
  checkPossibility: foods => dispatch(checkPossibility(foods))
});

export default connect(mapStateToProps, mapDispatchToProps)(MealPlanner);
