'use strict';


export const ALARM_LOAD_REQUEST = 'ALARM_LOAD_REQUEST';
export const ALARM_LOAD_SUCCESS = 'ALARM_LOAD_SUCCESS';
export const ALARM_LOAD_FAILURE = 'ALARM_LOAD_FAILURE';

export function loadAlarm(body){
  return (dispatch, getState) => {
    return dispatch({
        types: [ALARM_LOAD_REQUEST, ALARM_LOAD_SUCCESS, ALARM_LOAD_FAILURE],
        url: 'alarm/search/list',
        body
    });

  }
}

export const ALARM_LOAD_BYID_REQUEST = 'ALARM_LOAD_BYID_REQUEST';
export const ALARM_LOAD_BYID_SUCCESS = 'ALARM_LOAD_BYID_SUCCESS';
export const ALARM_LOAD_BYID_FAILURE = 'ALARM_LOAD_BYID_FAILURE';

export function loadAlarmById(alarmId,isHex){
  return (dispatch, getState) => {
    return dispatch({
        types: [ALARM_LOAD_BYID_REQUEST, ALARM_LOAD_BYID_SUCCESS, ALARM_LOAD_BYID_FAILURE],
        url: isHex?`alarm/${alarmId}`:`alarm/detail/${alarmId}`,
        data:{alarmId}
    });

  }
}

export const ALARM_RESET = 'ALARM_RESET';
export function resetAlarm(data){
  return (dispatch,getState)=>{
    return dispatch({
      type:ALARM_RESET,
      data
    });
  }
}

export const ALARM_FILTER_CHANGED = 'ALARM_FILTER_CHANGED';

export function filterChanged(data){
  return (dispatch,getState)=>{
    return dispatch({
      type:ALARM_FILTER_CHANGED,
      data
    });
  }
}

export const ALARM_FILTER_RESET = 'ALARM_FILTER_RESET';

export function resetFilterData(){
  return (dispatch,getState)=>{
    return dispatch({
      type:ALARM_FILTER_RESET,
    });
  }
}

export const ALARM_FILTER_CLOSED = 'ALARM_FILTER_CLOSED';

export function filterClosed(){
  return (dispatch,getState)=>{
    return dispatch({
      type:ALARM_FILTER_CLOSED,
    });
  }
}

export const ALARM_FILTER_DIDCHANGED = 'ALARM_FILTER_DIDCHANGED';
export function filterDidChanged(data){
  return (dispatch,getState)=>{
    return dispatch({
      type:ALARM_FILTER_DIDCHANGED,
      data
    });
  }
}

export const ALARM_FIRSTPAGE = 'ALARM_FIRSTPAGE';
export function firstPage(){
  return (dispatch,getState)=>{
    return dispatch({
      type:ALARM_FIRSTPAGE,
    });
  }
}

export const ALARM_NEXTPAGE = 'ALARM_NEXTPAGE';
export function nextPage(){
  return (dispatch,getState)=>{
    return dispatch({
      type:ALARM_NEXTPAGE,
    });
  }
}

export const ALARM_FILTER_CLEAR = 'ALARM_FILTER_CLEAR';
export function clearFilter(){
  return (dispatch,getState)=>{
    return dispatch({
      type:ALARM_FILTER_CLEAR,
    });
  }
}

export const ALARM_CODE_REQUEST = 'ALARM_CODE_REQUEST';
export const ALARM_CODE_SUCCESS = 'ALARM_CODE_SUCCESS';
export const ALARM_CODE_FAILURE = 'ALARM_CODE_FAILURE';
export function loadAlarmCode(body={}){
  return (dispatch,getState)=>{
    return dispatch({
        types: [ALARM_CODE_REQUEST, ALARM_CODE_SUCCESS, ALARM_CODE_FAILURE],
        url: 'alarm/codes',
        body
    });
  }
}


export const ALARM_BUILDING_REQUEST = 'ALARM_BUILDING_REQUEST';
export const ALARM_BUILDING_SUCCESS = 'ALARM_BUILDING_SUCCESS';
export const ALARM_BUILDING_FAILURE = 'ALARM_BUILDING_FAILURE';
export function loadAlarmBuildings(){
  return (dispatch,getState)=>{
    return dispatch({
        types: [ALARM_BUILDING_REQUEST, ALARM_BUILDING_SUCCESS, ALARM_BUILDING_FAILURE],
        url: 'building/myBuildings',
        body:{}
    });
  }
}
