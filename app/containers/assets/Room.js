
'use strict';
import React,{Component} from 'react';
import {
  ListView,
  InteractionManager,
} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';

import {loadRoomDetail,changeImage,changeImageComplete} from '../../actions/assetsAction';
import DetailView from '../../components/assets/DetailView';
import RoomEnvEdit from './RoomEnvEdit.js'
import AdminList from './AdminList.js';
import AssetLogs from './AssetLogs.js';
import TendingHistory from './TendingHistory.js';
import SinglePhotos from './SinglePhotos.js';
import ImagePicker from '../ImagePicker.js';
import privilegeHelper from '../../utils/privilegeHelper.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

class Room extends Component{
  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged:(r1, r2) => r1 !== r2,
    });
    this.state = {dataSource:null};
  }

  _loadDetailById(objAsset){
    // console.warn('building',building.get('Id'));
    this.props.loadRoomDetail(objAsset.get('Id'));
  }
  _gotoDetail(data){
    var type = data.get('type');
    if(type === 'temperature' ||
        type === 'humidity' ||
        type === 'dust'){
      this.props.navigator.push({
        id:'assets_env',
        component:RoomEnvEdit,
        passProps:{
          data,
          asset:this.props.ownData
        }
      });
    }
    else if(type === 'admin') {
      this.props.navigator.push({
        id:'assets_admin',
        component:AdminList,
        passProps:{
          adminId:data.get('id')
        }
      });
    }
    else if(type === 'log'){
      this.props.navigator.push({
        id:'assets_log',
        component:AssetLogs,
        passProps:{
          hierarchyId:this.props.ownData.get('Id')
        }
      });
    }
    else if(type === 'tending'){
      this.props.navigator.push({
        id:'tending',
        component:TendingHistory,
        passProps:{
          hierarchyId:this.props.ownData.get('Id')
        }
      });
    }
    else if(type === 'singleLine'){
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
  _onRefresh(){
      this._loadDetailById(this.props.ownData);
  }

  _onBackClick(){
    this.props.navigator.pop({current:this.props.ownData});
  }
  _onChangeImage(){
    this.props.navigator.push({
      id:'imagePicker',
      component:ImagePicker,
      passProps:{
        max:1,
        dataChanged:(chosenImages)=>this.props.changeImage('room',chosenImages)
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
      // console.warn('rerender');
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
        changeImage={()=>this._onChangeImage()}
        canEdit={privilegeHelper.hasAuth('AssetEditPrivilegeCode')}
        changeImageComplete={(data)=>this._onChangeImageComplete(data)}
        isFetching={this.props.isFetching}
        data={this.state.dataSource}
        sectionData={this.props.sectionData}
        onRefresh={()=>this._onRefresh()}
        onRowClick={(rowData)=>this._gotoDetail(rowData)}/>
    );
  }
}

Room.propTypes = {
  navigator:PropTypes.object,
  ownData:PropTypes.object,
  route:PropTypes.object,
  changeImage:PropTypes.func,
  changeImageComplete:PropTypes.func,
  loadRoomDetail:PropTypes.func,
  isFetching:PropTypes.bool.isRequired,
  data:PropTypes.object,
  sectionData:PropTypes.object,
  arrPhotos:PropTypes.object,
}

function mapStateToProps(state,ownProps) {
  var roomDetailData = state.asset.roomDetailData,
      data = roomDetailData.get('data'),
      sectionData = roomDetailData.get('sectionData'),
      isFetching = roomDetailData.get('isFetching');
  if (ownProps.ownData.get('Id') !== roomDetailData.get('roomId')) {
    data = null;
  }
  var arrPhotos=roomDetailData.get('arrSinglePhotos');

  return {
    isFetching,
    data,
    sectionData,
    arrPhotos,
    // pendingImageUri:roomDetailData.get('pendingImageUri')
  };
}

export default connect(mapStateToProps,{loadRoomDetail,changeImage,changeImageComplete})(Room);
