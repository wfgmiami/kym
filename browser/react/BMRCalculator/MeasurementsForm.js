import React from 'react';

const MeasurementForm = ({ submitForm, updateAge, updateGender, updateWeight, updateHeight, updateUnits, units, age, gender, weight, height, btnTxt }) => (
  <form onSubmit={ submitForm }>
    <div className="form-group">
      <label>Units</label>
      <div className="row">
        <label className="col-xs-6 text-center">
          <input
            checked={ units === 'imperial' }
            type="radio"
            className="form-control"
            name="units"
            value="imperial"
            onChange={ updateUnits }
          /> U.S. Customary</label>
        <label className="col-xs-6 text-center"><input
            checked={ units === 'metric' }
            type="radio"
            className="form-control"
            name="units"
            value="metric"
            onChange={ updateUnits }
          /> Metric</label>
      </div>

      <label>Date of Birth:</label>
      <input className="form-control" value={ age } onChange={ updateAge } type="date" />

      <label>Gender:</label>
      <select className="form-control" value={ gender } onChange={ updateGender } >
        <option>Male</option>
        <option>Female</option>
      </select>

      <label>Weight ({ units === 'imperial' ? 'lbs' : 'kg' }):</label>
      <input className="form-control" value={ weight } onChange={ updateWeight } type="number" />

      <label>Height ({ units === 'imperial' ? 'in' : 'cm' }):</label>
      <input className="form-control" value={ height } onChange={ updateHeight } type="number" />
    </div>
    <div className="form-group">
      <button className="btn btn-primary">{ btnTxt }</button>
    </div>
  </form>
);

// MeasurementForm.propTypes = {
//   submitForm: React.PropTypes.func.isRequired,
//   updateAge: React.PropTypes.func.isRequired,
//   updateGender: React.PropTypes.func.isRequired,
//   updateWeight: React.PropTypes.func.isRequired,
//   updateHeight: React.PropTypes.func.isRequired,
//   updateUnits: React.PropTypes.func.isRequired,
//   units: React.PropTypes.string.isRequired,
//   age: React.PropTypes.number.isRequired,
//   gender: React.PropTypes.string.isRequired,
//   weight: React.PropTypes.number.isRequired,
//   height: React.PropTypes.number.isRequired,
//   btnTxt: React.PropTypes.string.isRequired,
// };

export default MeasurementForm;
