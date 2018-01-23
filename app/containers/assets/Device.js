
'use strict';
import React,{Component} from 'react';
import {
  ListView,
  InteractionManager,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';

import {loadDeviceDetail,loadDeviceRealtimeData,loadDeviceRuntimeSetting,loadDashboardData,dashsSearchCondiChange,updateMaintenExpandInfo,exitDeviceInfo,changeImage,changeImageComplete} from '../../actions/assetsAction';
import DeviceDetailView from '../../components/assets/DeviceDetailView.js';
import DeviceParameter from './DeviceParameter';
import DeviceInfoView from '../../components/assets/DetailView.js';
import DeviceRuntimeSettingView from '../../components/assets/DeviceRuntimeSettingView.js';
import DeviceRealtimeDataView from '../../components/assets/DeviceRealtimeDataView.js';
import DeviceDashboardView from '../../components/assets/DeviceDashboardView.js';
import MaintainRecords from './MaintainRecords.js';
import reactMixin from 'react-mixin';
import timerMixin from 'react-timer-mixin';
import AssetLogs from './AssetLogs.js';
import TendingHistory from './TendingHistory.js';
import ImagePicker from '../ImagePicker.js';
import privilegeHelper from '../../utils/privilegeHelper.js';
import History from './History.js';
var Orientation = require('react-native-orientation');
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

class Device extends Component{
  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged:(r1, r2) => r1 !== r2,
    });
    this.state = {dataSource:null,currentIndex:0};
    this._viewCache = {};
    this._dataSourceCache={};
  }

  _loadDetailById(objAsset){
    // console.warn('building',objAsset.get('Id'));
    this.props.loadDeviceDetail(objAsset.get('Id'));
  }
  _loadRealtimeData(){
    var monitorGroupIds = this.props.realtimeData.get('monitorGroupIds').toArray();
      // console.warn('monitorGroupIds',monitorGroupIds.length);
    this.props.loadDeviceRealtimeData(monitorGroupIds);
  }
  _loadRuntimeSetting(objAsset){
    var isCommonDevice=this.props.classType!=='变频与驱动';
    this.props.loadDeviceRuntimeSetting(objAsset.get('Id'),{strTkdy:this.props.strTkdyly,isCommonDevice:isCommonDevice});
  }
  _loadDashboardData(objAsset)
  {
    // moment(filter.get('EndTime')).add(8,'h').unix();
    this.props.arrCanCalcuDash.forEach((item)=>{
      this.props.loadDashboardData({DeviceId: objAsset.get('Id'),
        CalcType: item.get('CalcType'),
        BeginDate: this.props.dashboardDatas.get('filter').get('StartTime'),
        EndDate: this.props.dashboardDatas.get('filter').get('EndTime')});
    });
  }
  _onRefresh(){
    var type = this._getCurrentType();
      //
      // console.warn('onRefresh...',type);
    if(type === 'infoData'){
      this._loadDetailById(this.props.ownData);
    }
    else if (type === 'realtimeData') {
      this._loadRealtimeData();
    }
    else if (type === 'runtimeData') {
      this._loadRuntimeSetting(this.props.ownData);
    }else if (type === 'dashboardData') {
      this._loadDashboardData(this.props.ownData);
    }else if (type==='maintainRecordData') {
      // this._loadMainRecoredData();
    }
  }
  _onBackClick(){
    this.props.navigator.pop();
    this.props.exitDeviceInfo();
  }
  _indexChanged(index){
    this.setState({currentIndex:index,dataSource:this._getDataSource(index)},()=>{
      if(index !== 0){
        this._onRefresh();
      }
    });

  }
  _gotoDetail(data){
    var type = data.get('type');
console.warn('_gotoDetail...',type);
    if(type === 'arrayParamValues'){
      this.props.navigator.push({
        id:'assets_parameter',
        component:DeviceParameter,
        passProps:{
          data:data.get('data'),
          title:data.get('title'),
        }
      });
    }
    if(type === 'log'){
      this.props.navigator.push({
        id:'assets_log',
        component:AssetLogs,
        passProps:{
          hierarchyId:this.props.ownData.get('Id')
        }
      });
    }else if(type === 'tending'){
      this.props.navigator.push({
        id:'tending',
        component:TendingHistory,
        passProps:{
          hierarchyId:this.props.ownData.get('Id')
        }
      });
    }else if (type === 'historydata') {
      this.props.navigator.push({
        id:'history_view',
        component:History,
        passProps:{
          uniqueId:data.get('uniqueId'),
          unit:data.get('unit'),
          name:data.get('title'),
        }
      });
    }

  }
  _getCurrentData(props){
    var type = this._getCurrentType();
    return props[type];
  }
  _getCurrentType(index = this.state.currentIndex){
    var ret = '';
    if(index === 0){
      ret = 'infoData';
    }
    else{
      if(this.props.hasRealtime){
        if(index === 1){
          ret = 'realtimeData';
        }
        else if(index === 2){
          ret = 'runtimeData';
        }
        else if (index === 3) {
          ret = 'maintainRecordData';
        }
      }
      else {
        if(index === 1){
          ret = 'runtimeData';
        }else if(index === 2){
          ret = 'maintainRecordData';
        }
      }
    }
    console.warn('currentType',ret,index);
    return ret;
  }
  _getDataSource(index){
    var type = this._getCurrentType(index);
    if(this._dataSourceCache[type]){
      return this._dataSourceCache[type];
    }
    return null;
  }
  _setDataSourceCache(dataSource){
    var type = this._getCurrentType();
    if(dataSource){
      this._dataSourceCache[type] = dataSource;
    }
    this.setState({dataSource});
  }
  _getCurrentContentView(){
    var type = this._getCurrentType();
    var component = null;
    if (type==='dashboardData') {
      component = (
        <DeviceDashboardView
          dashboardDatas={this.props.dashboardDatas}
          onSearch={()=>this._loadDashboardData(this.props.ownData)}
          onDateChanged={(type,value)=>{
            // console.warn('dashsSearchCondiChange',type,value);
            this.props.dashsSearchCondiChange({
              type,value
            });
          }}
          />
      );
      return component;
    }
    var stateData = this._getCurrentData(this.props)
    if (stateData==='undefined'||!stateData) {
      // console.warn('stateData is undefined...',type);
      return component;
    }
    var obj = {
      isFetching:stateData.get('isFetching'),
      data:this._getDataSource(),
      sectionData:stateData.get('sectionData'),
      onRefresh:()=>this._onRefresh(),
      stateData,
      hasToolbar:false,
      emptyImageText:localStr('lang_asset_des33'),
      changeImage:()=>this._onChangeImage(),
      canEdit:privilegeHelper.hasAuth('AssetEditPrivilegeCode'),
      ownData:this.props.ownData,
      changeImageComplete:(data)=>this._onChangeImageComplete(data),
      onRowClick:(rowData)=>this._gotoDetail(rowData),
      emptyText:localStr('lang_commons_notice0')
    }
    // if(this._viewCache[type]){
    //   return this._viewCache[type];
    // }
    if(type === 'infoData'){
      component = (
        <DeviceInfoView {...obj} />
      );
    }
    else if (type === 'realtimeData') {
      component = (
        <DeviceRealtimeDataView {...obj} />
      );
    }
    else if (type === 'runtimeData') {
      component = (
        <DeviceRuntimeSettingView {...obj}
          onSectionClick={(rowData)=>{
            this.props.updateMaintenExpandInfo({value:rowData});
          }}
          imageId={this._getCurrentData(this.props).get('imageId')} />
      );
    }else if(type === 'maintainRecordData'){
      component = (
        <MaintainRecords {...obj} navigator={this.props.navigator} />
      );
    }
    // if(component && this.state.dataSource){
    //   this._viewCache[type] = component;
    // }
    return component;
  }
  _onChangeImage(){
    this.props.navigator.push({
      id:'imagePicker',
      component:ImagePicker,
      passProps:{
        max:1,
        dataChanged:(chosenImages)=>this.props.changeImage('device',chosenImages)
      }
    });
  }
  _onChangeImageComplete(data){
    try {
      // console.warn('before parse json');
      let obj = JSON.parse(data);
      let {Result:{ImageKey}} = obj;
      // console.warn('ImageKey',ImageKey);
      this.props.changeImageComplete(ImageKey);

    } catch (e) {

    } finally {

    }
  }
  componentDidMount() {
    var navigator = this.props.navigator;
    // if (navigator) {
    //   var callback = (event) => {
    //     // console.warn('event route:',event.data.route.id);
    //     // console.warn('current route:',event.data.route.id,this.props.route.id);
    //     if(event.data.route && event.data.route.id && event.data.route.id === this.props.route.id){
    //       // Orientation.lockToPortrait();
    //     }
    //   };
    //   // Observe focus change events from the owner.
    //   this._listener= navigator.navigationContext.addListener('willfocus', callback);
    // }

    InteractionManager.runAfterInteractions(()=>{
      this._loadDetailById(this.props.ownData);
    });
    backHelper.init(this.props.navigator,this.props.route.id);
  }

  componentWillReceiveProps(nextProps) {
    var type = this._getCurrentType();
    if (type==='dashboardData') {
      return;
    }
    var data = this._getCurrentData(nextProps).get('data');
    var origData = this._getCurrentData(this.props).get('data');

    // console.warn('componentWillReceiveProps',data);
    if(data){
    // if(data !== origData && data && data.size >= 1){
      var obj = data.map((item)=>item.toArray()).toArray();
      InteractionManager.runAfterInteractions(()=>{
        this._setDataSourceCache(this.ds.cloneWithRowsAndSections(obj));
      });
      var type = this._getCurrentType();
      if(type !== 'infoData'){
        if (this.handerTimeout) {
          clearTimeout(this.handerTimeout);
        }
        this.handerTimeout=this.setTimeout(()=>{this._onRefresh()},5000);
      }
    }
  }

  componentWillUnmount() {
    if (this.handerTimeout) {
      clearTimeout(this.handerTimeout);
    }
    backHelper.destroy(this.props.route.id);
    // this._listener && this._listener.remove();
  }
  render() {
    return (
      <DeviceDetailView
        deviceData={this.props.data}
        title={this.props.ownData.get('Name')}
        hasRuntime={this.props.hasRuntime}
        hasRealtime={this.props.hasRealtime}
        has6Dashboard={this.props.arrCanCalcuDash.size>0&&this.props.infoData.get('classType')==='变频与驱动'}
        onBack={()=>this._onBackClick()}
        currentIndex={this.state.currentIndex}
        indexChanged={(index)=>{this._indexChanged(index)}}
        contentView={this._getCurrentContentView()}
        errorMessage={this.props.errorMessage}
        />
    );
  }
}
Device.propTypes = {
  navigator:PropTypes.object,
  ownData:PropTypes.object,
  route:PropTypes.object,
  realtimeData:PropTypes.object,
  runtimeData:PropTypes.object,
  maintainRecordData:PropTypes.object,
  infoData:PropTypes.object,
  dashboardDatas:PropTypes.object,
  arrCanCalcuDash:PropTypes.object,
  changeImage:PropTypes.func,
  changeImageComplete:PropTypes.func,
  loadDeviceDetail:PropTypes.func,
  loadDeviceRealtimeData:PropTypes.func,
  loadDeviceRuntimeSetting:PropTypes.func,
  loadDashboardData:PropTypes.func,
  dashsSearchCondiChange:PropTypes.func,
  updateMaintenExpandInfo:PropTypes.func,
  data:PropTypes.object,
  hasRuntime:PropTypes.bool,
  hasRealtime:PropTypes.bool,
  strTkdyly:PropTypes.string,
  classType:PropTypes.string,
  errorMessage:PropTypes.string,
}

