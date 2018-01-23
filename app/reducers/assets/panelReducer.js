'use strict';

import {
  PANEL_LOAD_REQUEST,
  PANEL_LOAD_SUCCESS,
  PANEL_LOAD_FAILURE,
  PANEL_SAVE_ENV_SUCCESS,
  PANEL_SAVE_ENV_FAILURE,
  ASSET_LOGS_SUCCESS,
  ASSET_IMAGE_CHANGED,
  ASSET_IMAGE_CHANGED_COMPLETE
} from '../../actions/assetsAction.js';

import {LOGOUT_SUCCESS} from '../../actions/loginAction.js';

import Immutable from 'immutable';
import unit from '../../utils/unit.js';
import privilegeHelper from '../../utils/privilegeHelper.js';
import {findSectioniIndexByType} from '../commonReducer.js';
import {formatNumber} from '../commonReducer.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

var defaultState = Immutable.fromJS({
  panelId:null,
  data:null,
  sectionData:[],
  isFetching:false,
  logCount:'',
  errorMessage:null,
});


function updateAssetDetailData(state,action) {
  var {body:{panelId},response:{Result}} = action;
  // let {url,body,types} = action;
  var res = Result;
  var panelType = [
  ];
  if (res.SerialNumber) {
    panelType.push({'title':localStr('lang_asset_des48'),'value':res.SerialNumber,'isNav':false,});
  }
  if (res.PanelType) {
    panelType.push({title:localStr('lang_asset_des69'),value:res.PanelType,isNav:false,});
  }
  var arrStatistic = res.StatisticData.BasicStatistic.
                        concat(res.StatisticData.DeviceStatistic).
                        map((item)=>{
                          return {
                            title:item.Key,
                            value:(item.Value+item.Unit),
                            isNav:false,
                          }
                        });

  var busTemperature = (res.EnvData && res.EnvData.BusLineTemperature)? res.EnvData.BusLineTemperature : '',
      temperature = (res.EnvData && res.EnvData.InpanelTemperature) ? res.EnvData.InpanelTemperature : '',
      humidity = (res.EnvData && res.EnvData.InpanelHumidity) ? res.EnvData.InpanelHumidity : '',
      dust = (res.EnvData && res.EnvData.InpanelDustDegree) ? res.EnvData.InpanelDustDegree : '';

      busTemperature=formatNumber(busTemperature,0);
      temperature=formatNumber(temperature,0);
      humidity=formatNumber(humidity,0);
      dust=formatNumber(dust,1,true);

  var envNav = true;
  if(!privilegeHelper.hasAuth('AssetEditPrivilegeCode')){
    envNav = false;
  }

  var arrEnvDatas = [
    {title:localStr('lang_asset_des70'),value: unit.combineUnit(busTemperature,'temperature'),rvalue:[busTemperature,unit.get('temperature')],isNav:envNav,type:'busTemperature',secType:'envSection'},
    {title:localStr('lang_asset_des71'),value: unit.combineUnit(temperature,'temperature'),rvalue:[temperature,unit.get('temperature')],isNav:envNav,type:'temperature',secType:'envSection'},
    {title:localStr('lang_asset_des72'),'value': unit.combineUnit(humidity,'humidity'),rvalue:[humidity,unit.get('humidity')],isNav:envNav,type:'humidity',secType:'envSection'},
    {title:localStr('lang_asset_des73'),value:unit.combineUnit(dust,'dust'),rvalue:[dust,unit.get('dust')],isNav:envNav,type:'dust',secType:'envSection'},
  ];

  var envObj = {
    BusLineTemperature:busTemperature,
    InpanelTemperature:temperature,
    InpanelHumidity:humidity,
    InpanelDustDegree:dust,
    PanelId:panelId
  };

  if (res.SubType===10||res.SubType===30) {
     arrEnvDatas.splice(0,1);
     delete envObj['BusLineTemperature'];
   }

  var logCount = res.SceneLogs.length;
  var tendingCount=res.HistoryTicketsCount;
  var singleLineCount= res.SingleLineDiagrams.length;
  var allElements=[
    [{title:'',value:res.LogoKey}],
    panelType,
    [{title:localStr('lang_asset_des28'),value:singleLineCount,isNav:true,type:'singleLine'}],
    arrEnvDatas,
    [{title:localStr('lang_asset_des31'),value:logCount,isNav:true,type:'log',secType:'logSection'}],
    [{title:localStr('lang_asset_des34'),value:tendingCount,isNav:true,type:'tending'}]
  ];
  var allSecTitle=[
    '',
    '',
    ' ',
    localStr('lang_asset_des74'),
    ' ',
    ' '
  ];
  //missing log
  if (arrStatistic.length>0) {
    allSecTitle.splice(3,0,localStr('lang_asset_des75'));
    allElements.splice(3,0,arrStatistic);
  }



  return Immutable.fromJS({
    data:Immutable.fromJS(allElements),
    envObj:Immutable.fromJS(envObj),
    sectionData:Immutable.fromJS(allSecTitle),
    isFetching:false,
    logCount,
    panelId,
    arrSinglePhotos:Immutable.fromJS(res.SingleLineDiagrams),
  });
}

