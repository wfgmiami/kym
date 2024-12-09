import React from 'react';
import { connect } from 'react-redux';

import { calculateDayMacros } from '../../redux/reducers/foodrecord';

import { Pie } from 'react-chartjs-2';


const DayMacroSummary = ({ foodrecord }) => {
  const macros = calculateDayMacros(foodrecord);

  const piedata = {
    labels: [ 'Fat', 'Protein', 'Carbs' ],
    datasets: [ {
        data: [ macros.percentCals.fat, macros.percentCals.protein, macros.percentCals.carbs ],
        backgroundColor: [ 'rgba(255, 99, 132, 0.3)', 'rgba(54, 162, 235, 0.3)', 'rgba(255, 206, 86, 0.3)' ],
        hoverBackgroundColor: [ 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)' ],
        borderColor: [ 'rgba(255,99,132,1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)' ]
      } ]
  };

  return (
    <div className="row">
      <div className="col-xs-7">
        <p>
          <b>Calories:</b> { macros.raw.calories }
        </p>
        <p>
          <b>Protein:</b> { macros.raw.protein } g
        </p>
        <p>
          <b>Carbs:</b> { macros.raw.carbs } g
        </p>
        <p>
          <b>Fat:</b> { macros.raw.fat } g
        </p>
      </div>
      <div className="col-xs-5 text-center">
        { macros.raw.calories ? 'Percent Calories:' : '' }
        {macros.percentCals.calories ? (<div style={{ maxWidth: '120px', margin: 'auto' }}>
          <Pie data={ piedata } width={120} height={120} options={{legend: { display: false } }} />
        </div>) : ''}
      </div>
    </div>
  );
};

const mapStateToProps = ({ root }) => ({
  foodrecord: root.foodrecord,
});

export default connect(mapStateToProps)(DayMacroSummary);
