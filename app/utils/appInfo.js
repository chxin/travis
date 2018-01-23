'use strict';

import { NativeModules } from 'react-native';

var _cached = null;

var getInfo = async () => {
  var {versionName,packageName,ossBucket,prod,upgradeUri} = await NativeModules.REMAppInfo.getAppInfo();
  // console.warn('appInfo',versionName,packageName,ossBucket,prod);
  _cached = {versionName,packageName,ossBucket,prod,upgradeUri};
  // console.warn('info',_cached);
};

getInfo();

//console.warn('cachedAppInfo',cachedAppInfo);

/*
 {
   versionName
   packageName
   ossBucket
   prod
 }
*/


export default {
  get(){
    return _cached;
  }
};
