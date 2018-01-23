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
import Icon from '../Icon.js';
import {GRAY,BLACK,ALARM_RED} from '../../styles/color';
import moment from 'moment';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class TicketRow extends Component{
  constructor(props){
    super(props);
  }
  _getTime(){
    var {rowData} = this.props;
    return localFormatStr('lang_ticket_finish_time_format',moment(rowData.get('StartTime')).format('MM-DD'),moment(rowData.get('EndTime')).format('MM-DD'));
  }
  _getContent(){
    var {rowData} = this.props;
    var content = rowData.get('Content');
    var strContent = '';
    content.split('\n').forEach((item)=>{
      strContent+=item;
      strContent+=' ';
    });
    return strContent;
  }
  _newText(){
    var {rowData} = this.props;
    var startTime = moment(rowData.get('StartTime')).format('YYYY-MM-DD');
    var endTime = moment(rowData.get('EndTime')).format('YYYY-MM-DD');
    var nowTime = moment().format('YYYY-MM-DD');
    var status = rowData.get('Status')|rowData.get('TicketStatus');
    var isExpire = false;
    if (status===1) {
      isExpire=startTime<nowTime;
    }else if (status===2) {
      isExpire=endTime<nowTime;
    }
    if (isExpire) {
      return(
        <View style={styles.expireView}>
          <Icon type='icon_over_due' size={18} color={ALARM_RED} />
          <Text style={styles.expireText}>{localStr('lang_ticket_expired')}</Text>
        </View>
      );
    }
    return null;
  }

  render(){
    var {rowData} = this.props;
    return (
      <ClickableRow currentRouteId={this.props.currentRouteId} onRowClick={()=>this.props.onRowClick(rowData)}>
        <View style={[styles.row,styles.rowHeight]}>
          <View style={styles.titleRow}>
            <View style={{flex:1}}>
              <Text style={styles.titleText} numberOfLines={1} lineBreakModel='charWrapping'>{
                  rowData.get('BuildingNames').filter((item)=>item).join('、')}</Text>
            </View>
            <Text style={styles.timeText}>{this._getTime()}</Text>
          </View>
          <View style={styles.contentRow}>
            <View style={{flex:1}}>
              <Text style={styles.contentText} numberOfLines={1} >{this._getContent()}</Text>
            </View>
            {this._newText()}
          </View>
        </View>
      </ClickableRow>
    );
  }
}

TicketRow.propTypes = {
  user:PropTypes.object,
  onRowClick:PropTypes.func.isRequired,
  rowData:PropTypes.object.isRequired,
  currentRouteId:PropTypes.string,
}

var styles = StyleSheet.create({
  rowHeight:{
    height:69
  },
  row:{
    backgroundColor:'transparent',
    padding:16,
    // justifyContent:'space-between'
  },
  titleRow:{
    flexDirection:'row',
    // backgroundColor:'red',
    flex:1,
    alignItems:'flex-start',
    justifyContent:'space-between',
  },
  titleText:{
    color:BLACK,
    fontSize:17
  },
  timeText:{
    color:GRAY,
    fontSize:12,
    marginLeft:6,
    marginTop:3,
  },
  expireText:{
    color:ALARM_RED,
    fontSize:12,
    marginLeft:6,
    marginTop:3,
  },
  expireView:{
    borderRadius:1,
    flexDirection:'row',
    // backgroundColor:'gray',
    justifyContent:'flex-start',
    alignItems:'center'
  },
  contentRow:{
    flex:1,
    marginTop:8,
    alignItems:'flex-start',
    flexDirection:'row',
  },
  contentText:{
    color:GRAY,
    fontSize:12
  },


});
