'use strict';


import {
  ALARM_FILTER_CHANGED,
  ALARM_FILTER_DIDCHANGED,
  ALARM_FIRSTPAGE,
  ALARM_NEXTPAGE,
  ALARM_CODE_REQUEST,
  ALARM_CODE_SUCCESS,
  ALARM_BUILDING_SUCCESS,
  ALARM_BUILDING_FAILURE,
  ALARM_FILTER_CLEAR,
  ALARM_FILTER_CLOSED,
  ALARM_FILTER_RESET,
  // ALARM_LOAD_SUCCESS
} from '../../actions/alarmAction';

import {LOGOUT_SUCCESS} from '../../actions/loginAction.js';

import {compose} from 'redux';
import Immutable from 'immutable';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

var defaultState = Immutable.fromJS({
    hasFilter:false,
    isFetching:false,
    codes:null,
    buildings:null,
    filterBuildings:[],
    filterCodes: [localStr('lang_alarm_reason0'),localStr('lang_alarm_reason1'),localStr('lang_alarm_reason2'),
  localStr('lang_alarm_reason3'),localStr('lang_alarm_reason4'),localStr('lang_alarm_reason5')
,localStr('lang_alarm_reason6')],
    stable:{
      CurrentPage:1,
      ItemsPerPage:20,
      IsSecure:null,
      Level:[],
      HierarchyIds:null,
      IsCriteriaSearch:false,
      SortMode:{
        Field:'AlarmTime',
        IsDesc:true
      }
    },
    temp:{
      status:[],
      level:[],
      code:[],
      building:[]
    },
    temp1:{
      status:[],
      level:[],
      code:[],
      building:[]
    },
});



function mergeTempFilter(state,action) {
  var newState = state;

  var temp = newState.get('temp');
  var {type,value} = action.data;
  var typeValue = temp.get(type);
  var index = typeValue.findIndex((item)=> item === value);
  if(index < 0){
    typeValue=typeValue.unshift(value);
  }else {
    typeValue=typeValue.remove(index);
  }
  temp = temp.set(type,typeValue);
  console.warn('mergeTempFilter...',type,value,typeValue);
  return newState.set('temp',temp);
}


function convertStatus(state) {
  var status = state.getIn(['temp','status']);
  var isSecure=null;
  if (status.includes(1)&&status.includes(0)) {
    isSecure=null;
  }else if (status.includes(1)) {
    isSecure=true;
  }else if (status.includes(0)) {
    isSecure=false;
  }

  return state.setIn(['stable','IsSecure'],isSecure);
}

function convertLevel(state) {
  // console.warn('convertLevel',state.get('temp'));
  var level = state.getIn(['temp','level']);
  // 在界面上全部，高，中低对应0，1，2，但是后台对应为3，2，1
  var newLevel=[];
  level.forEach((item)=>{
    if (item===0) {
      newLevel.push(3);
    }else if (item===1) {
      newLevel.push(2);
    }else if (item===2) {
      newLevel.push(1);
    }
  });

  return state.setIn(['stable','Level'],Immutable.List(newLevel));
}

function convertClass(state) {
  var code = state.getIn(['temp','code']);
  var newCode = mappingAlarmCode(state,code);
  return state.setIn(['stable','AlarmCode'],newCode);
}

function convertBuilding(state) {
  var building = state.getIn(['temp','building']);//index of buildings
  var newBuilding = mappingAlarmBuilding(state,building);
  console.warn('convertBuilding...',newBuilding);
  return state.setIn(['stable','HierarchyIds'],newBuilding);
}

function mergeStableFilter(state,action) {
  console.warn('mergeStableFilter...',action);
  var newState = compose(convertBuilding,convertClass,convertLevel,convertStatus)(state);
  newState = newState.setIn(['stable','CurrentPage'],1);
  newState = newState.set('temp1',Immutable.fromJS(newState.get('temp').toJSON()));

  newState = newState.setIn(['stable','IsCriteriaSearch'],true);
  return newState.set('hasFilter',true);
}

