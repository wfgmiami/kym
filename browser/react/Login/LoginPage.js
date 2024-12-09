import React, { Component } from 'react';

class LoginPage extends Component{
  constructor(){
    super();

    this.state = {
      visible: false
    };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.checkElement = this.checkElement.bind(this);
  }

  checkElement(event) {
      const ignore = document.getElementById('dropDown');
      const ignoreAnchor = document.getElementById('logInClick');
      let target = event.target;
      if (target === ignore || ignore.contains(target) ||
      target === ignoreAnchor || ignoreAnchor.contains(target)){
        return;
      }
      this.hide();
  }

  show(){
    this.setState({ visible: true });
    document.addEventListener('click', this.checkElement);
    let loginForm = document.getElementById('loginForm');
    let loginButton = document.getElementById('loginButton');

    loginForm.addEventListener('keypress', (event) => {
      if (event.keyCode === 13) {
        loginButton.click();
      }
    });
  }

  hide(){
    document.removeEventListener('click', this.checkElement);
    this.setState({ visible: false });
  }

  render(){
    const obj = Object.assign({}, this.state, { show: this.show, hide: this.hide });
    return (
      <div id="dropDown" className="menu">
       <div className={ (this.state.visible ? "visible " : "") + this.props.alignment }>
         {this.props.children && React.cloneElement(this.props.children, obj )}
       </div>
      </div>
    );
  }
}

export default LoginPage;
