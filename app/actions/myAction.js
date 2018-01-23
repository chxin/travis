'use strict';


export const VERSION_REQUEST = 'VERSION_REQUEST';
export const VERSION_SUCCESS = 'VERSION_SUCCESS';
export const VERSION_FAILURE = 'VERSION_FAILURE';

export function checkVersion(data){
  return (dispatch, getState) => {
    return dispatch({
        types: [VERSION_REQUEST, VERSION_SUCCESS, VERSION_FAILURE],
        url: `common/mobileversion`,
        body:data
    });

  }
}


export const FEEDBACK_LOGINFO_CHANGED = 'FEEDBACK_LOGINFO_CHANGED';

export function logInfoChanged(data){
  return (dispatch,getState)=>{
    return dispatch({
      type:FEEDBACK_LOGINFO_CHANGED,
      data
    });
  }
}

export const FEEDBACK_DELETE_IMAGE_REQUEST = 'FEEDBACK_DELETE_IMAGE_REQUEST';
export const FEEDBACK_DELETE_IMAGE_SUCCESS = 'FEEDBACK_DELETE_IMAGE_SUCCESS';
export const FEEDBACK_DELETE_IMAGE_FAILURE = 'FEEDBACK_DELETE_IMAGE_FAILURE';

export function deleteLogImage(names){
  return (dispatch, getState) => {
    return dispatch({
        types: [FEEDBACK_DELETE_IMAGE_REQUEST, FEEDBACK_DELETE_IMAGE_SUCCESS, FEEDBACK_DELETE_IMAGE_FAILURE],
        url: `images/delete`,
        body:names
    });

  }
}

export const FEEDBACK_LOG_CLEAN = 'FEEDBACK_LOG_CLEAN';

export function cleanFeedbackLog(){
  return (dispatch, getState) => {
    return dispatch({
        type: FEEDBACK_LOG_CLEAN,
    });
  }
}


export const FEEDBACK_LOG_SAVE_REQUEST = 'FEEDBACK_LOG_SAVE_REQUEST';
export const FEEDBACK_LOG_SAVE_SUCCESS = 'FEEDBACK_LOG_SAVE_SUCCESS';
export const FEEDBACK_LOG_SAVE_FAILURE = 'FEEDBACK_LOG_SAVE_FAILURE';

export function saveFeedback(body,isCreate){
  return (dispatch, getState) => {
    return dispatch({
        types: [FEEDBACK_LOG_SAVE_REQUEST, FEEDBACK_LOG_SAVE_SUCCESS, FEEDBACK_LOG_SAVE_FAILURE],
        url: 'common/feedback',
        body
    });

  }
}
