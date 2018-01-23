
'use strict';

import React,{Component} from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import {loginByPhone,getAuthCode,loginInfoChanged,countDown} from '../actions/loginAction';
import backHelper from '../utils/backHelper';
import Login from '../components/login/Login';
import LoginWithPassword from './LoginWithPassword';
import Main from './Main';

// const COUNTER = 60;

class LoginWithMobile extends Component{
  constructor(props){
    super(props);
  }
  _send(){
    // console.warn('phoneNumber:',this.props.login.get("phoneNumber"));
    this.props.getAuthCode(this.props.login.get("phoneNumber"));
  }
  _clearTimer(){
    if(this._timer){
      clearInterval(this._timer);
      this._timer = null;
    }
  }
  _switch(){
    // this.props.navigator.replace({id:'login_password',component:LoginWithPassword})
    this.props.navigator.pop();
  }
  _hasLogined(){
    return !!this.props.user;
  }
  _submit(){
    var login = this.props.login;
    this.props.loginByPhone({
      Telephone:login.get("phoneNumber"),
      AuthCode:login.get("validCode")
    });

  }
  _bindTimer(){
    if(!this._timer){
      this._timer = setInterval(()=>{
        this.props.countDown();
      },1000);
    }

  }
  _gotoMainPage(){
    this.props.navigator.resetTo({id:'main',component:Main});
  }
  _onInputChanged(input,value){
    // console.warn('input:%s,value:%s',input,value);
    this.props.loginInfoChanged({type:'mobile',input,value});
  }
  componentDidMount() {
    // console.warn('LoginWithMobile mount');
    backHelper.init(this.props.navigator,'login_mobile');
  }
  componentWillReceiveProps(nextProps) {
    // console.warn('nextProps',nextProps.login.get('counter'));
    if(nextProps.login.get('counter')){
      this._bindTimer();
    }
    else {
      this._clearTimer();
    }

    // console.warn('LoginWithMobile componentWillReceiveProps');

    if(nextProps.user){
      this._gotoMainPage();
    }
  }
  componentWillUnmount() {
    backHelper.destroy('login_mobile');
    this._clearTimer();
    this._onInputChanged('phoneNumber','');
  }
  render() {
    return (
      <Login
        type="mobile"
        data={this.props.login}
        onBack={()=>this.props.navigator.popToTop()}
        onSend={()=>this._send()}
        onSubmit={(type)=>this._submit(type)}
        onSwitch={()=>this._switch()}
        onInputChanged={(type,value)=>this._onInputChanged(type,value)}
      />
    );
  }
}

LoginWithMobile.propTypes = {
  navigator:PropTypes.object.isRequired,
  loginWithAuth:PropTypes.func,
  getAuthCode:PropTypes.func,
  loginByPhone:PropTypes.func,
  loginInfoChanged:PropTypes.func,
  countDown:PropTypes.func,
  login:PropTypes.object,
  user:PropTypes.object,
}



function mapStateToProps(state) {
  return {
    login:state.login.get('mobile'),
    user:state.user.get('user')
  };
}

export default connect(mapStateToProps,{loginByPhone,getAuthCode,loginInfoChanged,countDown})(LoginWithMobile);
