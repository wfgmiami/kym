import React from 'react';

const GoalForm = ({ proteinGoal, carbGoal, fatGoal, updateGoal, calculateFood }) => (
<div style={{ display: 'inline' }}>
  <div className="row form-group">
    <div className="col-md-4">
      <label>Protein Goal:</label>
      <input value={ proteinGoal } className="form-control" type="number" onChange={ev => updateGoal(ev, 'proteinGoal')} />
    </div>
    <div className="col-md-4">
      <label>Carb Goal:</label>
      <input value={ carbGoal } className="form-control" type="number" onChange={ev => updateGoal(ev, 'carbGoal')} />
    </div>
    <div className="col-md-4">
      <label>Fat Goal:</label>
      <input value={ fatGoal } className="form-control" type="number" onChange={ev => updateGoal(ev, 'fatGoal')} />
    </div>
  </div>
  <button className="btn btn-primary" onClick={ calculateFood }>Calculate</button>
</div>
);

GoalForm.propTypes = {
  proteinGoal: React.PropTypes.number.isRequired,
  carbGoal: React.PropTypes.number.isRequired,
  fatGoal: React.PropTypes.number.isRequired,
  updateGoal: React.PropTypes.func.isRequired,
  calculateFood: React.PropTypes.func.isRequired,
};

export default GoalForm;
