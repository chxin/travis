
'use strict';
import React,{Component} from 'react';
import {
  ListView,
  InteractionManager,
} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';

import {loadMyAssets} from '../../actions/assetsAction';
import AssetsView from '../../components/assets/AssetsView';
import Scan from './Scan';
import AssetHierarchy from './AssetHierarchy';

class Assets extends Component{
  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var data = props.asset.get('data');
    if(data){
      data = data.toArray();
      this.state = { dataSource:this.ds.cloneWithRows(data)};
    }
    else {
      this.state = { dataSource:null};
    }
  }

  _loadMyAssets(filter){
    // console.warn('filter',filter.toJSON());
    this.props.loadMyAssets(filter.toJSON());
  }

  _gotoDetail(rowData){
    // console.warn('assets', 'goto detail assets');
    this.props.navigator.push({
      id:'AssetHierarchy',
      component:AssetHierarchy,
      passProps:{
        ownAsset:rowData
      }
    });
  }

  _onRefresh(){
    this._loadMyAssets(this.props.filter);
  }
  _onScanClick(){
    // console.warn('didOnScanClick');
    this.props.navigator.push({
      id:'scan_from_building',
      component:Scan,
      sceneConfig:'FloatFromBottomAndroid',
      passProps:{

      }
    });
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(()=>{
      if(!this.props.asset.get('data')){
        this._loadMyAssets(this.props.filter);
      }
    });
    // backHelper.init(this.props.navigator,'assets');
  }

  componentWillReceiveProps(nextProps) {
    var data = nextProps.asset.get('data');
    var oldData = this.props.asset.get('data');
    if(data !== oldData){
      InteractionManager.runAfterInteractions(()=>{
        this.setState({dataSource:this.ds.cloneWithRows(data.toArray())});
      });
    }
    if(this.props.filter !== nextProps.filter){
      //this is a hack for following senario
      //when back from filter page
      //sometimes list is empty
      //but when _loadMyAssets included in runAfterInteractions it is fixed
      InteractionManager.runAfterInteractions(()=>{
        this._loadMyAssets(nextProps.filter);
      });
    }
  }

  componentWillUnmount() {
    // backHelper.destroy('assets');
  }

  render() {
    return (
      <AssetsView
        onScanClick={()=>this._onScanClick()}
        isFetching={this.props.asset.get('isFetching')}
        listData={this.state.dataSource}
        hasFilter={this.props.hasFilter}
        nextPage={()=>this.props.nextPage()}
        currentPage={this.props.asset.get('CurrentPage')}
        onRefresh={()=>this._onRefresh()}
        totalPage={this.props.asset.get('pageCount')}
        onRowClick={(rowData)=>this._gotoDetail(rowData)}/>
    );
  }
}

Assets.propTypes = {
  navigator:PropTypes.object,
  asset:PropTypes.object,
  filter:PropTypes.object,
  hasFilter:PropTypes.bool,
  loadMyAssets:PropTypes.func,
  nextPage:PropTypes.func,
}

function mapStateToProps(state) {
  return {
    hasFilter : false,
    filter:state.asset.assetData.get('filter'),
    asset:state.asset.assetData,
  };
}

export default connect(mapStateToProps,{loadMyAssets})(Assets);
