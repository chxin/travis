
'use strict';

import React,{Component} from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import {loginByPassword,loginInfoChanged} from '../actions/loginAction';
import backHelper from '../utils/backHelper';
import Login from '../components/login/Login';
import LoginWithMobile from './LoginWithMobile';
import Main from './Main';


class LoginWithPassword extends Component{
  constructor(props){
    super(props);
  }
  _codeChanged(code){

  }
  _switch(){
    this.props.navigator.push({
      id:'login_mobile',
      // sceneConfig:'HorizontalSwipeJump',
      component:LoginWithMobile})
  }
  _hasLogined(){
    return !!this.props.user;
  }
  _submit(){
    var login = this.props.login;
    this.props.loginByPassword({
      UserName:login.get("userName"),
      Password:login.get("password")
    });

  }
  _gotoMainPage(){
    this.props.navigator.resetTo({id:'main',component:Main});
  }
  _onInputChanged(input,value){
    this.props.loginInfoChanged({type:'password',input,value});
  }
  componentDidMount() {
    // backHelper.init(this.props.navigator,this.props.route.id);
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.user){
      this._gotoMainPage();
    }
  }
  componentWillUnmount() {
    // backHelper.destroy(this.props.route.id);
  }
  render() {
    return (
      <Login
        type="password"
        data={this.props.login}
        onBack={()=>this.props.navigator.pop()}
        onSend={()=>this._send()}
        onSubmit={(type)=>this._submit(type)}
        onSwitch={()=>this._switch()}
        onInputChanged={(type,value)=>this._onInputChanged(type,value)}
      />);
  }
}

LoginWithPassword.propTypes = {
  navigator:PropTypes.object.isRequired,
  loginWithAuth:PropTypes.func,
  getAuthCode:PropTypes.func,
  loginByPassword:PropTypes.func,
  loginInfoChanged:PropTypes.func,
  countDown:PropTypes.func,
  login:PropTypes.object,
  user:PropTypes.object,
  route:PropTypes.object,
}



function mapStateToProps(state) {
  return {
    login:state.login.get('password'),
    user:state.user.get('user')
  };
}

export default connect(mapStateToProps,{loginByPassword,loginInfoChanged,})(LoginWithPassword);
