
'use strict';
import React,{Component} from 'react';
import {
  View,
  // Alert
  Platform,
  AppState,
  InteractionManager,
  // DeviceEventEmitter,
  Alert,
  UIManager,
  ActionSheetIOS,
  Share,
} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../utils/backHelper';
import TabBar from '../components/TabBar';
import My from './my/My';
import Alarm from './alarm/Alarm';
import Ticket from './ticket/Ticket';
import Assets from './assets/Assets';
import notificationHelper from '../utils/notificationHelper.js';
import ViewPager from '../components/ViewPager';
import privilegeHelper from '../utils/privilegeHelper.js';
import {detectClipboard,emptyClipboard} from '../actions/appAction.js';
// console.warn('ViewPager',ViewPager);
import CameraRoll from 'rn-camera-roll';
// import Permissions from 'react-native-permissions';

import ReactNativeDetectNewPhoto from 'react-native-detect-new-photo';
import * as ScreenshotDetector from 'react-native-screenshot-detector';
import RNFS, { DocumentDirectoryPath } from 'react-native-fs';

import TicketDetail from './ticket/TicketDetail';
import AlarmDetail from './alarm/AlarmDetail';
import {localStr,localFormatStr} from '../utils/Localizations/localization.js';

var AlertManager = require('NativeModules').AlertManager;
var DeviceInfo = require('react-native-device-info');

var _stateChangedHandler = null;

class Main extends Component{
  constructor(props){
    super(props);
    this.state = {selectedIndex:0,imgUri:null};
    this.appIsActive=true;
    this.showViewIsVisible=false;
    this.timestamp=0;
  }
  _tabChanged(index,cb){
    var nav = this.props.navigator;
    // console.warn('nav',nav.getCurrentRoutes().length);
    if(nav.getCurrentRoutes().length > 1){
      // console.warn('pop');
      nav.popToTop();
    }
    this.viewPager.setPage(index);
    this.setState({selectedIndex:index},()=>{
      if(cb){
        InteractionManager.runAfterInteractions(()=>{
          cb();
        });
      }
    });
  }
  _onPageSelected(e){
    if(e.nativeEvent.position !== this.state.selectedIndex){
      this.setState({selectedIndex:e.nativeEvent.position});
    }
  }
  _getTabView(index){
    var component = null;
    var selectedIndex = this.state.selectedIndex;
    if(index === selectedIndex){
      if(selectedIndex === 1){
        component = (<Alarm navigator={this.props.navigator} route={{id:'alarm'}} />);
      }
      else if (selectedIndex === 0) {
        component = (<Assets navigator={this.props.navigator} route={{id:'asset'}}/>);
      }
      else if (selectedIndex === 3) {
        component = (<My navigator={this.props.navigator} route={{id:'my'}}/>);
      }
      else if (selectedIndex === 2) {
        component = (<Ticket navigator={this.props.navigator} route={{id:'ticket'}}/>);
      }
    }

    return component;
  }
  _checkCodePushUpgrade(){
    // codePush.sync();
  }
  _onNotification(notification){
    // var message = notification.getMessage();
    // console.warn('remote message',message,typeof notification.getData(),notification.getData());
    var data = notification.getData();
    if(data.Key === 'Ticket'){
      this._tabChanged(2,()=>{
        notificationHelper.setNotification(data);
      });
    }
    else if (data.Key === 'Alarm') {
      this._tabChanged(1,()=>{
        notificationHelper.setNotification(data);
      });
    }
  }
  _setPrivilege(){
    // console.warn('user',this.props.user.getIn(['user','PrivilegeCodes']));
    privilegeHelper.setPrivilegeCodes(this.props.user.getIn(['user','PrivilegeCodes']))
  }
  _handleAppStateChange(appState){
    if(appState === 'active'){
      this.props.detectClipboard();

      this.appIsActive=true;
      this.timestamp=new Date().getTime();
      console.warn('isactive...',this.timestamp);
    }else {
      console.warn('background...');
      this.appIsActive=false;
    }
  }
  _startCheckNewPhoto()
  {
    // console.warn('ReactNativeDetectNewPhoto init...');
    if(Platform.OS === 'ios'){
      this.eventEmitter = ScreenshotDetector.subscribe(
        ()=>{
        //   AlertManager.invalidateAllAlert();
        //   console.warn('will share...0',new Date().getTime());
        // }
        // ,()=>{
          console.warn('new photo detected! appIsActive:',this.appIsActive);
          if (this.appIsActive) {
            this._startGetFirstPhotos();
          }
        });
    }else {
      console.warn('device name...',DeviceInfo.getManufacturer(),DeviceInfo.getModel(),DeviceInfo.getSystemName());
      if (DeviceInfo.getManufacturer().toLowerCase().indexOf('huawei')>=0) {
        console.warn('this is huawei mobile...');
        return;
      }
      ReactNativeDetectNewPhoto.init(()=>{
        // console.warn('accept');
      },()=>{
        // console.warn('reject');
      });
      ReactNativeDetectNewPhoto.registerCallback(()=>{
        // console.warn('new photo detected! appIsActive:',this.appIsActive)
        if (this.appIsActive) {
          this._startGetFirstPhotos();
        }
      });
    }
  }
  _startCheckAppState()
  {
    _stateChangedHandler = (appState) => this._handleAppStateChange(appState);
    AppState.addEventListener('change', _stateChangedHandler);
  }

