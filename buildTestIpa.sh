api_key=be1290e71bb2fab7a9547cda2ee37d7b
appKey=8d52314a63156de90abff8a1413e7b8a
uKey=7d42c69844b88157360fe2dc141fdf1a

pgyerLog=`curl -d "_api_key=$api_key" -d "appKey=$appKey" https://www.pgyer.com/apiv2/app/view `
currCommit=$(git rev-parse --short HEAD)
buildNumber=$(echo $pgyerLog | tr ',' '\n' | awk -F : '/buildUpdateDescription/{print $2}'| sed 's/"//g' | head -1 | awk -F _ '{print $2}')
buildNumber=$(($buildNumber+1))
description="$currCommit"_"$buildNumber"

OUTPUTDIR="./buildIOSTemp"
SCHEMETEST="HipRock_Test"
SCHEMEPROD="HipRock_Prod"
APP_PROJECTPATH="./ios/HipRock.xcodeproj"
PLIST_PATH='./ios/HipRock/Info.plist'

oldVer=`/usr/libexec/PlistBuddy -c "Print :CFBundleShortVersionString" ./ios/HipRock/Info.plist`
version=$(echo $pgyerLog | tr ',' '\n' | awk -F : '/buildVersion/{print $2}' | head -1 | sed 's/"//g')
if [ $version == $oldVer ]
then 
	version=${version%.*}.$((${version##*.}+1))
# else 
# 	version=$oldVer	
fi

APPNAME='HipRock_V'$version

git checkout ${PLIST_PATH}
. ./mergeTest.sh
/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString ${version}" ${PLIST_PATH}
rm "$OUTPUTDIR/$APPNAME/$SCHEMETEST.ipa"
xcodebuild -project "$APP_PROJECTPATH" -scheme "$SCHEMETEST" archive -archivePath "$OUTPUTDIR/$APPNAME.xcarchive" -quiet
xcodebuild -exportArchive -archivePath "$OUTPUTDIR/$APPNAME.xcarchive" -exportPath "$OUTPUTDIR/$APPNAME" -exportOptionsPlist "exportTestOptions.plist" -quiet
curl -F "file=@$OUTPUTDIR/$APPNAME/$SCHEMETEST.ipa" -F "uKey=$uKey" -F "_api_key=$api_key" -F "installType=2" -F "password=123456" -F "updateDescription=$description" 'https://www.pgyer.com/apiv1/app/upload'

# git checkout ${PLIST_PATH}
# . ./mergeProd.sh
# /usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString ${version}" ${PLIST_PATH}
# rm "$OUTPUTDIR/$APPNAME/$SCHEMEPROD.ipa"
# xcodebuild -project "$APP_PROJECTPATH" -scheme "$SCHEMEPROD" archive -archivePath "$OUTPUTDIR/$APPNAME.xcarchive" -quiet
# xcodebuild -exportArchive -archivePath "$OUTPUTDIR/$APPNAME.xcarchive" -exportPath "$OUTPUTDIR/$APPNAME" -exportOptionsPlist "exportProdOptions.plist" -quiet
# curl -F "file=@$OUTPUTDIR/$APPNAME/$SCHEMEPROD.ipa" -F "uKey= 24af41e3b5e5117e773a733378aefa29" -F "_api_key= 0691c7489e57a5158796f6e1e7e988bd" -F "installType=2" -F "password=123456" -F "updateDescription=$description" http://qiniu-storage.pgyer.com/apiv1/app/upload
