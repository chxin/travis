
'use strict';
import React,{Component} from 'react';
import {
  View,
  Platform,
  StyleSheet,
  DatePickerAndroid,
  DatePickerIOS,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';

import moment from 'moment';
import Toolbar from '../Toolbar';
import Button from '../Button.js';
import Bottom from '../Bottom.js';
import {BLACK,GRAY,GREEN,LINE,LIST_BG} from '../../styles/color';
import Text from '../Text';
import TouchFeedback from '../TouchFeedback';
import Icon from '../Icon.js';
import ListSeperator from '../ListSeperator';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class CreateTicketView extends Component{
  constructor(props){
    super(props);
    this.state = {rowType:'',openDatePicker:false};
  }
  async _showPicker(type) {
    if(Platform.OS === 'android'){
      try {
        console.warn('_showPicker,type',type);
        var value = undefined;
        if (type==='StartTime') {
          value = this.props.data.get('StartTime') || undefined;
        }else if (type==='EndTime') {
          value = this.props.data.get('EndTime') || undefined;
        }
        var date = moment(value);
        var options = {date:date.toDate()}
        var {action, year, month, day} = await DatePickerAndroid.open(options);
        // console.warn('date',year,month,day);
        if (action !== DatePickerAndroid.dismissedAction) {
          var date = moment({year,month,day,hour:8});//from timezone
          // console.warn('moment',date);
          this.props.onDateChanged(type,date.toDate());
        }

      } catch ({code, message}) {
        // console.warn(`Error in example '${stateKey}': `, message);
      }
    }
  }
  _getDatePicker(dateType){
    var type = this.state.rowType;
    if(Platform.OS === 'ios' && this.state.openDatePicker && type===dateType){
      var value = undefined;
      if (type==='StartTime') {
        value = this.props.data.get('StartTime') || undefined;
      }else if (type==='EndTime') {
        value = this.props.data.get('EndTime') || undefined;
      }
      var date = moment(value);

      return (
        <DatePickerIOS style={{borderTopWidth:1,borderColor:LINE}} date={date.toDate()} mode="date"
          onDateChange={(date1)=>{
              this.props.onDateChanged(type,date1);
            }} />
      );
    }
    return null;
  }
  _getNavIcon(isNav){
    if(isNav){
      return (
        <Icon type='arrow_right' size={16} color={GRAY} />
      )
    }
  }
  _getSelectIcon(isSelect){
    if(!!isSelect){
      return (
        <View style={styles.selectView}>
          <Icon type='icon_check' size={10} color='white' />
        </View>
      )
    }else {
      return (
        <View style={styles.unSelectView}>
        </View>
      )
    }
  }
  _getToolbar(data){
    var actions = null;
    if(data){
      var status = data.get('Status');
      var type = data.get('TicketType');

      if(status !== 2 && status !== 3 && type !== 1 && type !== 2){
        actions = [{
        title:localStr('lang_ticket_remove'),
        iconType:'delete',
        show: 'always', showWithText: false}];
      }
    }
    return (
      <Toolbar title={this.props.title}
        navIcon="back"
        onIconClicked={()=>this.props.onBack()}
        actions={actions}
        onActionSelected={[this.props.onDeleteTicket]}
      />
    );
  }
  _getCustomerRow()
  {
    return this._getSimpleRow({'title':localStr('lang_ticket_customer_name'),'value':this.props.customer.get('CustomerName'),'isNav':false});
  }
  _getStartTimeRow()
  {
    return this._getSimpleRow({'title':localStr('lang_ticket_start_time'),'value':this.props.data.get('StartTime'),'isNav':false,type:'StartTime'});
  }
  _getEndTimeRow()
  {
    return this._getSimpleRow({'title':localStr('lang_ticket_end_time'),'value':this.props.data.get('EndTime'),'isNav':false,type:'EndTime'});
  }
  _getAssetsRow()
  {
    var arrAssets = this.props.data.get('Assets');
    var value = localStr('lang_ticket_please_choice');
    if (arrAssets && arrAssets.size >= 1) {
      value = arrAssets.map((item)=>item.get('Name')).join(',');
    }
    return this._getSimpleRow({'title':localStr('lang_ticket_asset_range'),'value':value,'isNav':!this.props.isAlarm,'type':'Assets'});
  }
  _getExecutersRow()
  {
    var arrUsers = this.props.data.get('Executors');
    var value = localStr('lang_ticket_please_choice');
    if (arrUsers && arrUsers.size >= 1) {
      value = arrUsers.map((item)=>item.get('RealName')).join(',');
    }
    return this._getSimpleRow({'title':localStr('lang_ticket_executer'),'value':value,'isNav':true,'type':'Executors'});
  }
  _getDescriptionRow()
  {
    var strDes = localStr('lang_ticket_input_detail');
    var content = this.props.data.get('Content');
    strDes = content&&content.length>0?content:strDes;
    return this._getSimpleRow({'title':localStr('lang_ticket_ticket_tash'),'value':strDes,'isNav':true,'type':'Content'});
  }
  _getTicketTypeRow()
  {
    var type = this.props.data.get('TicketType');
    var arrTicketTypes = [{'title':localStr('lang_ticket_scene'),'value':'','isSelect':type===4,'type':4},
                {'title':localStr('lang_ticket_random'),'value':'','isSelect':type===3,'type':3}];
    var rowData = {'title':localStr('lang_ticket_ticket_type'),'value':arrTicketTypes,'isNav':false,'type':'TicketType'};
    var value = rowData.value;
    if (this.props.ticketInfo||this.props.isAlarm) {
      var ticketValue = '';
      switch (type) {
        case 1:
          ticketValue=localStr('lang_ticket_ticket_planning');
          break;
        case 2:
          ticketValue=localStr('lang_ticket_ticket_alarm');
          break;
        case 3:
            ticketValue=localStr('lang_ticket_ticket_folow');
          break;
        case 4:
          ticketValue=localStr('lang_ticket_ticket_scene');
          break;
        default:
      }
      return this._getSimpleRow({'title':localStr('lang_ticket_ticket_type'),'value':ticketValue,'isNav':false,'type':'TicketType'});
    }
    return (
        <View style={[styles.row,styles.rowHeight]}>
          <Text style={styles.titleText}>
            {rowData.title}
          </Text>
          <View style={{flexDirection:'row',justifyContent: 'flex-end'}}>
            <TouchFeedback style={[{justifyContent:'flex-end',flexDirection:'row'}]} onPress={()=>{
                  this.props.onTicketTypeSelect(rowData.type,4)
                }}>
              <View style={{alignItems:'center',flexDirection:'row',padding:10}}>
                {this._getSelectIcon(value[0].isSelect)}
                <Text numberOfLines={1} style={[styles.valueText,{marginRight:10}]}>
                  {value[0].title}
                </Text>
              </View>
            </TouchFeedback>
            <TouchFeedback style={[{justifyContent:'center',flexDirection:'row'}]} onPress={()=>{
                this.props.onTicketTypeSelect(rowData.type,3)
              }}>
              <View style={{alignItems:'center',flexDirection:'row'}}>
                {this._getSelectIcon(value[1].isSelect)}
                <Text numberOfLines={1} style={styles.valueText}>
                  {value[1].title}
                </Text>
              </View>
            </TouchFeedback>
          </View>
        </View>
    );
  }
  _getSection()
  {
    return (<View style={{
        borderColor:LIST_BG,
        borderBottomWidth:20,
        }}>
      {}
    </View>);
  }
  _getSimpleRow(rowData){
    var value = rowData.value;
    return (
      <TouchFeedback style={[{backgroundColor:'white'},styles.rowHeight]} onPress={()=>{
        if(rowData.isNav){
          this.props.onRowClick(rowData.type);
          this.setState({
            openDatePicker:false,
          });
        }else if (rowData.type==='StartTime'||rowData.type==='EndTime') {
            var enableEditStartTime = this.props.ticketInfo?this.props.ticketInfo.get('Status')<2:true;
            if (rowData.type==='EndTime'||enableEditStartTime) {
              this.setState({
                rowType:rowData.type,
                openDatePicker:!this.state.openDatePicker,
              });
              this._showPicker(rowData.type);
              this.props.onRowClick(rowData.type)
            }
          }}}>
        <View style={[styles.row,styles.rowHeight]}>
          <Text style={styles.titleText}>
            {rowData.title}
          </Text>
          <View style={{flex:1,alignItems:'center', justifyContent:'flex-end', flexDirection:'row',marginLeft:16}}>
            <Text numberOfLines={1} lineBreakModel='charWrapping' style={[styles.valueText,{flex:1,}]}>
              {value}
            </Text>
            {this._getNavIcon(rowData.isNav)}
          </View>
        </View>
      </TouchFeedback>
    );
  }
  _getBottomButton()
  {
    // if (this.state.openDatePicker) {
    //   return null;
    // }else {
      return(
        <Bottom height={72} backgroundColor={LIST_BG} borderColor={LIST_BG}>
          <Button
            style={[styles.button,{
              backgroundColor:GREEN,
            }]}
            disabledStyle={[styles.button,{
                backgroundColor:GRAY,
              }]
            }
            textStyle={{
              fontSize:15,
              color:'#ffffff'
            }}
            disabled={!this.props.isEnableCreate}
            text={localStr('lang_ticket_save')} onClick={this.props.onCreateTicket} />
        </Bottom>
      );
    // }
  }
  render() {
    if (!this.props.data) {
      return (
        <View style={{flex:1,backgroundColor:'white'}}>
          {this._getToolbar(this.props.ticketInfo)}
        </View>
      );
    }
    return (
      <View style={{flex:1,backgroundColor:LIST_BG}}>
        {this._getToolbar(this.props.ticketInfo)}

        <ScrollView style={[styles.wrapper]}>
          {this._getSection()}
          <ListSeperator/>
            {this._getCustomerRow()}
            <ListSeperator/>
            {this._getTicketTypeRow()}
            <ListSeperator/>

          {this._getSection()}
          <ListSeperator/>
            {this._getStartTimeRow()}
            {this._getDatePicker('StartTime')}
          <ListSeperator/>
            {this._getEndTimeRow()}
            {this._getDatePicker('EndTime')}
          <ListSeperator/>

          {this._getSection()}
          <ListSeperator/>
            {this._getAssetsRow()}
            <ListSeperator/>
            {this._getExecutersRow()}
            <ListSeperator/>
            {this._getDescriptionRow()}
          <ListSeperator/>
        </ScrollView>
        {this._getBottomButton()}
      </View>
    );
  }
}

CreateTicketView.propTypes = {
  navigator:PropTypes.object,
  title:PropTypes.string,
  onBack:PropTypes.func.isRequired,
  onRowClick:PropTypes.func.isRequired,
  onDateChanged:PropTypes.func.isRequired,
  onTicketTypeSelect:PropTypes.func.isRequired,
  // isFetching:PropTypes.bool.isRequired,
  isPosting:PropTypes.number,
  data:PropTypes.object,
  onRefresh:PropTypes.func.isRequired,
  onCreateTicket:PropTypes.func.isRequired,
  onDeleteTicket:PropTypes.func.isRequired,
  customer:PropTypes.object.isRequired,
  isEnableCreate:PropTypes.bool.isRequired,
  isAlarm:PropTypes.bool,
  ticketInfo:PropTypes.object,
}

var styles = StyleSheet.create({
  button:{
    height:48,
    flex:1,
    marginHorizontal:16,
    borderRadius:6,
  },
  rowHeight:{
    height:49,
  },
  row:{
    flexDirection:'row',
    alignItems:'center',
    // flex:1,
    backgroundColor:'white',
    justifyContent:'space-between',
    paddingHorizontal:16,
  },
  titleText:{
    fontSize:17,
    color:BLACK,
    // flex:1,
    // backgroundColor:'white',
  },
  valueText:{
    textAlign:'right',
    marginLeft:10,
    fontSize:17,
    color:GRAY
  },

  selectView:{
    width:18,
    height:18,
    borderRadius:10,
    backgroundColor:GREEN,
    // paddingRight:10,
    justifyContent:'center',
    alignItems:'center'
  },
  unSelectView:{
    width:18,
    height:18,
    borderRadius:10,
    borderColor:GRAY,
    borderWidth:1,
    // marginRight:16,
    justifyContent:'center',
    alignItems:'center'
  },
});
