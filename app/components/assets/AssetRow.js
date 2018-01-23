'use strict'
import React,{Component} from 'react';
import {
  View,
  StyleSheet,
  // Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';

import Text from '../Text';
import ClickableRow from '../ClickableRow';

import {BLACK,GRAY} from '../../styles/color';
import NetworkImage from '../NetworkImage';

export default class AssetRow extends Component{
  constructor(props){
    super(props);
  }
  _getRightImage(data){
    return (
      <NetworkImage
        width={85}
        height={59}
        defaultSource = {require('../../images/building_default/building.png')}
        name={data.get('LogoKey')}>
      </NetworkImage>
    );
  }
  _getBuildingName(data){
    return (
      // <View style={[styles.content]}>
        <Text numberOfLines={1} style={styles.titleText}>{data.get('Name')}</Text>
      // </View>
    )
  }
  _getCustomer(data){
    return (
      // <View style={[styles.content]}>
        <Text numberOfLines={2} style={styles.subTitleText}>{data.get('CustomerName')}</Text>
      // </View>
    )
  }
  render(){
    var {rowData} = this.props;
    return (
      <ClickableRow onRowClick={()=>this.props.onRowClick(rowData)}>
        <View style={[styles.row,styles.rowHeight]}>
          <View style={styles.rowLeft}>
            {this._getBuildingName(rowData)}
            {this._getCustomer(rowData)}
          </View>
          <View style={styles.rowRight}>
            {this._getRightImage(rowData)}
          </View>
        </View>
      </ClickableRow>
    );
  }
}

AssetRow.propTypes = {
  user:PropTypes.object,
  onRowClick:PropTypes.func.isRequired,
  rowData:PropTypes.object.isRequired,
}

var styles = StyleSheet.create({
  rowHeight:{
    height:69,
  },
  row:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:'transparent',
    paddingHorizontal:16,
  },
  rowLeft:{
    flexDirection:'column',
    flex:1,
    // paddingVertical:16,
    // backgroundColor:'gray',
  },
  rowRight:{
    justifyContent:'center',
    // flex:1,
    paddingVertical:5,

  },
  titleText:{
    fontSize:17,
    color:BLACK
  },
  subTitleText:{
    fontSize:12,
    color:GRAY,
    marginTop:8,
  }
});
