'use strict';


import {
  VERSION_SUCCESS
} from '../actions/myAction';
import {LOGOUT_SUCCESS} from '../actions/loginAction';
import appInfo from '../utils/appInfo.js';
import Immutable from 'immutable';
import semver from 'semver';

var defaultState = Immutable.fromJS({
  hasNewVersion:false,
  version:'',
  upgradeUri:'',
  ignore:false
});

function checkVersion(state,action) {
  var {response:{Result}} = action;
  var version = Result.NewVersion,newState = state;
  // version = '3.1.11';
  // console.warn('checkVersion',version);
  if(version && semver.gt(version, appInfo.get().versionName)){
    newState = newState.set('hasNewVersion',true);
    // console.warn('version',version);
    newState = newState.set('version',version);
    newState = newState.set('upgradeUri',Result.UpgradeUrl)
  }
  return newState;
}

export default function(state=defaultState,action){
  // console.log('userReducer');
  // console.log(action);
  switch (action.type) {
    case VERSION_SUCCESS:
      return checkVersion(defaultState,action);
    case LOGOUT_SUCCESS:
      return defaultState;
    default:

  }
  return state;
}
