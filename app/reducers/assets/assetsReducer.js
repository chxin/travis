'use strict';

import {
  ASSET_ME_LOAD_REQUEST,
  ASSET_ME_LOAD_SUCCESS,
  ASSET_ME_LOAD_FAILURE,
} from '../../actions/assetsAction.js';
import {commonReducer} from '../commonReducer.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

import Immutable from 'immutable';

var defaultState = Immutable.fromJS({
  data:null,
  isFetching:false,
  filter:{
    AssetTaskType:1,
    CurrentPage:1,
  }
});

function updateData(state,action) {
  var response = action.response.Result;
  var newState = state;

  newState = newState.set('data',Immutable.fromJS(response));
  newState = newState.set('isFetching',false);

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

export default commonReducer((state,action)=>{

  switch (action.type) {
    case ASSET_ME_LOAD_REQUEST:
      return state.set('isFetching',true);
    case ASSET_ME_LOAD_SUCCESS:
      return updateData(state,action);
    case ASSET_ME_LOAD_FAILURE:
      return handleError(state,action);
    default:

  }
  return state;
},defaultState);
