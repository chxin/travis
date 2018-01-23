'use strict';

import {
  TICKET_FILTER_CHANGED,
  TICKET_FILTER_NEXTPAGE,
  TICKET_FILTER_BUILDING_REQUEST,
  TICKET_FILTER_BUILDING_SUCCESS,
  TICKET_FILTER_BUILDING_FAILURE,
  TICKET_FILTER_CLOSED,
  TICKET_FILTER_RESETRESULT,
  TICKET_FILTER_SEARCH,
  TICKET_FILTER_REQUEST,
  TICKET_FILTER_SUCCESS,
  TICKET_FILTER_FAILURE,
} from '../../actions/ticketAction';

import {LOGOUT} from '../../actions/loginAction.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';
import {LOGOUT_SUCCESS} from '../../actions/loginAction.js';

import Immutable from 'immutable';

var defaultState = Immutable.fromJS({
    isFetching:true,
    isFilterFetching:false,
	  buildingsData:[],
    arrBuildsName:[],
    selectDatas:{
    	ticketStrId:'',
    	ticketStatus:[],
    	ticketTypes:[],
    	selectBuilds:[],
    },
    reqParams:null,
    data:null,
    allDatas:null,
    sectionData:[],
    pageCount:0,
    filter:{
      CurrentPage:1,
      ItemsPerPage:20,
    },
});

function ticketFilterChange(state,action){
  var {data:{type,value}} = action;
  if (type==='ticketStrId') {
    state=state.setIn(['selectDatas','ticketStrId'],value);
  }else if (type==='status') {
    var arrStatus=state.getIn(['selectDatas','ticketStatus']);
    var index = arrStatus.findIndex((item)=> item === value);
    if (index===-1) {
      arrStatus=arrStatus.push(value);
    }else {
      arrStatus=arrStatus.remove(index);
    }
    state=state.setIn(['selectDatas','ticketStatus'],arrStatus);
  }else if (type==='types') {
    var arrStatus=state.getIn(['selectDatas','ticketTypes']);
    var index = arrStatus.findIndex((item)=> item === value);
    if (index===-1) {
      arrStatus=arrStatus.push(value);
    }else {
      arrStatus=arrStatus.remove(index);
    }
    state=state.setIn(['selectDatas','ticketTypes'],arrStatus);
  }else if (type==='building') {
    var arrStatus=state.getIn(['selectDatas','selectBuilds']);
    var index = arrStatus.findIndex((item)=> item === value);
    if (index===-1) {
      arrStatus=arrStatus.push(value);
    }else {
      arrStatus=arrStatus.remove(index);
    }
    state=state.setIn(['selectDatas','selectBuilds'],arrStatus);
  }

  return state;
}

function nextPage(state,action) {
  var {data:{isFirstPage}} = action;
  var filter = state.get('filter');
  if (isFirstPage) {
    filter = filter.set('CurrentPage',null).set('CurrentPage',1);
  }else {
    filter = filter.set('CurrentPage',filter.get('CurrentPage')+1);
  }
  console.warn('nextPage...',filter);
  return state.set('filter',filter);
}

function filterClosed(state,action) {
  return defaultState;
}

function mergeTicketData(state,action) {
  var response = action.response.Result;
  var page = action.body.CurrentPage;

  if (response&&response.Items) {
    response.Items.forEach((item)=>{
      item.isFutureTask=false;
    });
  }
  // console.warn('000000',response.Items.length);
  if(page === 1){
    state = state.set('data',Immutable.fromJS(response.Items));
  }
  else {
    var oldData = state.get('data');
    // console.warn('0 mergeData...Items...',typeTicketTask,page,oldData.size);
    var newList = Immutable.fromJS(response.Items);
    newList = oldData.push(...newList.toArray());
    state = state.set('data',newList);
  }
  console.warn('CurrentPage',page,response.PageCount,state.get('data').size);
  state=state.set('pageCount',response.PageCount).set('isFilterFetching',false);
  state=categoryAllDatas(state);
  return state;
}

function mergeTicketBuilding(state,action) {
  var result = action.response.Result;
  result = result.map((item)=>{
    return {
      Id:item.Id,
      Name:item.Name
    }
  });

  var newState = state.set('buildingsData',Immutable.fromJS(result));
  // result.unshift({id:-1,name:'全部楼宇'});
  newState = newState.set('arrBuildsName',
          Immutable.fromJS(result.map((item)=>{
            return item.Name
          })));

  return newState.set('isFetching',false);
}

