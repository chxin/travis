'use strict';

export const ASSET_ME_LOAD_REQUEST = 'ASSET_ME_LOAD_REQUEST';
export const ASSET_ME_LOAD_SUCCESS = 'ASSET_ME_LOAD_SUCCESS';
export const ASSET_ME_LOAD_FAILURE = 'ASSET_ME_LOAD_FAILURE';

export function loadMyAssets(body){
  return (dispatch, getState) => {
    return dispatch({
        types: [ASSET_ME_LOAD_REQUEST, ASSET_ME_LOAD_SUCCESS, ASSET_ME_LOAD_FAILURE],
        url: 'building/myBuildings',
        body
    });
  }
}

export const ASSET_CUSTOMER_LOAD_REQUEST = 'ASSET_CUSTOMER_LOAD_REQUEST';
export const ASSET_CUSTOMER_LOAD_SUCCESS = 'ASSET_CUSTOMER_LOAD_SUCCESS';
export const ASSET_CUSTOMER_LOAD_FAILURE = 'ASSET_CUSTOMER_LOAD_FAILURE';

export function loadCustomerAssets(customerId){
  return (dispatch, getState) => {
    return dispatch({
        types: [ASSET_CUSTOMER_LOAD_REQUEST, ASSET_CUSTOMER_LOAD_SUCCESS, ASSET_CUSTOMER_LOAD_FAILURE],
        url: `common/buildingtree/${customerId}`,
        data:{customerId}
    });
  }
}

export const CUSTOMER_ASSET_RESET = 'CUSTOMER_ASSET_RESET';
export function resetCustomerAssets(data){
  return (dispatch,getState)=>{
    return dispatch({
      type:CUSTOMER_ASSET_RESET,
      data
    });
  }
}

export const BINDHIERARCHY_LOAD_REQUEST = 'BINDHIERARCHY_LOAD_REQUEST';
export const BINDHIERARCHY_LOAD_SUCCESS = 'BINDHIERARCHY_LOAD_SUCCESS';
export const BINDHIERARCHY_LOAD_FAILURE = 'BINDHIERARCHY_LOAD_FAILURE';

export function loadBindHierarchyById(buildingId,isFromScan){
  return (dispatch, getState) => {
    return dispatch({
      types:[BINDHIERARCHY_LOAD_REQUEST, BINDHIERARCHY_LOAD_SUCCESS, BINDHIERARCHY_LOAD_FAILURE],
      url: `building/${buildingId}/tree`,
      body:{buildingId,isFromScan}
    });
  }
}

export const BUILDINGHIERARCHY_LOAD_REQUEST = 'BUILDINGHIERARCHY_LOAD_REQUEST';
export const BUILDINGHIERARCHY_LOAD_SUCCESS = 'BUILDINGHIERARCHY_LOAD_SUCCESS';
export const BUILDINGHIERARCHY_LOAD_FAILURE = 'BUILDINGHIERARCHY_LOAD_FAILURE';

export function loadHierarchyByBuildingId(buildingId,isFromScan){
  return (dispatch, getState) => {
    return dispatch({
      types:[BUILDINGHIERARCHY_LOAD_REQUEST, BUILDINGHIERARCHY_LOAD_SUCCESS, BUILDINGHIERARCHY_LOAD_FAILURE],
      url: `building/${buildingId}/tree`,
      body:{buildingId,isFromScan}
    });
  }
}


export const BUILDING_EXPANDED_CHANGE = 'BUILDING_EXPANDED_CHANGE';
export function changeBuildingHierarchyExpanded(buildingId,isFromScan){
  return (dispatch, getState) => {
    return dispatch({
      type:BUILDING_EXPANDED_CHANGE,
      data:{buildingId,isFromScan}
    });
  }
}

export const ASSET_QR_PANEL_HIERARCHY_REQUEST = 'ASSET_QR_PANEL_HIERARCHY_REQUEST';
export const ASSET_QR_PANEL_HIERARCHY_SUCCESS = 'ASSET_QR_PANEL_HIERARCHY_SUCCESS';
export const ASSET_QR_PANEL_HIERARCHY_FAILURE = 'ASSET_QR_PANEL_HIERARCHY_FAILURE';

