'use strict';

import {
  HISTORY_STEP_CHANGED,
  HISTORY_DATA_RESET,
  HISTORY_LOAD_REQUEST,
  HISTORY_LOAD_SUCCESS,
} from '../../actions/historyAction.js';

import {LOGOUT_SUCCESS} from '../../actions/loginAction.js';

import Immutable from 'immutable';

import moment from 'moment';

moment.locale('zh-cn');
// import unit from '../../utils/unit.js';
// import privilegeHelper from '../../utils/privilegeHelper.js';

var defaultState = Immutable.fromJS({
  data:null,
  isFetching:true,
  enableNext:false,
  enablePrview:true,
  isEnergyData:true,
  filter:{
    StartTime:moment().startOf('d'),
    Step:1,
    EndTime:moment().startOf('d').add(1,'d'),
  }
});

function setToDefault(state,action)
{
  var newState=state.set('data',null).set('isEnergyData',true).set('isFetching',true).set('enableNext',false).set('enablePrview',true)
  .setIn(['filter','StartTime'],moment().startOf('d')).setIn(['filter','EndTime'],moment().startOf('d').add(1,'d'))
  .setIn(['filter','Step'],1);
  return newState;
}

function mergeHistoryDatas(state,action)
{
  var {body:{Parameters}} = action;
  var result = action.response.Result;
  if (!result||!result.ParameterData||!result.ParameterData[0]||result.ParameterData.length===0) {
    return state.set('data',null).set('isFetching',false);
  }
  var paraDatas=result.ParameterData[0];
  // paraDatas.Id;
  // paraDatas.Step;
  var arrDatas=paraDatas.ParameterData;
  var isEnergyData=paraDatas.GraphicalType==='Histogram';
  var newState = state.set('data',Immutable.fromJS(arrDatas)).set('isFetching',false).set('isEnergyData',isEnergyData);
  return newState;
}

function getNextStepTime(startTime,endTime,index,isEnergyData)
{
  var endOfCurrStepInStartTime=moment(startTime);
  var newStaTime=moment(startTime);
  if (index===0) {//day
    newStaTime=moment(newStaTime).add(1,'d');
    endOfCurrStepInStartTime=moment(newStaTime).startOf('d').add(1,'d');
    // endOfCurrStepInStartTime=moment(newStaTime).add(1,'d');
  }else if (index===1&&!isEnergyData) {//hours
    newStaTime=moment(startTime).add(3,'h');
    endOfCurrStepInStartTime=moment(startTime).add(6,'h');
  }else if (index===1&&isEnergyData) {//week
    newStaTime=moment(startTime).add(1,'w');
    endOfCurrStepInStartTime=moment(endTime).add(1,'w');
  }else if (index===2&&isEnergyData) {//month
    newStaTime=moment(startTime).add(1,'M');
    endOfCurrStepInStartTime=moment(endTime).add(1,'M');
  }else if (index===3&&isEnergyData) {//year
    newStaTime=moment(startTime).add(1,'y');
    endOfCurrStepInStartTime=moment(endTime).add(1,'y');
  }
  return {endOfCurrStepInStartTime,newStaTime};
}

function setNewDate(startTime,endTime,index,isEnergyData,newDate)
{
  var endOfCurrStepInStartTime=moment(startTime);
  var newStaTime=moment(startTime);
  if (index===0) {//day
    newStaTime=moment(newDate);
    endOfCurrStepInStartTime=moment(newStaTime).startOf('d').add(1,'d');
    console.warn('setNewDate day',newStaTime,endOfCurrStepInStartTime);
  }else if (index===1&&isEnergyData) {//week
    newStaTime=moment(startTime).add(1,'w');
    endOfCurrStepInStartTime=moment(endTime).add(1,'w');
    console.warn('setNewDate week',newStaTime,endOfCurrStepInStartTime);
  }
  return {endOfCurrStepInStartTime,newStaTime};
}

