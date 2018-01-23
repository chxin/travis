'use strict';


import {
  ALARM_LOAD_BYID_REQUEST,
  ALARM_LOAD_BYID_SUCCESS,
  ALARM_LOAD_BYID_FAILURE,
  ALARM_RESET,
} from '../../actions/alarmAction';

import {LOGOUT_SUCCESS} from '../../actions/loginAction.js';

import Immutable from 'immutable';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

var defaultState = Immutable.fromJS({
  isFetching:false,
  data:null,
  alarmFirstId:null,
});

function alarmLoaded(state,action) {
  var {data:{alarmId}} = action;
  var alarm = action.response.Result;
  alarm.Status.push({'Timestamp':alarm.AlarmTime, 'Content':localStr('lang_alarm_create'),User:'self'});
  if (!!alarm.SecureTime) {
    alarm.Status.unshift({'Timestamp':alarm.SecureTime, 'Content':localStr('lang_alarm_des0'),User:'self'});
  }
  alarm.Status.sort(function(x,y){
    return x.Timestamp<y.Timestamp?1:-1;
  })
  return state.set('data',Immutable.fromJS(alarm)).set('alarmFirstId',alarmId);
}

function handleError(state,action) {
  var {Error} = action.error;
  switch (Error) {
    case '040001307022':
      action.error = localStr('lang_alarm_des1');
      break;
    case '050001251009'://009是没有数据权限， 501是报警设备移除
    case '050001251501':
      action.error = localStr('lang_alarm_des2');
      break;
  }
  return defaultState;
}

export default function(state=defaultState,action){

  switch (action.type) {
    case ALARM_LOAD_BYID_REQUEST:
      return state.set('isFetching',true);
    case ALARM_LOAD_BYID_SUCCESS:
      return alarmLoaded(state,action);
    case ALARM_LOAD_BYID_FAILURE:
      return handleError(state,action);
    case ALARM_RESET:
    case LOGOUT_SUCCESS:
      return defaultState;
    default:

  }
  return state;
}
