
'use strict';
import React,{Component} from 'react';
import {
  Alert,
  ListView,
  InteractionManager,
} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';
// import TicketLogView from '../../components/ticket/TicketLogView';
import TicketLogEdit from './TicketLogEdit';
import LogsView from '../../components/LogsView';
import privilegeHelper from '../../utils/privilegeHelper.js';
import {deleteLog,saveLog,loadTicketLogs} from '../../actions/ticketAction.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

class TicketLog extends Component{
  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {dataSource:null};
  }
  _showAuth(){
    if(this.props.hasAuth === null){ //do nothing wait api
      return false;
    }
    if(this.props.hasAuth === false){
      Alert.alert(
        '',
        localStr('lang_alarm_des1'),
        [
          {text: localStr('lang_ticket_OK'), onPress: () =>{}}
        ]
      )
      return false;
    }
    if(!this.props.canEdit){
      Alert.alert(
        '',
        localStr('lang_ticket_notice4'),
        [
          {text: localStr('lang_ticket_OK'), onPress: () =>{}}
        ]
      )
      return false;
    }
    return true;
  }
  _gotoEdit(log){
    if(!log){ //create one
      if(!this._showAuth()){
        return;
      }
    }
    this.props.navigator.push({
      id:'ticket_log_edit',
      component:TicketLogEdit,
      passProps:{
        log,
        saveLog:(a,b)=>{this.props.saveLog(a,b)},
        ticketId:this.props.ticketId,
        canEdit:this.props.canEdit,
        hasAuth:this.props.hasAuth,
      }
    });
  }
  _delete(log){
    // console.warn('user',log.get('CreateUserName'),this.props.user.get('RealName'));
    if(log.get('CreateUserName') !== this.props.user.get('RealName')){
      Alert.alert(
        '',
        localStr('lang_ticket_notice5'),
        [
          {text: localStr('lang_ticket_OK'), onPress: () =>{}}
        ]
      )
      return;
    }
    if(!this._showAuth()){
      return;
    }
    Alert.alert(
      '',
      localStr('lang_ticket_remove_log'),
      [
        {text: localStr('lang_ticket_cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: localStr('lang_ticket_remove'), onPress: () => {
          this.props.deleteLog(this.props.ticketId,log.get('Id'));
        }}
      ]
    )
  }
  _loadLogs(){
    this.props.loadTicketLogs(this.props.ticketId);
  }
  _canShowAdd(){
    return this.props.canEdit;
  }
  componentDidMount() {
    backHelper.init(this.props.navigator,this.props.route.id);
    // console.warn('didmount');
    InteractionManager.runAfterInteractions(() => {
      // console.warn('loadTicketLogs');
      this._loadLogs();
    });

  }
  componentWillReceiveProps(nextProps) {
    // console.warn('componentWillReceiveProps',this.props.logs,nextProps.logs);
    if(this.props.logs && !nextProps.logs){
      //this is a hack for following senario
      //when back from edit page
      //sometimes list is empty
      //but when _loadLogs included in runAfterInteractions it is fixed
      InteractionManager.runAfterInteractions(() => {
        this._loadLogs();
      });
      return ;
    }
    if((nextProps.logs && nextProps.logs !== this.props.logs) ||
    (this.props.logs&&nextProps.logs===this.props.logs && this.props.logs.size===0)){
      InteractionManager.runAfterInteractions(() => {
        this.setState({dataSource:this.ds.cloneWithRows(nextProps.logs.toArray())});
      });
    }
  }
  componentWillUnmount() {
    backHelper.destroy(this.props.route.id);
  }
  render() {
    // TicketEditPrivilegeCode====>TicketExecutePrivilegeCode
    return (
      <LogsView
        title={localStr('lang_ticket_ticket_log')}
        logs={this.state.dataSource}
        privilegeCode='TicketExecutePrivilegeCode'
        showAdd={this._canShowAdd()}
        isFetching={this.props.isFetching}
        onRefresh={()=>this._loadLogs()}
        emptyText={localStr('lang_ticket_nolog')}
        createLog={()=>this._gotoEdit()}
        onRowClick={(log)=>this._gotoEdit(log)}
        onRowLongPress={(log)=>this._delete(log)}
        onBack={()=>this.props.navigator.pop()} />
    );
  }
}

TicketLog.propTypes = {
  navigator:PropTypes.object,
  route:PropTypes.object,
  user:PropTypes.object,
  isFetching:PropTypes.bool,
  deleteLog:PropTypes.func,
  saveLog:PropTypes.func,
  loadTicketLogs:PropTypes.func,
  ticketId:PropTypes.number,
  hasAuth:PropTypes.bool,
  logs:PropTypes.object,//immutable
  canEdit:PropTypes.bool,
}

function mapStateToProps(state,ownProps) {
  var id = ownProps.ticketId;
  var logList = state.ticket.logList;
  var logs = null;
  // console.warn('ticketId',logList.get('ticketId'),id,privilegeHelper.hasAuth('TicketEditPrivilegeCode'),logList);
  if(logList.get('ticketId') === id){
    logs = logList.get('data');
  }
  return {
    user:state.user.get('user'),
    logs,
    isFetching:logList.get('isFetching'),
    hasAuth:privilegeHelper.hasAuth('TicketExecutePrivilegeCode'),
  };
}

export default connect(mapStateToProps,{deleteLog,saveLog,loadTicketLogs})(TicketLog);
