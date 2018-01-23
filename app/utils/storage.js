'use strict';

import {AsyncStorage,Clipboard} from 'react-native';

var TOKENKEY = "TOKENKEY";
var NAMEKEY = 'USERNAMEKEY';
var DEVICEKEY = 'DEVICEKEY';

var tempToken = null;
var tempName = null;
var tempDeviceid = null;

function createUuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
}

export default {
  encodeId(id){
		var n = Number(id);
		return n.toString(16);
	},
	decodeId(str){
		return parseInt(str,16);
	},
  setToken(tokenValue,isDemoUser){
    // console.log('tokenValue:'+tokenValue);
    if(isDemoUser){
      tempToken = tokenValue;
    }
    else {
      return this.setItem(TOKENKEY,tokenValue);
    }
  },
  removeToken(){
    tempToken = null;
    this.removeItem(TOKENKEY);
  },
  getToken(cb){
    if(tempToken){
      return tempToken;
    }
    return this.getItem(TOKENKEY,cb);
  },
  getIsDemoToken()
  {
    return tempToken?true:false;
  },
  getName(cb)
  {
    if(tempName){
      return tempName;
    }
    return this.getItem(NAMEKEY,cb);
  },
  setName(value){
    return this.setItem(NAMEKEY,value);
  },
  removeName(){
    this.removeItem(NAMEKEY);
  },

  async getDeviceId(cb)
  {
    if(tempDeviceid){
      return tempDeviceid;
    }
    tempDeviceid = await this.getItem(DEVICEKEY,cb);
    if (!tempDeviceid) {
      tempDeviceid=createUuid(32,16);
    }
    this.setItem(DEVICEKEY,tempDeviceid);
    return tempDeviceid;
  },
  removeDeviceId(){
    tempDeviceid=null;
    this.removeItem(DEVICEKEY);
  },

  removeItem(key){
    AsyncStorage.removeItem(key);
  },
  setItem(key,value){
    return AsyncStorage.setItem(key, value);
  },
  getItem(key,cb){
    return AsyncStorage.getItem(key,(err,ret)=>{cb && cb(ret,err)});
  },
  async getClipboardContent(cb){
    console.log('getClipboardContent');
    console.log(Clipboard);
    var content = await Clipboard.getString();
    cb.call(null,content);
  },
  emptyClipboardContent(){
    Clipboard.setString('');
  },
};
