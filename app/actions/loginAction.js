'use strict';

import storage from '../utils/storage.js';



export const NO_TOKEN = 'NO_TOKEN';
export const USER_REQUEST = 'USER_REQUEST';
export const USER_SUCCESS = 'USER_SUCCESS';
export const USER_FAILURE = 'USER_FAILURE';

export function loadUser(){
  return  (dispatch, getState) => {

      storage.getToken((value)=>{
        // console.log(value);

        if(!value){
          return dispatch({
              type: NO_TOKEN,
          });
        }

        return dispatch({
            types: [USER_REQUEST, USER_SUCCESS, USER_FAILURE],
            url: 'user/current'
        });
      });


  }
}

export const USER_UPDATE_REQUEST = 'USER_UPDATE_REQUEST';
export const USER_UPDATE_SUCCESS = 'USER_UPDATE_SUCCESS';
export const USER_UPDATE_FAILURE = 'USER_UPDATE_FAILURE';

export function updateUser(body){
  return  (dispatch, getState) => {
    return dispatch({
        types: [USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS, USER_UPDATE_FAILURE],
        url: 'user/update',
        body
    });
  }
}

export const LOGIN_INFO_CHANGED = 'LOGIN_INFO_CHANGED';

export function loginInfoChanged(data){
  return (dispatch,getState)=>{
    return dispatch({
      type:LOGIN_INFO_CHANGED,
      data
    });
  }
}

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export function loginByPassword(body){
  return (dispatch, getState) => {
    return dispatch({
        types: [LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE],
        url: 'user/login',
        body
    });

  }
}

export function loginByPhone(body){
  return (dispatch, getState) => {
    return dispatch({
        types: [LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE],
        url: `user/authlogin`,
        body
    });
  }
}

export function demoLogin(){
  return (dispatch, getState) => {
    return dispatch({
        types: [LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE],
        url: `user/demologin`,
        body:{}
    });
  }
}




export const AUTHCODE_REQUEST = 'AUTHCODE_REQUEST';
export const AUTHCODE_SUCCESS = 'AUTHCODE_SUCCESS';
export const AUTHCODE_FAILURE = 'AUTHCODE_FAILURE';

export function getAuthCode(telephone){
  return (dispatch, getState) => {
    return dispatch({
        types: [AUTHCODE_REQUEST, AUTHCODE_SUCCESS, AUTHCODE_FAILURE],
        url: `user/generateauthcode/${telephone}`,
        body:{}
    });
  }
}

export const COUNTER_CHANGED = 'COUNTER_CHANGED';
export function countDown() {
  return (dispatch, getState) => {
    return dispatch({
        type:COUNTER_CHANGED
    });
  }
}

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

export function logout() {
  return (dispatch, getState) => {
      return dispatch({
          types: [LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE],
          url: 'user/logout',
          body:{}
      });
  }
}