function updateStepData(state,action) {
  var newState=state;
  var {data:{uniqueId,type,index,isEnergyData,newDate}} = action;
  var StartTime=newState.getIn(['filter','StartTime']);
  var EndTime=newState.getIn(['filter','EndTime']);
  // console.warn('updateStepData',type);
  if (type==='left') {
    if (index===0) {
      EndTime=moment(StartTime);
      StartTime=moment(StartTime).subtract(1,'d');
    }else if (index===1&&!isEnergyData) {
      EndTime=moment(StartTime);
      StartTime=moment(StartTime).subtract(3,'h');
    }else if (index===1&&isEnergyData) {
      EndTime=moment(StartTime);
      StartTime=moment(StartTime).subtract(1,'w');
    }else if (index===2&&isEnergyData) {
      EndTime=moment(StartTime);
      StartTime=moment(StartTime).subtract(1,'M');
    }else if (index===3&&isEnergyData) {
    EndTime=moment(StartTime);
      StartTime=moment(StartTime).subtract(1,'y');
    }
  }else if (type==='right') {
    var {newStaTime,endOfCurrStepInStartTime}=getNextStepTime(StartTime,EndTime,index,isEnergyData);
    StartTime=newStaTime;
    EndTime=endOfCurrStepInStartTime;
    //moment().endOf('d').format('X')
    // console.warn('getNextStepTime 2...',StartTime,moment(),'EndTime',EndTime);
    // if (moment()>StartTime) {
    //   newState=newState.setIn(['filter','StartTime'],newStaTime);
    //   newState=newState.setIn(['filter','EndTime'],endOfCurrStepInStartTime);
    // }
  }else if (type==='center') {
    var {newStaTime,endOfCurrStepInStartTime}=setNewDate(StartTime,EndTime,index,isEnergyData,newDate);
    StartTime=newStaTime;
    EndTime=endOfCurrStepInStartTime;
  }else if (type==='step') {
    if (index===0&&!isEnergyData) {//'day'
      StartTime=moment(StartTime).startOf('d');
      EndTime=moment(StartTime).startOf('d').add(1,'d');
      newState=newState.setIn(['filter','Step'],1);
    }else if (index===1&&!isEnergyData) {//'minute'
      StartTime=moment(StartTime).startOf('d');
      EndTime=moment(StartTime).startOf('d').add(3,'h');
      newState=newState.setIn(['filter','Step'],0);
    }else if (index===0&&isEnergyData) {//'day'
      StartTime=moment().startOf('d');
      EndTime=moment().startOf('d').add(1,'d');
      newState=newState.setIn(['filter','Step'],1);
    }else if (index===1&&isEnergyData) {//week
      StartTime=moment().startOf('w').add(1,'d');
      EndTime=moment().startOf('w').add(1,'w').add(1,'d');
      newState=newState.setIn(['filter','Step'],2);
    }else if (index===2&&isEnergyData) {//month
      StartTime=moment().startOf('M');
      EndTime=moment().startOf('month').add(1,'M');
      newState=newState.setIn(['filter','Step'],3);
    }else if (index===3&&isEnergyData) {//year
      StartTime=moment().startOf('y');
      EndTime=moment().startOf('y').add(1,'y');
      newState=newState.setIn(['filter','Step'],5);
    }
  }
  newState=newState.setIn(['filter','StartTime'],StartTime);
  newState=newState.setIn(['filter','EndTime'],EndTime);

  // console.warn('EndTime...',moment(EndTime).add(8,'h').unix());
  if (moment()>StartTime && moment()<EndTime) {
    newState=newState.set('enableNext',false);
  }else {
    newState=newState.set('enableNext',true);
  }
  return newState;
}


export default function(state=defaultState,action){
  switch (action.type) {
    case HISTORY_STEP_CHANGED:
      return updateStepData(state,action);
    case HISTORY_LOAD_REQUEST:
      return state.set('isFetching',true);
    case HISTORY_LOAD_SUCCESS:
      return mergeHistoryDatas(state,action);
    //, HISTORY_LOAD_FAILURE
    case HISTORY_DATA_RESET:
      return setToDefault(state,action);
    case LOGOUT_SUCCESS:
      return defaultState;
    default:

  }
  return state;
}
