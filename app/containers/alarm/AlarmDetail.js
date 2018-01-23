
'use strict';
import React,{Component} from 'react';

import {
  InteractionManager,
  // Alert,
} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';
import AlarmDetailView from '../../components/alarm/AlarmDetail';
import TicketDetail from '../ticket/TicketDetail.js';
import CreateTicket from '../ticket/CreateTicket.js';
import Device from '../assets/Device.js';
import Room from '../assets/Room.js';
import Immutable from 'immutable';
import {loadAlarmById,resetAlarm} from '../../actions/alarmAction.js';

class AlarmDetail extends Component{
  constructor(props){
    super(props);
    // console.warn('props',this.props.rowData);
  }
  _onPostingCallback(type){
    console.warn('AlarmDetail _onPostingCallback',type);
    this.props.onPostingCallback();
    if (type==='create'||type==='finish') {
      InteractionManager.runAfterInteractions(() => {
        this.props.navigator.pop();
      });
    }
    this._loadAlarm(this.props.alarmId,this.props.fromHex);
  }
  _createOrEditTicket(rowData){
    this.props.navigator.push({
      id:'ticket_create',
      component:CreateTicket,
      passProps:{
        customer:Immutable.fromJS({
          'CustomerId':this.props.customerId,
          'CustomerName':this.props.customerName,
        }),
        alarm:rowData,
        ticketInfo:null,
        onPostingCallback:(type)=>this._onPostingCallback(type),
      }
    });

  }
  _gotoAsset(rowData)
  {
    var asset=rowData.get('AlarmHierarchy');
    var type = asset.get('Type');
    var container = Room;
    if (type===3) {
      container = Room;
    }else if (type===4) {
      // container = Panel;
    }else if (type===5) {
      container = Device;
    }
    this.props.navigator.push({
      id:'asset_detail',
      component:container,
      passProps:{
        ownData:asset
      }
    });
  }
  _gotoTicket(){
    this.props.navigator.push({
      id:'ticket_detail',
      component:TicketDetail,
      passProps:{
        ticketId:String(this.props.rowData.get('TicketId')),
        fromAlarm:true,
        onPostingCallback:(type)=>{this._onPostingCallback(type)},
      }
    });
  }
  _loadAlarm(alarmId,isHex){
    this.props.loadAlarmById(alarmId,isHex);
  }
  componentDidMount() {
    backHelper.init(this.props.navigator,this.props.route.id);
    InteractionManager.runAfterInteractions(() => {
      if(!this.props.rowData){
        this._loadAlarm(this.props.alarmId,this.props.fromHex);
      }
    });
  }
  componentWillReceiveProps(nextProps) {
  }
  componentWillUnmount() {
    backHelper.destroy(this.props.route.id);
    this.props.resetAlarm();

  }
  render() {
    return (
      <AlarmDetailView
        isFetching={this.props.isFetching}
        rowData={this.props.rowData}
        customerName={this.props.customerName}
        viewTicket={()=>this._gotoTicket()}
        onAssetClick={(rowData)=>this._gotoAsset(rowData)}
        onBack={()=>{
          var arrRoutes = this.props.navigator.getCurrentRoutes();
          var currCount=0;
          arrRoutes.forEach((item)=>{
            if (item.id==='alarm_detail') {
              currCount++;
            }
          });
          if (currCount>1) {
            this.props.navigator.popToTop();
          }else {
            this.props.navigator.pop();
          }
        }}
        createOrEditTicket={(rowData)=>this._createOrEditTicket(rowData)}/>
    );
  }
}

AlarmDetail.propTypes = {
  navigator:PropTypes.object,
  isFetching:PropTypes.bool,
  route:PropTypes.object,
  alarmId:PropTypes.string,
  loadAlarmById:PropTypes.func,
  resetAlarm:PropTypes.func,
  user:PropTypes.object,
  rowData:PropTypes.object,//immutable
  onPostingCallback:PropTypes.func,
  customerId:PropTypes.number,
  customerName:PropTypes.string,
  fromHex:PropTypes.bool,
}


function mapStateToProps(state,ownProps) {
  // var id = ownProps.alarmId;
  var rowData = null;
  var isFetching = false;
  var customerId = 0;
  var customerName = '';
  var alarm = state.alarm.alarm.get('data');
  var alarmFirstId = state.alarm.alarm.get('alarmFirstId');
  if (alarm) {
    console.warn('mapStateToProps...',ownProps.alarmId,alarmFirstId);
    customerId = alarm.getIn(['Customer','Id']);
    customerName = alarm.getIn(['Customer','Name']);
    if(ownProps.alarmId === String(alarmFirstId)){
      rowData = alarm;
    }
  }
  isFetching = state.alarm.alarm.get('isFetching');
  return {
    user:state.user.get('user'),
    rowData,
    isFetching,
    customerId,
    customerName
  };
}

export default connect(mapStateToProps,{loadAlarmById,resetAlarm})(AlarmDetail);
