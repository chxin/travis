'use strict'
import React,{Component} from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import Text from '../Text';
import ClickableRow from '../ClickableRow';
import Icon from '../Icon';
import {BLACK,GREEN} from '../../styles/color';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class HierarchyRow extends Component{
  constructor(props){
    super(props);
  }
  _getOfflineState(isGateway,isOnline)
  {
    if (isGateway&&isOnline===false) {
      return (
        <View style={{alignItems:'center',justifyContent:'center',backgroundColor:'#fdece5',borderRadius:3}}>
          <Text numberOfLines={1} style={[styles.offlineText]}>{localStr('lang_asset_des18')}</Text>
        </View>
      );
    }else {
      return null;
    }
  }
  _getSubHierarchyName(data){
    var type = data.get('Type');
    var subType = data.get('SubType');
    var isAsset = !!data.get('IsAsset');
    var isOnl = !!data.get('IsOnline')|false;
    var isOnline = false;
    var offLeft = (data.get('showType') - 3) * 30;
    var iconType = 'icon_panel';
    if (type===3) {
      iconType='icon_product_line';//room
      if (subType===6) {
        iconType='icon_site';//room
      }
      isOnline=data.get('IsOnline');
    }else if (type===4) {
      iconType=isAsset?'icon_panel':'icon_panel_box';
      isOnline=true;
    }else if (type===5) {
      iconType=isAsset?'icon_machine':'icon_machine_ol';
      isOnline=isOnl;
    }
    var onlineColor = isOnline?BLACK:'red';
    if (type===3) {
      onlineColor=BLACK;
    }
    var textColor = BLACK;
    if(this.props.isCurrent){
      textColor = GREEN;
    }
    return (
      <View style={styles.rowContent}>
        <View style={{flex:1,marginLeft:offLeft,flexDirection:'row'}}>
          <Icon type={iconType} size={18} color={onlineColor} />
          <View style={{flexDirection:'row'}}>
            <View style={{justifyContent:'center'}}>
              <Text numberOfLines={1} style={[styles.titleText,{color:textColor}]}>{data.get('Name')}</Text>
            </View>
            {this._getOfflineState(type===3,isOnline)}
          </View>
        </View>
      </View>
    )
  }
  render(){
    var {rowData} = this.props;
    return (
      <ClickableRow currentRouteId={this.props.currentRouteId} onRowClick={()=>this.props.onRowClick(rowData)}>
        <View style={[styles.row,styles.rowHeight]}>
          {this._getSubHierarchyName(rowData)}
        </View>
      </ClickableRow>
    );
  }
}

HierarchyRow.propTypes = {
  user:PropTypes.object,
  onRowClick:PropTypes.func.isRequired,
  isCurrent:PropTypes.bool.isRequired,
  currentRouteId:PropTypes.string,
  rowData:PropTypes.object.isRequired,
}

var styles = StyleSheet.create({
  rowHeight:{
    height:45,
  },
  rowContent:{
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'transparent',
    flex:1,
    paddingHorizontal:16,
  },
  titleText:{
    fontSize:14,
    marginHorizontal:16,
  },
  offlineText:{
    fontSize:13,
    color:'#f28459',
    marginHorizontal:4,
  },
});
