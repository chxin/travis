'use strict';
import React,{Component} from 'react';
import PropTypes from 'prop-types';

import {View,ToolbarAndroid,Platform,ViewPropTypes} from 'react-native';
import {GREEN} from '../styles/color.js';
import privilegeHelper from '../utils/privilegeHelper.js';

const height = 56;
const statusBarHeight=24;

export default class Toolbar extends Component {
  constructor(props){
    super(props);
  }
  render () {
    var {noShadow,color,navIcon,actions,opacity,...others} = this.props;
    var shadow  = null;
    if(!noShadow){
      shadow  = {elevation:5};
    }

    var backgroundColor = {backgroundColor:color};

    var top = 0;
    if(Platform.OS === 'android' && Platform.Version >= 21){
      top = statusBarHeight;
    }
    var navImage = null;
    if(navIcon === 'back'){
      navImage = require('../images/back_arrow_android/back_arrow.png');
    }
    else if(navIcon === 'close'){
      navImage = require('../images/close/close.png');
    }


    if(actions && actions.length > 0){
      actions = actions.filter((item)=>{
        if(!item.code) return true;
        // console.warn('item.code',item.code);
        if(privilegeHelper.hasAuth(item.code)) return true;
        return false;
      });
      actions.forEach((item)=>{
        if(item.iconType){
          if(item.iconType === 'add'){
            item.icon = require('../images/add/add.png');
          }
          else if(item.iconType === 'edit'){
            item.icon = require('../images/edit/edit.png');
          }
          else if(item.iconType === 'delete'){
            item.icon = require('../images/delete/delete.png');
          }
          else if (item.iconType === 'filter') {
            item.icon = require('../images/filter/filter.png');
          }
        }
      })
    }
    others = Object.assign(others,{titleColor:'white',navIcon:navImage,actions});
    // console.warn('others',others);

    if(opacity === 0){
      return (
        <ToolbarAndroid {...others}
          style={[{
            position:'absolute',top,left:0,right:0,
            height,backgroundColor:'transparent',
          }]}/>
      );
    }

    return (
      <View style={[shadow,backgroundColor]}>
        <ToolbarAndroid {...others}
          onActionSelected={(index)=>{this.props.onActionSelected[index]()}}
          style={[{
            marginTop:top,
            height,backgroundColor:'transparent',
          }]}/>
      </View>
    );
  }
}

Toolbar.propTypes = {
  noShadow:PropTypes.bool,
  style:ViewPropTypes.style,
  navIcon:PropTypes.any,
  actions:PropTypes.any,
  opacity:PropTypes.number,
  color:PropTypes.string,
  onActionSelected:PropTypes.any,
}

Toolbar.defaultProps = {
  noShadow:false,
  color:GREEN,
  opacity:1
}
