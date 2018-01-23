'use strict';

import React,{Component} from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import ViewFinder from './ViewFinder.js';
import Camera from 'react-native-camera';

export default class Scanner extends Component{
  constructor(props){
    super(props);
  }
  componentWillUnmount() {
    // console.warn('unmount Scanner');
  }
  render() {
    return (
      <Camera
        style={{flex:1,}}
        onBarCodeRead={this.props.onBarCodeRead}
         >
        <View style={{flex:1,backgroundColor:'#000000',opacity:0.6,}}>

        </View>
        <View style={{flexDirection:'row',height:200}}>
          <View style={{flex:1,backgroundColor:'#000000',opacity:0.6,}}>

          </View>
          <View style={{
              width:200,
            }} >
            <ViewFinder />
          </View>
            <View style={{flex:1,backgroundColor:'#000000',opacity:0.6,}}>

            </View>
        </View>

          <View style={{flex:1,backgroundColor:'#000000',opacity:0.6,}}>

          </View>
      </Camera>
    );
  }
}


Scanner.propTypes = {
  onBarCodeRead:PropTypes.func.isRequired
}
