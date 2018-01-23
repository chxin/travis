'use strict'

import React,{Component} from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import Text from '../Text';
import ClickableRow from '../ClickableRow.js';
import {GRAY,BLACK,ALARM_RED} from '../../styles/color';
import moment from 'moment';
import Icon from '../Icon.js';
import TouchFeedback from '../TouchFeedback';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class MaintainRecordRow extends Component{
  constructor(props){
    super(props);
  }
  _getBuildingText(data){
    var path = data.get('Paths').toArray();
    return (path&&path.length>0)?path[0]:'';
  }
  _getPrimaryContent(data){
    return (
      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.alarmText}>{data.get('Parameter')+'aaafasdfasdfasdfasdfasfdaaafasdfasdfasdfasdfasfd'}</Text>
        <View style={{flexDirection:'row',marginTop:5}}>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text numberOfLines={1} style={[styles.locationText,{marginRight:16}]}>{data.get('DeviceName')}</Text>
          </View>
          <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
            <Text numberOfLines={1} style={[styles.locationText]}>{this._getBuildingText(data)+'fasdfasdfasdfasdfasffasdfasdfasdfasdfasf'}</Text>
          </View>
        </View>
      </View>
    )
  }
  _getTime(data){
    var time = moment(data.get('AlarmTime'));
    if(time.isSame(moment(),'day')){
      return time.format('HH:mm:ss');
    }
    else {
      return time.format('MM-DD');
    }
  }
  render(){
    var {rowData} = this.props;
    return (
      <TouchFeedback onLongPress={()=>this.props.onRowLongPress(rowData)} onPress={()=>this.props.onRowClick(rowData)}>
        <View style={[styles.row,styles.rowHeight]}>
          <View style={styles.rowLeft}>
            {this._getPrimaryContent(rowData)}
          </View>
          <View style={[{paddingTop:16,width:80},styles.rowHeight]}>
            <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}>
              <Text style={styles.timeText}>{this._getTime(rowData)}</Text>
            </View>
            <View style={{flex:1,flexDirection:'row'}}>
              <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}>
                <Text numberOfLines={1} style={[styles.timeText,{fontSize:14}]}>{'王凯王凯'}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchFeedback>
    );
  }
}

MaintainRecordRow.propTypes = {
  user:PropTypes.object,
  onRowClick:PropTypes.func.isRequired,
  rowData:PropTypes.object.isRequired,
  onRowLongPress:PropTypes.func.isRequired,
}

var styles = StyleSheet.create({
  rowHeight:{
    height:68
  },
  row:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:'white',
    padding:16,
    overflow:'hidden'
  },
  rowLeft:{
    flexDirection:'row',
    flex:1,
  },
  content:{
    flex:1,
    // backgroundColor:'red'
  },
  level:{
    width:44,
    height:44,
    borderRadius:22,
    marginRight:16,
    justifyContent:'center',
    alignItems:'center'
  },
  levelText:{
    fontSize:11,
    color:'white'
  },
  unSecuredAlarm:{
    backgroundColor:ALARM_RED
  },
  securedAlarm:{
    backgroundColor:GRAY
  },
  alarmText:{
    fontSize:16,
    color:BLACK
  },
  locationText:{
    fontSize:12,
    color:GRAY,
  },
  timeText:{
    fontSize:12,
    color:GRAY
  },
  iconTicket:{
    width:18,
    height:18,
    // paddingRight:10,
    justifyContent:'center',
    alignItems:'center'
  },
});
