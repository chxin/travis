'use strict';

import {
  ASSET_QR_PANEL_HIERARCHY_SUCCESS,
  SCAN_EXIT,
  SCAN_RESET_ERROR,
  ASSET_QR_PANEL_HIERARCHY_REQUEST,
  ASSET_QR_PANEL_HIERARCHY_FAILURE,
  // ASSET_QR_DEVICE_DATA_UPDATE,
  DEVICE_QR_LOAD_REQUEST, DEVICE_QR_LOAD_SUCCESS, DEVICE_QR_LOAD_FAILURE,
  ASSET_QR_Sp_UPDATE,
  HIERARCHY_BIND_QR_REQUEST, HIERARCHY_BIND_QR_SUCCESS, HIERARCHY_BIND_QR_FAILURE,
  ASSET_QR_REQUEST, ASSET_QR_SUCCESS, ASSET_QR_FAILURE,
} from '../../actions/assetsAction.js';

import {LOGOUT_SUCCESS} from '../../actions/loginAction.js';

import Immutable from 'immutable';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

var defaultState = Immutable.fromJS({
  dataPanel:null,
  dataDevice:null,
  httpUri:null,
  bindHierarchy:null,
  isFetching:false,
  hasAuth:true,
  errorMessage:null,
});

function updateData(state,action) {
  var response = action.response.Result;
  var newState = state;

  newState = newState.set('dataPanel',Immutable.fromJS(response));
  newState = newState.set('dataDevice',null);
  newState = newState.set('isFetching',false);
  newState = newState.set('hasAuth',true);
  return newState;
}

function updateBindHierarchy(state,action) {
  var response = action.response.Result;
  var newState = state;

  newState = newState.set('dataPanel',null);
  newState = newState.set('dataDevice',null);
  newState = newState.set('isFetching',false);
  newState = newState.set('hasAuth',true);
  newState = newState.set('bindHierarchy',true);
  return newState;
}

function updateAssetData(state,action) {
  var response = action.response.Result;
  var newState = state;
  if (!response.Type) {
    newState = newState.set('errorMessage',localStr('lang_asset_des91'))
  }else if (response.Type===5) {
    newState = newState.set('dataDevice',Immutable.fromJS({'Id':response.HierarchyId,'Name':response.Name}));
  }else if (response.Type===4) {
    newState = newState.set('dataPanel',Immutable.fromJS({'Id':response.HierarchyId,'Name':response.Name}));
  }
  newState = newState.set('isFetching',false);
  newState = newState.set('hasAuth',true);
  return newState;
}

function updateDeviceData(state,action) {
  var {body:{data}} = action;
  // console.warn('updateDeviceData...',data);
  var newState = state;
  newState = newState.set('dataDevice',Immutable.fromJS({'Id':data.DeviceId,'Name':data.DeviceName}));
  newState = newState.set('dataPanel',null);
  newState = newState.set('isFetching',false);
  newState = newState.set('hasAuth',true);
  return newState;
}

function updateScanSpData(state,action) {
  var {data:{type,data}} = action;
  console.warn('updateScanSpData...',type,data);
  var newState = state;
  if (type==='scan') {
    newState = newState.set('httpUri',data);
  }else if (type==='reset') {
    newState = newState.set('httpUri',null);
  }

  newState = newState.set('dataDevice',null);
  newState = newState.set('dataPanel',null);
  newState = newState.set('isFetching',false);
  newState = newState.set('hasAuth',true);
  return newState;
}

function handleError(state,action) {
  var {Error} = action.error;
  // console.warn('handleError',action.error);
  var strError=null;
  switch (Error) {
    case '040001307022':
    case '050001207024':
      strError = localStr('lang_alarm_des1');
      break;
    case '040000307009':
    case '050001251009':
      strError = localStr('lang_commons_notice1');
      break;
    case '050001201010':
      strError = localStr('lang_asset_des92');
      break;
  }
  if (strError) {
    action.error=null;
  }
  return defaultState.set('hasAuth',false).set('errorMessage',strError);
}

export default function(state=defaultState,action){

  switch (action.type) {
    case ASSET_QR_PANEL_HIERARCHY_REQUEST:
    case DEVICE_QR_LOAD_REQUEST:
    case HIERARCHY_BIND_QR_REQUEST:
    case ASSET_QR_REQUEST:
      return state.set('isFetching',true);
    case ASSET_QR_PANEL_HIERARCHY_SUCCESS:
      return updateData(state,action);
    case HIERARCHY_BIND_QR_SUCCESS:
      return updateBindHierarchy(state,action);
    case ASSET_QR_SUCCESS:
      return updateAssetData(state,action);
    case ASSET_QR_PANEL_HIERARCHY_FAILURE:
    case DEVICE_QR_LOAD_FAILURE:
    case ASSET_QR_FAILURE:
    case HIERARCHY_BIND_QR_FAILURE:
      return handleError(state,action);
    case DEVICE_QR_LOAD_SUCCESS:
      return updateDeviceData(state,action);
    case ASSET_QR_Sp_UPDATE:
      return updateScanSpData(state,action);
    // case ASSET_QR_DEVICE_DATA_UPDATE:
    //   return updateDeviceData(state,action);
    case SCAN_RESET_ERROR:
    case SCAN_EXIT:
    case LOGOUT_SUCCESS:
      return defaultState;
    default:

  }
  return state;
}
