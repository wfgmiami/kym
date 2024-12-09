import React from 'react';
import { connect } from 'react-redux';

import { updateWeight } from '../../redux/reducers/root';

class UpdateWeight extends React.Component {
  constructor() {
    super();
    this.state = { weight: '' };
    this.changeWeight = this.changeWeight.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  changeWeight(ev) {
    this.setState({ weight: ev.target.value });
  }

  submitForm(ev) {
    ev.preventDefault();
    this.props.updateWeight(this.props.user.userMeasurements[0], this.state.weight, this.props.user, this.props.date);
  }

  render() {
    const { date, user } = this.props;
    if (Math.floor((date - new Date(user.programs[0].startDate)) / 86400000) % 7) {
      return null;
    }
    if ((Math.floor((date - new Date(user.programs[0].startDate)) / 86400000)) === 0) {
      return null;
    }

    return (
      <form onSubmit={ this.submitForm } className="input-group">
        <input type="number" placeholder="Update Weight" step="0.1" className="form-control" value={this.state.weight} onChange={this.changeWeight} />
        <span className="input-group-btn">
          <button role="button" className="btn btn-primary">
            Submit
          </button>
        </span>
      </form>
      );
  }
}

UpdateWeight.propTypes = {
  updateWeight: React.PropTypes.func.isRequired,
  date: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired
};

const mapsStateToProps = ({ root }) => ({
  user: root.user,
  date: root.date
});

const mapDispatchToProps = dispatch => ({
  updateWeight: (measurements, newWeight, user, date) => dispatch(updateWeight(measurements, newWeight, user, date))
});

export default connect(mapsStateToProps, mapDispatchToProps)(UpdateWeight);
