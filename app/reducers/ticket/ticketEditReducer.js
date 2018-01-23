'use strict';

import {
  CREATE_TICKET_DATA_INIT,
  TICKET_CREATE_CONDITION_CHANGED,
  USER_SELECT_CHANGED,
  ASSET_SELECT_CHANGED,
  TICKET_CREATE_REQUEST,
  TICKET_CREATE_SUCCESS,
  TICKET_CREATE_FAILURE,
  TICKET_CREATE_RESET,
  ASSETS_USERS_REQUEST,
  ASSETS_USERS_SUCCESS,
  ASSETS_USERS_FAILURE,
} from '../../actions/ticketAction.js';

import {LOGOUT_SUCCESS} from '../../actions/loginAction.js';

import Immutable from 'immutable';
import moment from 'moment';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

moment.locale('zh-cn');

var today = moment().format('YYYY-MM-DD');

var defaultState =  Immutable.fromJS({
  CustomerId:null,
  TicketType:0,
  Assets:[],
  StartTime:today,
  EndTime:today,
  Executors:[],
  Content:'',
  alarm:null,
  isFetching:true,
  isPosting:1,
  selectUsers:[],
  selectAssets:[],
});

function initData(state,action) {
  var {data:{type}}=action;
  var newState=state;
  if (type==='createNormalTicket') {
    newState=_initCreateTicket(state,action);
  }else if (type==='createAlarmTicket') {
    newState=_initCreateAlarmTicket(state,action);
  }else if (type==='editNormalTicket') {
    newState=_initEditTicket(state,action);
  }
  return newState;
}
function _initCreateTicket(state,action) {
  var {data:{value}}=action;
  var {customer}=value;
  var today = moment().format('YYYY-MM-DD');
  state=state.set('CustomerId',customer.get('CustomerId'))
            .set('TicketType',4)
            .set('StartTime',today)
            .set('EndTime',today)
            .set('alarm',null)
            .set('Assets',Immutable.fromJS([]))
            .set('selectAssets',Immutable.fromJS([]))
            .set('Executors',Immutable.fromJS([]))
            .set('selectUsers',Immutable.fromJS([]))
            .set('isFetching',false)
            .set('isPosting',1)
            .set('Content','');
  return state;
}
function _initCreateAlarmTicket(state,action) {
  var {data:{value}}=action;
  var {alarm,customer}=value;
  var today = moment().format('YYYY-MM-DD');
  state=state.set('CustomerId',customer.get('CustomerId'))
            .set('TicketType',2)
            .set('StartTime',today)
            .set('EndTime',today)
            .set('alarm',alarm)
            .set('Assets',Immutable.fromJS([{'Name':alarm.get('DeviceName'),'Id':alarm.get('HierarchyId')}]))
            .set('selectAssets',Immutable.fromJS([{'Name':alarm.get('DeviceName'),'Id':alarm.get('HierarchyId')}]))
            .set('Executors',Immutable.fromJS([]))
            .set('selectUsers',Immutable.fromJS([]))
            .set('isFetching',false)
            .set('isPosting',1)
            .set('Content',getAlarmDescri(alarm));
  console.warn('_initCreateAlarmTicket',state.get('Assets'),state.get('selectAssets'));
  return state;
}

function _initEditTicket(state,action) {
  var {data:{value}}=action;
  var {ticket,customer}=value;
  var startTime = moment(ticket.get('StartTime')).format('YYYY-MM-DD');
  var endTime = moment(ticket.get('EndTime')).format('YYYY-MM-DD');
  var arr = ticket.get('Executors');
  var selectUsers = [];
  arr.forEach((item)=>{
    selectUsers.push({'Id':item.get('UserId'),'RealName':item.get('UserName')});
  });
  var arrAss = ticket.get('Assets');
  var selectAssets = [];
  arrAss.forEach((item)=>{
    selectAssets.push({'Id':item.get('HierarchyId'),'Name':item.get('HierarchyName')});
  });
  var ticketType = ticket.get('TicketType');
  // var enableEditStartTime = ticket.get('Status')<2;
  state=state.set('CustomerId',customer.get('CustomerId'))
            .set('TicketType',ticketType)
            .set('StartTime',startTime)
            .set('EndTime',endTime)
            .set('Assets',Immutable.fromJS(selectAssets))
            .set('selectAssets',Immutable.fromJS(selectAssets))
            .set('Executors',Immutable.fromJS(selectUsers))
            .set('selectUsers',Immutable.fromJS(selectUsers))
            .set('Content',Immutable.fromJS(ticket.get('Content')))
            .set('isFetching',false)
            .set('isPosting',1);
  return state;
}

