'use strict'
import React,{Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';

import TouchFeedback from '../TouchFeedback';
import NetworkImage from '../NetworkImage';

export default class PhotoThuNaiRow extends Component{
  constructor(props){
    super(props);
  }
  render(){
    var {rowData,rowId} = this.props;
    var {width} = Dimensions.get('window');
    var photoW = parseInt((width-4*6)/4.0);//85
    // console.warn(width,photoW);
    return (
      <View style={[styles.rowStyle,{width:photoW,height:photoW}]}>
        <TouchFeedback style={{flex:1}} onPress={()=>{
          this.props.onRowClick(rowData,rowId,{width:photoW-2,height:photoW-2})
        }}>
        <View style={{flex:1,}}>
          <NetworkImage
            resizeMode='cover'
            imgType='jpg'
            width={photoW-2}
            height={photoW-2}
            defaultSource = {require('../../images/building_default/building.png')}
            name={rowData.get('ImageId')}>
          </NetworkImage>
        </View>
        </TouchFeedback>
      </View>
    );
  }
}

PhotoThuNaiRow.propTypes = {
  user:PropTypes.object,
  rowId:PropTypes.string,
  onRowClick:PropTypes.func.isRequired,
  rowData:PropTypes.object.isRequired,
}

var styles = StyleSheet.create({
  rowStyle: {
    justifyContent: 'center',
    // padding: 0,
    marginTop:5,
    marginLeft:3,
    // width: 85,
    // height: 85,
    backgroundColor: 'gray',
    // alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC'
  },
});