export function loadPanelHierarchy(panelId){
  return (dispatch, getState) => {
    return dispatch({
      types:[ASSET_QR_PANEL_HIERARCHY_REQUEST, ASSET_QR_PANEL_HIERARCHY_SUCCESS, ASSET_QR_PANEL_HIERARCHY_FAILURE],
      url: `panel/${panelId}`,
      data:{panelId}
    });
  }
}

export const ASSET_QR_Sp_UPDATE = 'ASSET_QR_Sp_UPDATE';

export function updateSpHttpInfo(data){
  return (dispatch, getState) => {
    return dispatch({
      type:ASSET_QR_Sp_UPDATE,
      data
    });
  }
}

export const HIERARCHY_BIND_QR_REQUEST = 'HIERARCHY_BIND_QR_REQUEST';
export const HIERARCHY_BIND_QR_SUCCESS = 'HIERARCHY_BIND_QR_SUCCESS';
export const HIERARCHY_BIND_QR_FAILURE = 'HIERARCHY_BIND_QR_FAILURE';

export function bindAssetHierarchy(body){
  return (dispatch, getState) => {
    return dispatch({
      types: [HIERARCHY_BIND_QR_REQUEST, HIERARCHY_BIND_QR_SUCCESS, HIERARCHY_BIND_QR_FAILURE],
      url: `common/qrcode/bind`,
      body:body
    });
  }
}

export const ASSET_QR_REQUEST = 'ASSET_QR_REQUEST';
export const ASSET_QR_SUCCESS = 'ASSET_QR_SUCCESS';
export const ASSET_QR_FAILURE = 'ASSET_QR_FAILURE';

export function loadAssetWithQrcode(body){
  return (dispatch, getState) => {
    return dispatch({
      types: [ASSET_QR_REQUEST, ASSET_QR_SUCCESS, ASSET_QR_FAILURE],
      url: `common/qrcode/scan`,
      body:body
    });
  }
}

export const DEVICE_QR_LOAD_REQUEST = 'DEVICE_QR_LOAD_REQUEST';
export const DEVICE_QR_LOAD_SUCCESS = 'DEVICE_QR_LOAD_SUCCESS';
export const DEVICE_QR_LOAD_FAILURE = 'DEVICE_QR_LOAD_FAILURE';

export function updateScanDeviceData(data){
  var deviceId=data.DeviceId;
  return (dispatch, getState) => {
    return dispatch({
        types: [DEVICE_QR_LOAD_REQUEST, DEVICE_QR_LOAD_SUCCESS, DEVICE_QR_LOAD_FAILURE],
        url: `device/${deviceId}`,
        body:{data}
    });
  }
}

export const PANEL_SAVE_ENV_REQUEST = 'PANEL_SAVE_ENV_REQUEST';
export const PANEL_SAVE_ENV_SUCCESS = 'PANEL_SAVE_ENV_SUCCESS';
export const PANEL_SAVE_ENV_FAILURE = 'PANEL_SAVE_ENV_FAILURE';

export function savePanelEnv(body){
  return (dispatch, getState) => {
    return dispatch({
      types:[PANEL_SAVE_ENV_REQUEST, PANEL_SAVE_ENV_SUCCESS, PANEL_SAVE_ENV_FAILURE],
      url: `panel/environment/save`,
      body
    });
  }
}
export const ROOM_SAVE_ENV_REQUEST = 'ROOM_SAVE_ENV_REQUEST';
export const ROOM_SAVE_ENV_SUCCESS = 'ROOM_SAVE_ENV_SUCCESS';
export const ROOM_SAVE_ENV_FAILURE = 'ROOM_SAVE_ENV_FAILURE';

export function saveRoomEnv(body){
  return (dispatch, getState) => {
    return dispatch({
      types:[ROOM_SAVE_ENV_REQUEST, ROOM_SAVE_ENV_SUCCESS, ROOM_SAVE_ENV_FAILURE],
      url: `room/environment/save`,
      body
    })
  }
}


export const ROOM_LOAD_REQUEST = 'ROOM_LOAD_REQUEST';
export const ROOM_LOAD_SUCCESS = 'ROOM_LOAD_SUCCESS';
export const ROOM_LOAD_FAILURE = 'ROOM_LOAD_FAILURE';

