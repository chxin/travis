'use strict';
import React,{Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';

import Icon from '../Icon';
import Form from './Form';
import KeyboardSpacer from '../KeyboardSpacer';
import {BLACK} from '../../styles/color.js';
import Text from '../Text.js';
import TouchFeedback from '../TouchFeedback';
var dismissKeyboard = require('dismissKeyboard');
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class Login extends Component{
  constructor(props){
    super(props);
    var {width,height} = Dimensions.get('window');
    // console.warn('width,height',width,height);
    this.state = {width,height}
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.data === nextProps.data ){
      return false;
    }
    return true;
  }
  render(){
    var {width,height} = this.state;
    var {type} = this.props,text;
    if(type === 'mobile'){
      text = localStr('lang_login_usernamedes');
    }
    else {
      text = localStr('lang_login_mobiledes');
    }
    return (
      <ImageBackground
        source={require('../../images/trial/trial.jpg')}
        resizeMode="cover"
        style={[{width,height},styles.imageBackground]}>
        <View style={styles.form}>
          <Form
            type={this.props.type}
            data={this.props.data}
            onSend={this.props.onSend}
            onSubmit={this.props.onSubmit}
            onInputChanged={this.props.onInputChanged}  />
          <TouchFeedback style={{height:40}} onPress={()=>{this.props.onSwitch();
            dismissKeyboard()}}>
            <View style={{marginTop:10,height:40,alignItems:'center',justifyContent:'center'}}>
              <Text  style={styles.switcherText}>{text}</Text>
            </View>
          </TouchFeedback>


        </View>
        <KeyboardSpacer force={true} />
      </ImageBackground>
    )
  }
}

Login.propTypes = {
  type:PropTypes.string.isRequired,
  onSwitch:PropTypes.func.isRequired,
  onBack:PropTypes.func.isRequired,
  onSubmit:PropTypes.func.isRequired,
  onInputChanged:PropTypes.func.isRequired,
  onSend:PropTypes.func,
  data:PropTypes.object.isRequired,
}

var styles = StyleSheet.create({
  imageBackground:{
    // flex:1,
    justifyContent:'center',
  },
  switcherText:{
    fontSize:14,
    color:'white',
  },
  switcher:{
    marginTop:24,
    height:50,

    // flex:1,
    position:'absolute',
    top:0,
    left:10,
    right:0,
    // backgroundColor:'red',
    justifyContent:'center',
  },
  form:{
    flex:1,
    paddingHorizontal:16,
    // backgroundColor:'red',
    justifyContent:'center',
    // alignItems:'center'
  }
});
