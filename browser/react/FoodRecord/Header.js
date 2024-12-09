import React from 'react';
import { connect } from 'react-redux';

import {
  changeAddMeal
} from '../../redux/reducers/foodrecord';

const Header = ({ title, mealIdx, changeAddMeal }) => (
  <div>
    <div className="row">
      <div className="col-xs-4">
        <h4>{title}</h4>
      </div>
      <div className="col-xs-4 col-xs-offset-4 text-right">
        <button className="btn btn-default btn-sm" onClick={ () => changeAddMeal(mealIdx) }>
          <span className="glyphicon glyphicon-plus text-success" />
          { ' ' }
          Add Food
        </button>
      </div>
    </div>
    <hr style={{ borderColor: '#dedede' }} />
  </div>
);

Header.propTypes = {
  title: React.PropTypes.string.isRequired,
  mealIdx: React.PropTypes.number.isRequired,
  changeAddMeal: React.PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  changeAddMeal: idx => dispatch(changeAddMeal(idx))
});

export default connect(null, mapDispatchToProps)(Header);
