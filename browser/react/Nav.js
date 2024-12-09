import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import LoginPage from './Login/LoginPage';
import LoginForm from './Login/LoginForm';
import { logout } from '../redux/reducers/root';

class Nav extends Component {
  constructor(){
    super();
    this.showLogin = this.showLogin.bind(this);
  }

  showLogin(){
    this.refs.slideForm.show();
  }

  render() {
    const { pathname } = this.props;

    function isInPath(paths) {
      return paths.reduce((memo, path) => pathname === path || memo, false);
    }
    return (
      <div>
        <nav id="mainNavbar" className="navbar navbar-default navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
              </button>
              <Link id="navbar-brand" className="navbar-brand" style={{ fontSize:"18px" }}>KnowYourMacros</Link>
            </div>
            <div className="collapse navbar-collapse" id="myNavbar">
              <ul className="nav navbar-nav">
                <li className={ pathname === '/' ? 'active' : ''}>
                  <Link to="/">
                    <span className="glyphicon glyphicon-home" />
                    { ' ' }
                    Dashboard
                  </Link>
                </li>
                <li className={ pathname === '/modify-goals' ? 'active' : ''}>
                  <Link to="/modify-goals">
                    <span className="glyphicon glyphicon-wrench" />
                    { ' ' }
                    Modify Goals
                  </Link>
                </li>
                <li className={ isInPath(['/meal-planner', '/shopping-list', '/public-meals']) ? 'dropdown active' : '' }>
                  <Link id="navbar-brand" className="dropdown-toggle" data-toggle="dropdown" to="#" aria-expanded="false">
                    <span className="glyphicon glyphicon-cutlery" />
                    { ' ' }
                    Meals
                    { ' ' }
                    <span className="caret" />
                  </Link>
                  <ul className="dropdown-menu">
                    <li className={ pathname === '/meal-planner' ? 'active' : ''}>
                      <Link to="/meal-planner">
                        <span className="glyphicon glyphicon-scale" />
                        { ' ' }
                        Single Meal Planner
                      </Link>
                    </li>
                    <li className={ pathname === '/shopping-list' ? 'active' : ''}>
                      <Link to="/shopping-list">
                        <span className="glyphicon glyphicon-screenshot" />
                        { ' ' }
                        Day Meal Planner
                      </Link>
                    </li>
                    <li className={ pathname === '/public-meals' ? 'active' : ''}>
                      <Link to="/public-meals">
                        <span className="glyphicon glyphicon-globe" />
                        { ' ' }
                        Public Meals
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className={ pathname === '/list' ? 'active' : ''}>
                  <Link to="/list">
                    <span className="glyphicon glyphicon-list-alt" />
                    { ' ' }
                    Shopping List
                  </Link>
                </li>
              </ul>
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <a id="logInClick" onClick={ this.props.user ? this.props.logout : this.showLogin } >
                    <span className="glyphicon glyphicon-log-in" />
                    { ' ' }
                    { this.props.user ? `Log Out` : `Log In` }
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        { !this.props.user &&
          <LoginPage ref="slideForm" alignment="top">
           <LoginForm />
          </LoginPage>
        }
      </div>
    );
  }
}

const mapStateToProps = ({ root }) => ({
  user: root.user
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Nav);

