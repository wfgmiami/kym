import React from 'react';
import { connect } from 'react-redux';

// import FoodList from './FoodList';
// import Header from './Header';
import DayMacroSummary from '../reuse/DayMacroSummary';
import ChangeDayContainer from '../reuse/ChangeDayContainer';
// import SelectFoodContainer from './SelectFoodContainer';
import RecordList from './SelectFoodContainer';

const FoodRecord = ({ date }) => {

  const isToday = date.toDateString() === ( new Date() ).toDateString();
  return (
    <div className="container">
      <div className="text-center">
        <hr />
        <h3>{ isToday ? <span className="text-primary">Today</span> : <span className="text-warning">{ date.toDateString() }</span> }</h3>
        <hr />
      </div>
      <div className="row">
        <div className="col-sm-6">
          <div className="text-center">
            <ChangeDayContainer />
          </div>
        </div>
        <div className="col-sm-6">
          <div className="alert alert-info">
            <DayMacroSummary />
          </div>
        </div>
      </div>
      <RecordList />
    </div>
  );
};

FoodRecord.propTypes = {
  date: React.PropTypes.object.isRequired
};

FoodRecord.defaultProps = {
  foodrecord: [],
};

const mapStateToProps = ({ root }) => ({
  date: root.date
});

export default connect(mapStateToProps)(FoodRecord);
