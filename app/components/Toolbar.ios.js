'use strict';
import React,{Component} from 'react';
import PropTypes from 'prop-types';

import {View,StyleSheet,Image,ViewPropTypes} from 'react-native';
import {GREEN,IOS_NAVBAR,IOS_NAVBAR_BORDER,LIGHTGRAY} from '../styles/color.js';
import Text from './Text.js';
import TouchFeedback from './TouchFeedback';
import privilegeHelper from '../utils/privilegeHelper.js';

const height = 64;
const statusBarHeight=20;
const sideWidth = 38;
const navHeight = 44;

export default class Toolbar extends Component {
  constructor(props){
    super(props);
  }
  render () {
    var {navIcon,onIconClicked,tintColor,color,borderColor,title,titleColor,actions} = this.props;
    var navView = null;
    var width = 22;
    var navImage = null;
    if(navIcon === 'back'){
      navImage = require('../images/back_arrow/back_arrow.png');
    }
    else if(navIcon === 'close'){
      navImage = require('../images/close/close.png');
    }
    var marginLeft = 5;

    if(navImage){
      navView = (
        <TouchFeedback style={{width:sideWidth,height:navHeight}} onPress={onIconClicked}>
          <View style={{marginLeft,flex:1,justifyContent:'center',}}>
            <Image style={{tintColor,width,height:width}} source={navImage}  />
          </View>
        </TouchFeedback>

      );
    }
    else {
      navView=(
        <View style={{width:sideWidth,marginLeft}}>
        </View>
      );
    }
    var actionsView = null;
    if(actions){
      actions = actions.filter((item)=>{
        if(!item.code) return true;
        // console.warn('item.code',item.code);
        if(privilegeHelper.hasAuth(item.code)) return true;
        return false;
      });
      actionsView = actions.map((item,index)=>{
        // console.warn('actions.map((item,index)=>{',item);
        var imageOrText = null;
        var enabled = !item.disable;
        if(item.iconType || item.icon){
          if(item.iconType === 'add'){
            item.icon = require('../images/add/add.png');
          }
          else if(item.iconType === 'edit'){
            item.icon = require('../images/edit/edit.png');
          }
          else if(item.iconType === 'delete'){
            item.icon = require('../images/delete/delete.png');
          }else if (item.iconType === 'filter') {
            item.icon = require('../images/filter/filter.png');
          }
          imageOrText = (
            <Image style={{tintColor,width,height:width}} source={item.icon}  />
          );
        }
        else {
          width = null;
          imageOrText = (
            <Text style={{color:enabled?tintColor:'rgba(0, 0, 0, .12)',fontSize:15,width:50,}}>{item.title}</Text>
          );
        }
        return (
          <TouchFeedback key={index} style={{width:sideWidth,height:navHeight}} onPress={()=>{
              if (enabled) {
                this.props.onActionSelected[index]();
              }
            }}>
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              {imageOrText}
            </View>
          </TouchFeedback>
        );
      });
    }
    else {
      actionsView = (
        <View style={{width:sideWidth}}>
        </View>
      );
    }

    var titleStyle = [styles.titleText];
    if(titleColor){
      titleStyle.push({color:titleColor});
    }
    if(color === 'transparent'){
      borderColor = 'transparent';
    }
    return (
      <View style={[styles.nav,{backgroundColor:color,borderColor:borderColor}]}>
        <View style={{
            flexDirection:'row',
            flex:1,
            justifyContent:'center',
            alignItems:'center',
            // backgroundColor:'red',
            position:'absolute',left:50,right:50,top:statusBarHeight,height:navHeight}}>
            <View style={{flex:1,justifyContent:'center'}}>
              <Text style={titleStyle} numberOfLines={1}>
                {title}
              </Text>
            </View>
        </View>
        {navView}
        <View style={{flexDirection:'row',paddingRight:8}}>
          {actionsView}
        </View>

      </View>
    );
  }
}

Toolbar.propTypes = {
  noShadow:PropTypes.bool,
  style:ViewPropTypes.style,
  opacity:PropTypes.number,
  titleColor:PropTypes.string,
  color:PropTypes.string,
  navIcon:PropTypes.string,
  onIconClicked:PropTypes.func,
  tintColor:PropTypes.string,
  title:PropTypes.string,
  actions:PropTypes.any,
  onActionSelected:PropTypes.any,
  borderColor:PropTypes.string,
}

Toolbar.defaultProps = {
  noShadow:false,
  color:IOS_NAVBAR,
  tintColor:GREEN,
  borderColor:IOS_NAVBAR_BORDER,
  opacity:1
}

var styles = StyleSheet.create({
  nav:{
    // marginTop:statusBarHeight,
    paddingTop:statusBarHeight,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    // justifyContent:'center',
    height,
    backgroundColor:GREEN,
    borderBottomWidth:1,

  },
  titleText:{
    fontSize:17,
    fontWeight: '500',
    textAlign: 'center',
  }
});
