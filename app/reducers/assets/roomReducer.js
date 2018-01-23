'use strict';

import {
  ROOM_LOAD_REQUEST,
  ROOM_LOAD_SUCCESS,
  ROOM_LOAD_FAILURE,
  ROOM_SAVE_ENV_SUCCESS,
  ROOM_SAVE_ENV_FAILURE,
  ASSET_LOGS_SUCCESS,
  ASSET_IMAGE_CHANGED,
  ASSET_IMAGE_CHANGED_COMPLETE
} from '../../actions/assetsAction.js';

import {LOGOUT_SUCCESS} from '../../actions/loginAction.js';

import Immutable from 'immutable';
import unit from '../../utils/unit.js';
import privilegeHelper from '../../utils/privilegeHelper.js';
import {formatNumber} from '../commonReducer.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

var defaultState = Immutable.fromJS({
  roomId:null,
  data:null,
  sectionData:[],
  isFetching:false,
});

function _getToFixedValue(value)
{
  var resVal=value;
  if(value.toString().indexOf('.')>0){
    resVal=unit.toFixed(value,2);
    resVal=parseFloat(resVal);
    if (Math.abs(value)>=10) {
      resVal=unit.toFixed(value,1);
      resVal=parseFloat(resVal);
    }
  }
  return resVal;
}

function updateAssetDetailData(state,action) {
  var {body:{roomId},response:{Result}} = action;
  // let {url,body,types} = action;
  var res = Result;
  var arrPosi = [];
  var arrLevels = [localStr('lang_asset_des76'),localStr('lang_asset_des77'),localStr('lang_asset_des78'),localStr('lang_asset_des79'),localStr('lang_asset_des80'),
localStr('lang_asset_des81')];
  var strLevel = res.Level ? arrLevels[res.Level] : '';
  var strCapcity = '';
  if (!!res.TransformerVoltage) {
    strCapcity = res.TransformerVoltage + ' kVA';
  }
  var arrPosi=[];
  var desTitle=localStr('lang_asset_des82');
  if (res.SubType===6) {
    desTitle=localStr('lang_asset_des83');
  }
  if (res.Description) {
    arrPosi.push({title:desTitle,value:res.Description,isNav:false,});
  }
  var arrStatistic = res.StatisticData.BasicStatistic.
                        concat(res.StatisticData.DeviceStatistic).
                        map((item)=>{
                          var value=item.Value;
                          if (item.Key==='能耗统计') {
                            value=_getToFixedValue(value);
                          }
                          return {
                            title:item.Key,
                            value:(value+item.Unit),
                            isNav:false,
                          }
                        });

  var temperature = (res.EnvData && res.EnvData.IndoorTemperature) ? res.EnvData.IndoorTemperature : '',
      humidity = (res.EnvData && res.EnvData.IndoorHumidity) ? res.EnvData.IndoorHumidity : '',
      dust = (res.EnvData && res.EnvData.IndoorDustDegree) ? res.EnvData.IndoorDustDegree : '';

  var envNav = true;
  if(!privilegeHelper.hasAuth('AssetEditPrivilegeCode')){
    envNav = false;
  }


  var arrEnvDatas = [
    {title:localStr('lang_asset_des85'),value: unit.combineUnit(formatNumber(temperature,0),'temperature'),rvalue:[formatNumber(temperature,0),unit.get('temperature')],isNav:envNav,type:'temperature'},
    {title:localStr('lang_asset_des86'),value: unit.combineUnit(formatNumber(humidity,0),'humidity'),rvalue:[formatNumber(humidity,0),unit.get('humidity')],isNav:envNav,type:'humidity'},
    {title:localStr('lang_asset_des87'),value: unit.combineUnit(formatNumber(dust,1,true),'dust'),rvalue:[formatNumber(dust,1,true),unit.get('dust')],isNav:envNav,type:'dust'},
  ];

  var envObj = {
    IndoorTemperature:temperature,
    IndoorHumidity:humidity,
    IndoorDustDegree:dust,
    RoomId:roomId
  };
  var arrAdmins = res.Administrators.map((item)=>{
    return {id:item.Id,title:item.Name,value:item.Title,isNav:true,type:'admin'};
  });

  // var arrLogPhoto = [
  //   {'title':'现场照片','value':'','isNav':false,},
  //   {'title':localStr('lang_asset_des31'),'value':'','isNav':false,},
  // ];
  var logCount = res.SceneLogs.length;
  var tendingCount=res.HistoryTicketsCount;
  var singleLineCount= res.SingleLineDiagrams.length;
  var allElements=[
    [{title:'',value:res.LogoKey,pendingImageUri:''}],
    arrPosi,
    [{title:localStr('lang_asset_des28'),value:singleLineCount,isNav:true,type:'singleLine'}],
    arrStatistic,
    arrEnvDatas,
    [{title:localStr('lang_asset_des31'),value:logCount,isNav:true,type:'log'}],
    [{title:localStr('lang_asset_des34'),value:tendingCount,isNav:true,type:'tending'}]
  ];
  var allSecTitle=[
    '',
    '',
    ' ',
    localStr('lang_asset_des88'),
    localStr('lang_asset_des89'),
    ' ',
    ' '
  ];
  //missing log
  if(arrAdmins.length > 0){
    allElements.push(arrAdmins);
    allSecTitle.push(localStr('lang_asset_des90'));
  }
  return Immutable.fromJS({
    data:Immutable.fromJS(allElements),
    envObj:Immutable.fromJS(envObj),
    admin:Immutable.fromJS(res.Administrators),
    sectionData:Immutable.fromJS(allSecTitle),
    isFetching:false,
    logCount,
    roomId,
    arrSinglePhotos:Immutable.fromJS(res.SingleLineDiagrams),
  });

}

