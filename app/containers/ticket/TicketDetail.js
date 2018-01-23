
'use strict';
import React,{Component} from 'react';
import {
  InteractionManager,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';
import TicketDetailView from '../../components/ticket/TicketDetail';
import TicketLog from './TicketLog.js';
import {execute,finish,loadTicketById,resetTicket} from '../../actions/ticketAction.js';
import CreateTicket from '../ticket/CreateTicket.js';
import Immutable from 'immutable';
import Toast from 'react-native-root-toast';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

import Orientation from 'react-native-orientation';

class TicketDetail extends Component{
  static contextTypes = {
    showSpinner: PropTypes.func,
    hideHud: PropTypes.func
  }
  constructor(props){
    super(props);
    this.state = {ready:false};
    this.props.resetTicket();
    // const init = Orientation.getInitialOrientation();
    // console.warn(init);
    // Orientation.lockToLandscapeRight();
  }
  _execute(id){
    Alert.alert(
      '',
      localStr('lang_ticket_start_notice0'),
      [
        {text: localStr('lang_ticket_cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: localStr('lang_ticket_start_execute'), onPress: () => {
          // this.context.showSpinner();

          this.props.execute(id);
          this.props.onPostingCallback();
        }}
      ]
    )
  }
  _finish(id){
    Alert.alert(
      '',
      localStr('lang_ticket_finish_notice1'),
      [
        {text: localStr('lang_ticket_cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: localStr('lang_ticket_finish_ticket'), onPress: () => {
          // this.context.showSpinner();
          this.props.finish(id);
          this.props.onPostingCallback();
        }}
      ]
    )
  }
  _gotoLog(){
    this.props.navigator.push({
      id:'ticket_log',
      component:TicketLog,
      passProps:{
        ticketId:this.props.rowData.get('Id'),
        canEdit:this.props.rowData.get('Status')===2,
      }
    });
  }
  _loadTicket(ticketId,isHex){
    this.props.loadTicketById(ticketId,null,isHex);
  }
  _onPostingCallback(type){
    console.warn('TicketDetail will to pop...',type);
    InteractionManager.runAfterInteractions(() => {
      if(type === 'delete'){
        if (this.props.fromFilterResult) {
          this.props.onPostingCallback(type);
          this.props.navigator.popToRoute(this.props.lastRoute);
        }else {
          this.props.navigator.popToTop();
        }
      }
      else{
        var arrRoutes = this.props.navigator.getCurrentRoutes();
        console.warn('TicketDetail...._loadticket',this.props.ticketId,this.props.fromHex,arrRoutes,this.props.rowData);
        this._loadTicket(String(this.props.rowData.get('Id')));
        // this._loadticket(this.props.ticketId,this.props.fromHex);

        // this.props.loadTicketById(this.props.ticketId,null,this.props.fromHex);

        this.props.onPostingCallback(type);

        this.props.navigator.pop();
      }
    });
  }
  _editTicket(){
    this.props.navigator.push({
      id:'ticket_create',
      component:CreateTicket,
      passProps:{
        customer:Immutable.fromJS({
          CustomerId:this.props.rowData.get('CustomerId'),
          CustomerName:this.props.rowData.get('CustomerName'),
        }),
        alarm:null,
        ticketInfo:this.props.rowData,
        onPostingCallback:(type)=>{this._onPostingCallback(type)},
      }
    });

  }
  componentDidMount() {
    backHelper.init(this.props.navigator,this.props.route.id);
    // Orientation.lockToLandscape();
    InteractionManager.runAfterInteractions(() => {
      if(!this.props.rowData){
        // console.warn('componentDidMount...',this.props.ticketId,this.props.fromHex);
        this._loadTicket(this.props.ticketId,this.props.fromHex);
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    // if(nextProps.isFetching === false){
      // console.warn('hideHud',new Date().getTime());
      // this.context.hideHud();
    // }
    // if(nextProps.isFetching === true){
    //   // console.warn('showSpinner',new Date().getTime());
    //   this.context.showSpinner();
    // }
    var status = 1;
    if (this.props.rowData) {
      status = this.props.rowData.get('Status');
    }
    if (nextProps.isFinish && status===2) {
      this.props.onPostingCallback('finish');
    }
    if (this.props.rowData && nextProps.rowData&&this.props.rowData.get('Status')===1&&nextProps.rowData.get('Status')===2) {
      Toast.show(localStr('lang_ticket_start_notice1'), {
          duration: 5000,
          position: -80,
      });
    }
  }
  componentWillUnmount() {
    // Orientation.lockToPortrait();
    backHelper.destroy(this.props.route.id);
    this.props.resetTicket();
  }
  render() {
    return (
      <TicketDetailView
        isFetching={this.props.isFetching}
        rowData={this.props.rowData}
        logCount={this.props.logCount}
        execute={(id)=>this._execute(id)}
        finish={(id)=>this._finish(id)}
        ticketLog={()=>this._gotoLog()}
        errorMessage={this.props.errorMessage}
        onBack={()=>{
          var arrRoutes = this.props.navigator.getCurrentRoutes();
          var currCount=0;
          arrRoutes.forEach((item)=>{
            if (item.id==='ticket_detail') {
              currCount++;
            }
          });
          if (currCount>1) {
            this.props.navigator.popToTop();
          }else {
            this.props.navigator.pop();
          }
          // if (this.props.fromFilterResult) {
          //   this.props.navigator.popToRoute('ticket_filter_result');
          // }else if (this.props.fromAlarm) {
          //   this.props.navigator.popToRoute('alarm_detail');
          // }else if (this.props.fromHex) {
          //   this.props.navigator.popToRoute('ticket');
          // }else {
            // this.props.navigator.pop();
          // }
        }}
        onEditTicket={(id)=>this._editTicket(id)}/>
    );
  }
}

TicketDetail.propTypes = {
  navigator:PropTypes.object,
  route:PropTypes.object,
  lastRoute:PropTypes.object,
  user:PropTypes.object,
  logCount:PropTypes.number,
  loadTicketById:PropTypes.func.isRequired,
  resetTicket:PropTypes.func.isRequired,
  ticketId:PropTypes.string.isRequired,
  isFetching:PropTypes.bool,
  isFinish:PropTypes.bool,
  execute:PropTypes.func.isRequired,
  finish:PropTypes.func.isRequired,
  rowData:PropTypes.object,//immutable
  onPostingCallback:PropTypes.func,
  fromHex:PropTypes.bool,
  fromFilterResult:PropTypes.bool,
  fromAlarm:PropTypes.bool,
  errorMessage:PropTypes.string,
}

function mapStateToProps(state,ownProps) {
  // var id = ownProps.ticketId;
  var rowData = null;
  var ticket = state.ticket.ticket;
  var data = ticket.get('data');
  var ticketFirstId=ticket.get('ticketFirstId');
  var isFinish = false;
  var fromHex = ownProps.fromHex;
  var errorMessage=ticket.get('errorMessage');
  // if (data) {
  //   console.warn('data.getId',data.get('Id'));
  // }
  if(data){
    if ((String(ticketFirstId)===ownProps.ticketId||ticketFirstId===String(data.get('Id')))) {
      rowData = data;
      isFinish = !!data.get('isFinishing');
      fromHex = false;
    }
    // else {
    //   rowData=null;
    //   isFinish = !!data.get('isFinishing');
    //   fromHex = false;
    // }
  }
  // console.warn('mapStateToProps...',ticketFirstId,ownProps.ticketId,errorMessage);
  return {
    user:state.user.get('user'),
    isFetching:ticket.get('isFetching'),
    logCount:ticket.get('logCount'),
    isFinish,
    rowData,
    fromHex,
    errorMessage,
  };
}
export default connect(mapStateToProps,{execute,finish,loadTicketById,resetTicket})(TicketDetail);
