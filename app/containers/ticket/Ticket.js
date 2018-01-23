
'use strict';
import React,{Component} from 'react';
import {
  View,
  ListView,
  InteractionManager,
} from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';

import {loadTickets,nextPage} from '../../actions/ticketAction';
import TicketView from '../../components/ticket/Ticket';
import TicketSubView from '../../components/ticket/TicketSubView';
import TicketDetail from './TicketDetail';
import CustomerSelect from './CustomerSelect';
import notificationHelper from '../../utils/notificationHelper.js';
import TicketFilter from './TicketFilter';
// import privilegeHelper from '../../utils/privilegeHelper.js';

class Ticket extends Component{
  constructor(props){
    super(props);
    this._viewCache = {};
    this._dataSourceCache={};

    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged:(r1, r2) => r1 !== r2,
    });

    this.state = {dataSource:null,currentIndex:1};
    var data = props.todayData.get('allDatas');
    if(data){
      var obj = data.map((item)=>item.toArray()).toArray();
      var type = this._getCurrentType();
      var dataSource = this.ds.cloneWithRowsAndSections(obj);
      if(dataSource){
        this._dataSourceCache[type] = dataSource;
        this.state = {dataSource:dataSource,currentIndex:1};
      }
      // this._setDataSourceCache(this.ds.cloneWithRowsAndSections(obj));
    }
  }

  _loadTickets(filter){
    var type = this._getCurrentType();
    // console.warn('filter',filter.toJSON(),type);
    this.props.loadTickets(filter.toJSON(),type);
  }
  _onPostingCallback(type){
    // console.warn('_onPostingCallback...');
    // InteractionManager.runAfterInteractions(() => {
      this._refreshOnFocus = true;
    // });
  }
  _filterClick(){
    // console.warn('_filterClick');
    this.props.navigator.push({id:'ticket_filter',component:TicketFilter,sceneConfig:Navigator.SceneConfigs.FloatFromBottom});
  }
  _gotoDetail(ticketId,fromHex,isFutureTask){
    this.props.navigator.push({
      id:'ticket_detail',
      component:TicketDetail,
      passProps:{
        onPostingCallback:(type)=>{this._onPostingCallback(type)},
        ticketId:ticketId,
        fromHex:fromHex,
        fromFilterResult:false,
        isFutureTask,
      },
    });
  }
  _createTicket(){
    this.props.navigator.push({
      id:'customer_select',
      component:CustomerSelect,
      sceneConfig:Navigator.SceneConfigs.FloatFromBottom,
      passProps:{
        onPostingCallback:()=>{this._onPostingCallback()},
      }
    });
  }
  _onRefresh(){
    var type = this._getCurrentType();
    // console.warn('refreshing',type);
    this.props.nextPage({isFirstPage:true,typeTicketTask:type});
  }
  _indexChanged(index){
    // console.warn('index',index);
    var dataSource=this._getDataSource(index);
    // console.warn('dataSource',dataSource.sectionIdentities.length,dataSource);
    if (dataSource && dataSource.sectionIdentities.length!==0) {
      this.setState({currentIndex:index,dataSource:dataSource});
    }else {
      this.setState({currentIndex:index});
      this._onRefresh();
    }

    // ???
    // this.setState({currentIndex:index,dataSource:this._getDataSource(index)},()=>{
    //   if(index !== 0){
    //     this._onRefresh();
    //   }
    // });

  }
  _getCurrentData(props){
    var type = this._getCurrentType();
    return props[type];
  }
  _getCurrentType(index = this.state.currentIndex){
    var ret = '';
    if(index === 0){
      ret = 'lastData';
    }else if(index === 1){
      ret = 'todayData';
    }
    else {
      ret = 'futureData';
    }
    return ret;
  }
  _getDataSource(index){
    var type = this._getCurrentType(index);
    // console.warn('_getDataSource',type);
    if(this._dataSourceCache[type]){
      return this._dataSourceCache[type];
    }
    return null;
  }
  _setDataSourceCache(dataSource){
    var type = this._getCurrentType();
    if(dataSource){
      this._dataSourceCache[type] = dataSource;
    }
    this.setState({dataSource});
  }

  _getCurrentContentView(){
    var type = this._getCurrentType();
    var stateData = this._getCurrentData(this.props)
    // console.warn('_getCurrentContentView...',stateData.get('isFetching'),!!stateData.get('data'));
    // console.warn('_getCurrentContentView ...',stateData.get('isFetching'),stateData.get('allDatas'));
    var obj = {
      isFetching:stateData.get('isFetching'),
      listData:this._getDataSource(),
      sectionData:stateData.get('sectionData'),
      nextPage:()=>this.props.nextPage({isFirstPage:false,typeTicketTask:type}),
      currentPage:stateData.get('filter').get('CurrentPage'),
      onRefresh:()=>this._onRefresh(),
      totalPage:stateData.get('pageCount'),
      keyType:type,
      onRowClick:(rowData)=>this._gotoDetail(String(rowData.get('Id')),false,rowData.get('isFutureTask')),
    }
    // return (<TicketSubView {...obj} />);

    var component = null;
    if(type === 'lastData'){
      component = (
        <TicketSubView {...obj} />
      );
    }
    else if (type === 'todayData') {
      component = (
        <TicketSubView {...obj} />
      );
    }
    else if (type === 'futureData') {
      component = (
        <TicketSubView {...obj} />
      );
    }
    return component;
  }
  _checkPushNotification(){
    var ticketId = notificationHelper.getData('ticket');
    if(ticketId){
      this._gotoDetail(ticketId,true);
    }
  }
  _bindEvent(){
    var navigator = this.props.navigator;
    // console.warn('navigator',navigator);
    if (navigator) {
      var callback = (event) => {
        if(!event.data.route || !event.data.route.id || (event.data.route.id === 'main')){
          if(this._refreshOnFocus){
            this._onRefresh();
            this._refreshOnFocus = false;
          }
        }
      };
      // Observe focus change events from the owner.
      this._listener= navigator.navigationContext.addListener('didfocus', callback);
    }
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(()=>{
      var currData = this._getCurrentData(this.props);
      if(!currData.get('allDatas')){
        // InteractionManager.runAfterInteractions(()=>{
          // console.warn('componentDidMount...',this._getCurrentData(this.props).get('filter'));
          this._loadTickets(this._getCurrentData(this.props).get('filter'));
        // });
      }else {
        // var obj = currData.get('allDatas').map((item)=>item.toArray()).toArray();
        // InteractionManager.runAfterInteractions(()=>{
        //   this._setDataSourceCache(this.ds.cloneWithRowsAndSections(obj));
        // });
      }
      notificationHelper.register('ticket',()=>this._checkPushNotification());

    });
    this._bindEvent();
    // backHelper.init(this.props.navigator,'tickets');
  }
  componentWillReceiveProps(nextProps) {
    var data = this._getCurrentData(nextProps).get('allDatas');
    // var origData = this._getCurrentData(this.props).get('allDatas');
    // console.warn('componentWillReceiveProps...',data,origData);
    if(data){// !== origData){// && data){// && data.size >= 1){
      var obj = data.map((item)=>item.toArray()).toArray();
      InteractionManager.runAfterInteractions(()=>{
        this._setDataSourceCache(this.ds.cloneWithRowsAndSections(obj));
      });
    }
    // var currData = this._getCurrentData(nextProps);
    // console.warn('componentWillReceiveProps...');
    if(this._getCurrentData(this.props).get('filter') !== this._getCurrentData(nextProps).get('filter')){
      // console.warn('_loadTickets...',this._getCurrentData(nextProps).get('filter'));
      //this is a hack for following senario
      //when back from edit page
      //sometimes list is empty
      //but when _loadTickets included in runAfterInteractions it is fixed
      InteractionManager.runAfterInteractions(()=>{
        this._loadTickets(this._getCurrentData(nextProps).get('filter'));
      });
    }
  }
  componentWillUnmount() {
    this._listener && this._listener.remove();
    // backHelper.destroy('tickets');
    notificationHelper.resetData('ticket');
    notificationHelper.unregister('ticket');
  }
  render() {
    // var stateData = this._getCurrentData(this.props);
    // stateData.get('isFetching')
    // var isFetching=stateData.get('isFetching');
    // console.warn('TicketView controller render ...',this.state.currentIndex,this.state.dataSource);

    return (
      <TicketView
        onBack={()=>this._onBackClick()}
        currentIndex={this.state.currentIndex}
        indexChanged={(index)=>{this._indexChanged(index)}}
        contentView={this._getCurrentContentView()}
        onCreateTicket={()=>this._createTicket()}
        onFilterTicket={()=>this._filterClick()}
        />
    );
  }
}

Ticket.propTypes = {
  navigator:PropTypes.object,
  loadTickets:PropTypes.func,
  nextPage:PropTypes.func,

  lastData:PropTypes.object,
  todayData:PropTypes.object,
  futureData:PropTypes.object,
}

function mapStateToProps(state) {
  var tickets = state.ticket.tickets;
  // var todayData=tickets.get('todayData');
  // console.warn('mapStateToProps...',todayData.get('isFetching'),todayData.get('allDatas'));
  return {
    lastData:tickets.get('lastData'),
    todayData:tickets.get('todayData'),
    futureData:tickets.get('futureData'),
  }
}

export default connect(mapStateToProps,{loadTickets,nextPage})(Ticket);
