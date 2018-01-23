
'use strict';
import React,{Component} from 'react';

import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import Scanner from '../Scanner';
import Text from '../Text.js';
import Loading from '../Loading.js';
import Toolbar from '../Toolbar';
import {localStr,localFormatStr} from '../utils/Localizations/localization.js';

export default class CameraView extends Component{
  constructor(props){
    super(props);
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
          top:0,
        }}>
        <Toolbar
          title=''
          color='transparent'
          titleColor="white"
          navIcon="back"
          onIconClicked={()=>{
            this.props.onBack();
          }}
        />
      </View>

        <View style={{
            position:'absolute',
            left:0,right:0,
            justifyContent:'center',
            alignItems:'center',
            bottom:100,
          }}>
          <Text style={{
              fontSize:17,color:'white'
            }}>{localStr('lang_commons_notice13')}</Text>
        </View>
      </View>

    );
  }
  render() {
    var scanner = null;
    if(this.props.openCamera){
      scanner = this._getScanner();
    }


    if(this.props.isFetching){
      scanner = (<Loading />);
    }


    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        {scanner}
      </View>

    );
  }
}

CameraView.propTypes = {
  navigator:PropTypes.object,
  isFetching:PropTypes.bool.isRequired,
  openCamera:PropTypes.bool.isRequired,
  barCodeComplete:PropTypes.func.isRequired,
  onBack:PropTypes.func.isRequired,
}
