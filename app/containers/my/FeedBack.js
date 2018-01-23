
'use strict';
import React,{Component} from 'react';
import {
  InteractionManager,
  Alert
} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';
import {logInfoChanged,deleteLogImage,cleanFeedbackLog,saveFeedback} from '../../actions/myAction.js';
import FeedBackView from '../../components/my/FeedBackView';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

import ImagePicker from '../ImagePicker.js';
import PhotoShow from '../assets/PhotoShow';
import NetworkImage from '../../components/NetworkImage.js';
var dismissKeyboard = require('dismissKeyboard');

const MAX = 100;

class FeedBack extends Component{
  static contextTypes = {
    showSpinner: PropTypes.func,
    hideHud: PropTypes.func
  }
  _save(){
    dismissKeyboard();
    if(!this.props.feedBackLog.get('Content') && this.props.feedBackLog.get('Pictures').size === 0){
      Alert.alert(
        '',
        localStr('lang_ticket_notice6'),
        [
          {text: localStr('lang_ticket_OK'), onPress: () =>{}}
        ]
      )
      return ;
    }
    var images=[];
    this.props.feedBackLog.get('Pictures').forEach((item)=>{
      var url = NetworkImage.getUri(item.get('PictureId'),1024,768);
      images.push(url);
    });
    var param={
      'ContactInfo':this.props.feedBackLog.get('ContactInfo'),
      'Content':this.props.feedBackLog.get('Content'),
      'PictureURLs':images
    };
    this.context.showSpinner('posting');
    this.props.saveFeedback(param);
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
        type:'feedbackLogPhoto',
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
    // this.props.deleteLogImage(imageId);
  }
  _openImagePicker(){
    this.props.navigator.push({
      id:'imagePicker',
      component:ImagePicker,
      passProps:{
        max:MAX-this.props.feedBackLog.get('Pictures').size,
        dataChanged:(chosenImages)=>this._dataChanged('image','add',chosenImages)
      }
    });
  }
  _checkAuth(){
    // if(!this.props.canEdit){
    //   Alert.alert('','localStr('lang_ticket_notice4')');
    //   return false;
    // }
    // if(!this.props.isSameUser){
    //   return false;
    // }
    // if(!this.props.hasAuth){
    //   // Alert.alert('',localStr('lang_alarm_des1'));
    //   return false;
    // }
    return true;
  }
  _dataChanged(type,action,value){
    // console.warn('_dataChanged',value);
    this.props.logInfoChanged({
      log:this.props.log,
      feedId:this.props.feedId,
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
      old:null,
      feedId:this.props.feedId,
      type:'init'
    })
  }
  componentWillReceiveProps(nextProps) {
    if(!this.props.isPostSuccess && nextProps.isPostSuccess){
      // this.context.hideHud();
      this.context.showSpinner('success');
      InteractionManager.runAfterInteractions(() => {
        this._exit();
      });
    }
  }
  componentWillUnmount() {
    backHelper.destroy(this.props.route.id);
    this.props.cleanFeedbackLog();

  }
  render() {
    var placeholder = this.props.canEdit?localStr('lang_my_des26'):'';
    return (
      <FeedBackView
        log={this.props.feedBackLog}
        user={this.props.user}
        openImagePicker={()=>this._openImagePicker()}
        canEdit={this.props.isSameUser&&this.props.canEdit}
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

FeedBack.propTypes = {
  navigator:PropTypes.object,
  route:PropTypes.object,
  user:PropTypes.object,
  log:PropTypes.object,
  feedBackLog:PropTypes.object,
  logInfoChanged:PropTypes.func,
  deleteLogImage:PropTypes.func,
  cleanFeedbackLog:PropTypes.func,
  saveFeedback:PropTypes.func,
  feedId:PropTypes.number,
  isSameUser:PropTypes.bool,
  hasAuth:PropTypes.bool,
  canEdit:PropTypes.bool,
  isPostSuccess:PropTypes.bool,
}

function mapStateToProps(state,ownProps) {
  var feedBackLog = state.feedBack;
  var user = state.user.get('user');
  var isSameUser = true,canEdit=true,hasAuth=true;

  return {
    user,
    log:null,
    feedBackLog,
    isSameUser,
    canEdit,
    hasAuth,
    feedId:feedBackLog.get('FeedId'),
    isPostSuccess:feedBackLog.get('isPostSuccess'),
  };
}

export default connect(mapStateToProps,{logInfoChanged,deleteLogImage,cleanFeedbackLog,saveFeedback})(FeedBack);
