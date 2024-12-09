import React, { Component } from 'react';

class SignupPage extends Component{
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
      const ignore = document.getElementById('signUp');
      const ignoreAnchor = document.getElementById('logInClick');
      const ignoreLoginPage = document.getElementById('dropDown');

      let target = event.target;
      if (target === ignore || ignore.contains(target) ||
      target === ignoreAnchor || ignoreAnchor.contains(target)){
        return
      }
      this.hide();
  }

  show(){
    this.setState({ visible: true });
    document.addEventListener("click", this.checkElement);
  }

  hide(){
    document.removeEventListener("click", this.checkElement);
    this.setState({ visible: false })
  }

  render(){
    const obj = Object.assign({}, this.state, { show: this.show, hide: this.hide, hideLogin: this.props.hideLogin })
    return (
      <div id="signUp" className="signUp">
       <div className={ (this.state.visible ? "visible " : "") + this.props.alignment }>
         {this.props.children && React.cloneElement(this.props.children, obj )}
       </div>
      </div>
   );
  }
}
export default SignupPage;
