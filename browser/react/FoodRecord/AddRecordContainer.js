import React from 'react';
// import { connect } from 'react-redux';

class AddRecordContainer extends React.Component {
  constructor() {
    super();
    this.state = { inputVal: '' };
    this.changeInput = this.changeInput.bind(this);
  }

  changeInput(ev) {
    this.setState({ inputVal: ev.target.value });
  }

  render() {
    return (
      <div>
        <input className="form-control" value="inputVal" onChange={ this.changeInput } />
      </div>
    );
  }
}

export default AddRecordContainer;
