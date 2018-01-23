'use strict';


import {
  TICKET_LOAD_REQUEST,
  TICKET_LOAD_SUCCESS,
  TICKET_LOAD_FAILURE,
  TICKET_NEXTPAGE,
  TICKET_EXECUTE_SUCCESS,
  TICKET_FINISH_SUCCESS,
  TICKET_FINISH_FAILURE,
  TICKET_EXECUTE_FAILURE,
  TICKET_LOG_DELETE_FAILURE,
  TICKET_DELETE_SUCCESS

} from '../../actions/ticketAction';

// import {LOGOUT_SUCCESS} from '../../actions/loginAction.js';
import {commonReducer} from '../commonReducer.js';
import Immutable from 'immutable';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

var defaultState = Immutable.fromJS({
  todayData:{
    data:null,//source datas
    allDatas:null,//category datas
    sectionData:[],
    pageCount:0,
    isFetching:false,
    filter:{
      TicketTaskType:1,
      CurrentPage:1,
      ItemsPerPage:20
    }
  },
  lastData:{
    data:null,
    allDatas:null,
    sectionData:[],
    pageCount:0,
    isFetching:false,
    filter:{
      TicketTaskType:3,
      // TicketTaskType:1,
      CurrentPage:1,
      ItemsPerPage:20
    }
  },
  futureData:{
    data:null,
    allDatas:null,
    sectionData:[],
    pageCount:0,
    isFetching:false,
    filter:{
      TicketTaskType:2,
      CurrentPage:1,
      ItemsPerPage:20
    }
  },
});

function startRequest(state,action) {
  var {typeTicketTask} = action;
  var oneData = state.get(typeTicketTask);
  oneData=oneData.set('isFetching',true);
  return state.set(typeTicketTask,oneData);
}

function mergeData(state,action) {
  var {typeTicketTask} = action;
  var response = action.response.Result;
  var newState = state;
  var page = action.body.CurrentPage;
  var oneData = newState.get(typeTicketTask);

  if (response&&response.Items) {
    response.Items.forEach((item)=>{
      item.isFutureTask=typeTicketTask==='futureData';
    });
  }
  // console.warn('000000',typeTicketTask,page);
  if(page === 1){
    oneData = oneData.set('data',Immutable.fromJS(response.Items));
    newState = newState.set(typeTicketTask,oneData);
    // console.warn('1mergeData...Items...',newState.get('lastData'));//typeTicketTask,newState.get(['lastData','data']));
  }
  else {
    var oldData = oneData.get('data');
    // console.warn('0 mergeData...Items...',typeTicketTask,page,oldData.size);
    var newList = Immutable.fromJS(response.Items);
    newList = oldData.push(...newList.toArray());
    oneData = oneData.set('data',newList);
    // console.warn('1 mergeData...Items...',typeTicketTask,page,newList.size);
    newState = newState.set(typeTicketTask,oneData);
  }
  // console.warn('CurrentPage',page,response.PageCount,newState.get('data').size,);
  oneData=oneData.set('pageCount',response.PageCount).set('isFetching',false);
  newState = newState.set(typeTicketTask,oneData);

  newState = categoryAllDatas(typeTicketTask,newState);
  return newState;
}

function categoryAllDatas(typeTicketTask,state)
{
  var newState = state;
  // var Items = newState.get(typeTicketTask,'data');
  var oneData = newState.get(typeTicketTask);
  var Items = oneData.get('data');

  var listStatus1 = [];
  var listStatus2 = [];
  var listStatus3 = [];
  Items.forEach((item)=>{
    if (item.get('Status')===1) {
      listStatus1.push(item);
    }else if (item.get('Status')===2) {
      listStatus2.push(item);
    }else if (item.get('Status')===3) {
      listStatus3.push(item);
    }
  });
  var sectionTitle = [];
  var allDatas = [];
  if (listStatus1.length>0) {
    allDatas.push(listStatus1);
    sectionTitle.push(localStr('lang_ticket_not_start'));
  }
  if (listStatus2.length>0) {
    allDatas.push(listStatus2);
    sectionTitle.push(localStr('lang_ticket_going'));
  }
  if (listStatus3.length>0) {
    allDatas.push(listStatus3);
    sectionTitle.push(localStr('lang_ticket_finished'));
  }
  // console.warn('categoryAllDatas',allDatas);
  oneData=oneData.set('sectionData',Immutable.fromJS(sectionTitle)).set('allDatas',Immutable.fromJS(allDatas));
  newState = newState.set(typeTicketTask,oneData);
  return newState;
}