export function loadRoomDetail(roomId){
  return (dispatch, getState) => {
    return dispatch({
        types: [ROOM_LOAD_REQUEST, ROOM_LOAD_SUCCESS, ROOM_LOAD_FAILURE],
        url: `room/${roomId}`,
        body:{roomId}
    });
  }
}


export const PANEL_LOAD_REQUEST = 'PANEL_LOAD_REQUEST';
export const PANEL_LOAD_SUCCESS = 'PANEL_LOAD_SUCCESS';
export const PANEL_LOAD_FAILURE = 'PANEL_LOAD_FAILURE';

export function loadPanelDetail(panelId){
  return (dispatch, getState) => {
    return dispatch({
        types: [PANEL_LOAD_REQUEST, PANEL_LOAD_SUCCESS, PANEL_LOAD_FAILURE],
        url: `panel/${panelId}`,
        body:{panelId}
    });
  }
}

export const DEVICE_EXIT = 'DEVICE_EXIT';

export function exitDeviceInfo(data){
  return (dispatch,getState)=>{
    return dispatch({
      type:DEVICE_EXIT,
    });
  }
}

export const DEVICE_LOAD_REQUEST = 'DEVICE_LOAD_REQUEST';
export const DEVICE_LOAD_SUCCESS = 'DEVICE_LOAD_SUCCESS';
export const DEVICE_LOAD_FAILURE = 'DEVICE_LOAD_FAILURE';

export function loadDeviceDetail(deviceId){
  return (dispatch, getState) => {
    return dispatch({
        types: [DEVICE_LOAD_REQUEST, DEVICE_LOAD_SUCCESS, DEVICE_LOAD_FAILURE],
        url: `device/${deviceId}`,
        body:{deviceId}
    });
  }
}

export const SCAN_EXIT = 'SCAN_EXIT';

export function exitScan(data){
  return (dispatch,getState)=>{
    return dispatch({
      type:SCAN_EXIT,
    });
  }
}

export const SCAN_RESET_ERROR = 'SCAN_RESET_ERROR';

export function resetScanError(data){
  return (dispatch,getState)=>{
    return dispatch({
      type:SCAN_RESET_ERROR,
    });
  }
}

export const MAINTEN_SELECT_CHANGED = 'MAINTEN_SELECT_CHANGED';

export function updateMaintenExpandInfo(data){
  return (dispatch,getState)=>{
    return dispatch({
      type:MAINTEN_SELECT_CHANGED,
      data
    });
  }
}

export const DEVICE_SETTING_REQUEST = 'DEVICE_SETTING_REQUEST';
export const DEVICE_SETTING_SUCCESS = 'DEVICE_SETTING_SUCCESS';
export const DEVICE_SETTING_FAILURE = 'DEVICE_SETTING_FAILURE';

export function loadDeviceRuntimeSetting(deviceId,datas){
  return (dispatch, getState) => {
    return dispatch({
        types: [DEVICE_SETTING_REQUEST, DEVICE_SETTING_SUCCESS, DEVICE_SETTING_FAILURE],
        url: `device/${deviceId}/runtimesettinggroupparameters`,
        data:{deviceId,datas}
    });
  }
}

export const DEVICE_DASHBOARD_REQUEST = 'DEVICE_DASHBOARD_REQUEST';
export const DEVICE_DASHBOARD_SUCCESS = 'DEVICE_DASHBOARD_SUCCESS';
export const DEVICE_DASHBOARD_FAILURE = 'DEVICE_DASHBOARD_FAILURE';

export function loadDashboardData(data){
  return (dispatch, getState) => {
    return dispatch({
        types: [DEVICE_DASHBOARD_REQUEST, DEVICE_DASHBOARD_SUCCESS, DEVICE_DASHBOARD_FAILURE],
        url: `data/parameter/calculate`,
        body:data
    });
  }
}

export const DASHBOARD_CONDITION_CHANGED = 'DASHBOARD_CONDITION_CHANGED';
export function dashsSearchCondiChange(data){
  return (dispatch,getState)=>{
    return dispatch({
      type:DASHBOARD_CONDITION_CHANGED,
      data
    });
  }
}

export const DEVICE_REALTIME_REQUEST = 'DEVICE_REALTIME_REQUEST';
export const DEVICE_REALTIME_SUCCESS = 'DEVICE_REALTIME_SUCCESS';
export const DEVICE_REALTIME_FAILURE = 'DEVICE_REALTIME_FAILURE';

