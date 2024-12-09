import React from 'react';
import { connect } from 'react-redux';
import { addDay, removeDay, recalculateDay } from '../../redux/reducers/shoppinglist';
import AddDay from './AddDay';

class Day extends React.Component {
  constructor() {
    super();
    this.state = { type: 'rest', added: false };
    this.onChangeType = this.onChangeType.bind(this);
    this.confirmAddDay = this.confirmAddDay.bind(this);
  }

  onChangeType(ev) {
    this.setState({ type: ev.target.value }, () => {
      this.props.recalculateDay(this.props.index, this.state.type);
    });
  }

  confirmAddDay() {
    this.setState({ added: true });
  }


  render() {
    const meals = [ 'Breakfast', 'Morning Snack', 'Lunch', 'Afternoon Snack', 'Dinner', 'Evening Snack' ];
    function modWeight(food, weight) {
      return food.weights.map(wt => {
        return Math.round(weight / (wt.Gr_Wgt * 1) * ( wt.Amount * 1 ) * 10) / 10 + ` ${wt.Description}`;
      });
    }
    return (
      <div>
        {this.state.added && <div className="alert alert-success"><b>Meals Added</b></div>}
        <div className="row">
          <div className="col-xs-4">
            <b>Day { this.props.index + 1 }</b>
          </div>
          <div className="col-xs-4 text-center">
          { this.props.date }
          </div>
          <div className="col-xs-4 text-right">
            <AddDay meals={ this.props.day } day={ this.props.date } clickAddDay={ this.confirmAddDay } />
            <button className="btn btn-default btn-xs" onClick={ () => this.props.recalculateDay(this.props.index, this.state.type) }>
              <span className="glyphicon glyphicon-refresh text-primary" />
            </button>
            <button className="btn btn-default btn-xs" onClick={ () => this.props.removeDay(this.props.index) }>
              <span className="glyphicon glyphicon-remove text-danger" />
            </button>
          </div>
        </div>
        <select className="form-control" value={this.state.type} onChange={ this.onChangeType }>
          <option value="rest">Rest</option>
          <option value="train">Train</option>
        </select>
        <ul className="list-group">
          { this.props.day.map((meal, ix) => (
            meal &&
            (<li key={ ix } className="list-group-item">
              <b>{ meals[ ix ] }</b>
              <br />
                {
                  meal.map(factor => (
                    factor.foods.map((food, idx) => (
                      <div key={ idx }>
                        { food.longname }
                        <span className="badge badge-default pull-right">
                          { modWeight(food, (factor.weight.gr / factor.foods.length))[0] }
                        </span>
                      </div>
                    ))
                  ))
                }
            </li>)
            )
          ) }
        </ul>
      </div>
    );
  }
}

Day.propTypes = {
  index: React.PropTypes.number.isRequired,
  date: React.PropTypes.string.isRequired,
  day: React.PropTypes.array.isRequired,
  recalculateDay: React.PropTypes.func.isRequired,
  removeDay: React.PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  addDay: () => dispatch(addDay()),
  removeDay: index => dispatch(removeDay(index)),
  recalculateDay: (index, type) => dispatch(recalculateDay(index, type))
});


export default connect(null, mapDispatchToProps)(Day);