function nextPage(state,action) {
  var {data:{typeTicketTask,isFirstPage}} = action;
  var oneData = state.get(typeTicketTask);
  var filter = oneData.get('filter');
  if (isFirstPage) {
    filter = filter.set('CurrentPage',null).set('CurrentPage',1);
  }else {
    filter = filter.set('CurrentPage',filter.get('CurrentPage')+1);
  }
  oneData=oneData.set('filter',filter);

  // console.warn('nextPagenextPage...',typeTicketTask,isFirstPage,filter);
  return state.set(typeTicketTask,oneData);
}

function handleError(state,action) {
  var {Error} = action.error;
var {typeTicketTask}=action;
  switch (Error) {
    case '050001251405':
      action.error = localStr('lang_ticket_notice9');
      break;
    case '040001307022':
      action.error = localStr('lang_alarm_des1');
      state=state.setIn([typeTicketTask,'data'],null)
      .setIn([typeTicketTask,'allDatas'],Immutable.fromJS([]))
      .setIn([typeTicketTask,'isFetching'],false);
      break;
    case '050001251409':
      action.error = localStr('lang_ticket_notice10');
      break;
  }
  return state;
}

function execute(state,action) {
  // console.warn('ticket list execute...',action);
  var {body:{ticketId},response:{Result:{ActualStartTime,Status}}} = action;

  var dataTypes=['lastData','todayData','futureData'];
  for (var i = 0; i < dataTypes.length; i++) {
    var oneData=state.get(dataTypes[i]);
    if (!oneData.get('data')) {
      continue;
    }
    var index = oneData.get('data').findIndex((item) => item.get('Id') === ticketId);
    // console.warn('execute...',index);
    if (index!==-1) {
      oneData=oneData.set('data',oneData.get('data').update(index,(item) =>{
        return item.set('ActualStartTime',ActualStartTime).set('Status',Status);
      }));
      state=state.set(dataTypes[i],oneData);
      state = categoryAllDatas(dataTypes[i],state);
      return state;
    }
  }
  return state;
}

function finish(state,action) {
  // console.warn('ticket list finish...',action);
  var {body:{ticketId},response:{Result:{ActualEndTime,Status}}} = action;

  var dataTypes=['lastData','todayData','futureData'];
  for (var i = 0; i < dataTypes.length; i++) {
    var oneData=state.get(dataTypes[i]);
    if (!oneData.get('data')) {
      continue;
    }
    var index = oneData.get('data').findIndex((item) => item.get('Id') === ticketId);
    if (index!==-1) {
      oneData=oneData.set('data',oneData.get('data').update(index,(item) =>{
        return item.set('ActualEndTime',ActualEndTime).set('Status',Status);
      }));
      state=state.set(dataTypes[i],oneData);
      state = categoryAllDatas(dataTypes[i],state);
      return state;
    }
  }
  return state;
}

function deleteTicket(state,action) {
  var {body:{ticketId}} = action;
  var dataTypes=['lastData','todayData','futureData'];
  for (var i = 0; i < dataTypes.length; i++) {
    var oneData=state.get(dataTypes[i]);
    if (!oneData.get('data')) {
      continue;
    }
    var index = oneData.get('data').findIndex((item) => item.get('Id') === ticketId);
    if (index!==-1) {
      var oneData=oneData.set('data',oneData.get('data').delete(index));
      state=state.set(dataTypes[i],oneData);
      state = categoryAllDatas(dataTypes[i],state);
      return state;
    }
  }
  return state;
}

export default commonReducer((state,action)=>{

  switch (action.type) {
    case TICKET_LOAD_REQUEST:
      return startRequest(state,action);
    case TICKET_LOAD_SUCCESS:
      return mergeData(state,action);
    case TICKET_NEXTPAGE:
      return nextPage(state,action);
    case TICKET_EXECUTE_SUCCESS:
      return execute(state,action);
    case TICKET_FINISH_SUCCESS:
      return finish(state,action);
    case TICKET_DELETE_SUCCESS:
      return deleteTicket(state,action);
    case TICKET_LOAD_FAILURE:
    case TICKET_FINISH_FAILURE:
    case TICKET_EXECUTE_FAILURE:
    case TICKET_LOG_DELETE_FAILURE:
      return handleError(state,action);
    default:

  }
  return state;
},defaultState);
