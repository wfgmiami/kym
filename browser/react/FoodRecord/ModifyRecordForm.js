import React from 'react';
import { connect } from 'react-redux';
import { updateQuantity } from '../../redux/reducers/foodrecord';

class ModifyRecordForm extends React.Component {
  constructor(props) {
    super();
    let { record } = props;
    this.initialSeq = record.weights.filter(weight => weight.Description === record.Unit)[0];
    this.state = { quantity: record.Quantity, seq: record.Seq };

    this.changeQuantity = this.changeQuantity.bind(this);
    this.submitUpdate = this.submitUpdate.bind(this);
    this.changeSeq = this.changeSeq.bind(this);
  }

  componentDidMount() {
    const { record } = this.props;
    this.setState( { quantity: record.Quantity, seq: record.Seq } );
  }

  changeQuantity(ev) {
    this.setState({ quantity: ev.target.value });
  }

  changeSeq(ev) {
    this.setState({ seq: ev.target.value });
  }

  submitUpdate(ev) {
    ev.preventDefault();
    if ( !this.state.quantity ) return;
    const { record, updateQuantity, changeUpdating } = this.props;
    if (this.state.quantity * 1 !== record.Quantity * 1 || this.state.seq * 1 !== record.Seq * 1) {
      updateQuantity( record, this.state )
        .then(changeUpdating);
    } else {
      changeUpdating();
    }
  }

  render() {
    const { record } = this.props;
    const isSame = this.state.quantity * 1 === record.Quantity * 1 && this.state.seq * 1 === record.Seq;
    return (
      <form className="form-inline" onSubmit={ this.submitUpdate }>
        <input
          type="number"
          min="0"
          max="1000"
          step="0.1"
          placeholder={ record.Quantity }
          onChange={ this.changeQuantity }
          value={ this.state.quantity }
          className="form-control input-sm" />
        <select className="form-control input-sm" onChange={ this.changeSeq } value={ this.state.seq }>
          { record.weights.map(weight => <option value={ weight.Seq } key={ weight.Seq }>{ weight.Description }</option>) }
        </select>
        { this.state.quantity ?
          (<button
            type="submit"
            className={`btn btn-${isSame ? 'default' : 'primary'} btn-sm`}
          >
            {isSame ? 'Cancel' : 'Update'}
          </button>) : ''
        }
      </form>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  updateQuantity: (record, quant) => dispatch( updateQuantity( record, quant ) ),
});

export default connect(null, mapDispatchToProps)(ModifyRecordForm);
