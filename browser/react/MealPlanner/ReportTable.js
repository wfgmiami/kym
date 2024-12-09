import React from 'react';
import { connect } from 'react-redux';

import AddToMeals from './AddToMeals';
import ChangeDayContainer from '../reuse/ChangeDayContainer';

const ReportTable = ({ meal, error }) => {

  if (error) {
    return (
      <div className="alert alert-danger">
        <strong>{ error }</strong>
      </div>
    );
  }

  if (!meal.length) return null;
  function sumMacro(macroToSum) {
    return Math.round(10 * meal.reduce((macro, food) => macro + food.macros[macroToSum], 0)) / 10;
  }

  function modWeight(food, weight) {
    return food.weights.map(wt => {
      return Math.round(weight / (wt.Gr_Wgt * 1) * ( wt.Amount * 1 ) * 10) / 10 + ` ${wt.Description}`;
    });
  }

  function calcMacroCont(mealItem, food) {
    const totals = mealItem.foods.reduce((memo, fd) => {
      memo.Protein += fd.Protein * 1;
      memo.Carbohydrates += fd.Carbohydrates * 1;
      memo.Fat += fd.Fat * 1;
      return memo;
    }, { Protein: 0, Carbohydrates: 0, Fat: 0 });

    const percent = {
      Protein: food.Protein / totals.Protein || 0,
      Carbohydrates: food.Carbohydrates / totals.Carbohydrates || 0,
      Fat: food.Fat / totals.Fat || 0,
    };

    return {
      Protein: round10(mealItem.macros.protein * percent.Protein),
      Carbohydrates: round10(mealItem.macros.carbs * percent.Carbohydrates),
      Fat: round10(mealItem.macros.fat * percent.Fat),
    };
  }

  function round10(num) {
    return Math.round(num * 10) / 10;
  }


  return (
    <div>
    <ChangeDayContainer displayDay={ true } />
    <AddToMeals meal={ meal } />
    <table className="table table-condensed">
      <thead>
        <tr>
          <th>Food</th>
          <th>Amount</th>
          <th>Weight (g)</th>
          <th>Protein (g)</th>
          <th>Carbs (g)</th>
          <th>Fat (g)</th>
        </tr>
      </thead>
      <tbody>
    { meal.map( fd => (
      fd.foods.map(food => (
      <tr key={ food.id }>
          <td>{ food.longname }</td>
          <td>{ modWeight( food, (fd.weight.gr / fd.foods.length) ).map( (wt, idx) => <div key={ idx }>{ wt }</div>) }</td>
          <td>{ Math.round( fd.weight.gr / fd.foods.length ) }</td>
          <td>{ calcMacroCont(fd, food).Protein }</td>
          <td>{ calcMacroCont(fd, food).Carbohydrates }</td>
          <td>{ calcMacroCont(fd, food).Fat }</td>
      </tr>
      ))
    ))
    }
      <tr>
        <td colSpan={3}>Total:</td>
        <td>{ sumMacro('protein') }</td>
        <td>{ sumMacro('carbs') }</td>
        <td>{ sumMacro('fat') }</td>
      </tr>
      </tbody>
    </table>
    </div>
  );
};

ReportTable.propTypes = {
  meal: React.PropTypes.array.isRequired,
  error: React.PropTypes.string,
};

ReportTable.defaultProps = {
  error: null
};

const mapStateToProps = ({ mealplanner }) => ({
  meal: mealplanner.meal,
});

export default connect(mapStateToProps)(ReportTable);
