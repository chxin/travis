
'use strict';
import React,{Component} from 'react';
import {
  InteractionManager,
  Alert
} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';
import {logInfoChanged,deleteLogImage,cleanTicketLog} from '../../actions/ticketAction';
import LogEditView from '../../components/LogEditView';

import ImagePicker from '../ImagePicker.js';
import PhotoShow from '../assets/PhotoShow';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

const MAX = 100;

class TicketLogEdit extends Component{
  static contextTypes = {
    showSpinner: PropTypes.func,
    hideHud: PropTypes.func
  }
  _save(){
    if(!this.props.ticketLog.get('Content') && this.props.ticketLog.get('Pictures').size === 0){
      Alert.alert(
        '',
        localStr('lang_ticket_notice6'),
        [
          {text: localStr('lang_ticket_OK'), onPress: () =>{}}
        ]
      )
      return ;
    }

    this.context.showSpinner();
    this.props.saveLog(this.props.ticketLog.toJSON(),this.props.log ? false : true);
  }
  _goToDetail(items,index,thumbImageInfo)
  {
    this.props.navigator.push({
      id:'photo_show',
      component:PhotoShow,
      passProps:{
        index:index,
        arrPhotos:items,
        thumbImageInfo:thumbImageInfo,
        type:'ticketLogPhoto',
        onRemove:(item)=>{this._photoViewDeleteImage(item)},
        checkAuth:()=>this._checkAuth(),
        canEdit:this.props.canEdit,
      }
    });
  }
  _photoViewDeleteImage(item)
  {
    if (this._checkAuth()&&item) {
      this._dataChanged('image','delete',item);
      this._deleteImage([item.get('PictureId')]);
    }
  }
  _deleteImage(imageId){
    this.props.deleteLogImage(imageId);
  }
  _openImagePicker(){
    this.props.navigator.push({
      id:'imagePicker',
      component:ImagePicker,
      passProps:{
        max:MAX-this.props.ticketLog.get('Pictures').size,
        dataChanged:(chosenImages)=>this._dataChanged('image','add',chosenImages)
      }
    });
  }
  _checkAuth(){
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
    if(!this.props.isSameUser){
      Alert.alert(
        '',
        localStr('lang_ticket_notice7'),
        [
          {text: localStr('lang_ticket_OK'), onPress: () =>{}}
        ]
      )
      return false;
    }
    if(!this.props.hasAuth){
      // Alert.alert('',localStr('lang_alarm_des1'));
      return false;
    }
    return true;
  }
  _dataChanged(type,action,value){
    // console.warn('_dataChanged',value);
    this.props.logInfoChanged({
      log:this.props.log,
      ticketId:this.props.ticketId,
      userId:this.props.user.get('Id'),
      type,action,value
    });
  }
  _exit(){
    this.props.navigator.pop();
  }
  componentDidMount() {
    backHelper.init(this.props.navigator,this.props.route.id);
    // console.warn('init',this.props.log);
    this.props.logInfoChanged({
      old:this.props.log,
      ticketId:this.props.ticketId,
      type:'init'
    })
  }
  componentWillReceiveProps(nextProps) {
    if(!nextProps.logs && this.props.logs){
      this.context.hideHud();
      InteractionManager.runAfterInteractions(() => {
        this._exit();
      });
    }
  }
  componentWillUnmount() {
    backHelper.destroy(this.props.route.id);
    this.props.cleanTicketLog();

  }
  render() {
    var placeholder = this.props.canEdit?localStr('lang_ticket_notice8'):'';
    return (
      <LogEditView
        log={this.props.ticketLog}
        user={this.props.user}
        openImagePicker={()=>this._openImagePicker()}
        canEdit={this.props.isSameUser&&this.props.canEdit}
        privilegeCode='TicketExecutePrivilegeCode'
        checkAuth={()=>this._checkAuth()}
        inputPlaceholder={placeholder}
        gotoDetail={(items,index,thumbImageInfo)=>this._goToDetail(items,String(index),thumbImageInfo)}
        save={(data)=>this._save(data)}
        deleteImage={(imageId)=>this._deleteImage(imageId)}
        dataChanged={(type,action,value)=>this._dataChanged(type,action,value)}
        onBack={()=>this._exit()} />
    );
  }
}

TicketLogEdit.propTypes = {
  navigator:PropTypes.object,
  route:PropTypes.object,
  user:PropTypes.object,
  log:PropTypes.object,
  logs:PropTypes.object,
  ticketLog:PropTypes.object,
  saveLog:PropTypes.func,
  logInfoChanged:PropTypes.func,
  deleteLogImage:PropTypes.func,
  cleanTicketLog:PropTypes.func,
  isSameUser:PropTypes.bool,
  hasAuth:PropTypes.bool,
  ticketId:PropTypes.number.isRequired,
  canEdit:PropTypes.bool,
}

function mapStateToProps(state,ownProps) {
  var logs = state.ticket.logList.get('data');
  var ticketLog = state.ticket.ticketLog;
  var user = state.user.get('user');
  var isSameUser = true;
  if(ownProps.log && ownProps.log.get('CreateUserName') !== user.get('RealName')){
    isSameUser = false;
  }
  return {
    user,
    logs,
    isSameUser,
    ticketLog,
  };
}

export default connect(mapStateToProps,{logInfoChanged,deleteLogImage,cleanTicketLog})(TicketLogEdit);