  async _getImagesWithInit(isInit){
    var obj = await CameraRoll.getPhotos({first:1});
    //uri is: content://media/external/images/media/35627
    //ios is: assets-library://asset/asset.PNG?id=B0951C5B-F643-4E34-84A1-F5FFA5EFAF5D&ext=PNG

    var uri=obj.edges[0].node.image.uri;
    var image=obj.edges[0].node.image;
    console.warn('showViewIsVisible.....',this.showViewIsVisible);
    if (this.state.imgUri===uri||this.showViewIsVisible) {
      return;
    }
    // console.warn('will share...',obj.edges[0].node);
    var timestamp=obj.edges[0].node.timestamp*1000;

    console.warn('will share 1...',new Date().getTime(),uri);
    // if (timestamp!==0&&timestamp<this.timestamp) {
    //   return;
    // }
    // ./storage/emulated/0/Pictures/image-ff34cb59-aaa8-4607-870a-2cc2fec39131.jpg
    //./storage/emulated/0/Pictures/Screenshots/Screenshot_2017-03-31-20-26-44.png
    this.setState({imgUri:uri});
    if (Platform.OS==='android') {
      if (uri.toLowerCase().indexOf('screen')<0) {
        console.warn('the image is not screen shot ...',uri);
        return;
      }
      uri=uri.replace('file:/','./');
      console.warn('_getImages',uri);
      if (!isInit) {
        Share.share({
          imgPath: uri,
          message:''
        });
      }
    }else {
      if (!isInit) {
        // UIManager.takeSnapshot('window').then((uri) => {
        //   ActionSheetIOS.showShareActionSheetWithOptions({
        //     url: uri,
        //     excludedActivityTypes: [
        //     ]
        //   },
        //   (error) => {
        //     this.showViewIsVisible=false;
        //     this.timestamp=new Date().getTime();
        //   },
        //   (success, method) => {
        //     this.showViewIsVisible=false;
        //     this.timestamp=new Date().getTime();
        //   });
        // });

        this.showViewIsVisible=true;
        var imageName=image.filename.toLowerCase();
        var index = imageName.lastIndexOf('.');
        var type = imageName.substring(index+1).toLowerCase();
        var subName=imageName.substring(0,index).toLowerCase();
        var obj = {
            imagePath: uri,
            imageName: subName,
            imageType: type,
            width: image.width,
            height: image.height,
        };
        var successCallBack = ()=>{
          this.showViewIsVisible=true;
          var path = RNFS.DocumentDirectoryPath + '/'+imageName;
          ActionSheetIOS.showShareActionSheetWithOptions({
            url: path,
            excludedActivityTypes: [
              'com.apple.UIKit.activity.PostToTwitter'
            ]
          },
          (error) => {
            this.showViewIsVisible=false;
            this.timestamp=new Date().getTime();
          },
          (success, method) => {
            this.showViewIsVisible=false;
            this.timestamp=new Date().getTime();
          });
        };
        var errorCallback = (error)=>{
            console.log('error: ', error);
        };
        ScreenshotDetector.saveImage(obj, successCallBack, errorCallback);
      }
    }
  }
  _startGetFirstPhotos()
  {
    console.warn('start to get photo ...');
    if(Platform.OS === 'android'){
      InteractionManager.runAfterInteractions(() => {
        this._getImagesWithInit();
      });
    }else {
      Permissions.getPermissionStatus('photo').then(response => {
          // response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
          console.warn('check',response);
          if (response==='authorized'||response==='undetermined') {
            InteractionManager.runAfterInteractions(() => {
              this._getImagesWithInit();
            });
          }else {
            Alert.alert(
              '',
              localStr('lang_commons_notice19'),
              [
                {text: localStr('lang_ticket_cancel'), onPress: () => {
                }},
                {text:localStr('lang_commons_notice15'), onPress: () => {
                  if (Permissions.canOpenSettings()) {
                    Permissions.openSettings();
                  }
                }}
              ]
            )
          }
      });
    }
  }

