'use strict';


export const TICKET_LOAD_REQUEST = 'TICKET_LOAD_REQUEST';
export const TICKET_LOAD_SUCCESS = 'TICKET_LOAD_SUCCESS';
export const TICKET_LOAD_FAILURE = 'TICKET_LOAD_FAILURE';

export function loadTickets(body,typeTicketTask){
  return (dispatch, getState) => {
    return dispatch({
        types: [TICKET_LOAD_REQUEST, TICKET_LOAD_SUCCESS, TICKET_LOAD_FAILURE],
        url: 'tickets/search',
        typeTicketTask,
        body
    });

  }
}

export const TICKET_LOAD_BYID_REQUEST = 'TICKET_LOAD_BYID_REQUEST';
export const TICKET_LOAD_BYID_SUCCESS = 'TICKET_LOAD_BYID_SUCCESS';
export const TICKET_LOAD_BYID_FAILURE = 'TICKET_LOAD_BYID_FAILURE';

export function loadTicketById(ticketId,data,isHex){
  return (dispatch, getState) => {
    return dispatch({
        types: [TICKET_LOAD_BYID_REQUEST, TICKET_LOAD_BYID_SUCCESS, TICKET_LOAD_BYID_FAILURE],
        url: isHex?`tickets/hex/${ticketId}`:`tickets/${ticketId}`,
        ticketId,
        data:{ticketId},
    });
  }
}

export const TICKET_NEXTPAGE = 'TICKET_NEXTPAGE';
export function nextPage(data){
  return (dispatch,getState)=>{
    return dispatch({
      type:TICKET_NEXTPAGE,
      data,
    });
  }
}

export const TICKET_EXECUTE_REQUEST = 'TICKET_EXECUTE_REQUEST';
export const TICKET_EXECUTE_SUCCESS = 'TICKET_EXECUTE_SUCCESS';
export const TICKET_EXECUTE_FAILURE = 'TICKET_EXECUTE_FAILURE';

export function execute(ticketId){
  return (dispatch, getState) => {
    return dispatch({
        types: [TICKET_EXECUTE_REQUEST, TICKET_EXECUTE_SUCCESS, TICKET_EXECUTE_FAILURE],
        url: `tickets/${ticketId}/startwork`,
        body:{ticketId}
    });

  }
}

export const TICKET_FINISH_REQUEST = 'TICKET_FINISH_REQUEST';
export const TICKET_FINISH_SUCCESS = 'TICKET_FINISH_SUCCESS';
export const TICKET_FINISH_FAILURE = 'TICKET_FINISH_FAILURE';

export function finish(ticketId){
  return (dispatch, getState) => {
    return dispatch({
        types: [TICKET_FINISH_REQUEST, TICKET_FINISH_SUCCESS, TICKET_FINISH_FAILURE],
        url: `tickets/${ticketId}/endwork`,
        body:{ticketId}
    });

  }
}


export const TICKET_LOGS_REQUEST = 'TICKET_LOGS_REQUEST';
export const TICKET_LOGS_SUCCESS = 'TICKET_LOGS_SUCCESS';
export const TICKET_LOGS_FAILURE = 'TICKET_LOGS_FAILURE';

export function loadTicketLogs(ticketId){
  return (dispatch, getState) => {
    return dispatch({
        types: [TICKET_LOGS_REQUEST, TICKET_LOGS_SUCCESS, TICKET_LOGS_FAILURE],
        url: `tickets/${ticketId}/logs`,
        ticketId
    });

  }
}

export const TICKET_LOG_SAVE_REQUEST = 'TICKET_LOG_SAVE_REQUEST';
export const TICKET_LOG_SAVE_SUCCESS = 'TICKET_LOG_SAVE_SUCCESS';
export const TICKET_LOG_SAVE_FAILURE = 'TICKET_LOG_SAVE_FAILURE';

export function saveLog(body,isCreate){
  return (dispatch, getState) => {
    return dispatch({
        types: [TICKET_LOG_SAVE_REQUEST, TICKET_LOG_SAVE_SUCCESS, TICKET_LOG_SAVE_FAILURE],
        url: isCreate ? 'tickets/ticketlogs/create' : 'tickets/ticketlogs/update',
        body
    });

  }
}

export const TICKET_LOG_DELETE_REQUEST = 'TICKET_LOG_DELETE_REQUEST';
export const TICKET_LOG_DELETE_SUCCESS = 'TICKET_LOG_DELETE_SUCCESS';
export const TICKET_LOG_DELETE_FAILURE = 'TICKET_LOG_DELETE_FAILURE';

