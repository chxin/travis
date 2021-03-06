/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import "RCTBundleURLProvider.h"
#import "RCTRootView.h"
#import "Orientation.h"
#import <RNScreenshotDetector/RNScreenshotDetector.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  #ifdef DEBUG
    jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];
//  [[RCTBundleURLProvider sharedSettings] setDefaults];
//  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
  #else
    jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  #endif



  /**
   * Loading JavaScript code - uncomment the one you want.
   *
   * OPTION 1
   * Load from development server. Start the server from the repository root:
   *
   * $ npm start
   *
   * To run on device, change `localhost` to the IP address of your computer
   * (you can get this by typing `ifconfig` into the terminal and selecting the
   * `inet` value under `en0:`) and make sure your computer and iOS device are
   * on the same Wi-Fi network.
   */

//  jsCodeLocation = [NSURL URLWithString:@"http://192.168.1.104:8081/index.ios.bundle?platform=ios&dev=true"];

  /**
   * OPTION 2
   * Load from pre-bundled file on disk. The static bundle is automatically
   * generated by the "Bundle React Native code and images" build step when
   * running the project on an actual device or running the project on the
   * simulator in the "Release" build configuration.
   */

//   jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];

//  [self initPush:application didFinishLaunchingWithOptions:launchOptions];


  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"HipRock"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  RNScreenshotDetector* screenshotDetector = [[RNScreenshotDetector alloc] init];
  [screenshotDetector setupAndListen:rootView.bridge];

  return YES;
}

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  return [Orientation getOrientation];
}

#pragma mark 注册苹果的推送
-(void) registerAPNS :(UIApplication *)application :(NSDictionary *)launchOptions{
}

#pragma mark 注册接收CloudChannel 推送下来的消息
- (void) registerMsgReceive {
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onMessageReceived:) name:@"CCPDidReceiveMessageNotification" object:nil]; // 注册
}
// 推送下来的消息抵达的处理示例
- (void)onMessageReceived:(NSNotification *)notification {


//  NSData *data = [notification object];
//  NSString *message = [[NSString alloc]initWithData:data encoding:NSUTF8StringEncoding];
  // 报警提示
//  if(![NSThread isMainThread])
//  {
//    dispatch_async(dispatch_get_main_queue(), ^{
////      UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:@"有消息抵达" message:message delegate:self cancelButtonTitle:@"Cancel" otherButtonTitles:@"OK", nil];
////      [alertView show];
//      [RCTPushNotificationManager didReceiveRemoteNotification:notification];
//
//    });
//  } else {
////    UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:@"有消息抵达" message:message delegate:self cancelButtonTitle:@"Cancel" otherButtonTitles:@"OK", nil];
////    [alertView show];
//  }
}

#pragma marker 注册deviceToken
// 苹果推送服务回调，注册 deviceToken
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
}

// 通知统计回调
- (void)application:(UIApplication*)application didReceiveRemoteNotification:(NSDictionary*)userInfo {
}

//-------------------------------------------------------------------------------------------------------------------------------------------------
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
//-------------------------------------------------------------------------------------------------------------------------------------------------
{
  NSLog(@"didFailToRegisterForRemoteNotificationsWithError %@", error);
}

@end
