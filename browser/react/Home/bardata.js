const bardata = ( foodrecord, macrosByMeal ) => {
  foodrecord = foodrecord.filter( fd => fd.confirmed );

  const data = [
    [1, macrosByMeal( foodrecord, 1, 'Fat' )],
    [2, macrosByMeal( foodrecord, 2, 'Fat' )],
    [3, macrosByMeal( foodrecord, 3, 'Fat' )],
    [4, macrosByMeal( foodrecord, 4, 'Fat' )],
    [5, macrosByMeal( foodrecord, 5, 'Fat' )],
    [6, macrosByMeal( foodrecord, 6, 'Fat' )]
  ];

  const getData = macro => [
    [1, macrosByMeal( foodrecord, 1, macro )],
    [2, macrosByMeal( foodrecord, 2, macro )],
    [3, macrosByMeal( foodrecord, 3, macro )],
    [4, macrosByMeal( foodrecord, 4, macro )],
    [5, macrosByMeal( foodrecord, 5, macro )],
    [6, macrosByMeal( foodrecord, 6, macro )]
  ];

  return {
    chart: {
      type: 'column',
    },
    animation: true,
    title: 'Macros By Meal',
    xAxis: {
      type: 'integer',
      title: {
        text: 'Meal'
      }
    },
    yAxis: {
      title: {
        text: 'Macros (g)'
      },
      min: 0
    },
    tooltip: {
      headerFormat: '',
      pointFormat: '{series.name}: {point.y} g'
    },
    series: [ {
      name: 'Fat',
      color: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255,99,132,1)',
      data: getData('Fat')
    }, {
      name: 'Protein',
      color: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      data: getData('Protein')
    }, {
      name: 'Carbs',
      color: 'rgba(255, 206, 86, 0.2)',
      borderColor: 'rgba(255, 206, 86, 1)',
      data: getData('Carbohydrates')
    } ]
  };
};

export default bardata;

