'uset strict'

import React,{Component,NativeModules} from 'react';

import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Camera from 'react-native-camera';
import ViewFinder from './ViewFinder.js';

export default class Scanner extends Component{
  constructor(props){
    super(props);
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

// <View style={{flex:1,backgroundColor:'#000000',opacity:0.6,}}>
// </View>
//
// <View style={{flex:1,flexDirection:'row',}}>
// <View style={{flex:1,backgroundColor:'#000000',opacity:0.6,}}>
// </View>
// <View style={{
//   width:250,
//  //  height:200,
//   borderColor:'white',
//   borderWidth:1,
// }} />
// <View style={{flex:1,backgroundColor:'#000000',opacity:0.6,}}>
// </View>
// </View>
//
// <View style={{flex:1,backgroundColor:'#000000',opacity:0.6,}}>
// </View>

Scanner.propTypes = {
  onBarCodeRead:PropTypes.func.isRequired
}
