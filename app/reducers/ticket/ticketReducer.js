'use strict';


import {
  TICKET_LOAD_BYID_REQUEST,
  TICKET_LOAD_BYID_SUCCESS,
  TICKET_LOAD_BYID_FAILURE,
  TICKET_CREATE_REQUEST,
  TICKET_CREATE_SUCCESS,
  TICKET_CREATE_FAILURE,
  TICKET_EXECUTE_REQUEST,
  TICKET_FINISH_REQUEST,
  TICKET_EXECUTE_SUCCESS,
  TICKET_FINISH_SUCCESS,
  TICKET_EXECUTE_FAILURE,
  TICKET_FINISH_FAILURE,
  TICKET_LOGS_SUCCESS,
  TICKET_RESET
} from '../../actions/ticketAction';

import {LOGOUT} from '../../actions/loginAction.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';
import {LOGOUT_SUCCESS} from '../../actions/loginAction.js';

import Immutable from 'immutable';


var defaultState = Immutable.fromJS({
  isFetching:false,
  data:null,
  logCount:null,
  isPosting:false,
  ticketId:null,
  ticketFirstId:null,
  errorMessage:null,
});

function ticketLoadedStart(state,action){
    var {data:{ticketId}} = action;
    return state.set('ticketFirstId',ticketId).set('isFetching',true);
}

function ticketLoaded(state,action) {
  var resTicketId = action.response.Result.Id;
  return state.set('data',Immutable.fromJS(action.response.Result)).
               set('ticketId',resTicketId).
               set('isFetching',false).
               set('logCount',action.response.Result.Logs.length);
}
function execute(state,action) {
  var {body:{ticketId},response:{Result:{ActualStartTime,Status}}} = action;
  var data = state.get('data');
  data = data.set('ActualStartTime',ActualStartTime).set('Status',Status);
  return state.set('data',data).set('ticketId',ticketId).set('isFetching',false);
}

function finish(state,action) {
  var {body:{ticketId},response:{Result:{ActualEndTime,Status}}} = action;
  var data = state.get('data');
  data = data.set('ActualEndTime',ActualEndTime).set('Status',Status).set('isFinishing',true);
  return state.set('data',data).set('ticketId',ticketId).set('isFetching',false);
}

function addLogsCount(state,action) {
  var {ticketId,response:{Result}} = action;
  if(state.get('ticketId') === ticketId || state.get('ticketId') === String(ticketId)){
    if(!Result){
      Result = [];
    }
    // console.warn('addLogsCount...',state.get('ticketId'),ticketId,Result.length);
    return state.set('logCount',Result.length);
  }
  return state;
}


function handleError(state,action) {
  var {Error} = action.error;
  switch (Error) {
    case '040001307022':
      Error = localStr('lang_alarm_des1');
      break;
    case '050001251500':
      Error = localStr('lang_ticket_notice11');
      break;
    case '050001251009':
      Error = localStr('lang_ticket_notice12');
      break;
  }
  if (Error) {
    action.error=null;
  }
  return state.set('isFetching',false).set('errorMessage',Error);
}



export default function(state=defaultState,action){

  switch (action.type) {
    case TICKET_LOAD_BYID_REQUEST:
      return ticketLoadedStart(state,action);
    case TICKET_LOAD_BYID_SUCCESS:
      return ticketLoaded(state,action);
    case TICKET_LOAD_BYID_FAILURE:
    case TICKET_EXECUTE_FAILURE:
    case TICKET_FINISH_FAILURE:
      return handleError(state,action);
    case TICKET_EXECUTE_REQUEST:
    case TICKET_FINISH_REQUEST:
      return state.set('isFetching',true);
    case TICKET_EXECUTE_SUCCESS:
      return execute(state,action);
    case TICKET_FINISH_SUCCESS:
      return finish(state,action);
    case TICKET_LOGS_SUCCESS:
      return addLogsCount(state,action);
    case TICKET_CREATE_REQUEST:
      return state.set('isPosting',1);
    case TICKET_CREATE_SUCCESS:
      return state.set('isPosting',2);
    case TICKET_CREATE_FAILURE:
      return state.set('isPosting',3);
    case TICKET_RESET:
    case LOGOUT_SUCCESS:
      return defaultState;
    default:

  }
  return state;
}
