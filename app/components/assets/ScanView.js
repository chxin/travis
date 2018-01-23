
'use strict';
import React,{Component} from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import Scanner from '../Scanner';
import Text from '../Text.js';
import Loading from '../Loading';
import Toolbar from '../Toolbar';
import ViewFinder from '../ViewFinder.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class ScanView extends Component{
  constructor(props){
    super(props);
  }
  _barcodeReceived(e){
    // console.warn('barcode',e);
    if(e.type === 'QR_CODE' || e.type === 'org.iso.QRCode'){
      this.props.barCodeComplete(e.data);
    }
  }
  _getScanner(){
    return (
      <View style={{flex:1,backgroundColor:'transparent'}}>
        <Scanner
          onBarCodeRead={(e)=>this._barcodeReceived(e)}
        />
        <View style={{
            position:'absolute',
            left:0,right:0,
            justifyContent:'center',
            alignItems:'center',
            bottom:100,
          }}>
          <Text style={{
              fontSize:17,color:'white',textAlign:'center'
            }}>{this.props.scanText}</Text>
        </View>
      </View>
    );
  }
  render() {
    var scanner = null;
    if(this.props.openCamera){
      scanner = this._getScanner();
    }
    else {
      scanner = (<ViewFinder />);
    }

    if(this.props.isFetching){
      scanner = (<Loading />);
    }


    return (
      <View style={{flex:1,backgroundColor:'black'}}>
        {scanner}
        <View style={{
            position:'absolute',
            left:0,right:0,
            top:0,
          }}>
          <Toolbar
            title={this.props.scanTitle}
            color='transparent'
            tintColor="white"
            titleColor='white'
            navIcon="back"
            onIconClicked={()=>{
              this.props.onBack();
            }}
          />
        </View>
      </View>
    );
  }
}

ScanView.propTypes = {
  navigator:PropTypes.object,
  isFetching:PropTypes.bool.isRequired,
  openCamera:PropTypes.bool.isRequired,
  barCodeComplete:PropTypes.func.isRequired,
  onBack:PropTypes.func.isRequired,
  scanText:PropTypes.string,
  scanTitle:PropTypes.string,
}

ScanView.defaultProps = {
  scanText:localStr('lang_commons_notice13'),
  scanTitle:'',
}