export function loadDeviceRealtimeData(body){
  return (dispatch, getState) => {
    return dispatch({
        types: [DEVICE_REALTIME_REQUEST, DEVICE_REALTIME_SUCCESS, DEVICE_REALTIME_FAILURE],
        url: `data/realtime/get`,
        body
    });
  }
}

export const ASSET_TENDING_REQUEST = 'ASSET_TENDING_REQUEST';
export const ASSET_TENDING_SUCCESS = 'ASSET_TENDING_SUCCESS';
export const ASSET_TENDING_FAILURE = 'ASSET_TENDING_FAILURE';

export function loadTendingHistory(hierarchyId){
  return (dispatch, getState) => {
    return dispatch({
        types: [ASSET_TENDING_REQUEST, ASSET_TENDING_SUCCESS, ASSET_TENDING_FAILURE],
        url: `tickets/hierarchytickets/${hierarchyId}`,
        hierarchyId
    });

  }
}

export const ASSET_LOGS_REQUEST = 'ASSET_LOGS_REQUEST';
export const ASSET_LOGS_SUCCESS = 'ASSET_LOGS_SUCCESS';
export const ASSET_LOGS_FAILURE = 'ASSET_LOGS_FAILURE';

export function loadAssetLogs(hierarchyId){
  return (dispatch, getState) => {
    return dispatch({
        types: [ASSET_LOGS_REQUEST, ASSET_LOGS_SUCCESS, ASSET_LOGS_FAILURE],
        url: `hierarchy/${hierarchyId}/scenelogs`,
        hierarchyId
    });

  }
}

export const ASSET_LOG_SAVE_REQUEST = 'ASSET_LOG_SAVE_REQUEST';
export const ASSET_LOG_SAVE_SUCCESS = 'ASSET_LOG_SAVE_SUCCESS';
export const ASSET_LOG_SAVE_FAILURE = 'ASSET_LOG_SAVE_FAILURE';

export function saveLog(body,isCreate){
  return (dispatch, getState) => {
    return dispatch({
        types: [ASSET_LOG_SAVE_REQUEST, ASSET_LOG_SAVE_SUCCESS, ASSET_LOG_SAVE_FAILURE],
        url: isCreate ? 'scenelogs/create' : 'scenelogs/update',
        body
    });

  }
}

export const ASSET_LOG_DELETE_REQUEST = 'ASSET_LOG_DELETE_REQUEST';
export const ASSET_LOG_DELETE_SUCCESS = 'ASSET_LOG_DELETE_SUCCESS';
export const ASSET_LOG_DELETE_FAILURE = 'ASSET_LOG_DELETE_FAILURE';

export function deleteLog(logId){
  return (dispatch, getState) => {
    return dispatch({
        types: [ASSET_LOG_DELETE_REQUEST, ASSET_LOG_DELETE_SUCCESS, ASSET_LOG_DELETE_FAILURE],
        url: `scenelogs/delete/${logId}`,
        body:{logId}
    });

  }
}

export const ASSET_LOGINFO_CHANGED = 'ASSET_LOGINFO_CHANGED';

export function logInfoChanged(data){
  return (dispatch,getState)=>{
    return dispatch({
      type:ASSET_LOGINFO_CHANGED,
      data
    });
  }
}

export const ASSET_LOG_CLEAN = 'ASSET_LOG_CLEAN';

export function cleanAssetLog(){
  return (dispatch, getState) => {
    return dispatch({
        type: ASSET_LOG_CLEAN,
    });
  }
}


export const ASSET_IMAGE_CHANGED = 'ASSET_IMAGE_CHANGED';

export function changeImage(hierarchyType,data) {
  return (dispatch,getState)=>{
    return dispatch({
      type:ASSET_IMAGE_CHANGED,
      data,
      hierarchyType
    });
  }
}

export const ASSET_IMAGE_CHANGED_COMPLETE = 'ASSET_IMAGE_CHANGED_COMPLETE';


export function changeImageComplete(data) {
  return (dispatch,getState)=>{
    return dispatch({
      type:ASSET_IMAGE_CHANGED_COMPLETE,
      data,
    });
  }
}