function mergeAllSearchParam(state,action)
{
  var TicketId=state.getIn(['selectDatas','ticketStrId']);
  var TicketStatus=[];
  var TicketTypes=[];
  var Hierarchies=[];
  var arrSelects=state.getIn(['selectDatas','ticketStatus']);
  arrSelects.forEach((item)=>{
    switch (item) {
      case 0:
        TicketStatus.push(3);
        break;
      case 1:
        TicketStatus.push(4);
        break;
      case 2:
        TicketStatus.push(5);
        break;
      case 3:
        TicketStatus.push(1);
        TicketStatus.push(2);
        break;
      default:
    }
  });

  var arrSelects=state.getIn(['selectDatas','ticketTypes']);
  arrSelects.forEach((item)=>{
    switch (item) {
      case 0:
        TicketTypes.push(1);
        break;
      case 1:
        TicketTypes.push(2);
        break;
      case 2:
        TicketTypes.push(4);
        break;
      case 3:
        TicketTypes.push(3);
        break;
      default:
    }
  });

  var arrSelects=state.getIn(['selectDatas','selectBuilds']);
  var buildingsData=state.get('buildingsData');
  arrSelects.forEach((item)=>{
    var build=buildingsData.get(item);
    console.warn('buildingsData..',build);
    Hierarchies.push(build.get('Id'));
  });
  TicketId = TicketId.replace(/(^\s*)|(\s*$)/g, "");
  var reqParams={TicketId,TicketStatus,TicketTypes,Hierarchies};
  console.warn('Hierarchies',reqParams);
  return state.set('reqParams',reqParams);
}

function categoryAllDatas(state)
{
  var newState = state;
  var Items = newState.get('data');

  var listStatus1 = [];
  var listStatus2 = [];
  var listStatus3 = [];
  Items.forEach((item)=>{
    var status=item.get('TicketStatus')|item.get('Status');
    if (status===3 || status===1) {
      listStatus1.push(item);
    }else if (status===4 || status===2) {
      listStatus2.push(item);
    }else if (status===5) {
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
  newState=newState.set('sectionData',Immutable.fromJS(sectionTitle)).set('allDatas',Immutable.fromJS(allDatas));
  return newState;
}

function resetFilterResult(state,action) {
  state=state.setIn(['filter','CurrentPage'],1);
  state=state.setIn(['filter','ItemsPerPage'],20);
  return state.set('data',null).set('allDatas',null).set('pageCount',0);
}

function handleErrorBuildFailure(state,action) {
  var {Error} = action.error;
  switch (Error) {
    case '040001307022':
      action.error = null;// localStr('lang_alarm_des1');
      break;
  }
  return state.set('isFetching',false).set('data',null).set('allDatas',null);
}

function handleErrorFilterFailure(state,action) {
  var {Error} = action.error;
  switch (Error) {
    case '040001307022':
      action.error = null;// localStr('lang_alarm_des1');
      break;
  }
  return state.set('isFilterFetching',false)
  .set('data',Immutable.fromJS([]))
  .set('allDatas',Immutable.fromJS([]))
  .set('sectionData',Immutable.fromJS([]));
}


export default function(state=defaultState,action){
  switch (action.type) {
    case TICKET_FILTER_CHANGED:
      return ticketFilterChange(state,action);
    case TICKET_FILTER_NEXTPAGE:
      return nextPage(state,action);
    case TICKET_FILTER_CLOSED:
      return filterClosed(state,action);
    case TICKET_FILTER_BUILDING_REQUEST:
      return state.set('isFetching',true);
    case TICKET_FILTER_BUILDING_SUCCESS:
      return mergeTicketBuilding(state,action);
    case TICKET_FILTER_BUILDING_FAILURE:
      return handleErrorBuildFailure(state,action);
    case TICKET_FILTER_FAILURE:
      return handleErrorFilterFailure(state,action);
    case TICKET_FILTER_SEARCH:
      return mergeAllSearchParam(state,action);
    case TICKET_FILTER_RESETRESULT:
      return resetFilterResult(state,action);
    case TICKET_FILTER_REQUEST:
      return state.set('isFilterFetching',true);
    case TICKET_FILTER_SUCCESS:
      return mergeTicketData(state,action);
    case LOGOUT_SUCCESS:
      return defaultState;
    default:
  }
  return state;
}
