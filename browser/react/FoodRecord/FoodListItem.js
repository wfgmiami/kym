import React from 'react';
import { connect } from 'react-redux';
import {
  destroyFoodRecord,
  confirmRecord
} from '../../redux/reducers/foodrecord';

import ModifyRecordForm from './ModifyRecordForm';

class FoodListItem extends React.Component {
  constructor() {
    super();
    this.state = { updating: false };

    this.changeUpdating = this.changeUpdating.bind(this);
  }

  changeUpdating() {
    this.setState({ updating: !this.state.updating });
  }

  render() {
    const { destroyFoodRecord, confirmRecord, food } = this.props;

    return (
      <div className="clearfix">
        <button onClick={ () => destroyFoodRecord(food.id) } className="btn btn-default btn-xs glyphicon">
          <span className="glyphicon-remove text-danger" />
        </button>
        { !food.confirmed && (
          <button onClick={ () => confirmRecord(food.id) } className="btn btn-default btn-xs">
            <b className="text-success">I ate this</b>
          </button>
        ) }
        { ' ' }
        {food.Main}, {food.Sub}
        { ' ' }
        <div className="pull-right">
          { this.state.updating ?
            <ModifyRecordForm record={ food } changeUpdating={ this.changeUpdating } /> :
            <span className="label label-default" style={{ cursor: 'pointer' }} onClick={ this.changeUpdating }>{food.Quantity} {food.Unit}</span> }
        </div>
      </div>
    );
  }
}


FoodListItem.propTypes = {
  destroyFoodRecord: React.PropTypes.func.isRequired,
  confirmRecord: React.PropTypes.func.isRequired,
  food: React.PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
  destroyFoodRecord: id => dispatch( destroyFoodRecord( id ) ),
  confirmRecord: id => dispatch( confirmRecord( id ) ),
});

export default connect(null, mapDispatchToProps)(FoodListItem);