function envChanged(state,action) {
  var {response:{Result}} = action;
  var newState = state.set('envObj',Immutable.Map(Result));
  var envIndex=findSectioniIndexByType(newState.get('data'),'envSection');
  return newState.set('data',newState.get('data').update(envIndex,(item)=>{
    var res = Result;
    var busTemperature = res.BusLineTemperature ? res.BusLineTemperature : '',
        temperature = res.InpanelTemperature ? res.InpanelTemperature : '',
        humidity = res.InpanelHumidity ? res.InpanelHumidity : '',
        dust = res.InpanelDustDegree ? res.InpanelDustDegree : '';

        busTemperature=formatNumber(busTemperature,0);
        temperature=formatNumber(temperature,0);
        humidity=formatNumber(humidity,0);
        dust=formatNumber(dust,1,true);

    if (item.size===4) {
      return item.setIn([0,'value'],unit.combineUnit(busTemperature,'temperature')).
                  setIn([0,'rvalue'],Immutable.fromJS([busTemperature,unit.get('temperature')])).
                  setIn([1,'value'],unit.combineUnit(temperature,'temperature')).
                  setIn([1,'rvalue'],Immutable.fromJS([temperature,unit.get('temperature')])).
                  setIn([2,'value'],unit.combineUnit(humidity,'humidity')).
                  setIn([2,'rvalue'],Immutable.fromJS([humidity,unit.get('humidity')])).
                  setIn([3,'value'],unit.combineUnit(dust,'dust')).
                  setIn([3,'rvalue'],Immutable.fromJS([dust,unit.get('dust')]));
    }else if (item.size===3) {
      return item.setIn([0,'value'],unit.combineUnit(temperature,'temperature')).
                  setIn([0,'rvalue'],Immutable.fromJS([temperature,unit.get('temperature')])).
                  setIn([1,'value'],unit.combineUnit(humidity,'humidity')).
                  setIn([1,'rvalue'],Immutable.fromJS([humidity,unit.get('humidity')])).
                  setIn([2,'value'],unit.combineUnit(dust,'dust')).
                  setIn([2,'rvalue'],Immutable.fromJS([dust,unit.get('dust')]));
    }
    }));
}

function addLogsCount(state,action) {
  var {hierarchyId,response:{Result}} = action;
  if(state.get('panelId') === hierarchyId){
    if(!Result){
      Result = [];
    }
    var len = Result.length;
    if(state.get('logCount') !== len){
      var newState = state.set('logCount',len);
      var indexSec=findSectioniIndexByType(newState.get('data'),'logSection');
      var data = newState.get('data');
      data = data.setIn([indexSec,0,'value'],len);
      return newState.set('data',data);
    }

  }
  return state;
}



function imageChanged(state,action) {
  let {data,hierarchyType} = action;
  if(hierarchyType !== 'panel') return state;
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
  var strError=null;
  switch (Error) {
    case '040001307022':
      strError = localStr('lang_alarm_des1');
      action.error=null;
      break;
    case '040000307009':
      strError = localStr('lang_commons_notice1');
      action.error=null;
      break;
  }
  return state.set('isFetching',false).set('errorMessage',strError);
}


export default function(state=defaultState,action){
  switch (action.type) {
    case PANEL_LOAD_REQUEST:
      return state.set('isFetching',true);
    case PANEL_LOAD_SUCCESS:
      return updateAssetDetailData(state,action);
    case PANEL_LOAD_FAILURE:
    case PANEL_SAVE_ENV_FAILURE:
      return handleError(state,action);
    case PANEL_SAVE_ENV_SUCCESS:
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
