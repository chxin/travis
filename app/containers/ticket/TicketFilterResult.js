
'use strict';
import React,{Component} from 'react';
import {
  ListView,
  InteractionManager,
} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';

import {loadTicketFilterResult,resetTicketFilterResult,nextFilterPage} from '../../actions/ticketAction';
import TicketDetail from './TicketDetail';
import TicketFilterResultView from '../../components/ticket/TicketFilterResultView';

class TicketFilterResult extends Component{
  constructor(props){
    super(props);
    this._onPostingCallback=this._onPostingCallback.bind(this);
    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged:(r1, r2) => r1 !== r2,
    });
    this.state = {dataSource:null};
  }
  _loadTicketFilterResult(filter){
    var param={...this.props.reqParams, ...filter.toJS()};
    console.warn('curr routes,',this.props.route);
    this.props.loadTicketFilterResult(param);
  }
  _gotoDetail(ticketId,fromHex,isFutureTask){
    // var arrRoutes = this.props.navigator.getCurrentRoutes(0);
    this.props.navigator.push({
      id:'ticket_detail',
      component:TicketDetail,
      passProps:{
        lastRoute:this.props.route,
        onPostingCallback:(type)=>{this._onPostingCallback(type)},
        ticketId:ticketId,
        fromHex:fromHex,
        fromFilterResult:true,
        isFutureTask,
      },
    });
  }
  _onRefresh(){
    this.props.nextFilterPage({isFirstPage:true});
  }
  _onPostingCallback(type){
    // InteractionManager.runAfterInteractions(() => {
      this._refreshOnFocusInFilter = true;
      // this._onRefresh();
    // });
  }
  _bindEvent(){
    var navigator = this.props.navigator;
    if (navigator) {
      var callback = (event) => {
        if(!event.data.route || !event.data.route.id || (event.data.route.id === 'ticket_filter_result')){
          if(this._refreshOnFocusInFilter){
            this._onRefresh();
            this._refreshOnFocusInFilter = false;
          }
        }
      };
      // Observe focus change events from the owner.
      this._listener= navigator.navigationContext.addListener('didfocus', callback);
    }
  }
  componentDidMount() {
    console.warn('TicketFilterResult componentDidMount...',this.props.route.id);
    backHelper.init(this.props.navigator,this.props.route.id);
    this._bindEvent();
    InteractionManager.runAfterInteractions(()=>{
      this._loadTicketFilterResult(this.props.filter);
    });
  }

  componentWillReceiveProps(nextProps) {
    var data = nextProps.data;
    if(this.props.data !== data && data){
      var obj = data.map((item)=>item.toArray()).toArray();
      InteractionManager.runAfterInteractions(()=>{
        this.setState({
          dataSource:this.ds.cloneWithRowsAndSections(obj)});
      });
    }
    if(this.props.filter !== nextProps.filter){
      InteractionManager.runAfterInteractions(()=>{
        this._loadTicketFilterResult(nextProps.filter);
      });
    }
  }

  componentWillUnmount() {
    this.props.resetTicketFilterResult();
    backHelper.destroy(this.props.route.id);
  }

  render() {
    var obj = {
      onBack:()=>{
        this.props.navigator.pop();
      },
      currentRouteId:this.props.route.id,
      isFetching:this.props.isFetching,
      listData:this.state.dataSource,
      sectionData:this.props.sectionData,
      nextPage:()=>this.props.nextFilterPage({isFirstPage:false}),
      currentPage:this.props.filter.get('CurrentPage'),
      onRefresh:()=>this._onRefresh(),
      totalPage:this.props.pageCount,
      onRowClick:(rowData)=>this._gotoDetail(String(rowData.get('Id')),false,rowData.get('isFutureTask')),
    }
    return (<TicketFilterResultView {...obj} />);
  }
}

TicketFilterResult.propTypes = {
  navigator:PropTypes.object,
  route:PropTypes.object,
  loadTicketFilterResult:PropTypes.func,
  resetTicketFilterResult:PropTypes.func,
  nextFilterPage:PropTypes.func,
  isFetching:PropTypes.bool.isRequired,
  data:PropTypes.object,
  sectionData:PropTypes.object,
  filter:PropTypes.object,
  reqParams:PropTypes.object,
  pageCount:PropTypes.number,
}

function mapStateToProps(state,ownProps) {
  var filterResult = state.ticket.ticketFilter,
      data = filterResult.get('allDatas'),
      sectionData = filterResult.get('sectionData'),
      isFetching = filterResult.get('isFilterFetching'),
      filter = filterResult.get('filter'),
      reqParams = filterResult.get('reqParams'),
      pageCount=filterResult.get('pageCount');
  return {
    isFetching,
    data,
    sectionData,
    filter,
    reqParams,
    pageCount,
  };
}

export default connect(mapStateToProps,{loadTicketFilterResult,
resetTicketFilterResult,nextFilterPage})(TicketFilterResult);
