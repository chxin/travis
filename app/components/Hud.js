'use strict'
import React,{Component,} from 'react';

import {
  View,
  Animated,
  Easing,
  StyleSheet,
  Text,
  ViewPropTypes
} from 'react-native';
import PropTypes from 'prop-types';

import Icon from './Icon.js';
import {localStr,localFormatStr} from '../utils/Localizations/localization.js';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor:'#00000050',
    justifyContent: "center", alignItems: "center", position:"absolute", top: 0, bottom: 0, left: 0, right: 0},
  hudContainer: {
     width:120, height:120, borderRadius: 5, justifyContent: "center", alignItems: "center"
   }
})

export default class Hud extends Component {
  static contextTypes = {
    showSpinner:PropTypes.func
  }
  constructor(props,context) {
     super(props,context);
     this.state = {
       fadeDuration: 700,
       isVisible: false,
       isRotating: false,
       fadeAnim: new Animated.Value(0),
       rotationAnim: new Animated.Value(0),
     };
   }
   _fadeIn() {
     this.setState({isVisible: true})
     Animated.timing(
       this.state.fadeAnim,
       {toValue: 1, duration: this.state.fadeDuration}
     ).start();
   }
   _fadeOut() {
     Animated.timing(
       this.state.fadeAnim,
       {toValue: 0, duration: this.state.fadeDuration}
     ).start(() => {
       this.setState({isVisible: false})
     });
   }
   _initializeRotationAnimation(isRotating) {
     this.state.rotationAnim.setValue(0)
     if (!isRotating && !this.state.isVisible) return;

     Animated.timing(this.state.rotationAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.linear,
        }).start(() => {
          this._initializeRotationAnimation()
        });
   }
   _getInterpolatedRotateAnimation() {
     return this.state.rotationAnim.interpolate({
           inputRange: [0, 1],
         outputRange: ['0deg', '360deg']
       });
   }
   _getHudContainerStyles() {
     return [styles.hudContainer, {opacity: this.state.fadeAnim}, {backgroundColor: '#00000050'}]
   }
  _getContainerStyles() {
    return [this.props.style, {flex: 1}];
  }
  _getIconWrapperStyles() {
    var styles = this.state.isRotating ? {transform: [{rotate: this._getInterpolatedRotateAnimation()}]} : {};
    return styles;
  }
  _renderIcon(type) {
    return (
      <Animated.View style={[this._getIconWrapperStyles(),{width:36,height:36,}]}>
        <Icon type={type} color='white' style={{width:36,height:36}} size={36} />
      </Animated.View>
    )
  }
  _showHud(icon, rotate, hideOnCompletion, hudText) {
    this.setState({isVisible: false, icon: icon, isRotating: rotate, hudText:hudText})
    this._initializeRotationAnimation(rotate);
    this._fadeIn();

    return new Promise((resolve, reject) => {
      if (hideOnCompletion) {
        setTimeout(() => {
          // console.warn('hide');
          this.hide();
          setTimeout(() => {
            // console.warn('resolve');
            resolve();
          }, this.state.fadeDuration/2.0)
        }, this.state.fadeDuration*3)
      }
    });
  }
  hide() {
    this._fadeOut();
  }
  showSpinner(step) {
    // console.warn('showSpinner',step);
    if (step==='posting') {
      return this._showHud('icon_sync',true,false,localStr('lang_my_des30'));
    }else if (step==='success') {
      return this._showHud('icon_success',false,true,localStr('lang_my_des31'));
    }else if (step==='bindsuccess') {
      return this._showHud('icon_success',false,true,localStr('lang_my_des32'));
    }
    return this._showHud('icon_sync',true);
  }
  _renderText(text){
    return text&&(
      <View style={{alignItems:'center',justifyContent:'center',marginTop:8}}>
        <Text style={{fontSize:16,color:'white'}}>
          {text}
        </Text>
      </View>
    );
  }
  render() {
    if (!this.state.isVisible) return null;
    return (
      <View style={styles.mainContainer}>
        <Animated.View style={this._getHudContainerStyles()}>
          {this._renderIcon(this.state.icon)}
          {this._renderText(this.state.hudText)}
        </Animated.View>
      </View>
    )
  }
}

Hud.propTypes = {
  style:ViewPropTypes.style
}