function mappingAlarmCode(state,arrIndex) {
  if(!arrIndex) return null;
  var filterCodes = state.get('filterCodes');
  var arrCodes=[];
  arrIndex.forEach((index)=>{
    var text = filterCodes.get(index);
    var result = state.get('codes').find((item)=>{
      return item.get('Type').indexOf(text) >= 0;
    });
    if(result){
      arrCodes.push(result.get('Code'));
    }
  });
  var arrOtherCodes=null;
  if (arrIndex.includes(6)) {
    arrOtherCodes=state.get('codes').filterNot((item) => {
      return filterCodes.includes(item.get('Type'))
    }).map((item)=> item.get('Code'));
  }
  // console.warn(
  //   'mappingAlarmCode...',arrCodes,arrOtherCodes.toArray()
  // );
  if (arrOtherCodes) {
    arrCodes.push(arrOtherCodes.toArray());
  }
  var strCodes=arrCodes.map((item)=> item).join(',');
  return strCodes;
}

function mappingAlarmBuilding(state,arrIndex) {
  if(!arrIndex) return null;
  var arrBuilds=[];
  arrIndex.forEach((index)=>{
    var result=state.get('buildings').get(index);
    arrBuilds.push(result.get('id'));
  });
  // var strCodes=arrBuilds.map((item)=> item).join(',');
  return arrBuilds;
}

function nextPage(state,action) {
  var stable = state.get('stable');
  stable = stable.set('CurrentPage',stable.get('CurrentPage')+1);
  return state.set('stable',stable);
}

function firstPage(state,action) {
  var stable = state.get('stable');
  stable = stable.set('CurrentPage',1);

  return state.set('stable',stable);
}

function clearFilter(state,action) {
  return defaultState;
}

function filterClosed(state,action) {
  var newState = state;
  if(newState.get('temp1')){
    newState = newState.set('temp',newState.get('temp1'));
  }

  return newState;
}

function mergeAlarmCode(state,action) {
  var result = action.response.Result;
  var newState = state.set('codes',Immutable.fromJS(result));

  if(newState.get('buildings')&&newState.get('buildings').size >= 0){
    return newState.set('isFetching',false);
  }

  return newState;
}

function mergeAlarmBuilding(state,action) {
  var result = action.response.Result;

  // console.log(result);

  result = result.map((item)=>{
    return {
      id:item.Id,
      name:item.Name
    }
  });

  var newState = state.set('buildings',Immutable.fromJS(result));
  // console.warn('mergeAlarmBuilding...',newState.get('buildings'),newState.get('codes'));

  newState = newState.set('filterBuildings',
          Immutable.fromJS(result.map((item)=>{
            return item.name
          })));


  if(newState.get('codes') && newState.get('codes').size >= 0){
    return newState.set('isFetching',false);
  }

  return newState;
}

function resetFilter(state,action) {
  return state.set('buildings',[]).set('codes',null);
}

function handleError(state,action) {
  var {Error} = action.error;
  // console.warn('handleError',action);

  switch (Error) {
    case '040001307022':
      action.error = null;// localStr('lang_alarm_des1');
      break;
  }
  return state.set('isFetching',false);
}

export default function(state=defaultState,action){
  switch (action.type) {
    case ALARM_FILTER_CHANGED:
      return mergeTempFilter(state,action);
    case ALARM_FILTER_DIDCHANGED:
      return mergeStableFilter(state,action);
    case ALARM_FILTER_CLEAR:
      return clearFilter(state,action);
    case ALARM_NEXTPAGE:
      return nextPage(state,action);
    case ALARM_FIRSTPAGE:
      return firstPage(state,action);
    case ALARM_CODE_REQUEST:
      return state.set('isFetching',true);
    case ALARM_FILTER_CLOSED:
      return filterClosed(state,action);
    case ALARM_CODE_SUCCESS:
      return mergeAlarmCode(state,action);
    case ALARM_BUILDING_SUCCESS:
      return mergeAlarmBuilding(state,action);
    case ALARM_BUILDING_FAILURE:
      return handleError(state,action);
    case ALARM_FILTER_RESET:
      return resetFilter(state,action);
    case LOGOUT_SUCCESS:
      return defaultState;
    default:

  }
  return state;
}
