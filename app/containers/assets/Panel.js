
'use strict';
import React,{Component} from 'react';
import {
  ListView,
  InteractionManager,
} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';

import {loadPanelDetail,changeImage,changeImageComplete} from '../../actions/assetsAction';
import DetailView from '../../components/assets/DetailView';
import PanelEnvEdit from './PanelEnvEdit.js';
import AssetLogs from './AssetLogs.js';
import TendingHistory from './TendingHistory.js';
import SinglePhotos from './SinglePhotos.js';
import ImagePicker from '../ImagePicker.js';
import privilegeHelper from '../../utils/privilegeHelper.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

class Panel extends Component{
  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged:(r1, r2) => r1 !== r2,
    });
    this.state = {dataSource:null};
  }
  _gotoDetail(data){
    var type = data.get('type');
    if(type === 'temperature' ||
        type === 'busTemperature' ||
        type === 'humidity' ||
        type === 'dust'){
      this.props.navigator.push({
        id:'assets_env',
        component:PanelEnvEdit,
        passProps:{
          data,
          asset:this.props.ownData
        }
      });
    }
    if(type === 'log'){
      this.props.navigator.push({
        id:'assets_log',
        component:AssetLogs,
        passProps:{
          hierarchyId:this.props.ownData.get('Id')
        }
      });
    }else if(type === 'tending'){
      this.props.navigator.push({
        id:'tending',
        component:TendingHistory,
        passProps:{
          hierarchyId:this.props.ownData.get('Id')
        }
      });
    }else if(type === 'singleLine'){
      this.props.navigator.push({
        id:'assets_singlePhotos',
        component:SinglePhotos,
        passProps:{
          hierarchyId:this.props.ownData.get('Id'),
          arrPhotos:this.props.arrPhotos,
        }
      });
    }

  }
  _loadDetailById(objAsset){
    // console.warn('building',building.get('Id'));
    this.props.loadPanelDetail(objAsset.get('Id'));
  }
  _onRefresh(){
    this._loadDetailById(this.props.ownData);
  }

  _onBackClick(){
    this.props.navigator.pop();
  }
  _onChangeImage(){
    this.props.navigator.push({
      id:'imagePicker',
      component:ImagePicker,
      passProps:{
        max:1,
        dataChanged:(chosenImages)=>this.props.changeImage('panel',chosenImages)
      }
    });
  }
  _onChangeImageComplete(data){
    try {
      // console.warn('before parse json');
      let obj = JSON.parse(data);
      let {Result:{ImageKey}} = obj;
      // console.warn('ImageKey',ImageKey);
      this.props.changeImageComplete(ImageKey);

    } catch (e) {

    } finally {

    }
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(()=>{
      this._loadDetailById(this.props.ownData);
    });
    backHelper.init(this.props.navigator,this.props.route.id);
  }

  componentWillReceiveProps(nextProps) {
    var data = nextProps.data;
    if(this.props.data !== data && data && data.size >= 1){
      var obj = data.map((item)=>item.toArray()).toArray();
      InteractionManager.runAfterInteractions(()=>{
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
      <DetailView
        ownData={this.props.ownData}
        onBack={()=>this._onBackClick()}
        emptyImageText={localStr('lang_asset_des33')}
        isFetching={this.props.isFetching}
        changeImage={()=>this._onChangeImage()}
        canEdit={privilegeHelper.hasAuth('AssetEditPrivilegeCode')}
        changeImageComplete={(data)=>this._onChangeImageComplete(data)}
        data={this.state.dataSource}
        sectionData={this.props.sectionData}
        errorMessage={this.props.errorMessage}
        onRefresh={()=>this._onRefresh()}
        onRowClick={(rowData)=>this._gotoDetail(rowData)}/>
    );
  }
}

Panel.propTypes = {
  navigator:PropTypes.object,
  ownData:PropTypes.object,
  route:PropTypes.object,
  loadPanelDetail:PropTypes.func,
  changeImage:PropTypes.func,
  changeImageComplete:PropTypes.func,
  isFetching:PropTypes.bool.isRequired,
  data:PropTypes.object,
  sectionData:PropTypes.object,
  arrPhotos:PropTypes.object,
  errorMessage:PropTypes.string,
}

function mapStateToProps(state,ownProps) {
  var panelDetailData = state.asset.panelDetailData,
      data = panelDetailData.get('data'),
      sectionData = panelDetailData.get('sectionData'),
      isFetching = panelDetailData.get('isFetching');
  var errorMessage=panelDetailData.get('errorMessage');
  if (ownProps.ownData.get('Id') !== panelDetailData.get('panelId')) {
    data = null;
  }
  // console.warn('sectionData',sectionData);
  var arrPhotos=panelDetailData.get('arrSinglePhotos');
  return {
    isFetching,
    data,
    sectionData,
    arrPhotos,
    errorMessage
  };
}

export default connect(mapStateToProps,{loadPanelDetail,changeImage,changeImageComplete})(Panel);
