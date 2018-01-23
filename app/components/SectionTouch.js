'use strict'
import React,{Component} from 'react';

import {
  View,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import Text from './Text';
import TouchFeedback from './TouchFeedback';
import {BLACK,GRAY,LIST_BG} from '../styles/color.js';
import Icon from './Icon.js';

export default class SectionTouch extends Component{
  constructor(props){
    super(props);
  }
  render(){
    var {rowData} = this.props;
    var isExpanded = rowData.get('isExpanded');
    var sCount = rowData.get('sCount')|0;
    var count = rowData.get('allHierars').size;
    var arrow = null;
    if(isExpanded){
      arrow = (
        <Icon type="icon_arrow_fold" color={GRAY} size={16} />
      )
    }
    else {
      arrow = (
        <Icon type="icon_arrow_unfold" color={GRAY} size={16} />
      )
    }
    return (
      <View style={{flex:1,backgroundColor:LIST_BG}}>
        <TouchFeedback style={{flex:1}} onPress={()=>{
              this.props.onSectionClick(rowData);
            }}>
          <View style={[styles.row,styles.rowHeight]}>
            {arrow}
            <View style={{flex:1,marginLeft:10,marginRight:10,flexDirection:'row'}}>
              <View style={{flex:1}}>
                <Text numberOfLines={1} style={styles.titleText}>
                  {rowData.get('Name')}
                </Text>
              </View>
              <View style={{width:60}}>
                <Text numberOfLines={1} style={styles.valueText}>
                  {sCount+'/'+count}
                </Text>
              </View>
            </View>
          </View>
        </TouchFeedback>
      </View>
    );
  }
}

SectionTouch.propTypes = {
  onSectionClick:PropTypes.func.isRequired,
  rowData:PropTypes.object.isRequired,
}
var styles = StyleSheet.create({
  rowHeight:{
    height:49,
  },
  row:{
    flexDirection:'row',
    alignItems:'center',
    flex:1,
    // backgroundColor:'red',
    justifyContent:'space-between',
    paddingHorizontal:16,
    paddingTop:19,
    paddingBottom:10,
  },
  titleText:{
    fontSize:14,
    color:BLACK,
    // flex:1,
    // backgroundColor:'white',
  },
  valueText:{
    textAlign:'right',
    flex:1,
    marginLeft:10,
    fontSize:14,
    color:GRAY
  }
});
