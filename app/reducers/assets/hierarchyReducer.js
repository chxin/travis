'use strict';

import {
  BUILDINGHIERARCHY_LOAD_REQUEST,
  BUILDINGHIERARCHY_LOAD_SUCCESS,
  BUILDINGHIERARCHY_LOAD_FAILURE,
} from '../../actions/assetsAction.js';

import {LOGOUT_SUCCESS} from '../../actions/loginAction.js';

import Immutable from 'immutable';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

var defaultState = Immutable.fromJS({
  scanData:null,
  scanHierarchyId:null,
  buildId:null,
  data:null,
  isFetching:false,
});

function _addSubElementToList(obj, arrList, showType){
  if (obj instanceof Array) {
    obj.forEach(function(subEle){
      if (subEle) {
        subEle.showType=showType;
        arrList.push(subEle);
        if (subEle.Children) {
          _addSubElementToList(subEle.Children, arrList, showType+1)
        }
      }
    });
  }else if(obj!=='undefined'){
    obj.showType=showType;
    arrList.push(obj);
    if (obj.Children) {
      _addSubElementToList(obj.Children, arrList, showType+1)
    }
  }

}

function updateHierarchyData(state,action) {
  var {body:{buildingId,isFromScan}} = action;
  // let {url,body,types} = action;
  var res = action.response.Result;
  var allElements = new Array();
  _addSubElementToList(isFromScan?res:res.Children, allElements, 3);
  var arrDatas = Immutable.fromJS(allElements);

  var newState = state;
  if(isFromScan){
    newState = newState.set('scanData', arrDatas);
    newState = newState.set('scanHierarchyId', buildingId);
  }
  else {
    newState = newState.set('data', arrDatas);
    newState = newState.set('buildId', buildingId);
  }

  newState = newState.set('isFetching', false);

  return newState;
}

function handleError(state,action) {
  var {Error} = action.error;
  // console.warn('handleError',action);

  switch (Error) {
    case '050001207024':
      action.error = localStr('lang_alarm_des1');
      break;
  }
  return defaultState;
}

export default function(state=defaultState,action){
  switch (action.type) {
    case BUILDINGHIERARCHY_LOAD_REQUEST:
      return state.set('isFetching',true);
    case BUILDINGHIERARCHY_LOAD_SUCCESS:
      return updateHierarchyData(state,action);
    case BUILDINGHIERARCHY_LOAD_FAILURE:
      return handleError(state,action);
    case LOGOUT_SUCCESS:
      return defaultState;
    default:

  }
  return state;
}
