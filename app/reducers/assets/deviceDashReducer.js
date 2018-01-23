'use strict';

import {
  DEVICE_DASHBOARD_REQUEST,
  DEVICE_DASHBOARD_SUCCESS,
  DEVICE_DASHBOARD_FAILURE,
  DEVICE_LOAD_SUCCESS,
  DASHBOARD_CONDITION_CHANGED,
  DEVICE_EXIT
} from '../../actions/assetsAction.js';


import {LOGOUT_SUCCESS} from '../../actions/loginAction.js';
import Immutable from 'immutable';
import utils from '../../utils/unit.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';
import moment from 'moment';
moment.locale('zh-cn');
var today = moment().format('YYYY-MM-DD');
var lastMonthDay=moment().subtract(1,'months').add(1, 'days').format('YYYY-MM-DD');

// var today='2016-12-01';
// var lastMonthDay='2016-12-01';

var defaultState = Immutable.fromJS({
  filter:{
    StartTime:lastMonthDay,
    EndTime:today,
  },
  arrDashDatas:[],
});

function isNull(str){
  if ( str == "" ) return true;
  var regu = "^[ ]+$";
  var re = new RegExp(regu);
  return re.test(str);
}

function combineUnit(value,unit) {
  var val = parseFloat(value);
  // var isDecimal = value.indexOf('.') >= 0
    // console.warn('combineUnit',value,isNaN(val),isNull(value),val,unit);
  if(isNaN(val)){
    if (isNull(value)||isNull(unit)){
      return value;
    }
    return '--';
  }
  else {
    if (unit==='次') {
      return parseFloat(utils.toFixed(Number(val),0));
    }
    if(val.toString().indexOf('.')>0){
      if (Math.abs(val)>=10) {
        return parseFloat(utils.toFixed(Number(val),1));
      }
      return parseFloat(utils.toFixed(Number(val),2));
    }
    else {
      return val;
    }
  }
}

function generateItemFromEnumValue(calType)
{
  var arrIndexs=[
    {Name:localStr('lang_asset_des37'),Unit:'Hz'},
    {Name:localStr('lang_asset_des38'),Unit:'A'},
    {Name:localStr('lang_asset_des39'),Unit:'%'},
    {Name:localStr('lang_asset_des40'),Unit:'%'},
    {Name:localStr('lang_asset_des41'),Unit:'h'},
    {Name:localStr('lang_asset_des42'),Unit:localStr('lang_asset_des36')}
  ];
  return arrIndexs[calType-1];
}
function generateDashDatas(state,action) {
  var {body:{deviceId},response:{Result}} = action;
  var res = Result;
  // console.warn('generateDashDatas...');
  var arrOldDashDatas=state.get('arrDashDatas');
  if(res.ParameterCanCalculates && res.ParameterCanCalculates.length > 0 && arrOldDashDatas.size===0){
    var arrCanCalcu=[];
    res.ParameterCanCalculates.forEach((item)=>{
      if (item.DisplayInstrument) {
        item.Name=generateItemFromEnumValue(item.CalcType).Name;
        item.Unit=generateItemFromEnumValue(item.CalcType).Unit;
        item.isFetching=true;
        arrCanCalcu.push(item);
      }
    });
    arrCanCalcu.sort(function(x,y){
      return x.CalcType>y.CalcType?1:-1;
    });
    state=state.set('arrDashDatas',Immutable.fromJS(arrCanCalcu));
  }
  return state;
}

function updateDashCondition(state,action) {
  var {data:{type,value}} = action;
  var newState = state;
  if (type==='StartTime') {
    var startTime = moment(value).format('YYYY-MM-DD');
    newState = newState.setIn(['filter','StartTime'],startTime);
  }else if (type==='EndTime') {
    var endTime = moment(value).format('YYYY-MM-DD');
    newState = newState.setIn(['filter','EndTime'],endTime);
  }
  return newState;
}

function updateFetching(state,action) {
  var {body:{deviceId,CalcType}} = action;
  var newState = state;

  var arrDashDatas = newState.get('arrDashDatas');
  var index = arrDashDatas.findIndex((item)=>item.get('CalcType')===CalcType);
  if (index===-1) {
    // console.warn('-1 not finded...',arrDashDatas.size);
    return newState;
  }
  arrDashDatas = arrDashDatas.update(index,(dash)=>{
    if (dash==='undefined') {
      // console.warn('dash is undefined...');
    }
    dash = dash.set('isFetching',true);
    dash = dash.set('Name',generateItemFromEnumValue(CalcType).Name);
    dash = dash.set('Unit',generateItemFromEnumValue(CalcType).Unit);
    return dash;
  });
  newState = newState.set('arrDashDatas', arrDashDatas);
  return newState;
}

function updateData(state,action) {
  var {body:{deviceId,CalcType,Name},response:{Result}} = action;
  var newState = state;

  var arrDashDatas = newState.get('arrDashDatas');
  var index = arrDashDatas.findIndex((item)=>item.get('CalcType')===CalcType);
  if (index===-1) {
    // console.warn('-1 not finded 2...',arrDashDatas.size);
    return newState;
  }
  arrDashDatas = arrDashDatas.update(index,(item)=>{
    item = item.set('isFetching',false);
    item = item.set('Value',combineUnit(Result.Val,generateItemFromEnumValue(CalcType).Unit));
    return item;
  });
  newState = newState.set('arrDashDatas', arrDashDatas);
  return newState;
}

function handleError(state,action) {
  var error = action.error;
  // console.warn('handleError...',action);
  if(!error){
    action.error = localStr('lang_commons_notice0');
  }else {
    action.error=null;
  }

  return state;
}

export default function(state=defaultState,action){

  switch (action.type) {
    case DEVICE_DASHBOARD_REQUEST:
      return updateFetching(state,action);
    case DEVICE_DASHBOARD_SUCCESS:
      return updateData(state,action);
    case DEVICE_DASHBOARD_FAILURE:
      return handleError(state,action);
    case DEVICE_LOAD_SUCCESS:
      return generateDashDatas(state,action);
    case DASHBOARD_CONDITION_CHANGED:
      return updateDashCondition(state,action);
    case DEVICE_EXIT:
      return defaultState;
    case LOGOUT_SUCCESS:
      return defaultState;
    default:

  }
  return state;
}