function mapStateToProps(state,ownProps) {
  var deviceDetailData = state.asset.deviceDetailData,data;
  var errorMessage=deviceDetailData.get('errorMessage');
  if (ownProps.ownData.get('Id') !== deviceDetailData.get('deviceId')) {
    data = null;
  }
  else {
    data = state.asset.deviceDetailData.get('data');
  }
  var arrCanDash=deviceDetailData.get('arrCanCalcuDash');
  var has6Dashboard=false;
  if (arrCanDash&&arrCanDash.size>0&&deviceDetailData) {
    has6Dashboard=arrCanDash.size>0&&deviceDetailData.get('classType')==='变频与驱动';
  }//为利德华福做的，机器顾问没有这个
  return {
    data,
    infoData:deviceDetailData,
    runtimeData:state.asset.deviceRuntimSetting,
    maintainRecordData:state.asset.maintainRecordData,
    realtimeData:state.asset.deviceRealtime,
    dashboardDatas:state.asset.dashboardDatas,
    arrCanCalcuDash:arrCanDash,
    hasRuntime:deviceDetailData.get('hasRuntime'),
    hasRealtime:deviceDetailData.get('hasRealtime'),
    has6Dashboard:has6Dashboard,
    strTkdyly:deviceDetailData.get('strTkdyly'),
    classType:deviceDetailData.get('classType'),
    errorMessage,
  };
}

reactMixin(Device.prototype, timerMixin);


export default connect(mapStateToProps,{loadDeviceDetail,loadDeviceRealtimeData,loadDeviceRuntimeSetting,loadDashboardData,dashsSearchCondiChange,updateMaintenExpandInfo,exitDeviceInfo,changeImage,changeImageComplete})(Device);
