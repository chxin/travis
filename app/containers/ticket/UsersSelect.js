
'use strict';
import React,{Component} from 'react';
import {
  ListView,
  InteractionManager,
} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';

import {getUsersFromAssets,updateUserSelectInfo} from '../../actions/ticketAction';
import UsersSelView from '../../components/ticket/UsersSelView';

class UsersSelect extends Component{
  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged:(r1, r2) => r1 !== r2,
    });
    // console.warn('data',props.data);
    // if(props.data){
    //   var obj = props.data.map((item)=>item.toArray()).toArray();
    //   // InteractionManager.runAfterInteractions(() => {
    //     this.state={dataSource:this.ds.cloneWithRowsAndSections(obj)}
    //   // });
    // }else {
    this.state={dataSource:null};
    // }
  }
  _loadUsers(selectAssets){
    // if (this.props.data&&this.props.data.size>=1) {
    //   return;
    // }
    // console.warn('_loadUsers selectAssets count',selectAssets.size);
    var Assets=[];
    selectAssets.forEach((item)=>{
      Assets.push(item.get('Id'));
    });
    var reqbody = {
      CustomerId:this.props.customerId,
      AssetIds:Assets,
      StartDate:this.props.startTime,
      EndDate:this.props.endTime,
    };
    this.props.getUsersFromAssets(reqbody);
  }
  _didRowClick(rowData){
    this.props.updateUserSelectInfo({type:'select',value:rowData});
  }
  _onSave()
  {
    this.props.updateUserSelectInfo({type:'save',value:this.props.selectUsers});
    this.props.navigator.pop();
  }
  _onRefresh(){
    this._loadUsers(this.props.selectAssets);
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(()=>{
      this._loadUsers(this.props.selectAssets);
    });
    backHelper.init(this.props.navigator,this.props.route.id);
  }
  componentWillReceiveProps(nextProps) {
    var data = nextProps.data;
    var oldData = this.props.data;
    if(data){
      // console.warn('componentWillReceiveProps...',nextProps.isFetching,nextProps.sectionData,data);
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
      <UsersSelView
        title={this.props.title}
        isFetching={this.props.isFetching}
        data={this.state.dataSource}
        sectionData={this.props.sectionData}
        selectUsers={this.props.selectUsers}
        onRowClick={(rowData)=>this._didRowClick(rowData)}
        onBack={()=>this.props.navigator.pop()}
        onSave={()=>this._onSave()}
        onRefresh={()=>this._onRefresh()}
        />
    );
  }
}

UsersSelect.propTypes = {
  navigator:PropTypes.object,
  route:PropTypes.object,
  title:PropTypes.string,
  users:PropTypes.object,
  customerId:PropTypes.number,
  isFetching:PropTypes.bool.isRequired,
  data:PropTypes.object,
  sectionData:PropTypes.object,
  selectUsers:PropTypes.object,
  selectAssets:PropTypes.object,
  getUsersFromAssets:PropTypes.func,
  updateUserSelectInfo:PropTypes.func,
  startTime:PropTypes.string,
  endTime:PropTypes.string,
}

function mapStateToProps(state,ownProps) {
  var users = state.ticket.users;
  var data = users.get('data'),
      sectionData = users.get('sectionData'),
      isFetching = users.get('isFetching'),
      selectUsers = users.get('selectUsers'),
      selectAssets = ownProps.selectAssets;
  return {
    isFetching,
    data,
    sectionData,
    selectUsers,
    selectAssets,
  };
}

export default connect(mapStateToProps,{getUsersFromAssets,updateUserSelectInfo})(UsersSelect);