function conditionChanged(state,action) {
  var newState = state;
  var {data:{type,value}} = action;
  if (type==='StartTime') {
    var startTime = moment(value).format('YYYY-MM-DD');
    newState = newState.set('StartTime',startTime);
  }else if (type==='EndTime') {
    var endTime = moment(value).format('YYYY-MM-DD');
    newState = newState.set('EndTime',endTime);
  }else if (type==='Content') {
    newState = newState.set('Content',value);
  }else if (type==='TicketType') {
    newState = newState.set('TicketType',value);
  }
  return newState;
}

function updateAssetsUsers(state,action)
{
  var response = action.response.Result;
  var selectUsers = state.get('selectUsers');
  var allElements = Immutable.fromJS(response);

  var newSelecUsers=[];
  selectUsers.forEach((oldItem)=>{
    var index = allElements.findIndex((item)=>item.get('Id')===oldItem.get('Id'));
    if (index===-1) {
      return;
    }
    newSelecUsers.push(oldItem);
    allElements = allElements.update(index,(item)=>{
      item = item.set('isSelect',true);
      return item;
    });
  });
  state = state.set('Executors', Immutable.fromJS(newSelecUsers)).set('selectUsers', Immutable.fromJS(newSelecUsers));
  return state;
}

function userSelectInfoChange(state,action){
  var {data:{type,value}}=action;
  var newState = state;
  if (type==='save') {
    newState = newState.set('Executors', value).set('selectUsers', value);
  }
  return newState;
}

function assetsSelectInfoChange(state,action){
  var newState = state;
  var {data:{type,value}} = action;
    // console.warn('assetsSelectInfoChange...',type,value,action);
  if (type==='save') {
    newState = newState.set('Assets', value).set('selectAssets', value);
  }
  return newState;
}

function getAlarmDate(alarm){
  var obj = moment(alarm.get('AlarmTime'));
  return obj.format(localStr('lang_ticket_timeformat'))
}
function getAlarmLevel(alarm){
  var level = alarm.get('Level');
  if(level === 1){
    return localStr('lang_alarm_low_level');
  }
  else if(level === 2){
    return localStr('lang_alarm_midd_level');
  }
  else{
    return localStr('lang_alarm_high_level');
  }
}
function getAlarmDescri(alarm)
{
  if (!alarm) {
    return '';
  }
  var des = localStr('lang_ticket_time')+getAlarmDate(alarm)+'\n';
  des += localStr('lang_alarm_leveldes')+':'+getAlarmLevel(alarm)+'\n';
  des += localStr('lang_ticket_type')+alarm.get('Code')+'\n';
  des += localStr('lang_ticket_point')+alarm.get('Parameter')+'\n';
  des += localStr('lang_ticket_acture_value')+alarm.get('ActualValue')+'\n';
  des += localStr('lang_alarm_setting_value')+':'+alarm.get('ThresholdValue')+'\n';
  des += localStr('lang_alarm_position')+':'+alarm.get('Paths').reverse().join('\n');
  return des;
}

export default function(state=defaultState,action){
  switch (action.type) {
    case CREATE_TICKET_DATA_INIT:
      return initData(state,action);
    case TICKET_CREATE_CONDITION_CHANGED:
      return conditionChanged(state,action);
    case USER_SELECT_CHANGED:
      return userSelectInfoChange(state,action);
    case ASSET_SELECT_CHANGED:
      return assetsSelectInfoChange(state,action);
    case ASSETS_USERS_SUCCESS:
      return updateAssetsUsers(state,action);
    case TICKET_CREATE_REQUEST:
      return state.set('isPosting',1);
    case TICKET_CREATE_SUCCESS:
      return state.set('isPosting',2);
    case TICKET_CREATE_FAILURE:
      return state.set('isPosting',3);
    case TICKET_CREATE_RESET:
    case LOGOUT_SUCCESS:
      return defaultState;
    default:

  }
  return state;
}
