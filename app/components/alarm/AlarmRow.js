'use strict'

import React,{Component} from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import Text from '../Text';
// import TouchFeedback from '../TouchFeedback';
import ClickableRow from '../ClickableRow.js';
import {GRAY,BLACK,ALARM_RED} from '../../styles/color';
import moment from 'moment';
import Icon from '../Icon.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class AlarmRow extends Component{
  constructor(props){
    super(props);
  }
  _getLevelText(data){
    var level = data.get('Level'),secureTime = data.get('SecureTime');
    var ret = {text:level,style:null};
    if(level === 3){
      ret.text = localStr('lang_alarm_highdes');
    }
    else if (level === 2) {
      ret.text = localStr('lang_alarm_midddes');
    }
    else {
      ret.text = localStr('lang_alarm_lowdes');
    }
    if(secureTime){
      ret.style=styles.securedAlarm;
    }
    else {
      ret.style=styles.unSecuredAlarm;
    }

    return ret;
  }
  _getLevelView(data){
    var level = this._getLevelText(data);
    return (
      <View style={[styles.level,level.style]}>
        <Text style={styles.levelText}>{level.text}</Text>
      </View>
    )
  }
  _getBuildingText(data){
    var path = data.get('Paths').toArray();
    return (path&&path.length>0)?path[0]:'';
  }
  _getPrimaryContent(data){
    return (
      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.alarmText}>{data.get('Parameter')}</Text>
        <View style={{flexDirection:'row',marginTop:6}}>
          <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
            <Icon type="icon_machine_ol" color={GRAY} size={10} />
            <Text numberOfLines={1} style={[styles.locationText,{marginRight:16}]}>{data.get('DeviceName')}</Text>
          </View>
          <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
            <Icon type="icon_build_location" color={GRAY} size={10} />
            <Text numberOfLines={1} style={[styles.locationText]}>{this._getBuildingText(data)}</Text>
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
  _getTicketIcon(rowData){
    var iconTicket = null;
    if (rowData.get('TicketId')) {
      iconTicket=(
        <View style={styles.iconTicket}>
          <Icon type='icon_alarm_ticket' size={18} color={GRAY} />
        </View>
      );
    }
    return iconTicket;
  }
  render(){
    var {rowData} = this.props;
    return (
      <ClickableRow onRowClick={()=>this.props.onRowClick(rowData)}>
        <View style={[styles.row,styles.rowHeight]}>
          <View style={styles.rowLeft}>
            {this._getLevelView(rowData)}
            {this._getPrimaryContent(rowData)}
          </View>
          <View style={[{paddingTop:16,},styles.rowHeight]}>
            <View style={{flex:1,flexDirection:'row'}}>
              <Text style={styles.timeText}>{this._getTime(rowData)}</Text>
            </View>
            <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}>
              {this._getTicketIcon(rowData)}
            </View>
          </View>
        </View>
      </ClickableRow>
    );
  }
}

AlarmRow.propTypes = {
  user:PropTypes.object,
  onRowClick:PropTypes.func.isRequired,
  rowData:PropTypes.object.isRequired,
}

var styles = StyleSheet.create({
  rowHeight:{
    height:69
  },
  row:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:'transparent',
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
    fontSize:17,
    color:BLACK
  },
  locationText:{
    fontSize:12,
    color:GRAY,
    marginLeft:3,
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
