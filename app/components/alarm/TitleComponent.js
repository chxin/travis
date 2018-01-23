'use strict';
import React from 'react';
import {View} from 'react-native'
import Text from '../Text.js';


export default (props) => {
  return (
    <View>
      <Text style={{marginBottom:8}}>{props.title}</Text>
      {props.children}
    </View>
  )
}
