import React from 'react';
import { connect } from 'react-redux';

const MacroGoalsReport = ({ goals }) => {
  if (!goals) return (<div>Not Set</div>);
  if (!goals[0]) return (<div>Not Set</div>);

  goals = goals[0].goals;

  function macrosByMeal(goal, macro) {
    if (macro === 'calories') {
      return Math.round(macrosByMeal(goal, 'protein') * 4 + macrosByMeal(goal, 'carbs') * 4 + macrosByMeal(goal, 'fat') * 9);
    }
    return Math.round(goal.reduce((total, gl) => total + gl[macro], 0) * 10) / 10;
  }

  return (
    <table className="table table-condensed">
      <thead>
        <tr>
          <th />
          <th>Training</th>
          <th>Resting</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Calories</td>
          <td>{ macrosByMeal(goals.train, 'calories') }</td>
          <td>{ macrosByMeal(goals.rest, 'calories') }</td>
        </tr>
        <tr>
          <td>Protein</td>
          <td>{ macrosByMeal(goals.train, 'protein') }</td>
          <td>{ macrosByMeal(goals.rest, 'protein') }</td>
        </tr>
        <tr>
          <td>Carbs</td>
          <td>{ macrosByMeal(goals.train, 'carbs') }</td>
          <td>{ macrosByMeal(goals.rest, 'carbs') }</td>
        </tr>
        <tr>
          <td>Fat</td>
          <td>{ macrosByMeal(goals.train, 'fat') }</td>
          <td>{ macrosByMeal(goals.rest, 'fat') }</td>
        </tr>
      </tbody>
    </table>
  );
};

const mapStateToProps = ({ root }) => ({
  goals: root.user.mealGoals,
});

export default connect(mapStateToProps)(MacroGoalsReport);
