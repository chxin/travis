
'use strict';
import React,{Component} from 'react';

import {
  View,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';

import Toolbar from '../Toolbar';

import Text from '../Text';
import {GRAY,BLACK,TAB,TAB_BORDER,GREEN,TICKET_STATUS,LINE} from '../../styles/color';
import moment from 'moment';
import ListSeperator from '../ListSeperator';
import Button from '../Button';
// import TicketRow from './TicketRow.js';
import MoreContent from './MoreContent';
import LabelValue from './LabelValue';
import TouchFeedback from '../TouchFeedback';
import NetworkImage from '../NetworkImage';
import Icon from '../Icon.js';
import Bottom from '../Bottom.js';
import Loading from '../Loading';
import privilegeHelper from '../../utils/privilegeHelper.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

moment.locale('zh-cn');

export default class TicketDetail extends Component{
  constructor(props){
    super(props);
    this.state = {toolbarOpacity:0,showToolbar:false,forceStoped:false};
  }
  _getImageHeader(){
    var {rowData} = this.props;
    var buildingKey = rowData.getIn(['Assets',0,'BuildingPictureKey']);
    var {width} = Dimensions.get('window');
    var height = parseInt(width*2/3);
    return (
      <NetworkImage
        defaultSource = {require('../../images/building_default/building.png')}
        width={width}
        height={height}
        name={buildingKey}>
        <View style={{
            flex:1,
            justifyContent:'flex-end'}}>
            <ImageBackground
              resizeMode="stretch"
              style={{justifyContent:'flex-end',
                width,height,paddingBottom:28,paddingHorizontal:16}}
              source={require('../../images/black_gradient/gradient.png')} >
              <Text style={{marginBottom:11,fontSize:12,color:'white'}}>
                {localStr('lang_ticket_asset_position')}
              </Text>
              <Text numberOfLines={1} style={{fontSize:20,color:'white'}}>
                {rowData.get('BuildingNames').join('、')}
              </Text>
            </ImageBackground>

        </View>
      </NetworkImage>
    );
  }
  _getStatusView(){
    var {rowData} = this.props;
    var startTime = rowData.get('ActualStartTime') || '',
        endTime = rowData.get('ActualEndTime') || '';
    var text = '',textView = null,type='ticket_notstart';
    if(startTime){
      startTime = moment(startTime).format('YYYY-MM-DD HH:mm');
    }
    if(endTime){
      endTime = moment(endTime).format('YYYY-MM-DD HH:mm');
    }
    if(startTime || endTime){
      if(!endTime){
        text = localFormatStr('lang_ticket_start_time_format',startTime);
        type = 'ticket_processing';
      }
      else {
        text = localFormatStr('lang_ticket_finish_time_format',startTime,endTime);
        type = 'ticket_finished';
      }
      textView = (
        <Text style={{marginTop:8}}>{text}</Text>
      );
    }


    return (
      <View style={styles.statusRow}>
        <Icon type={type} size={24} color={BLACK} />
        <View style={{flex:1,marginLeft:32}}>
          <Text style={styles.statusText}>{TicketDetail.getStatusText(rowData)}</Text>
          {textView}
        </View>

      </View>
    );
  }
  _getAssetView(){
    var {rowData} = this.props;
    var content = rowData.get('AssetNames').join('\n');
    return (
      <MoreContent style={styles.moreContent} title={localStr('lang_ticket_asset_range')} content={content}/>
    );
  }
  _getTaskView(){
    var {rowData} = this.props;

    return (
      <MoreContent style={styles.moreContent} title={localStr('lang_ticket_task_des')} content={rowData.get('Content')} />
    );
  }
  _getTimeView(){
    var {rowData} = this.props;
    var startTime = moment(rowData.get('StartTime')).format('YYYY-MM-DD'),
        endTime = moment(rowData.get('EndTime')).format('YYYY-MM-DD');
    var executor = rowData.get('ExecutorNames').join('、');
    var documents = rowData.get('Documents').map((item)=> {return {name:item.get('DocumentName'),id:item.get('DocumentId'),size:item.get('Size')}}).toArray();
    var content = [
      {label:localStr('lang_ticket_run_time'),value:localFormatStr('lang_ticket_finish_time_format',startTime,endTime)},
      {label:localStr('lang_ticket_executer'),value:executor},
      {label:localStr('lang_ticket_document'),value:documents}
    ];
    var style={marginHorizontal:16,marginBottom:16};
    if (Platform.OS === 'ios') {
      style={marginHorizontal:16,marginBottom:8,marginTop:8};
    }
    return (
      <View style={style}>
        {
          content.map((item,index) => {
            return (
              <LabelValue key={index} style={{}} label={item.label} value={item.value} forceStoped={this.state.forceStoped}/>
            )
          })
        }
      </View>
    )

  }
  _getUserView(){
    var {rowData} = this.props;
    var type = rowData.get('TicketType');
    if(type === 1){
      type = localStr('lang_ticket_ticket_planning');
    }
    else if (type === 2) {
      type = localStr('lang_ticket_ticket_alarm');
    }
    else if (type === 3) {
      type = localStr('lang_ticket_ticket_folow');
    }
    else if (type === 4) {
      type = localStr('lang_ticket_ticket_scene');
    }
    var content = [
      {label:localStr('lang_ticket_create_user'),value:rowData.get('CreateUserName')},
      {label:localStr('lang_alarm_type'),value:type},
      {label:'ID',value:rowData.get('TicketNum')}
    ];
    var style={marginHorizontal:16,marginBottom:16};
    if (Platform.OS === 'ios') {
      style={marginHorizontal:16,marginBottom:8,marginTop:8};
    }
    return (
      <View style={style}>
        {
          content.map((item,index) => {
            return (
              <LabelValue key={index} style={{}} label={item.label} value={item.value} />
            )
          })
        }
      </View>
    )
  }
  _getLogView(){
    var {rowData} = this.props;
    var status = rowData.get('Status');
    if(status < 2){ //未开始和已完成，不能上传日志
      return null;
    }
    var count = '';
    // if(this.props.logCount > 0){
      count = this.props.logCount;
    // }
    return (
      <View style={{height:56}}>
        <TouchFeedback style={{flex:1}} onPress={this.props.ticketLog}>
          <View style={
              {flex:1,
                justifyContent:'space-between',
                flexDirection:'row',
                alignItems:'center',
                paddingHorizontal:16}}>
            <Text style={{fontSize:17,color:BLACK}}>{localStr('lang_ticket_ticket_log')}</Text>
            <View style={{flexDirection:'row',alignItems:'center'}}>
              <Text style={{fontSize:16,color:GRAY,marginRight:4}}>{count}</Text>
              <Icon type='arrow_right' size={16} color={GRAY} />
            </View>
          </View>
        </TouchFeedback>
        <ListSeperator />
      </View>
    );
  }
  _getButton(isScollView){
    var startTime = moment(this.props.rowData.get('StartTime')).format('YYYY-MM-DD');
    var nowTime = moment().format('YYYY-MM-DD');
    if(!privilegeHelper.hasAuth('TicketExecutePrivilegeCode') || startTime > nowTime){
      return null;
    }
    var status = this.props.rowData.get('Status');
    if(status === 1 && !isScollView){
      return (
        <Bottom borderColor={LINE} height={74}>
          <Button
            style={[styles.button,{
              backgroundColor:GREEN,
            }]}
            textStyle={{
              fontSize:15,
              color:'#ffffff'
            }}
            text={localStr('lang_ticket_start_execute')} onClick={() => this.props.execute(this.props.rowData.get('Id'))} />
        </Bottom>
      );
    }
    if(status === 2 && !isScollView){
      return (
        <Bottom borderColor={LINE} height={74}>
          <Button
            style={[styles.button,{
              backgroundColor:GREEN,
            }]}
            textStyle={{
              fontSize:15,
              color:'#ffffff'
            }}
            text={localStr('lang_ticket_finish_ticket')} onClick={() => this.props.finish(this.props.rowData.get('Id'))} />
        </Bottom>
      );
    }else if (status === 2 && isScollView) {
      <View style={{
          flex:1,
          height:72,paddingHorizontal:16,paddingVertical:13}}>
        <Button
          style={[styles.button,{
            backgroundColor:GREEN,
          }]}
          textStyle={{
            fontSize:15,
            color:'#ffffff'
          }}
          text={localStr('lang_ticket_finish_ticket')} onClick={() => this.props.finish(this.props.rowData.get('Id'))} />
      </View>
    }
    return null;
  }
  _onScroll(e){
    // console.warn('scroll',e);
  }
  _getToolbar(data){
    var actions = null;
    if(data){
      var status = data.get('Status');
      if(status !== 3){
        actions = [{
        title:localStr('lang_ticket_ticket_edit'),
        code:'TicketEditPrivilegeCode',
        iconType:'edit',
        show: 'always', showWithText: false}];
      }
    }

    return (
        <Toolbar
          title={localStr('lang_ticket_ticket_detail')}
          navIcon="back"
          onIconClicked={()=>{
            this.props.onBack();
            this.setState({forceStoped:true});
          }}
          actions={actions}
        onActionSelected={[this.props.onEditTicket]} />
    );
  }
  static getStatusText(rowData) {
    var status = rowData.get('Status'),statusText='';
    if(status === 1){
      statusText = localStr('lang_ticket_not_start');
    }
    else if (status === 2) {
      statusText = localStr('lang_ticket_going');
    }
    else {
      statusText = localStr('lang_ticket_finished');
    }
    return statusText;
  }
  render() {
    if(!this.props.isFetching && this.props.errorMessage){
      return  (
        <View style={{flex:1,backgroundColor:'white'}}>
          {this._getToolbar(this.props.rowData)}
          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Text style={{fontSize:17,color:GRAY}}>{this.props.errorMessage}</Text>
          </View>
        </View>
      )
    }
    if(this.props.isFetching || !this.props.rowData){
      return  (
        <View style={{flex:1,backgroundColor:'white'}}>
          {this._getToolbar(this.props.rowData)}
          <Loading />
        </View>
      )
    }

    var marginBottom = {marginBottom:bottomHeight};
    // var status = this.props.rowData.get('Status');

    //已完成工单没有按钮，已开始按钮，在scrollview内，如果没有权限，按钮也不显示
    var bottomButton = this._getButton(false);
    // if(status === 3 || status === 2){
    //   marginBottom = null;
    // }
    if(!bottomButton){
      marginBottom = null;
    }

    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        {this._getToolbar(this.props.rowData)}
        <ScrollView style={[styles.wrapper,marginBottom]} onScroll={(e)=>this._onScroll(e)}>
          {this._getImageHeader()}
          {this._getStatusView()}
          <ListSeperator />
          {this._getLogView()}
          {this._getAssetView()}
          <ListSeperator />
          {this._getTaskView()}
          <ListSeperator />
          {this._getTimeView()}
          <ListSeperator />
          {this._getUserView()}
          <ListSeperator />
        </ScrollView>
        {bottomButton}
      </View>
    );
  }
}

TicketDetail.propTypes = {
  onBack:PropTypes.func,
  onEditTicket:PropTypes.func,
  execute:PropTypes.func,
  finish:PropTypes.func,
  ticketLog:PropTypes.func,
  isFetching:PropTypes.bool,
  logCount:PropTypes.number,
  rowData:PropTypes.object,//immutable
  errorMessage:PropTypes.string,
}
var bottomHeight = 72;

var styles = StyleSheet.create({
  statusRow:{
    height:69,
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:16,
    backgroundColor:TICKET_STATUS
  },
  statusText:{
    fontSize:17,
    color:BLACK
  },
  moreContent:{
    margin:16,
    backgroundColor:'white'
  },
  bottom:{
    position:'absolute',
    left:0,
    right:0,
    bottom:0,
    flex:1,
    height:bottomHeight,
    borderTopWidth:1,
    borderColor:TAB_BORDER,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:TAB
  },
  button:{
    // marginTop:20,
    height:48,
    flex:1,
    marginHorizontal:16,
    borderRadius:6,

  },
  wrapper:{
    flex:1,
    // marginTop:-56,
    // position:'absolute',
    //
    // top:0,
    // bottom:0,
    // left:0,right:0,
    // backgroundColor:'transparent',
  },
});
