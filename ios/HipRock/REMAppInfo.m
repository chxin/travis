//
//  REMAppInfo.m
//  Rock
//
//  Created by Tan on 4/28/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "REMAppInfo.h"

@implementation REMAppInfo

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(getAppInfo,
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  NSMutableDictionary *infos = [[NSMutableDictionary alloc] init];
  
  NSString *version = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
  NSString *ossBucket = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"REMOSSBucket"];
  NSString *uri = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"URI"];
  NSString *upgradeUri = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"UpgradeUri"];
  infos[@"versionName"] = version;
  infos[@"ossBucket"] = ossBucket;
  infos[@"prod"] = uri;
  infos[@"upgradeUri"] = upgradeUri;
  resolve(infos);
  
}

@end
