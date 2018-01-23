'use strict'
import React,{Component} from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import Text from '../Text';
import TouchFeedback from '../TouchFeedback';
import Icon from '../Icon.js';
import {BLACK,GRAY,GREEN} from '../../styles/color';

export default class AssetSelectRow extends Component{
  constructor(props){
    super(props);
  }
  _getNavIcon(){
    var {rowData} = this.props;
    if(!!rowData.get('isSelect')){
      return (
        <View style={styles.selectView}>
          <Icon type='icon_check' size={10} color='white' />
        </View>
      )
    }else {
      return (
        <View style={styles.unSelectView}>
        </View>
      )
    }
  }
  _getSubHierarchyName(data){
    var type = data.get('Type');
    var subType = data.get('SubType');
    var isAsset = !!data.get('IsAsset');
    var isOnl = !!data.get('IsOnline')|false;
    var isOnline = false;
    var offLeft = (data.get('showType') - 2) * 32;
    var iconType = 'icon_panel';
    if (type===2) {
      iconType='icon_building';//room
      if (subType===3) {
        iconType='icon_factory';//room
      }else if (subType===2) {
        iconType='icon_project';//room
      }
      isOnline=true;
    }else if (type===3) {
      iconType='icon_product_line';//room
     if (subType===6) {
       iconType='icon_site';//room
     }
      isOnline=true;
    }else if (type===4) {
      iconType=isAsset?'icon_panel':'icon_panel_box';
      isOnline=true;
    }else if (type===5) {
      iconType=isAsset?'icon_machine':'icon_machine_ol';
      isOnline=isOnl;
    }
    var onlineColor = isOnline?BLACK:'red';
    var textColor = BLACK;
    return (
      <View style={styles.rowContent}>
        {this._getNavIcon()}
        <View style={{flex:1,marginLeft:offLeft+16,flexDirection:'row'}}>
          <Icon type={iconType} size={18} color={onlineColor} />
          <View style={{flex:1,justifyContent:'center'}}>
            <Text numberOfLines={1} style={[styles.titleText,{color:textColor}]}>{this.props.rowData.get(this.props.selKey)}</Text>
          </View>
        </View>
      </View>
    )
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.rowData.get(this.props.selKey) === this.props.rowData.get(this.props.selKey)
        && nextProps.rowData.get('isSelect') === this.props.rowData.get('isSelect')){
      return false;
    }
    return true;
  }
  render(){
    var {rowData,sectionId,rowId} = this.props;
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        <TouchFeedback style={{flex:1}} onPress={()=>{
              this.props.onRowClick(rowData,sectionId,rowId);
            }}>
            {this._getSubHierarchyName(rowData)}
        </TouchFeedback>
      </View>
    );
  }
}

AssetSelectRow.propTypes = {
  user:PropTypes.object,
  onRowClick:PropTypes.func.isRequired,
  rowData:PropTypes.object.isRequired,
  selKey:PropTypes.string.isRequired,
  sectionId:PropTypes.string,
  rowId:PropTypes.string,
}

var styles = StyleSheet.create({
  rowContent:{
    height:45,
    flexDirection:'row',
    // justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:'white',
    paddingHorizontal:16,
  },
  titleText:{
    marginLeft:15,
    fontSize:14,
    color:BLACK
  },
  selectView:{
    width:18,
    height:18,
    borderRadius:10,
    backgroundColor:GREEN,
    justifyContent:'center',
    alignItems:'center'
  },
  unSelectView:{
    width:18,
    height:18,
    borderRadius:10,
    borderColor:GRAY,
    borderWidth:1,
    // marginRight:16,
    justifyContent:'center',
    alignItems:'center'
  },
});
