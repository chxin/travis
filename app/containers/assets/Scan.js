
'use strict';
import React,{Component} from 'react';
import {
  InteractionManager,
  Alert,
  Linking,
  PermissionsAndroid
  // Permissions
} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';
import AssetHierarchy from './AssetHierarchy.js';

import Device from './Device';
import Panel from './Panel';

import {loadPanelHierarchy,updateScanDeviceData,updateSpHttpInfo,bindAssetHierarchy,loadAssetWithQrcode,exitScan,resetScanError} from '../../actions/assetsAction';
import ScanView from '../../components/assets/ScanView';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

import Permissions from 'react-native-permissions';

class Scan extends Component{
  static contextTypes = {
    showSpinner: PropTypes.func,
    hideHud: PropTypes.func
  }
  constructor(props){
    super(props);
    this.state = {openCamera:false};
  }
  _getScanData(data){
    try {
      if (data.indexOf('.energymost.com')!==-1) {
        // this.props.updateSpHttpInfo({type:'scan',data});
        this.setState({openCamera:false});

        Linking.canOpenURL(data).then(async (supported) => {
           if (supported) {
             this.props.updateSpHttpInfo({type:'scan',data});
           } else {
             throw new Error();
           }
        });

        // Linking.canOpenURL(data).then(async (supported) => {
        //    if (supported) {
        //      Linking.openURL(data);
        //      this.props.navigator.pop();
        //    } else {
        //      throw new Error();
        //    }
        // });

        return;
      }
      data = JSON.parse(data);
      if ('PanelId' in data) {
        this.setState({openCamera:false,panelId:data.PanelId});
        if(data.PanelId){
          this.props.loadPanelHierarchy(data.PanelId);
        }
      }else if ('DeviceId' in data) {
        this.setState({openCamera:false,deviceId:data.DeviceId});
        if(data.DeviceId){
          this.props.updateScanDeviceData({DeviceId:data.DeviceId,DeviceName:data.DeviceName});
        }
      }else {
        throw new Error();
      }
    } catch (e) {
      this.setState({openCamera:false});
      if (this.props.hierarchyId) {
        if (!this.props.bindHierarchy) {
          this.props.bindAssetHierarchy({HierarchyId:this.props.hierarchyId,QRCode:data});
        }
      }else {
        this.props.loadAssetWithQrcode(data);
      }
      // Alert.alert(
      //   '',
      //   '无法识别与机器顾问系统不相关的二维码，请确认后再试！',
      //   [
      //     {text: localStr('lang_ticket_OK'), onPress: () => {this.setState({openCamera:true});}}
      //   ]
      // )
      // this.setState({openCamera:false});
    }
  }
  _gotoAssetsTree(data){
    this.props.navigator.push({
      id:'assets_tree_from_scan',
      component:AssetHierarchy,
      passProps:{
        ownAsset:data,
        currentPanel:this.state.panelId,
        isFromScan:true
      }
    });
    this.props.exitScan();
  }
  _gotoPanel(data){
    this.props.navigator.push({
      id:'asset_detail',
      component:Panel,
      passProps:{
        ownData:data,
      }
    });
    this.props.exitScan();
  }
  _gotoDevice(data){
    this.props.navigator.push({
      id:'asset_detail',
      component:Device,
      passProps:{
        ownData:data,
      }
    });
    this.props.exitScan();
  }
  _mounted(v,cb=()=>{}){
    this.setState({openCamera:v},cb);
  }
  _onBackClick()
  {
    this.props.navigator.pop();
  }
  componentDidMount() {
    backHelper.init(this.props.navigator,this.props.route.id,()=>{
      if(this.state.openCamera){
        this._mounted(false,()=>{
          this.props.navigator.pop();
        });

      }
    });

    InteractionManager.runAfterInteractions(() => {
      Permissions.getPermissionStatus('camera').then(response => {
        console.warn('checkscan',response);
        if (response==='authorized'||response==='undetermined'||response===true) {
          this._mounted(true);
        }else {
          Alert.alert(
            '',
            localStr('lang_commons_notice14'),
            [
              {text: localStr('lang_ticket_cancel'), onPress: () => {
                // Permissions.requestPermission('camera').then(response => {
                //   console.warn('requestPermission camera',response);
                //   //returns once the user has chosen to 'allow' or to 'not allow' access
                //   //response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
                // });
              }},
              {text: localStr('lang_commons_notice15'), onPress: () => {
                if (Permissions.canOpenSettings()) {
                    Permissions.openSettings();
                  }
                // this.setState({openCamera:false});
              }}
            ]
          )
          this._mounted(false);
        }
      });

      var navigator = this.props.navigator;
      if (navigator) {
        var callback = (event) => {
          // console.warn('event route:',event.data.route.id);
          // console.warn('current route:',this.props.route.id);
          if(event.data.route && event.data.route.id && event.data.route.id === this.props.route.id){
            console.warn('route call mounted');
            this._mounted(true);
          }
        };
        // Observe focus change events from the owner.
        this._listener= navigator.navigationContext.addListener('willfocus', callback);

      }
    });

  }

