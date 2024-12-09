import React from 'react';

import { connect } from 'react-redux';
import { handleAddFoodRecord } from '../../redux/reducers/foodrecord';

class SelectFood extends React.Component {
  constructor() {
    super();
    this.state = {
      weight: 1,
      amount: ''
    };

    this.onAmountChange = this.onAmountChange.bind(this);
    this.onWeightChange = this.onWeightChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onAmountChange(ev) {
    this.setState({ amount: ev.target.value });
  }

  onWeightChange(ev) {
    this.setState({ weight: ev.target.value });
  }

  onSubmit(ev) {
    ev.preventDefault();
    this.props.handleAddFoodRecord({
      abbrev_id: this.props.food.id,
      date: this.props.day.toDateString(),
      meal: this.props.addMeal.id,
      quantity: this.state.amount,
      unit: this.state.weight * 1,
    });
  }

  render() {
    const { food } = this.props;
    return (
      <form onSubmit={this.onSubmit}>
        <b>{food.Main}</b>
        <br />
        {food.Sub}
        <br />
        <div className="form-inline">
          <input className="form-control" value={this.state.amount} onChange={this.onAmountChange} type="number" min="0" max="500" step="0.1" />
          { ' ' }
          <select className="form-control" value={this.state.weight} onChange={this.onWeightChange}>
            { food.weights.map(weight => (
              <option key={weight.Seq} value={weight.Seq}>
                {weight.normalized.txt}
              </option>)) }
          </select>
          { ' ' }
          <button className="btn btn-default">Submit</button>
        </div>
      </form>
    );
  }
}

SelectFood.propTypes = {
  handleAddFoodRecord: React.PropTypes.func.isRequired,
  food: React.PropTypes.object.isRequired,
  day: React.PropTypes.object.isRequired,
  addMeal: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  day: state.root.date,
  addMeal: state.foodrecord.addMeal,
  searchResults: state.foodrecord.foodSearchResults
});

const mapDispatchToProps = dispatch => ({
  handleAddFoodRecord: record => dispatch(handleAddFoodRecord(record))
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectFood);
