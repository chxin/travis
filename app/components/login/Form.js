'use strict';
import React,{Component} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  InteractionManager,
  Platform
} from 'react-native';
import PropTypes from 'prop-types';

import Text from '../Text.js';
import Button from '../Button';
import {GRAY,BLACK,GREEN,LOGIN_SEP,LOGIN_GREEN_DISABLED} from '../../styles/color.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class Form extends Component{
  constructor(props){
    super(props);
    // this.state = {focus:false};
    // this.state = {value1:'',value2:'',submitStatus:'disabled',resendStatus:'disabled'};
  }
  _codeChanged(type,text){
    this.props.onInputChanged(type,text);
  }
  _getTitle(){
    var text = localStr('lang_login_title'), {type} = this.props;
    return (
      <View style={{marginBottom:28,alignItems:'center'}}>
        <Text style={{color:'white',fontSize:24}}>{text}</Text>
      </View>
    )
  }
  _getMobileValidationForm(){
    var senderEnable = this.props.data.get('senderEnable');
    var counterText = this.props.data.get('counter');
    if(counterText){
      counterText += 's';
    }
    else {
      counterText = localStr('lang_login_code_getdes');
    }
    var inputStyle={};
    if (Platform.OS==='android') {
      // inputStyle={marginTop:8,};
    }
    return (
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>+86</Text>
          <TextInput
              ref={(input)=>this._firstInput=input}
              style={[styles.input,inputStyle]}
              keyboardType={"numeric"}
              autoFocus={false}
              underlineColorAndroid={'transparent'}
              textAlign={'left'}
              placeholderTextColor="lightgray"
              textAlignVertical={'center'}
              placeholder={localStr('lang_login_mobile_placeholder')}
              onChangeText={(text)=>this._codeChanged('phoneNumber',text)}
              value={this.props.data.get('phoneNumber')}
            />
        </View>
        <View style={{height:StyleSheet.hairlineWidth,backgroundColor:LOGIN_SEP}} />
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{localStr('lang_login_code_des')}</Text>
          <TextInput
              ref={(input)=>this._secondInput=input}
              style={[styles.input,inputStyle]}
              keyboardType={"numeric"}
              underlineColorAndroid={'transparent'}
              textAlign={'left'}
              placeholderTextColor="lightgray"
              textAlignVertical={'center'}
              placeholder={localStr('lang_login_mobilecode_placeholder')}
              onChangeText={(text)=>this._codeChanged('validCode',text)}
              value={this.props.data.get('validCode')}
            />
          <Button
            text={counterText}
            textStyle={styles.sendButtonText}
            disabledTextStyle={[styles.sendButtonText,styles.sendButtonDisableText]}
            disabledStyle={[styles.sendButton,styles.sendButtonDisable]}
            style={styles.sendButton}
            onClick={()=>this.props.onSend()}
            disabled={!senderEnable} />
        </View>
      </View>

    );
  }
  _getPasswordValidationForm(){
    var inputStyle={};
    if (Platform.OS==='android') {
      // inputStyle={marginTop:18,};
    }
    return (
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{localStr('lang_login_nameinputdes')}</Text>
          <TextInput
              ref={(input)=>this._firstInput=input}
              style={[styles.input,inputStyle]}
              autoFocus={false}
              underlineColorAndroid={'transparent'}
              textAlign={'left'}
              placeholderTextColor="lightgray"
              textAlignVertical={'center'}
              placeholder={localStr('lang_login_name_placeholder')}
              onChangeText={(text)=>this._codeChanged('userName',text)}
              value={this.props.data.get('userName')}
            />
        </View>
        <View style={{height:StyleSheet.hairlineWidth,backgroundColor:LOGIN_SEP}} />
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{localStr('lang_login_passdes')}</Text>
          <TextInput
              ref={(input)=>this._secondInput=input}
              style={[styles.input,inputStyle]}
              secureTextEntry={true}
              underlineColorAndroid={'transparent'}
              textAlign={'left'}
              placeholderTextColor="lightgray"
              textAlignVertical={'center'}
              placeholder={localStr('lang_login_pass_placeholder')}
              onChangeText={(text)=>this._codeChanged("password",text)}
              value={this.props.data.get('password')}
            />
        </View>
      </View>

    );
  }
  _getLoginButton(){
    var submitEnable = this.props.data.get('submitEnable');

    var text = localStr('lang_login_btndes');
    if(this.props.data.get('isFetching')){
      text = localStr('lang_login_btnlogingdes');
    }

    return (
      <Button
        text={text}
        style={styles.button}
        disabledStyle={[styles.button,styles.buttonDisabled]}
        disabledTextStyle={[styles.buttonText,styles.buttonDisabledText]}
        textStyle={styles.buttonText}
        onClick={this.props.onSubmit}
        disabled={!submitEnable} />
    )

  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      // console.warn('mounted');
      // this._firstInput.blur();
      // this._firstInput.focus();
    });
  }
  componentWillUnmount() {
    // this._firstInput.blur();
    // this._secondInput.blur();
  }
  render(){
    var content = null, {type} = this.props;
    if(type === 'mobile'){
      content = this._getMobileValidationForm();
    }
    else{
      content = this._getPasswordValidationForm();
    }


    return (
      <View >
        {this._getTitle()}
        {content}
        {this._getLoginButton()}
      </View>
    )
  }
}

Form.propTypes = {
  type:PropTypes.string.isRequired,
  onSubmit:PropTypes.func.isRequired,
  onSend:PropTypes.func,
  data:PropTypes.object.isRequired,
  onInputChanged:PropTypes.func.isRequired
}


var styles = StyleSheet.create({
  form:{
    backgroundColor:'white',
    borderRadius:6,
    paddingHorizontal:10,

  },
  inputContainer:{
    // flex:1,
    // width:200,
    height:46,
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
    // backgroundColor:'red'
  },
  inputLabel:{
    color:'black',
    fontSize:14,
    width:64,
    textAlign:'center',
  },
  input:{
    flex:1,
    fontSize:14,
    marginLeft:10,
    paddingTop:0,paddingBottom:0,
    // height:30,
    // backgroundColor:'#f0fa'
    // height:48,
  },
  sendButton:{
    backgroundColor:GREEN,
    width:70,
    height:34,
    borderRadius:2,
  },
  sendButtonDisable:{
    backgroundColor:GRAY
  },
  sendButtonText:{
    fontSize:14,
    color:'white'
  },
  sendButtonDisableText:{
    color:'#ffffff88'
  },
  button:{
    marginTop:17,
    backgroundColor:GREEN,
    // flex:1,
    borderRadius:6,
    height:43,
  },
  buttonDisabled:{
    backgroundColor:LOGIN_GREEN_DISABLED
  },
  buttonText:{
    color:'white',
    fontSize:15
  },
  buttonDisabledText:{
    color:'#ffffff50',
  }
});
