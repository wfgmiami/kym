import React from 'react';
import { connect } from 'react-redux';

import UpdateWeight from '../BMRCalculator/UpdateWeight';
import ReactHighcharts  from 'react-highcharts';
import linedata from './linedata';

import { destroyMeasurement } from '../../redux/reducers/root';

class WeightChart extends React.Component {
  constructor() {
    super();

    this.state = { display: 'chart' };
    this.changeDisplay = this.changeDisplay.bind(this);
  }

  changeDisplay(display) {
    this.setState({ display });
  }

  render() {
    const { user } = this.props;
    return (
      <div>
        <div>
          <ul className="nav nav-tabs">
            <li className={ this.state.display === 'chart' ? 'active' : '' } onClick={ () => this.changeDisplay('chart') }>
              <a>Chart</a>
            </li>
            <li className={ this.state.display === 'table' ? 'active' : '' } onClick={ () => this.changeDisplay('table') }>
              <a>Table</a>
            </li>
          </ul>
        </div>
        <UpdateWeight />
        { this.state.display === 'chart' ?
          <ReactHighcharts config={ linedata(user.userMeasurements, user.programs) } /> :
          <div style={{ marginTop: '15px' }}>
            {
              user.userMeasurements.sort((a, b) => {
                if (new Date(a.createdAt) > new Date(b.createdAt)) return 1;
                if (new Date(a.createdAt) < new Date(b.createdAt)) return -1;
                return 0;
              }).map(meas => (
                <p key={ `${meas.id}_${meas.createdAt}_${meas.weight}` }>
                  <button className="btn btn-default btn-xs" onClick={ () => this.props.destroyMeasurement(meas.id) }>
                    <span className="glyphicon glyphicon-remove text-danger" />
                  </button>
                  { ' ' }
                  { meas.weight } { meas.units === 'imperial' ? 'lbs' : 'kg' }
                  <span className="pull-right">{ new Date(meas.createdAt).toDateString() }</span>
                </p>
              )
            ) }
          </div>
        }
      </div>
    );
  }
}


const mapStateToProps = ({root}) => ({
  user: root.user
});

const mapDispatchToProps = dispatch => ({
  destroyMeasurement: id => dispatch(destroyMeasurement(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(WeightChart);
