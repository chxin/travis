function setFileName()
{
	file=(react-native-image-picker react-native-permissions react-native-file-opener react-native-fs react-native-svg react-native-detect-new-photo)
	parentDir=../node_modules
}

function getFileAndChangeJcenter()
{
	setFileName
	totalDir=`ls -R $parentDir`
	parentDir=$parentDir'/'

	for childDir in $totalDir
	do
		[[ "$childDir" =~ ":" ]]
		if [ $? -eq 0 ]
		then
			parentDir=${childDir/':'/'/'} #把:替换为/
		else
			nowDir="$parentDir""$childDir"
			[ -f $nowDir ]
			if [ $? -eq 0 -a ${nowDir##*/} = "build.gradle" ]
			then
				for obj in ${file[@]}
				do
					[[ "$nowDir" =~ "$obj" ]] 
					if [ $? -eq 0 ]
					then
						changeJcenterContent $nowDir
					fi
				done
			fi
		fi
	done
}

function changeJcenterContent()
{
	fPath=$1
	pattern1='jcenter()'
	pattern2='jcenter{url "http:\/\/jcenter.bintray.com\/"}'
	sed -ig "s/$pattern1/$pattern2/g" $fPath 
}

function changeJSCHeader() {
	JscPath=../node_modules/react-native/ReactAndroid/build.gradle
	pattern1='https:\/\/svn.webkit.org'
	pattern2='http:\/\/svn.webkit.org'
	sed -ig "s/$pattern1/$pattern2/g" $JscPath 
}

function changeBuildVersion() {
	verPath=../node_modules/rn-camera-roll/android/build.gradle
	pattern1='23.0.2'
	pattern2='23.0.1'
	sed -ig "s/$pattern1/$pattern2/g" $verPath 
}

