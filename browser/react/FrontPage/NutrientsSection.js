import React from 'react';


const NutrientsSection = ({ diet }) => {

  return (
    <div className="buffer forms">
      <table>
        <caption>Macronutrients (in grams) And Daily Calories</caption>
        <thead>
          <tr>
            <th className="size">Protein</th>
            <th className="size">Carbohydrates</th>
            <th className="size">Fat</th>
            <th className="size">Calories</th>
          </tr>
        </thead>
        <tbody>
         <tr>
            <td className="item">
              { diet.protein }
            </td>
            <td className="item">
              { diet.carbs }
            </td>
            <td className="item">
              { diet.fat }
            </td>
            <td className="item">
              { diet.calories }
            </td>
          </tr>
         </tbody>
      </table>
    </div>
  );
};

export default NutrientsSection;

