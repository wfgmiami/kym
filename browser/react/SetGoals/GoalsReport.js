import React from 'react';

const GoalsReport = ({ goals, title }) => {

  if (!goals) return null;

  const mealNames = [ 'Breakfast', 'Morning Snack', 'Lunch', 'Afternoon Snack', 'Dinner', 'Evening Snack' ];

  goals = goals.map((meal, ix) => {
    meal.id = ix;
    return meal;
  }).filter(meal => {
    return meal.pGoal > 0 || meal.cGoal > 0 || meal.fGoal > 0;
  });

  const calories = ({ pGoal, cGoal, fGoal }) => Math.round(pGoal * 4 + cGoal * 4 + fGoal * 9);

  return (
    <div>
      <h4>{ title }</h4>
      <table className="table table-condensed">
        <thead>
          <tr>
            <th>Meal</th>
            <th>Protein</th>
            <th>Carbs</th>
            <th>Fat</th>
            <th>Calories</th>
          </tr>
        </thead>
        <tbody>
          { goals.map(meal => (
            <tr key={ meal.id }>
              <td>{ mealNames[meal.id] }</td>
              <td>{ meal.pGoal }</td>
              <td>{ meal.cGoal }</td>
              <td>{ meal.fGoal }</td>
              <td>{ calories(meal) }</td>
            </tr>
          )
          ) }
        </tbody>
      </table>
    </div>
  );
};

GoalsReport.propTypes = {
  goals: React.PropTypes.array,
  title: React.PropTypes.string.isRequired,
};

GoalsReport.defaultProps = {
  goals: []
};

export default GoalsReport;
