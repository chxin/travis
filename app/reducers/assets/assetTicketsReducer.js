'use strict';

import {
  ASSET_TENDING_REQUEST,
  ASSET_TENDING_SUCCESS,
  ASSET_TENDING_FAILURE,
} from '../../actions/assetsAction.js';

import Immutable from 'immutable';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

var defaultState = Immutable.fromJS({
  data:null,
  isFetching:false,
  hierarchyId:null,
  filter:{
    AssetTaskType:1,
    CurrentPage:1,
  }
});

function updateData(state,action) {
  var {hierarchyId} = action;
  var response = action.response.Result;
  var newState = state;

  newState=newState.set('data',Immutable.fromJS(response))
                   .set('hierarchyId',hierarchyId)
                   .set('isFetching',false);

  return newState;
}

function handleError(state,action) {
  var {Error} = action.error;
  // console.warn('handleError',action);

  switch (Error) {
    case '040001307022':
      action.error = localStr('lang_alarm_des1');
      state=state.set('data',Immutable.fromJS([]));
      break;
  }
  return state.set('isFetching',false);
}

export default function(state=defaultState,action){
  switch (action.type) {
    case ASSET_TENDING_REQUEST:
      return state.set('isFetching',true);
    case ASSET_TENDING_SUCCESS:
      return updateData(state,action);
    case ASSET_TENDING_FAILURE:
      return handleError(state,action);
    default:

  }
  return state;
}
