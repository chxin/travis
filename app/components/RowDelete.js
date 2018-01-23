'use strict'

import React from 'react';

import {View,} from 'react-native'

import Text from './Text.js';
import TouchFeedback from './TouchFeedback';
import {localStr,localFormatStr} from '../utils/Localizations/localization.js';

export default (props) => {
  return (
    <View
      style={{
        flex:1,
        alignItems:'flex-end'
      }}>
      <TouchFeedback style={{
          flex:1,

        }} onPress={props.onPress}>
        <View style={{flex:1,
            width:80,
            backgroundColor:'red',
        justifyContent:'center',
        alignItems:'center'}}>
          <Text style={{
              color:'white'
            }}>{localStr('lang_ticket_remove')}</Text>
        </View>

      </TouchFeedback>
    </View>
  )
}