export function deleteLog(ticketId,ticketLogId){
  return (dispatch, getState) => {
    return dispatch({
        types: [TICKET_LOG_DELETE_REQUEST, TICKET_LOG_DELETE_SUCCESS, TICKET_LOG_DELETE_FAILURE],
        url: `tickets/ticketlogs/delete/${ticketLogId}`,
        body:{ticketId,ticketLogId}
    });

  }
}



export const TICKET_LOGINFO_CHANGED = 'TICKET_LOGINFO_CHANGED';

export function logInfoChanged(data){
  return (dispatch,getState)=>{
    return dispatch({
      type:TICKET_LOGINFO_CHANGED,
      data
    });
  }
}

export const TICKET_DELETE_IMAGE_REQUEST = 'TICKET_DELETE_IMAGE_REQUEST';
export const TICKET_DELETE_IMAGE_SUCCESS = 'TICKET_DELETE_IMAGE_SUCCESS';
export const TICKET_DELETE_IMAGE_FAILURE = 'TICKET_DELETE_IMAGE_FAILURE';

export function deleteLogImage(names){
  return (dispatch, getState) => {
    return dispatch({
        types: [TICKET_DELETE_IMAGE_REQUEST, TICKET_DELETE_IMAGE_SUCCESS, TICKET_DELETE_IMAGE_FAILURE],
        url: `images/delete`,
        body:names
    });

  }
}

export const CUSTOMER_LOAD_REQUEST = 'CUSTOMER_LOAD_REQUEST';
export const CUSTOMER_LOAD_SUCCESS = 'CUSTOMER_LOAD_SUCCESS';
export const CUSTOMER_LOAD_FAILURE = 'CUSTOMER_LOAD_FAILURE';

export function getCustomer(){
  return (dispatch, getState) => {
    return dispatch({
        types: [CUSTOMER_LOAD_REQUEST, CUSTOMER_LOAD_SUCCESS, CUSTOMER_LOAD_FAILURE],
        // url: `building/myBuildings`,
        url:`user/current/customers`,
    });
  }
}

export const CREATE_TICKET_DATA_INIT = 'CREATE_TICKET_DATA_INIT';
export function loadCreateTicketData(data){
  return (dispatch,getState)=>{
    return dispatch({
      type:CREATE_TICKET_DATA_INIT,
      data
    });
  }
}

export const TICKET_CREATE_CONDITION_CHANGED = 'TICKET_CREATE_CONDITION_CHANGED';
export function ticketCreateConditionChange(data){
  return (dispatch,getState)=>{
    return dispatch({
      type:TICKET_CREATE_CONDITION_CHANGED,
      data
    });
  }
}

export const CUSTOMER_USERS_REQUEST = 'CUSTOMER_USERS_REQUEST';
export const CUSTOMER_USERS_SUCCESS = 'CUSTOMER_USERS_SUCCESS';
export const CUSTOMER_USERS_FAILURE = 'CUSTOMER_USERS_FAILURE';

export function getUsersFromCustomer(customerId,startTime,endTime){
  return (dispatch, getState) => {
    return dispatch({
        types: [CUSTOMER_USERS_REQUEST, CUSTOMER_USERS_SUCCESS, CUSTOMER_USERS_FAILURE],
        url:`tickets/users/${customerId}/${startTime}/${endTime}`,
    });
  }
}

export const ASSETS_USERS_REQUEST = 'ASSETS_USERS_REQUEST';
export const ASSETS_USERS_SUCCESS = 'ASSETS_USERS_SUCCESS';
export const ASSETS_USERS_FAILURE = 'ASSETS_USERS_FAILURE';

export function getUsersFromAssets(body){
  return (dispatch, getState) => {
    return dispatch({
        types: [ASSETS_USERS_REQUEST, ASSETS_USERS_SUCCESS, ASSETS_USERS_FAILURE],
        url:`tickets/privilegedusers`,
        body
    });
  }
}

export const USER_SELECT_CHANGED = 'USER_SELECT_CHANGED';
export function updateUserSelectInfo(data){
  return (dispatch,getState)=>{
    return dispatch({
      type:USER_SELECT_CHANGED,
      data
    });
  }
}

export const ASSET_SELECT_CHANGED = 'ASSET_SELECT_CHANGED';
export function updateAssetsSelectInfo(data){
  return (dispatch,getState)=>{
    return dispatch({
      type:ASSET_SELECT_CHANGED,
      data
    });
  }
}

