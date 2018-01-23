'use strict'
import React,{Component} from 'react';

import {
  View,
  Linking,
  ViewPropTypes
} from 'react-native';
import PropTypes from 'prop-types';
import Text from '../Text.js';
import NetworkText from './NetworkText.js';
import {GRAY,BLACK,GREEN} from '../../styles/color.js';

export default class LabelValue extends Component {
  constructor(props){
    super(props);
    this.state={id:null,loaded:false};
  }
  render () {
    var {style,value,label} = this.props;
    var textColor = BLACK;

    var array;
    if(Array.isArray(value)){
      textColor = GREEN;
      array = value;
    }
    else {
      array = [{name:value}];
    }
    return (
      <View style={[{flexDirection:'row'},style]}>
        <View style={{width:56,justifyContent:'flex-start'}}>
          <Text style={{fontSize:12,color:GRAY,lineHeight:30}}>{label}</Text>
        </View>
        <View style={{flex:1}}>
          {
            array.map((item,index)=>{
              var marginTop = null;
              if(index !== 0){
                marginTop = {marginTop:0};
              }
              var textComponent=null;
              if (!item.id) {
                textComponent=(
                  <Text
                    style={{fontSize:12,color:textColor,lineHeight:30,marginTop:0}}
                    numberOfLines={1}>{item.name}</Text>
                );
              }else {
                textComponent=(
                  <NetworkText
                    item={item}
                    style={{fontSize:12,color:textColor,lineHeight:30,marginTop:1}}
                    forceStoped={this.props.forceStoped}></NetworkText>
                );
              }
              return (
                <View key={index} style={[{},marginTop]}>
                  {textComponent}
                </View>
              )
            })
          }
        </View>
      </View>
    )
  }
}

LabelValue.propTypes = {
  label:PropTypes.string.isRequired,
  value:PropTypes.any.isRequired,
  style:ViewPropTypes.style,
  forceStoped:PropTypes.bool,
}
