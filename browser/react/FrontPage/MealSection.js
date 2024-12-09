import React from 'react';

const MealSection = ( { foods, meal, error }) => {

if (error) {
    return (
      <div className="alert alert-danger">
        <strong>{error}</strong>
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
      <table>
        <thead>
          <tr>
            <th className="size">Food</th>
            <th className="size">Amount</th>
            <th className="size">Protein</th>
            <th className="size">Carbohydrates</th>
            <th className="size">Fat</th>
          </tr>
        </thead>

        <tbody>
          { meal && meal.map( fd => (
            fd.foods.map(food => (
            <tr key={ food.id }>
              <td  className="item">{ food.longname }</td>
              <td  className="item">{ modWeight( food, (fd.weight.gr / fd.foods.length) ).map( (wt, idx) => <div key={ idx }>{ wt }</div>) }</td>
              {/*<td className="item">{ Math.round( fd.weight.gr / fd.foods.length ) }</td>*/}
              <td className="item">{ calcMacroCont(fd, food).Protein }</td>
              <td className="item">{ calcMacroCont(fd, food).Carbohydrates }</td>
              <td className="item">{ calcMacroCont(fd, food).Fat }</td>
            </tr>
            ))
          ) ) }
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={ 2 }>Total:</td>
              <td>{ sumMacro('protein') }</td>
              <td>{ sumMacro('carbs') }</td>
              <td>{ sumMacro('fat') }</td>
            </tr>
          </tfoot>
      </table>
    </div>
  );
};

export default MealSection;

