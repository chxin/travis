'use strict';

import React, { Component } from 'react'
import { Provider } from 'react-redux'
import Entry from './Entry';
import configureStore from '../store/configureStore';

export default class Root extends Component {
  render() {
    return (
      // <View style={{flex:1,backgroundColor:'red'}}>
      // </View>
      <Provider store={configureStore()}>
        <Entry />
      </Provider>
    )
  }
}
