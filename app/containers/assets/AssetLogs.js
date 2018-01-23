
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
import LogsView from '../../components/LogsView';
import AssetLogEdit from './AssetLogEdit';
import privilegeHelper from '../../utils/privilegeHelper.js';
import {deleteLog,saveLog,loadAssetLogs} from '../../actions/assetsAction.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

class AssetLogs extends Component{
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
    return true;
  }
  _gotoEdit(log){
    if(!log){ //create one
      if(!this._showAuth()){
        return;
      }
    }
    this.props.navigator.push({
      id:'asset_log_edit',
      component:AssetLogEdit,
      passProps:{
        log,
        saveLog:(a,b)=>{this.props.saveLog(a,b)},
        hierarchyId:this.props.hierarchyId
      }
    });
  }
  _delete(log){
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
          this.props.deleteLog(log.get('Id'));
        }}
      ]
    )
  }
  _loadLogs(){
    this.props.loadAssetLogs(this.props.hierarchyId);
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
    if(nextProps.logs && nextProps.logs !== this.props.logs ||
      (this.props.logs && nextProps.logs === this.props.logs && this.props.logs.size === 0)){
      // console.warn('ready setdatasource');
      InteractionManager.runAfterInteractions(() => {
        // console.warn('setdatasource',nextProps.logs.size);
        this.setState({dataSource:this.ds.cloneWithRows(nextProps.logs.toArray())});
      });
    }
  }
  componentWillUnmount() {
    backHelper.destroy(this.props.route.id);
  }
  render() {
    return (
      <LogsView
        title={localStr('lang_asset_des31')}
        logs={this.state.dataSource}
        isFetching={this.props.isFetching}
        privilegeCode='AssetEditPrivilegeCode'
        emptyText={localStr('lang_asset_des32')}
        showAdd={true}
        onRefresh={()=>this._loadLogs()}
        createLog={()=>this._gotoEdit()}
        onRowClick={(log)=>this._gotoEdit(log)}
        onRowLongPress={(log)=>this._delete(log)}
        onBack={()=>this.props.navigator.pop()} />
    );
  }
}

AssetLogs.propTypes = {
  navigator:PropTypes.object,
  route:PropTypes.object,
  user:PropTypes.object,
  isFetching:PropTypes.bool,
  deleteLog:PropTypes.func,
  saveLog:PropTypes.func,
  loadAssetLogs:PropTypes.func,
  hierarchyId:PropTypes.number,
  hasAuth:PropTypes.bool,
  logs:PropTypes.object,//immutable
}


function mapStateToProps(state,ownProps) {
  var id = ownProps.hierarchyId;
  var logList = state.asset.logs;
  var logs = null;
  // console.warn('ticketId',id);
  if(logList.get('hierarchyId') === id){
    logs = logList.get('data');
  }
  // console.warn('logs',logs);
  return {
    user:state.user.get('user'),
    logs,
    isFetching:logList.get('isFetching'),
    hasAuth:privilegeHelper.hasAuth('AssetEditPrivilegeCode')
  };
}

export default connect(mapStateToProps,{deleteLog,saveLog,loadAssetLogs})(AssetLogs);
