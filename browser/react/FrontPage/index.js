import React from 'react';
import Nav from './NavFrontPage';
import InputsSection from './InputsSection';
import AboutSection from './AboutSection';

const FrontPage = () => {
  const year = new Date().getFullYear();

  return (
    <div className="content_container">
      <div id="header">
        <Nav />
      </div>

      <div id="body">
        <AboutSection />
        <InputsSection />
      </div>


      <div className="navbar navbar-default" id="footer">
       <div className="container">
        <ul className="nav navbar-nav">
          <li>
            <a  style={{ color: 'white' }} href="#">&copy;{' '}{ year } KnowYourMacros</a>
          </li>
        </ul>
        <ul className="nav navbar-nav pull-right">
          <li>
            <a style={{ color: 'white' }} href="#">Terms of Service</a>
          </li>
          <li>
            <a style={{ color: 'white' }} href="#">Privacy Policy</a>
          </li>
        </ul>
       </div>
      </div>

    </div>
  );
};

export default FrontPage;
