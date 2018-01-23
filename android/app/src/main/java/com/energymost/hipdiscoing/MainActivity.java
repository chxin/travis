package com.energymost.hipdiscoing;

import com.facebook.react.ReactActivity;
import com.github.yamill.orientation.OrientationPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.ReactContext;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager.NameNotFoundException;
import android.os.Bundle;
import android.util.Log;
import android.app.Activity;
import android.content.Intent;
import android.app.Dialog;


import java.util.Arrays;
import java.util.List;

// import com.microsoft.codepush.react.CodePush;
// import com.imagepicker.ImagePickerPackage;
//

import com.mehcode.reactnative.splashscreen.SplashScreen;
// import com.lwansbrough.RCTCamera.*;

import android.content.Intent;
import android.content.res.Configuration;

public class MainActivity extends ReactActivity {
    // public MainActivity(){
    //   super();
    //
    //   show();
    // }

    // Dialog mSplashDialog;
    //
    //
    // void show() {
    //     if (mSplashDialog != null && mSplashDialog.isShowing()) {
    //         // Splash screen is open
    //         return;
    //     }
    //
    //     this.runOnUiThread(new Runnable() {
    //         @Override
    //         public void run() {
    //             if (mSplashDialog == null) {
    //                 mSplashDialog = new Dialog(MainActivity.this, R.style.SplashTheme);
    //                 mSplashDialog.setCancelable(false);
    //             }
    //
    //             if (!MainActivity.this.isFinishing()) {
    //                 mSplashDialog.show();
    //             }
    //         }
    //     });
    // }
    //
    // public void hide(){
    //   if (mSplashDialog == null || !mSplashDialog.isShowing()) {
    //       // Not showing splash screen
    //       return;
    //   }
    //
    //   this.runOnUiThread(new Runnable() {
    //       @Override
    //       public void run() {
    //           mSplashDialog.dismiss();
    //       }
    //   });
    // }


    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "HipRock";
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
      super.onConfigurationChanged(newConfig);
      Intent intent = new Intent("onConfigurationChanged");
      intent.putExtra("newConfig", newConfig);
      this.sendBroadcast(intent);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this, getReactInstanceManager());
        
        super.onCreate(savedInstanceState);
        Log.d("sanbo","onCreate Bundle savedInstanceState ");
    }
    @Override
    protected void onResume() {
        super.onResume();
    }
    @Override
    protected void onPause() {
        super.onPause();
    }
    // public static ReactContext getContext() {
    //   ReactInstanceManager sReactInstanceManager = this.getReactNativeHost().getReactInstanceManager();
    //     if (sReactInstanceManager == null){
    //         // This doesn't seem to happen ...
    //         throw new IllegalStateException("Instance manager not available");
    //     }
    //     final ReactContext context = sReactInstanceManager.getCurrentReactContext();
    //     if (context == null){
    //         // This really shouldn't happen ...
    //         throw new IllegalStateException("React context not available");
    //     }
    //     return context;
    // }
}
