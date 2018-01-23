'use strict'

import React,{Component} from 'react';

import {View,StyleSheet,Image,Platform} from 'react-native';
import PropTypes from 'prop-types';
import TouchFeedback from './TouchFeedback';
import Text from './Text';
// import Icon from './Icon.js';
import {TAB,TAB_BORDER,GREEN,TAB_TEXT} from '../styles/color';
import {localStr,localFormatStr} from '../utils/Localizations/localization.js';

export default class TabBar extends Component {
  constructor(props){
    super(props);
  }
  _getNewVersionIcon(isShowIconType)
  {
    if (isShowIconType&&this.props.needUpdate) {
      return (
        <View style={{backgroundColor:'red',width:10,height:10,borderRadius:20,
          position:'absolute',right:-8,
          }}>
        </View>
      );
    }
    return null;
  }
  render () {
    var items = [
      {text:localStr('lang_alarm_assetdes'),
      normal:require('../images/tab_assets_normal/assets_normal.png'),
      selected:require('../images/tab_assets_selected/assets_selected.png')},
      {text:localStr('lang_commons_notice25'),
        normal:require('../images/tab_alarm_normal/alarm_normal.png'),
        selected:require('../images/tab_alarm_selected/alarm_selected.png')},
      {text:localStr('lang_commons_notice26'),
        normal:require('../images/tab_tickets_normal/tickets_normal.png'),
        selected:require('../images/tab_tickets_selected/tickets_selected.png')},
      {text:localStr('lang_my_des25'),
        normal:require('../images/tab_user_normal/user_normal.png'),
        selected:require('../images/tab_user_selected/user_selected.png'),}];
    var content = items.map((item,key) => {
      var selectedColor = TAB_TEXT,image = item.normal;
      if(key === this.props.selectedIndex){
        selectedColor = GREEN;
        image = item.selected;
      }
      return (
        <TouchFeedback style={styles.tab} key={key} onPress={()=>this.props.onSelectedChanged(key)}>
          <View style={[styles.tab,{flexDirection:'column'}]}>
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              {
                this._getNewVersionIcon(item.text===localStr('lang_my_des25'))
              }
              <Image
                source={image}
                style={{width:24,height:24}}/>
              <Text style={[styles.tabText,{color:selectedColor}]}>{item.text}</Text>
            </View>
          </View>
        </TouchFeedback>
      );
    })

    return (
      <View style={styles.bottom}>
        {content}
      </View>
    );
  }
}

TabBar.propTypes = {
  selectedIndex:PropTypes.number,
  onSelectedChanged:PropTypes.func.isRequired,
  needUpdate:PropTypes.bool,
};

TabBar.defaultProps = {
  selectedIndex:0,
}

var styles = StyleSheet.create({
  bottom:{
    // flex:1,
    // position:'absolute',
    backgroundColor:TAB,
    // left:0,
    // right:0,
    // bottom:0,
    height:56,
    borderTopWidth:1,
    borderColor:TAB_BORDER,
    flexDirection:'row',
    justifyContent:'space-between'
    // marginTop:24
    // alignItems:'center'
  },
  tab:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    // backgroundColor:'red'
  },
  tabText:{
    color:TAB_TEXT,
    fontSize:12,
    marginTop:3,
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center'
  }
});
