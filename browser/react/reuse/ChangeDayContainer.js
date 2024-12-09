import React from 'react';
import { DateField } from 'react-date-picker';

import { connect } from 'react-redux';
import {
  changeDay,
  nextDayClick,
  previousDayClick,
} from '../../redux/reducers/foodrecord';


class ChangeDayContainer extends React.Component {
  constructor(props) {
    super();
    this.changeDateVal = this.changeDateVal.bind(this);
  }

  changeDateVal(date) {
    this.props.changeDay(new Date(new Date(date).getTime() + 86400000));
  }

  render() {
    const { date, previousDayClick, nextDayClick, displayDay } = this.props;
    const currentDate = new Date();
    const isToday = date.toDateString() === currentDate.toDateString();
    const dateDiff = Math.round((date - currentDate) / 86400000);
    return (
      <div>
        <div style={{ margin: 'auto', maxWidth: '228px', textAlign: 'center' }}>
          <DateField dateFormat="YYYY-MM-DD" value={ date } onChange={ this.changeDateVal } />
          <div>
            <small>Use format <i>YYYY-MM-DD</i></small>
          </div>
        </div>
        <div className="text-center">
          <div className="btn-group">
            <button type="button" className="btn btn-default" onClick={ previousDayClick }>Previous Day</button>
            <button type="button" className="btn btn-default" onClick={ nextDayClick }>Next Day</button>
          </div>
          <div>
          { displayDay && <b>{ isToday ? <span className="text-primary">Today</span> : <span className="text-warning">{date.toDateString()}</span> }</b>
          }
          </div>
          <div>
          {isToday ? '' : <small>Today { dateDiff }</small>}
          </div>
        </div>
      </div>
    );
  }
}

ChangeDayContainer.defaultProps = {
  date: new Date()
};

const mapDispatchToProps = dispatch => ({
  changeDay: dt => dispatch(changeDay(dt)),
  nextDayClick: () => dispatch(nextDayClick()),
  previousDayClick: () => dispatch(previousDayClick())
});

const mapStateToProps = ({ root }) => ({
  date: root.date
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangeDayContainer);
