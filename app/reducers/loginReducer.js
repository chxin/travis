'use strict';

import Immutable from 'immutable';

import {
  LOGIN_INFO_CHANGED,AUTHCODE_SUCCESS,COUNTER_CHANGED,
  LOGOUT_SUCCESS,
  AUTHCODE_FAILURE,LOGIN_FAILURE,LOGIN_REQUEST,LOGIN_SUCCESS
} from '../actions/loginAction';

import {compose} from 'redux';
import storage from '../utils/storage.js';
import {localStr,localFormatStr} from '../utils/Localizations/localization.js';


var defaultState = Immutable.fromJS({
  password:{
    userName:'',
    password:'',
    submitEnable:false,
    isFetching:false,
  },
  mobile:{
    phoneNumber:'',
    validCode:'',
    counter:'',
    submitEnable:false,
    senderEnable:false,
    isFetching:false,
  }
});

function infoChanged(state,action) {
  var {data:{type}} = action;
  if(type === 'mobile'){
    return mobileInfoChanged(state,action);
  }
  else {
    return passwordInfoChanged(state,action);
  }
}

function phoneNumberSetter(state,value) {
  return state.setIn(['mobile','phoneNumber'],value);
}

function validCodeSetter(state,value) {
  return state.setIn(['mobile','validCode'],value);
}

function counterSetter(state) {
  var phoneNumber = state.getIn(['mobile','phoneNumber']);
  if(!phoneNumber){
    return state.setIn(['mobile','counter'],'');
  }
  return state;
}

function senderButtonSetter(state) {
  var counter = state.getIn(['mobile','counter']);
  if(counter === ''){
    var phoneNumber = state.getIn(['mobile','phoneNumber']);
    var enable = false;
    var strPhone = String(phoneNumber);
    if(/\d{11}/.test(phoneNumber)&&strPhone.length===11){
      enable = true;
    }
    return state.setIn(['mobile','senderEnable'],enable);
  }
  return state;
}

function submitButtonSetter(state) {
  var phoneNumber = state.getIn(['mobile','phoneNumber']);
  var validCode = state.getIn(['mobile','validCode']);

  if(phoneNumber && validCode && validCode.length === 4){
    return state.setIn(['mobile','submitEnable'],true);
  }
  else {
    return state.setIn(['mobile','submitEnable'],false);
  }
}

function mobileInfoChanged(state,action) {
  var {data:{input,value}} = action;

  if(input === 'phoneNumber'){
    return compose(submitButtonSetter,senderButtonSetter,
                  counterSetter,phoneNumberSetter)(state,value);
  }
  else {
    return compose(submitButtonSetter,validCodeSetter)(state,value);
  }

}

function passwordInfoChanged(state,action) {
  var {data:{input,value}} = action;
  var returnState = state;

  if(input === 'userName'){
    returnState = returnState.setIn(['password','userName'],value);
  }
  else {
    returnState = returnState.setIn(['password','password'],value);
  }

  var userName = returnState.getIn(['password','userName']);
  var password = returnState.getIn(['password','password']);

  if(userName && password){
    returnState = returnState.setIn(['password','submitEnable'],true);
  }
  else {
    returnState = returnState.setIn(['password','submitEnable'],false);
  }

  return returnState;

}

const COUNTER = 60;

function sendAuthCode(state, action) {
  return state.
          setIn(['mobile','counter'],COUNTER).
          setIn(['mobile','senderEnable'],false);
}

function countDown(state, action) {
  var counter = parseInt(state.getIn(['mobile','counter']));
  if(counter === 1){
    counter = '';
  }
  else {
    counter--;
  }
  var newState = state;
  newState = newState.setIn(['mobile','counter'],counter);
  if(!counter){
    newState = newState.setIn(['mobile','senderEnable'],true);
  }

  return newState;

}

function handleError(state,action) {
  var {Error} = action.error;
  // console.warn('handleError',action);

  switch (Error) {
    case '050001212602':
      action.error = localStr('lang_login_des0');
      break;
    case '050001212008':
      action.error = localStr('lang_login_des1');
      break;
    case '050001212003':
      action.error = localStr('lang_login_des2');
      break;
    case '050001212601':
      action.error = localStr('lang_login_des3');
      break;
    case '050001212600':
      action.error = localStr('lang_login_des4');
      break;
    default:

  }
  // console.warn('action',action);
  var newState = fetching(state,false);
  if(action.type === LOGIN_FAILURE){
    newState = newState.
                  setIn(['mobile','submitEnable'],true).
                  setIn(['password','submitEnable'],true)
  }
  return newState;
}

function fetching(state,val) {
  return state.
          setIn(['mobile','isFetching'],val).
          setIn(['password','isFetching'],val);
}

function handleRequest(state,action) {
  return fetching(state,true).
          setIn(['mobile','submitEnable'],false).
          setIn(['password','submitEnable'],false);
}


export default function(state=defaultState,action){
  // console.warn('action.type',action.type);
  switch (action.type) {
    case LOGIN_INFO_CHANGED:
      return infoChanged(state,action);
    case AUTHCODE_SUCCESS:
      return sendAuthCode(state,action);
    case COUNTER_CHANGED:
      return countDown(state,action);
    case AUTHCODE_FAILURE:
    case LOGIN_FAILURE:
      return handleError(state,action);
    case LOGIN_REQUEST:
      return handleRequest(state,action);
    case LOGIN_SUCCESS:
      return defaultState;
    case LOGOUT_SUCCESS:
      return defaultState;
    default:

  }
  return state;
}
