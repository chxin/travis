'use strict'

import {
  DeviceEventEmitter,
  PushNotificationIOS,
  Platform,
  // AppState,
  NativeModules,
  Alert,
  // Alert
} from 'react-native';

var {REMPushNotification} = NativeModules;
import {localStr,localFormatStr} from './Localizations/localization.js';

var _data = null;
var _map = {};
var _eventFn = null;

export default {
  setNotification(data){
    _data = data;
    if(_map[data.Key.toLowerCase()]){
      _map[data.Key.toLowerCase()]();
    }
  },
  register(type,fn){
    // console.warn('register');
    _map[type] = fn;
    if(_data){
      fn(_data);
    }
  },
  unregister(type){
    _map[type] = null;
  },
  getData(type){
    var ret = null;
    if(_data){
      if(type === _data.Key.toLowerCase()){
        ret = _data.Value;
      }
    }
    if(!ret){
      _data = null;
    }
    return ret;
  },
  resetData(type){
    if(type && _data){
      if(type === _data.Key.toLowerCase()){
        _data = null;
        _map[type] = null;
      }
    }
  },
  bind(userId,cb){
    // REMPushNotification.bindAccount(userId.toString(),true);
  },
  unbind(userId){
    // REMPushNotification.bindAccount(userId.toString(),false);
  },
  addEventListener(fn){
    if(Platform.OS === 'ios'){
      _eventFn = (notification)=>{
        // console.warn('param',param);
        var data = notification.getData();

        if(data.foreground){
          var title = '';
          if(data.Key === 'Ticket'){
            title = localStr('lang_ticket_notice14');
          }
          else if (data.Key === 'Alarm') {
            title = localStr('lang_ticket_notice15');
          }
          Alert.alert(
            title,
            localFormatStr('lang_commons_see',notification.getMessage()),
            [
              {text: localStr('lang_commons_no'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: localStr('lang_commons_yes'), onPress: () => fn(notification)},
            ]
          )
        }
        else {
          fn(notification);
        }
      }
      PushNotificationIOS.addEventListener('notification',_eventFn);
    }
    else {
      // console.log('addEventListener');
      this._eventFn = DeviceEventEmitter.addListener('remoteNotificationReceived', (notification)=>{
        // console.log('param',notification);
        fn(notification);
      });
    }
  },
  removeEventListener(eventName){
    if(Platform.OS === 'ios'){
      PushNotificationIOS.removeEventListener('notification',_eventFn);
    }
    else {
      this._eventFn && this._eventFn.remove();

    }
  }
}
