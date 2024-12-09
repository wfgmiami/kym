import React from 'react';
import Nav from './Nav';
import FrontPage from './FrontPage';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

class Main extends React.Component {
  render() {
    return (
      <div>
        { !localStorage.getItem( 'token' ) ? <FrontPage /> :
          <div>
            <Nav pathname={ browserHistory.getCurrentLocation().pathname } />
            <div style={{ marginTop: '65px' }}>
              { this.props.children }
            </div>
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = ({ root }) => ({
  user: root.user
});

export default connect(mapStateToProps)(Main);