  componentWillReceiveProps(nextProps) {
    if(!this.props.panel && nextProps.panel){
      // this._gotoPanel(nextProps.panel);
      this._gotoAssetsTree(nextProps.panel);
    }else if(!this.props.device && nextProps.device){
      this._gotoDevice(nextProps.device);
    }else if(!this.props.httpUri && nextProps.httpUri){
      this.props.updateSpHttpInfo({type:'reset'});
      InteractionManager.runAfterInteractions(() => {
        Linking.openURL(nextProps.httpUri);
      });
      this.setState({openCamera:true});
    }else if(!this.props.bindHierarchy && nextProps.bindHierarchy){
      // this.setState({openCamera:true});
      this.context.showSpinner('bindsuccess');
      InteractionManager.runAfterInteractions(() => {
        this.props.navigator.pop();
      });
    }

    if(!this.props.errorMessage&&nextProps.errorMessage){
      Alert.alert(
        '',
        nextProps.errorMessage,
        [
          {text: localStr('lang_ticket_OK'), onPress: () =>{
            this.setState({openCamera:true});
            this.props.resetScanError();
          }}//
        ]
      )
    }
    if(!nextProps.hasAuth && this.state.photoPermission==='authorized'){
      //when scan a unpermitted device,should open camera for next scan
      this.setState({openCamera:true});
    }
  }
  componentWillUnmount() {
    backHelper.destroy(this.props.route.id);
    this._listener && this._listener.remove();
    this.props.exitScan();

  }

  render() {
    // console.warn('render ScanView',this.props.scanTitle);
    return (
      <ScanView
        isFetching = {this.props.isFetching}
        openCamera={this.state.openCamera}
        scanText={this.props.scanText}
        scanTitle={this.props.scanTitle}
        onBack={()=>{
          this._mounted(true,()=>{
            this.props.navigator.pop()
          })
        }}
        barCodeComplete={(data)=>this._getScanData(data)} />
    );
  }
}

Scan.propTypes = {
  navigator:PropTypes.object,
  route:PropTypes.object,
  exitScan:PropTypes.func.isRequired,
  resetScanError:PropTypes.func.isRequired,
  panel:PropTypes.object,
  device:PropTypes.object,
  httpUri:PropTypes.string,
  hierarchyId:PropTypes.number,
  bindHierarchy:PropTypes.bool,
  isFetching:PropTypes.bool,
  hasAuth:PropTypes.bool,
  loadPanelHierarchy:PropTypes.func.isRequired,
  updateScanDeviceData:PropTypes.func.isRequired,
  updateSpHttpInfo:PropTypes.func.isRequired,
  bindAssetHierarchy:PropTypes.func.isRequired,
  loadAssetWithQrcode:PropTypes.func.isRequired,
  errorMessage:PropTypes.string,
  scanText:PropTypes.string,
  scanTitle:PropTypes.string,
}

function mapStateToProps(state) {
  var scan = state.asset.scan;
  return {
    panel:scan.get('dataPanel'),
    device:scan.get('dataDevice'),
    httpUri:scan.get('httpUri'),
    bindHierarchy:scan.get('bindHierarchy'),
    hasAuth:scan.get('hasAuth'),
    isFetching:scan.get('isFetching'),
    errorMessage:scan.get('errorMessage'),
  };
}

export default connect(mapStateToProps,{loadPanelHierarchy,updateScanDeviceData,updateSpHttpInfo,bindAssetHierarchy,loadAssetWithQrcode,exitScan,resetScanError})(Scan);
