'use strict';


import {NO_TOKEN,LOGOUT_SUCCESS,LOGIN_SUCCESS,USER_SUCCESS,USER_FAILURE,USER_REQUEST,USER_UPDATE_REQUEST,USER_UPDATE_SUCCESS} from '../actions/loginAction';

import Immutable from 'immutable';
import storage from '../utils/storage.js';

var defaultState = Immutable.fromJS({hasLogin:null,user:null,isFetching:false,isRealUserLogin:null});

function loadUser(state,action,isDemoUser=false) {
  if(action.response && action.response.Result){
    return state.merge(Immutable.Map({
      hasLogin:true,
      isDemoUser,
      user:Immutable.fromJS(action.response.Result),
      // isRealUserLogin:isDemoUser?false:true,
      isFetching:false
    }));
  }
  else{
    return state.merge(Immutable.Map({
      user:false,
      isFetching:false,
      // isRealUserLogin:isDemoUser?false:true,
      error:action.error
    }));
  }
}

function updateUser(state,action)
{
  if(action.response && action.response.Result){
    var user = state.get('user');
    // console.warn('updateUser',user.get('RealName'),action.response.Result.RealName);
    user = user.set('RealName',action.response.Result.RealName);
    state = state.set('user',user);//.set('isFetching',false);
    return state;
  }
}

function logout(state) {
  storage.removeToken();
  storage.removeDeviceId();
  storage.removeItem('USERNAMEKEY');
  return defaultState.set('hasLogin',false);
}

function loginSuccess(state,action) {
  var currentToken = null;
  var data = action.response;
  var isDemoUser = false;
  if(data && data.Result && data.Result.Token){
    currentToken = data.Result.Token;
    var {url} = action;
    if(url.indexOf('demologin') >= 0){//only way to check demologin
      isDemoUser = true;
    }
    storage.setItem('USERNAMEKEY',data.Result.Name);
    // console.warn('loginSuccess...',data.Result.Name,isDemoUser);
  }


  if(currentToken){
    storage.setToken(currentToken,isDemoUser);
  }
  return loadUser(state,action,isDemoUser);
}

export default function(state=defaultState,action){
  // console.log('userReducer');
  // console.log(action);
  switch (action.type) {
    case NO_TOKEN:
      return logout(defaultState,action);
    case USER_REQUEST:
      return state.set('isFetching',true);
    case LOGIN_SUCCESS:
      return loginSuccess(state,action);
    case USER_SUCCESS:
    case USER_FAILURE:
      return loadUser(state,action);
    // case USER_UPDATE_REQUEST:
    //   return state.set('isFetching',true);
    case USER_UPDATE_SUCCESS:
      return updateUser(state,action);
    case LOGOUT_SUCCESS:
      return logout(defaultState,action);
    default:

  }
  return state;
}
