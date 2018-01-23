/usr/libexec/PlistBuddy -c "Merge ./ios/HipRock/prod.plist" "./ios/HipRock/Info.plist"
cp ./langResources/prod/en.lproj/InfoPlist.strings ./ios/HipRock/en.lproj/InfoPlist.strings
cp ./langResources/prod/zh-Hans.lproj/InfoPlist.strings ./ios/HipRock/zh-Hans.lproj/InfoPlist.strings
