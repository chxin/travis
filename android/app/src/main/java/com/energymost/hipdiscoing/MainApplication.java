package com.energymost.hipdiscoing;

import android.app.Application;
import android.util.Log;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager.NameNotFoundException;
import android.app.Activity;
import android.content.Intent;

import com.facebook.react.ReactApplication;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.horcrux.svg.SvgPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import fr.bamlab.rncameraroll.CameraRollPackage;
import com.devialab.detectNewPhoto.RCTDetectNewPhotoPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.joshblour.reactnativepermissions.ReactNativePermissionsPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.mehcode.reactnative.splashscreen.SplashScreenPackage;

import java.util.Arrays;
import java.util.List;

import com.imagepicker.ImagePickerPackage;
import com.fileopener.FileOpenerPackage;
import com.rnfs.RNFSPackage;

public class MainApplication extends Application implements ReactApplication {

  private static final String TAG = "HipRock";


  // private String getCodePushKey() {
  //   try{
  //     String pkName = this.getPackageName();
  //     ApplicationInfo appInfo = this.getPackageManager().getApplicationInfo(pkName,PackageManager.GET_META_DATA);
  //     String codepushKey=appInfo.metaData.getString("com.energymost.hipdiscoing.codepushKey");
  //     return codepushKey;
  //   }
  //   catch(NameNotFoundException exc){
  //     Log.e(TAG,"getCodePushKey error",exc);
  //   }
  //   return "";
  //
  // }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {


   @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    // @Override
    // protected String getJSBundleFile() {
    //     return CodePush.getBundleUrl();
    // }




    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNFetchBlobPackage(),
          new SvgPackage(),
          new RCTCameraPackage(),
          new ReactNativeLocalizationPackage(),
          new AppInfoPackage(),
          new ImagePickerPackage(),
          new ReactNativePermissionsPackage(),
          new FileOpenerPackage(),
          new RNFSPackage(),
          new OrientationPackage(),
          new RCTDetectNewPhotoPackage(),
          new CameraRollPackage(),
          new SplashScreenPackage(),
          new RNDeviceInfo()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
