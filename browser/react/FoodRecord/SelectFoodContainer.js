import React from 'react';

import { connect } from 'react-redux';
import { searchFoods } from '../../redux/reducers/foodrecord';

import SelectFood from './SelectFood';

class SelectFoodContainer extends React.Component {
  constructor() {
    super();
    this.state = { searchVal: '' };
    this.handleChangeSearchVal = this.handleChangeSearchVal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeSearchVal(ev) {
    this.setState({ searchVal: ev.target.value });
  }

  handleSubmit(ev) {
    ev.preventDefault();
    this.props.searchFoods(this.state.searchVal);
  }

  render() {
    return (
      <div id="myModal" className="modal fade" role="dialog">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">&times;</button>
              <h4 className="modal-title">{ this.props.day.toDateString() } { this.props.addMeal.name }</h4>
            </div>
            <div className="modal-body">
              <div>
                <form className="form-group" onSubmit={ this.handleSubmit }>
                  <label>Search Terms:</label>
                  <div className="input-group">
                    <input className="form-control" value={ this.state.searchVal } onChange={ this.handleChangeSearchVal } />
                    <span className="input-group-btn">
                      <button className="btn btn-primary">Submit</button>
                    </span>
                  </div>
                </form>
                <div className="form-group">
                  <ul className="list-group">
                    { this.props.searchResults.map(food => (
                      <li className="list-group-item" key={food.id}>
                        <SelectFood food={ food } />
                      </li>
                    )) }
                  </ul>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SelectFoodContainer.propTypes = {
  day: React.PropTypes.object,
  searchFoods: React.PropTypes.func.isRequired,
  searchResults: React.PropTypes.array,
};

SelectFoodContainer.defaultProps = {
  day: new Date(),
  addMeal: { id: 1, name: 'Breakfast' },
  searchResults: [],
  searchVal: ''
};

const mapStateToProps = ({ root, foodrecord }) => ({
  day: root.date,
  addMeal: foodrecord.addMeal,
  searchResults: foodrecord.foodSearchResults
});

const mapDispatchToProps = dispatch => ({
  searchFoods: val => dispatch(searchFoods(val)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectFoodContainer);
