
'use strict';
import React,{Component} from 'react';
import {
  ListView,
  InteractionManager,
} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';

import {loadFollowsData,updateFollowSelectInfo,submitFollowsInfo} from '../../actions/followsAction.js';
import FollowsView from '../../components/follow/FollowsView';

import Main from '../Main';

class Follow extends Component{
  constructor(props){
    super(props);
  }

  _loadMyFollows(filter){
    this.props.loadFollowsData(filter.toJSON());
  }
  _didRowClick(rowData){
    this.props.updateFollowSelectInfo({type:'select',value:rowData});
  }
  _onSave()
  {
    var follIds=[];
    this.props.data.forEach(item=>{
      if (item.get('Selected')) {
        follIds.push(item.get('Id'));
      }
    });
    this.props.submitFollowsInfo({'FocusItemIds':follIds});

    this.props.navigator.resetTo({id:'main',component:Main});//test
  }
  _gotoDetail(rowData){
    // console.warn('assets', 'goto detail assets');
    // this.props.navigator.push({
    //   id:'AssetHierarchy',
    //   component:AssetHierarchy,
    //   passProps:{
    //     ownAsset:rowData
    //   }
    // });
  }
  componentDidMount() {
  // backHelper.init(this.props.navigator,'assets');
    InteractionManager.runAfterInteractions(()=>{
      if(!this.props.data||this.props.data.size===0){
        console.warn('start load');
        this._loadMyFollows(this.props.filter);
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.updateSuccess && !this.props.updateSuccess){
      InteractionManager.runAfterInteractions(() => {
        this.props.navigator.resetTo({id:'main',component:Main});
      });
    }
  }
  componentWillUnmount() {
    // backHelper.destroy('assets');
  }

  render() {
    return (
      <FollowsView
        onRowClick={(rowData)=>this._didRowClick(rowData)}
        onSave={()=>this._onSave()}
        isFetching={this.props.isFetching}
        data={this.props.data}>
      </FollowsView>
    );
  }
}

Follow.propTypes = {
  navigator:PropTypes.object,
  data:PropTypes.object,
  filter:PropTypes.object,
  isFetching:PropTypes.bool,
  // selectFollows:PropTypes.object,
  updateSuccess:PropTypes.bool,
  loadFollowsData:PropTypes.func,
  updateFollowSelectInfo:PropTypes.func,
  submitFollowsInfo:PropTypes.func,
}

function mapStateToProps(state) {
  return {
    filter:state.follows.get('filter'),
    data:state.follows.get('data'),
    isFetching:state.follows.get('isFetching'),
    updateSuccess:state.follows.get('updateSuccess'),
    // selectFollows:state.follows.get('selectFollows')
  };
}

export default connect(mapStateToProps,{loadFollowsData,updateFollowSelectInfo,submitFollowsInfo})(Follow);
