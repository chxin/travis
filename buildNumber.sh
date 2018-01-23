function getParamAndPlusone()
{
	arg1="rockBuildNum"
	ifglobal=0

	if [ ! -f ~/Documents/.profile ]
	then
		touch -f ~/Documents/.profile
	fi

	for member in `cat ~/Documents/.profile`
	do
	key1=${member%=*}
	value1=${member#*=}
	if [ "$key1" = "$arg1" ]
	then
		ifglobal=1
		expr $value1 + 1&>/dev/null
		if [ $? == 0 ]
		then
			 let rockBuildNum=$[$value1+1]
			setParam $rockBuildNum
		else
			setParam 1
		fi
	fi
	done

	if [ $ifglobal -eq 0 ]
	then
		setParam 1
		rockBuildNum=1
	fi

	echo $rockBuildNum
	return 0
}

setParam()
{
	echo "rockBuildNum=$1">~/Documents/.profile
}

# initParam()
# {
# 	echo "rockBuildNum=1">~/Documents/shell/.profile
# }


# getParamAndPlusone
# Number=$?
# echo $Number
