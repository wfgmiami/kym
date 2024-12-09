const linedata = ( measurements = [], programs ) => {
  let data = measurements.map( inst => {
    const dt = new Date( inst.createdAt );
    return [ Date.UTC( dt.getFullYear(), dt.getMonth(), dt.getDate() ), inst.weight * 1 ];
  } );

  if (!programs[0]) return null;
  const program = programs[0];
  const dt = new Date();

  const startDate = new Date(program.startDate);
  const endDate = new Date(program.endDate);
  data.splice(0, 0, [ Date.UTC( startDate.getFullYear(), startDate.getMonth(), startDate.getDate() ), program.startWeight * 1 ]);
  data.push([ Date.UTC( endDate.getFullYear(), endDate.getMonth(), endDate.getDate() ), program.endGoal * 1 ]);

  data = data.sort((a, b) => {
    if (a[0] > b[0]) return 1;
    if (a[0] < b[0]) return -1;
    return 0;
  });

  return {
    chart: {
      type: 'spline'
    },
    title: '',
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        month: '%e. %b',
        year: '%b'
      },
      title: {
        text: 'Date'
      }
    },
    yAxis: {
      title: {
        text: 'Weight (lbs)'
      },
      min: program.endGoal * 1 - 5
    },
    tooltip: {
      headerFormat: '',
      pointFormat: '{point.x:%e %b}: {point.y:.1f} lbs'
    },

    plotOptions: {
      spline: {
        marker: {
          enabled: true
        }
      }
    },
    series: [ {
      name: 'Weight (lbs)',
      showInLegend: false,
      data
    }, {
      name: 'Current Date',
      showInLegend: true,
      data: [
        [ Date.UTC( dt.getFullYear(), dt.getMonth(), dt.getDate() ), program.startWeight * 1 + 5 ],
        [ Date.UTC( dt.getFullYear(), dt.getMonth(), dt.getDate() ), program.endGoal * 1 - 5 ]
      ]
    } ]
  };
};

export default linedata;

