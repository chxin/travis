
'use strict';
import React,{Component} from 'react';

import {
  View,
  Dimensions,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';

import moment from 'moment';
import Loading from '../Loading';

import {GREEN,GRAY,LINE_HISTORY} from '../../styles/color.js';
import Immutable from 'immutable';
import Text from '../Text';
import utils from '../../utils/unit.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLine,
  VictoryScatter
} from "victory-native";

export default class HistoryDataView extends Component{
  constructor(props){
    super(props);
    this._alreadyShowMaxPointInDay=false;
  }
  _checkShowXTickes(index,isInsert,time)
  {
    var objTime=moment(1000*time).subtract(8,'h');
    var stepIndex=0;
    if (this.props.step===1&&!this.props.isEnergyData) {
      // stepIndex=12;
      var points=[6,18,30,42,54,66,78,90,102];
      // return index%stepIndex===0&&!isInsert;
      return points.indexOf(index)!==-1&&!isInsert;
    }else if (this.props.step===0&&!this.props.isEnergyData) {
      stepIndex=1;
      return index%stepIndex===0&&!isInsert;
    }else if (this.props.step===1&&this.props.isEnergyData) {
      stepIndex=3;
      return objTime.get('hour')%stepIndex===0&&!isInsert;
    }else if (this.props.step===2&&this.props.isEnergyData) {
      return !isInsert;
    }else if (this.props.step===3&&this.props.isEnergyData) {
      stepIndex=7;
      return (index-1)%stepIndex===0&&!isInsert;
    }else if (this.props.step===5&&this.props.isEnergyData) {
      return !isInsert;
    }
  }
  _getXTickesFormat(time,x,size)
  {
    var objTime=moment(1000*time).subtract(8,'h');
    if (this.props.step===1&&!this.props.isEnergyData) {
      if (x===size-7) {
        return '24:00';
      }
      return objTime.format("HH:mm");
    }else if (this.props.step===0&&!this.props.isEnergyData) {
      return objTime.format("HH:mm");
    }else if (this.props.step===1&&this.props.isEnergyData) {
      if (x===size-1) {
        return '24:00';
      }
      return objTime.format("HH:mm");
    }else if (this.props.step===2&&this.props.isEnergyData) {
      return objTime.format("MM/DD");
    }else if (this.props.step===3&&this.props.isEnergyData) {
      return objTime.format("MM/DD");
    }else if (this.props.step===5&&this.props.isEnergyData) {
      return objTime.format("MM");
    }
  }
  _getToFixedValue(value)
  {
    if (Math.abs(value)<10) {
      value=utils.fillZeroAfterPointWithRound(value,2);
    }else {
      value=utils.fillZeroAfterPointWithRound(value,1);
    }
    return value;
  }
  _getYLabelValues(yValues,maxValue)
  {
    var yDayValues=[];
    if (this.props.step===1&&!this.props.isEnergyData) {
      var isFinded=false;
      yValues.forEach((item)=>{
        if (item===maxValue&&!isFinded) {
          yDayValues.push(this._getToFixedValue(maxValue));
          isFinded=true;
        }else {
          yDayValues.push('');
        }
      });
    }else if (this.props.step===0&&!this.props.isEnergyData) {
      yValues.forEach((item)=>{
        yDayValues.push(item||item===0?this._getToFixedValue(item):item);
      });
    }
    return yDayValues;
  }
  _getBarWidth()
  {
    if (this.props.step===1&&!this.props.isEnergyData) {
      return 0;
    }else if (this.props.step===0&&!this.props.isEnergyData) {
      return 0;
    }else if (this.props.step===1&&this.props.isEnergyData) {
      return 18;
    }else if (this.props.step===2&&this.props.isEnergyData) {
      return 50;
    }else if (this.props.step===3&&this.props.isEnergyData) {
      return 14;
    }else if (this.props.step===5&&this.props.isEnergyData) {
      return 34;
    }
  }
  _unshiftXItems(arrItems)
  {
    var item=arrItems.get(0);
    if (this.props.step===1&&!this.props.isEnergyData) {
      for (var i = 0; i < 6; i++) {
        arrItems=arrItems.unshift(Immutable.fromJS({'Time':item.get('Time'),'Value':null,'isInsert':true}));
        arrItems=arrItems.push(Immutable.fromJS({'Time':item.get('Time'),'Value':null,'isInsert':true}));
      }
    }else if (this.props.step===0&&!this.props.isEnergyData) {
      arrItems=arrItems.unshift(Immutable.fromJS({'Time':item.get('Time'),'Value':null,'isInsert':true}));
    }else if (this.props.step===1&&this.props.isEnergyData) {
      arrItems=arrItems.unshift(Immutable.fromJS({'Time':item.get('Time'),'Value':null,'isInsert':true}));
    }else if (this.props.step===2&&this.props.isEnergyData) {
      arrItems=arrItems.unshift(Immutable.fromJS({'Time':item.get('Time'),'Value':null,'isInsert':true}));
    }else if (this.props.step===3&&this.props.isEnergyData) {
      arrItems=arrItems.unshift(Immutable.fromJS({'Time':item.get('Time'),'Value':null,'isInsert':true}));
    }else if (this.props.step===5&&this.props.isEnergyData) {
      arrItems=arrItems.unshift(Immutable.fromJS({'Time':item.get('Time'),'Value':null,'isInsert':true}));
    }

    return arrItems;
  }
  _reCalculateMaxMinValue(maxValue,minValue)
  {
    var yInterval = ((maxValue - minValue) / 5.0);
    if (maxValue < 0) {
        // maxValue = maxValue + yInterval;
    }else
    {
        if (minValue < 0) {
            maxValue = maxValue / 0.7;
        }else
            maxValue =  maxValue / 0.7;//0.8;
    }
    yInterval = ((maxValue - minValue) / 5.0);
    if (minValue < 0) {
        minValue = minValue - yInterval;
    }else
    {
        minValue = 0;
    }
    yInterval = ((maxValue - minValue) / 5.0);
    if (maxValue < 0) {
        yInterval = ((maxValue - minValue) / 5.0);
    }
    if (yInterval > 2) {
        // yInterval = [self changeFloatToAccuracy:yInterval with:AccuracyTypeTen];
    }
    if (maxValue === 0 && minValue === 0) {
        maxValue = 500;
        yInterval = ((maxValue - minValue) / 5.0);
    }else if (maxValue === minValue) {
        maxValue = maxValue + 0.4*3;
        minValue = minValue - 0.6*3;
        yInterval = 0.199;
        // yInterval = [self changeFloatToAccuracy:yInterval with:AccuracyTypeThou];
    }else if (maxValue - minValue < 0.001)
    {
        maxValue = maxValue + 1;
        yInterval = 0.199;
    }else if ((maxValue - minValue < 3) && !this.props.isEnergyData)
    {
        for (var i = 0; i < 1000; i++) {
            maxValue = maxValue + yInterval;
            minValue = minValue - yInterval;
            yInterval = ((maxValue - minValue) / 5.0);
            if (maxValue - minValue >= 3 && maxValue>0) {
                // console.warn('maxValue - minValue < 3',maxValue - minValue,yInterval);
                break;
            }
        }
    }
    return {maxRange:maxValue,minRange:minValue};
  }
  _getPlotChar(datas)
  {
    if (!this.props.isEnergyData) {
      return(
        <VictoryLine
          style={{
            data: {
              stroke:GREEN,
              strokeWidth:2,
            },
            labels: {fontSize:12}
          }}
          data={datas}/>
      );
    }
    return(
      <VictoryBar
            data={datas}
            style={{
              data: {
                fill:GREEN,
                width:this._getBarWidth()
              }
            }}
          />
      );
  }
  _getPlotScatter(datas,arrPointsText,maxValue)
  {
    if (!this.props.isEnergyData) {
      return(
        <VictoryScatter
          width={400}
          height={300}
          standalone={false}
          style={{
            data: {
              fill: (data) => {
                return GREEN;
              }
            },
            labels: {
              fontFamily:'',
              fill:LINE_HISTORY,
              fontSize:12,
              padding:12
            }
          }}
          size={(data)=>{
            if (!data.y&&data.y!==0) {
              return 0;
            }else {
              if ((data.y===maxValue&&!this._alreadyShowMaxPointInDay)||this.props.step===0) {
                this._alreadyShowMaxPointInDay=true;
                return 4;
              }else {
                return 1;
              }
            }
          }}
          labels={arrPointsText}
          data={datas}
        />
        );
    }
    return null;
  }
  _getNoDatasView()
  {
    var text=this.props.isEnergyData?localStr('lang_asset_des25'):localStr('lang_asset_des26');
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontSize:17,color:GRAY}}>{localFormatStr('lang_asset_des24',text)}</Text>
      </View>
    );
  }
  _formatNumber(v,digit){
    if(v.indexOf('.') >= 0){
      return Number(v).toFixed(digit);
      // return unit.toFixed(Number(v),digit);
    }
    else {
      if (v>=1000&&v<1000000) {
        return (Number(v)/1000.0)+'k';
      }else if (v>=1000000&&v<1000000000) {
        return (Number(v)/1000000.0)+'m';
      }
      return v;
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.data!==nextProps.data||this.props.isFetching!==nextProps.isFetching) {
      return true;
    }
    return false;
  }
  render() {
    // console.warn('TicketSubView render listData...',this.props.isFetching,this.props.data);
    var lineDatas=this.props.data;
    if (this.props.isFetching) {
      return (<Loading />);
    }else {
      if (!lineDatas) {
        return this._getNoDatasView();
      }
    }
    var datas=[];
    var tickesIndex=[];
    // var yValues=[];
    var yNotFixedValues=[];
    var maxValue=0;
    var minValue=0;
    lineDatas=this._unshiftXItems(lineDatas);
    var hasNotNullValue=false;
    lineDatas.forEach((item,index)=>{
      var value=item.get('Value');
      datas.push({x:index,y:value});
      // yValues.push((value||value===0)?unit.toFixed(value,1):value);
      yNotFixedValues.push(value);

      if (this._checkShowXTickes(index,item.get('isInsert'),item.get('Time'))){
        tickesIndex.push(index);
      }
      if (value||value===0) {
          if (!hasNotNullValue) {
              maxValue=value;
              minValue=value;
              hasNotNullValue=true;
          }
          if (value > maxValue) {
              maxValue = value;
          }
          if (value < minValue) {
              minValue = value;
          }
      }
    });
    if (!hasNotNullValue||!lineDatas) {
      return this._getNoDatasView();
    }
    var showValue=Math.abs(maxValue)>=Math.abs(minValue)?maxValue:minValue;
    var arrLabelValues=this._getYLabelValues(yNotFixedValues,showValue);
    var {maxRange,minRange}=this._reCalculateMaxMinValue(maxValue,minValue);
    // console.warn(maxValue,minValue);
    var {width,height} = Dimensions.get('window');
    //5s:120,android:120
    // console.warn(width,height);
    var bottom=65;
    if(Platform.OS === 'ios' && height===320){
      bottom=130;
    }
    if (Platform.OS === 'android') {
      bottom=110;
    }
    this._alreadyShowMaxPointInDay=false;
    return (
      <VictoryChart
        width={width>height?width:height}
        padding={{left:50,right:25,top:20,bottom}}
        >
        <VictoryAxis
          style={{
            axis:{stroke:LINE_HISTORY,strokeWidth:0.5},
            ticks:{stroke:LINE_HISTORY,size:3,strokeWidth:0.5},
            tickLabels:{fontSize:12,fill:LINE_HISTORY,fontFamily:''},
          }}
          tickValues={tickesIndex}
          domain={[0, lineDatas.size]}
          tickFormat={(x) => {
            return this._getXTickesFormat(lineDatas.get(x).get('Time'),x,lineDatas.size);
          }}/>
        <VictoryAxis
          style={{
            axis:{stroke:LINE_HISTORY,strokeWidth:0.5},
            grid:{stroke:LINE_HISTORY,strokeWidth:0.5,strokeDasharray:"3,5"},
            tickLabels:{fontSize:12,fill:LINE_HISTORY,fontFamily:''},
          }}
          domain={[minRange, maxRange]}
          dependentAxis
          crossAxis={true}
          standalone={true}
          tickFormat={(y) =>{
            return this._formatNumber(String(y),1);
          }}
        />
      {this._getPlotChar(datas)}
      {this._getPlotScatter(datas,arrLabelValues,showValue)}
      </VictoryChart>
    );
  }
}

HistoryDataView.propTypes = {
  user:PropTypes.object,
  isFetching:PropTypes.bool,
  data:PropTypes.object,
  isEnergyData:PropTypes.bool,
  step:PropTypes.number,
}
