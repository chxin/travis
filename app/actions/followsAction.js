'use strict';

export const FOLLOWS_LOAD_REQUEST = 'FOLLOWS_LOAD_REQUEST';
export const FOLLOWS_LOAD_SUCCESS = 'FOLLOWS_LOAD_SUCCESS';
export const FOLLOWS_LOAD_FAILURE = 'FOLLOWS_LOAD_FAILURE';

export function loadFollowsData(body){
  return (dispatch, getState) => {
    return dispatch({
        types: [FOLLOWS_LOAD_REQUEST, FOLLOWS_LOAD_SUCCESS, FOLLOWS_LOAD_FAILURE],
        url:`user/focus/get`,
        data:body
    });
  }
}

export const FOLLOW_SELECT_CHANGED = 'FOLLOW_SELECT_CHANGED';
export function updateFollowSelectInfo(data){
  return (dispatch,getState)=>{
    return dispatch({
      type:FOLLOW_SELECT_CHANGED,
      data
    });
  }
}

export const FOLLOWS_UPDATE_REQUEST = 'FOLLOWS_UPDATE_REQUEST';
export const FOLLOWS_UPDATE_SUCCESS = 'FOLLOWS_UPDATE_SUCCESS';
export const FOLLOWS_UPDATE_FAILURE = 'FOLLOWS_UPDATE_FAILURE';
export function submitFollowsInfo(body){
  return (dispatch,getState)=>{
    return dispatch({
      types: [FOLLOWS_UPDATE_REQUEST, FOLLOWS_UPDATE_SUCCESS, FOLLOWS_UPDATE_FAILURE],
      url:`user/focus/update`,
      body
    });
  }
}

export const HISTORY_STEP_CHANGED = 'HISTORY_STEP_CHANGED';

export function updateStepData(data){
  return (dispatch,getState)=>{
    return dispatch({
      type:HISTORY_STEP_CHANGED,
      data
    });
  }
}

export const HISTORY_DATA_RESET = 'HISTORY_DATA_RESET';

export function resetHistoryData(data){
  return (dispatch,getState)=>{
    return dispatch({
      type:HISTORY_DATA_RESET,
      data
    });
  }
}