function envChanged(state,action) {
  var {response:{Result}} = action;
  var newState = state.set('envObj',Immutable.Map(Result));
  return newState.set('data',newState.get('data').update(4,(item)=>{
    var res = Result;
    var temperature = res.IndoorTemperature ? res.IndoorTemperature : '',
        humidity = res.IndoorHumidity ? res.IndoorHumidity : '',
        dust = res.IndoorDustDegree ? res.IndoorDustDegree : '';
    temperature=formatNumber(temperature,0);
    humidity=formatNumber(humidity,0);
    dust=formatNumber(dust,1,true);

    return item.setIn([0,'value'],unit.combineUnit(temperature,'temperature')).
                setIn([0,'rvalue'],Immutable.fromJS([temperature,unit.get('temperature')])).
                setIn([1,'value'],unit.combineUnit(humidity,'humidity')).
                setIn([1,'rvalue'],Immutable.fromJS([humidity,unit.get('humidity')])).
                setIn([2,'value'],unit.combineUnit(dust,'dust')).
                setIn([2,'rvalue'],Immutable.fromJS([dust,unit.get('dust')]));
  }))
}

function addLogsCount(state,action) {
  var {hierarchyId,response:{Result}} = action;
  if(state.get('roomId') === hierarchyId){
    if(!Result){
      Result = [];
    }
    var len = Result.length;
    if(state.get('logCount') !== len){
      var newState = state.set('logCount',len);
      var data = newState.get('data');
      // if(len === 0){
      //   len = '';
      // }
      data = data.setIn([5,0,'value'],len);
      return newState.set('data',data);
    }

  }
  return state;
}

function imageChanged(state,action) {
  let {data,hierarchyType} = action;
  if(hierarchyType !== 'room') return state;
  if(data.length > 0){
    let image = data[0];
    // console.warn('imageChanged',image.uri);
    // console.warn('state',state);
    var newState = state.setIn(['data',0,0,'pendingImageUri'],image.uri);
    // console.warn('newState',newState);
    return newState;
  }

  return state;

}

function imageChangedComplete(state,action) {
  let {data} = action;
  let newState = state;
  // newState = newState.set('pendingImageUri','');
  newState = newState.setIn(['data',0,0,'value'],data);

  return newState;
}


function handleError(state,action) {
  var {Error} = action.error;
  // console.warn('handleError',action);

  switch (Error) {
    case '040001307022':
      action.error = localStr('lang_alarm_des1');
      break;
  }
  return state.set('isFetching',false);
}

export default function(state=defaultState,action){
  switch (action.type) {
    case ROOM_LOAD_REQUEST:
      return state.set('isFetching',true);
    case ROOM_LOAD_SUCCESS:
      return updateAssetDetailData(state,action);
    case ROOM_LOAD_FAILURE:
    case ROOM_SAVE_ENV_FAILURE:
      return handleError(state,action);
    case ROOM_SAVE_ENV_SUCCESS:
      return envChanged(state,action);
    case ASSET_LOGS_SUCCESS:
      return addLogsCount(state,action);
    case ASSET_IMAGE_CHANGED:
      return imageChanged(state,action);
    case ASSET_IMAGE_CHANGED_COMPLETE:
      return imageChangedComplete(state,action);
    case LOGOUT_SUCCESS:
      return defaultState;
    default:

  }
  return state;
}