  _onPostingCallback(type){
  }
  _gotoTicketDetail(ticketId,fromHex,isFutureTask){
    this.props.navigator.push({
      id:'ticket_detail',
      component:TicketDetail,
      passProps:{
        onPostingCallback:(type)=>{this._onPostingCallback(type)},
        ticketId:ticketId,
        fromHex:fromHex,
        fromFilterResult:false,
        isFutureTask,
      },
    });
  }
  _gotoAlarmDetail(alarmId,fromHex){
    this.props.navigator.push({
      id:'alarm_detail',
      component:AlarmDetail,
      barStyle:'light-content',
      passProps:{
        onPostingCallback:(type)=>{this._onPostingCallback(type)},
        alarmId:alarmId,
        fromHex
      }
    });
  }
  componentDidMount() {
    console.warn('Main componentDidMount...');
    notificationHelper.addEventListener((notification)=>this._onNotification(notification));
    notificationHelper.bind(this.props.user.getIn(['user','Id']));

    this._startCheckNewPhoto();

    this._checkCodePushUpgrade();
    this._setPrivilege();
    this._startCheckAppState();

    this.props.detectClipboard();
  }
  componentWillReceiveProps(nextProps) {
    // console.warn('componentWillReceiveProps',nextProps.itemType,this.props.itemId,nextProps.itemId,nextProps.itemId!==this.props.itemId);
    if (nextProps.itemType && nextProps.itemId && (nextProps.itemId!==this.props.itemId)) {
      InteractionManager.runAfterInteractions(()=>{
          var index=2;
          if (nextProps.itemType==='alarm') {
            index=1;
          }
          this._tabChanged(index,()=>{
            // notificationHelper.setNotification({Value:nextProps.itemId,Key:'ticket'});
            Alert.alert(
              '',
              this.props.content,
              [
                {text: localStr('lang_ticket_cancel'), onPress: () => {
                  this.props.emptyClipboard();
                  return;
                }},
                {text:localStr('lang_commons_notice28'), onPress: () => {
                  this.props.emptyClipboard();
                  if (nextProps.itemType==='alarm') {
                    this._gotoAlarmDetail(nextProps.itemId,true);
                  }else if (nextProps.itemType==='ticket') {
                    this._gotoTicketDetail(nextProps.itemId,true,false);
                  }
                  return;
                }}
              ]
            )
          });
        });
    }
  }
  componentWillUnmount() {
    // backHelper.destroy('main');
    notificationHelper.removeEventListener();
    AppState.removeEventListener('change', _stateChangedHandler);
    this.appIsActive=false;
    if(Platform.OS === 'ios'){
      ScreenshotDetector.unsubscribe(this.eventEmitter);
    }
  }
  render() {
    return (
      <View style={{flex:1}}>
        <ViewPager
          ref={(viewPager) => { this.viewPager = viewPager; }}
          style={{flex:1}} initialPage={this.state.selectedIndex}
          onPageSelected={(e)=>this._onPageSelected(e)}
          totalPage={4}
          renderPage={(page)=>this._getTabView(page,this.state.selectedIndex)}
          >
        </ViewPager>
        <TabBar needUpdate={this.props.hasNewVersion} selectedIndex={this.state.selectedIndex} onSelectedChanged={(index) => this._tabChanged(index)}/>
      </View>
    );
  }
}

Main.propTypes = {
  navigator:PropTypes.object.isRequired,
  user:PropTypes.object,
  itemId:PropTypes.string,
  itemType:PropTypes.string,
  content:PropTypes.string,
  detectClipboard:PropTypes.func,
  emptyClipboard:PropTypes.func,
}

function mapStateToProps(state) {
  var boot = state.boot;
  // console.warn('mapStateToProps',boot,boot.get('itemId'),boot.get('itemType'));
  return {
    user:state.user,
    itemId:boot.get('itemId'),
    itemType:boot.get('itemType'),
    content:boot.get('content'),
    hasNewVersion:state.version.get('hasNewVersion'),
  };
}

export default connect(mapStateToProps,{detectClipboard,emptyClipboard})(Main);
