
'use strict';
import React,{Component} from 'react';

import {
  ListView,
  InteractionManager,
} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';

import {loadHierarchyByBuildingId} from '../../actions/assetsAction';
import AssetHierarchyView from '../../components/assets/AssetHierarchy';
import Scan from './Scan.js';

import Room from './Room';
import Panel from './Panel';
import Device from './Device';
import AssetBindHierarchy from './AssetBindHierarchy';
import privilegeHelper from '../../utils/privilegeHelper.js';

class AssetHierarchy extends Component{
  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {dataSource:null};
  }

  _loadHierarchyByBuildingId(building){
    console.warn('building',building.get('Id'),this.props.isFromScan);
    this.props.loadHierarchyByBuildingId(building.get('Id'),this.props.isFromScan);
  }

  _gotoDetail(rowData){
    // // console.warn('assets', rowData);
    var type = rowData.get('Type');
    var container = Room;
    if (type===3) {
      container = Room;
    }else if (type===4) {
      container = Panel;
    }else if (type===5) {
      container = Device;
    }

    this.props.navigator.push({
      id:'asset_detail',
      component:container,
      passProps:{
        ownData:rowData
      }
    });
  }

  _onRefresh(){
    this._loadHierarchyByBuildingId(this.props.ownAsset);
  }

  _onBackClick(){
    // this.props.exitHierarchyView();
    this.props.navigator.pop();
  }

  _onScanClick(){
    this.props.navigator.push({
      id:'scan_from_hierarchy',
      component:Scan,
      passProps:{

      }
    });
  }
  _onBindClick(){
    this.props.navigator.push({
      id:'assets_bind_hierarchy',
      component:AssetBindHierarchy,
      passProps:{
        ownAsset:this.props.ownAsset
      }
    });
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(()=>{
      this._loadHierarchyByBuildingId(this.props.ownAsset);
    });
    backHelper.init(this.props.navigator,this.props.route.id);
  }

  componentWillReceiveProps(nextProps) {
    // console.warn('componentWillReceiveProps',this.props.isFetching,nextProps.listHierarchys);
    var data = nextProps.listHierarchys;
    if(data){
      InteractionManager.runAfterInteractions(()=>{
        this.setState({dataSource:this.ds.cloneWithRows(data.toArray())});
      });
    }
  }

  componentWillUnmount() {
    backHelper.destroy(this.props.route.id);
  }

  render() {
    return (
      <AssetHierarchyView
        buildData={this.props.ownAsset}
        onBack={()=>this._onBackClick()}
        currentRouteId={this.props.route.id}
        isFromScan={this.props.isFromScan}
        onScanClick={()=>this._onScanClick()}
        hasBindAuth={privilegeHelper.hasAuth('AssetEditPrivilegeCode')}
        onBindClick={()=>this._onBindClick()}
        isFetching={this.props.isFetching}
        listData={this.state.dataSource}
        currentPanel={this.props.currentPanel}
        hasFilter={this.props.hasFilter}
        nextPage={()=>this.props.nextPage()}
        currentPage={1}
        onRefresh={()=>this._onRefresh()}
        totalPage={1}
        onRowClick={(rowData)=>this._gotoDetail(rowData)}/>
    );
  }
}

AssetHierarchy.propTypes = {
  navigator:PropTypes.object,
  ownAsset:PropTypes.object,//is Building or Panel
  route:PropTypes.object,
  hasFilter:PropTypes.bool,
  currentPanel:PropTypes.number,
  isFromScan:PropTypes.bool,
  loadHierarchyByBuildingId:PropTypes.func,
  nextPage:PropTypes.func,
  isFetching:PropTypes.bool.isRequired,
  listHierarchys:PropTypes.object,
  buildId:PropTypes.number,
}

function mapStateToProps(state,ownProps) {
  var buildHierarData = state.asset.buildHierarchyData;
  var listHierarchys = buildHierarData.get('data');
  var bId = buildHierarData.get('buildId');
  if(ownProps.isFromScan){
    listHierarchys = buildHierarData.get('scanData');
    bId = buildHierarData.get('scanHierarchyId');
  }
  if (ownProps.ownAsset.get('Id') !== bId) {
    listHierarchys = null;
  }
  // console.warn('mapStateToProps',buildHierarData.get('isFetching'),ownProps.ownAsset.get('Id'),bId,listHierarchys);
  return {
    hasFilter : false,
    isFetching:buildHierarData.get('isFetching'),
    listHierarchys:listHierarchys,
    buildId:bId,
  };
}

export default connect(mapStateToProps,{loadHierarchyByBuildingId})(AssetHierarchy);
