import React from 'react';
import { connect } from 'react-redux';

import ChangeDayContainer from '../reuse/ChangeDayContainer';

import { addDay, removeDay, recalculateDay } from '../../redux/reducers/shoppinglist';

import Day from './Day';

const ShoppingList = ({ addDay, date, removeDay, recalculateDay, shoppinglist, fetchingData }) => {

  const followingDay = numDays => new Date(date.getTime() + numDays * 86400000).toDateString();
  return (
    <div className="container">
      { fetchingData && <span className="alert alert-warning pull-right"><b>Getting your meal plan</b></span> }
      <ChangeDayContainer />
      <div className="well">
        <button className="btn btn-primary" onClick={ () => addDay('rest') }>Add Day</button>
      </div>
      <div>
      {
        shoppinglist.map((day, ix) => ( day &&
          <div className="well" key={ ix }>
            <Day day={ day } index={ ix } date={ followingDay(ix) } />
          </div>
        ))
      }
      </div>
    </div>
  );
};

ShoppingList.propTypes = {
  shoppinglist: React.PropTypes.array.isRequired,
  fetchingData: React.PropTypes.bool.isRequired,
  date: React.PropTypes.object.isRequired,
  addDay: React.PropTypes.func.isRequired,
  removeDay: React.PropTypes.func.isRequired,
  recalculateDay: React.PropTypes.func.isRequired,
};

const mapStateToProps = ({ shoppinglist, root }) => ({
  shoppinglist: shoppinglist.shoppinglist,
  fetchingData: shoppinglist.fetchingData,
  date: root.date
});

const mapDispatchToProps = dispatch => ({
  addDay: type => dispatch(addDay(type)),
  removeDay: index => dispatch(removeDay(index)),
  recalculateDay: index => dispatch(recalculateDay(index))
});

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingList);