export const TICKET_RESET = 'TICKET_RESET';
export function resetTicket(data){
  return (dispatch,getState)=>{
    return dispatch({
      type:TICKET_RESET,
      data
    });
  }
}


export const TICKET_CREATE_REQUEST = 'TICKET_CREATE_REQUEST';
export const TICKET_CREATE_SUCCESS = 'TICKET_CREATE_SUCCESS';
export const TICKET_CREATE_FAILURE = 'TICKET_CREATE_FAILURE';

export function createTicket(body,isCreate){
  return (dispatch, getState) => {
    return dispatch({
        types: [TICKET_CREATE_REQUEST, TICKET_CREATE_SUCCESS, TICKET_CREATE_FAILURE],
        url: isCreate?`tickets/create`:`tickets/update`,
        body:body
    });
  }
}

export const TICKET_CREATE_RESET = 'TICKET_CREATE_RESET';
export function resetCreateTicket(data){
  return (dispatch,getState)=>{
    return dispatch({
      type:TICKET_CREATE_RESET,
      data
    });
  }
}


export const TICKET_DELETE_REQUEST = 'TICKET_DELETE_REQUEST';
export const TICKET_DELETE_SUCCESS = 'TICKET_DELETE_SUCCESS';
export const TICKET_DELETE_FAILURE = 'TICKET_DELETE_FAILURE';

export function deleteTicket(ticketId){
  return (dispatch, getState) => {
    return dispatch({
        types: [TICKET_DELETE_REQUEST, TICKET_DELETE_SUCCESS, TICKET_DELETE_FAILURE],
        url: `tickets/delete/${ticketId}`,
        body:{ticketId}
    });
  }
}

export const TICKET_LOG_CLEAN = 'TICKET_LOG_CLEAN';

export function cleanTicketLog(){
  return (dispatch, getState) => {
    return dispatch({
        type: TICKET_LOG_CLEAN,
    });
  }
}

export const TICKET_FILTER_CLOSED = 'TICKET_FILTER_CLOSED';

export function filterClosed(){
  return (dispatch,getState)=>{
    return dispatch({
      type:TICKET_FILTER_CLOSED,
    });
  }
}

export const TICKET_FILTER_CHANGED = 'TICKET_FILTER_CHANGED';

export function filterChanged(data){
  return (dispatch,getState)=>{
    return dispatch({
      type:TICKET_FILTER_CHANGED,
      data
    });
  }
}

export const TICKET_FILTER_BUILDING_REQUEST = 'TICKET_FILTER_BUILDING_REQUEST';
export const TICKET_FILTER_BUILDING_SUCCESS = 'TICKET_FILTER_BUILDING_SUCCESS';
export const TICKET_FILTER_BUILDING_FAILURE = 'TICKET_FILTER_BUILDING_FAILURE';
export function loadTicketBuildings(){
  return (dispatch,getState)=>{
    return dispatch({
        types: [TICKET_FILTER_BUILDING_REQUEST, TICKET_FILTER_BUILDING_SUCCESS, TICKET_FILTER_BUILDING_FAILURE],
        url: 'building/myBuildings',
        body:{}
    });
  }
}

export const TICKET_FILTER_NEXTPAGE = 'TICKET_FILTER_NEXTPAGE';
export function nextFilterPage(data){
  return (dispatch,getState)=>{
    return dispatch({
      type:TICKET_FILTER_NEXTPAGE,
      data,
    });
  }
}

export const TICKET_FILTER_SEARCH = 'TICKET_FILTER_SEARCH';
export function filterReadyToSearch(data){
  return (dispatch,getState)=>{
    return dispatch({
      type:TICKET_FILTER_SEARCH,
      data,
    });
  }
}

export const TICKET_FILTER_REQUEST = 'TICKET_FILTER_REQUEST';
export const TICKET_FILTER_SUCCESS = 'TICKET_FILTER_SUCCESS';
export const TICKET_FILTER_FAILURE = 'TICKET_FILTER_FAILURE';
export function loadTicketFilterResult(params){
  return (dispatch,getState)=>{
    return dispatch({
        types: [TICKET_FILTER_REQUEST, TICKET_FILTER_SUCCESS, TICKET_FILTER_FAILURE],
        url: `tickets/searchme`,
        body:{...params}
    });
  }
}

export const TICKET_FILTER_RESETRESULT = 'TICKET_FILTER_RESETRESULT';
export function resetTicketFilterResult(data){
  return (dispatch,getState)=>{
    return dispatch({
      type:TICKET_FILTER_RESETRESULT,
      data
    });
  }
}
