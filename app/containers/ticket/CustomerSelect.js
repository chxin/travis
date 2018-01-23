
'use strict';
import React,{Component} from 'react';
import {
  ListView,
  Alert,
  InteractionManager,
} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';

import {getCustomer} from '../../actions/ticketAction';
import CustomerSelView from '../../components/ticket/CustomerSelView';
import CreateTicket from './CreateTicket';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';


class CustomerSelect extends Component{
  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged:(r1, r2) => r1 !== r2,
    });
    this.state = {dataSource:null};
  }
  _loadCustomers(){
    this.props.getCustomer();
  }
  _onPostingCallback(){
    InteractionManager.runAfterInteractions(()=>{
      this.props.onPostingCallback();
      this.props.navigator.popToTop();
    });
  }
  _didRowClick(rowData){
    this.props.navigator.push({
      id:'ticket_create',
      component:CreateTicket,
      passProps:{
        customer:rowData,
        alarm:null,
        ticketInfo:null,
        onPostingCallback:()=>{this._onPostingCallback()},
      }
    });
  }
  _checkAuth()
  {
    this.props.checkAuth(2135);
  }
  _showAuth(){
    if(this.props.hasAuth === null){ //do nothing wait api
      return false;
    }
    if(this.props.hasAuth === false){
      Alert.alert(
        '',
        localStr('lang_alarm_des1'),
        [
          {text: localStr('lang_ticket_OK'), onPress: () =>{}}
        ]
      )
      return false;
    }
    return true;
  }
  _onRefresh(){
    this._loadCustomers();
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(()=>{
      this._loadCustomers();
    });
    backHelper.init(this.props.navigator,this.props.route.id);
  }
  componentWillReceiveProps(nextProps) {
    var data = nextProps.data;
    var oldData = this.props.data;
    if(data !== oldData && data){
      var obj = data.map((item)=>item.toArray()).toArray();
      InteractionManager.runAfterInteractions(() => {
        this.setState({
          dataSource:this.ds.cloneWithRowsAndSections(obj)});
      });
    }
  }
  componentWillUnmount() {
    backHelper.destroy(this.props.route.id);
  }
  render() {
    return (
      <CustomerSelView
        isFetching={this.props.isFetching}
        data={this.state.dataSource}
        sectionData={this.props.sectionData}
        onRowClick={(rowData)=>this._didRowClick(rowData)}
        onBack={()=>this.props.navigator.pop()}
        onRefresh={()=>this._onRefresh()}
        />
    );
  }
}

CustomerSelect.propTypes = {
  navigator:PropTypes.object,
  customers:PropTypes.object,
  route:PropTypes.object,
  hasAuth:PropTypes.bool,
  getCustomer:PropTypes.func,
  checkAuth:PropTypes.func,
  isFetching:PropTypes.bool.isRequired,
  data:PropTypes.object,
  sectionData:PropTypes.object,
  onPostingCallback:PropTypes.func,
}

function mapStateToProps(state) {
  var customers = state.ticket.customers;
  var data = customers.get('data'),
      sectionData = customers.get('sectionData'),
      isFetching = customers.get('isFetching');
  return {
    isFetching,
    data,
    sectionData,
  };
}

export default connect(mapStateToProps,{getCustomer})(CustomerSelect);
