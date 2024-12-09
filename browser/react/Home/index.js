import React from 'react';
import { connect } from 'react-redux';

import BMRCalculator from '../BMRCalculator';
import MainDash from './MainDash';

const Home = ({ user }) => {

  const measurementsForm = (
    <div className="container">
      <BMRCalculator saveMeas={ true } />
    </div>
    );

  return (
    <div>
      {
        // Make sure user has given their measurements
        (user && user.userMeasurements && !user.userMeasurements.length) ?
        measurementsForm :
        ( user && user.userMeasurements && <MainDash />)
      }
    </div>
  );
};

const mapStateToProps = ({ root }) => ({
  user: root.user
});

export default connect(mapStateToProps)(Home);
