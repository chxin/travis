'use strict'
import React,{Component} from 'react';
import {
  View,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';

import List from '../List.js';
import SimpleRow from './SimpleRow.js';
import Section from '../Section.js';
import NetworkImage from '../NetworkImage.js';
import SectionParamTouch from './SectionParamTouch.js';
import AgeingView from './AgeingView.js';
import LineGauge from './LineGauge';

export default class DeviceRuntimeSettingView extends Component{
  constructor(props){
    super(props);
  }
  _renderSection(sectionData,sectionId,sectionIndex){
    if(!this.props.sectionData || !this.props.sectionData.get(sectionId)){
      return null
    }
    var secData=this.props.sectionData.get(sectionId);
    if (secData&&secData.get('isExpanded')===null) {
      return (
        <Section text={secData.get('title')} />
      );
    }
    return (
      <SectionParamTouch rowData={secData} onSectionClick={this.props.onSectionClick}/>
    );
  }
  _renderRow(rowData,sectionId,rowId){
    if (rowData.get('title')==='image') {
      return this._renderImage();
    }else if (rowData.get('title')==='AgingData') {
      return this._renderAgingData(rowData);
    }else if (rowData.get('title')==='DemandRequestRatio') {
      return this._renderDemandRatio(rowData);
    }
    var secData=this.props.sectionData.get(sectionId);
    var style={};
    // if (secData&&secData.get('isExpanded')!==null) {
    //   style={marginLeft:34};
    // }
    return (
      <SimpleRow textStyle={style} rowData={rowData} onRowClick={()=>{}} />
    )
  }
  _renderAgingData(rowData)
  {
    return (
      <View style={{alignItems:'center',justifyContent:'center',backgroundColor:'white'}}>
        <AgeingView ageValue={rowData.get('value')} errStr={rowData.get('errStr')}/>
      </View>
    );
  }
  _renderDemandRatio(rowData)
  {
    // console.warn(rowData);
    return (
      <View style={{backgroundColor:'white'}}>
        <LineGauge min={0} max={100} value={rowData.get('value')} errStr={rowData.get('errStr')}/>
      </View>
    )
  }
  _renderImage(){
    // console.warn('footer',this.props.imageId);
    if(this.props.imageId){
      var {width} = Dimensions.get('window');
      width -= 20;
      var height = parseInt(width*2/3);
      return (
        <View style={{padding:10,backgroundColor:'white'}}>
          <NetworkImage resizeMode="contain" name={this.props.imageId} width={width} height={height} />
        </View>

      );
    }
    return null;
  }
  render(){
    return (
      <List
        isFetching={this.props.isFetching}
        listData={this.props.data}
        hasFilter={false}
        currentPage={1}
        totalPage={1}
        emptyText={this.props.emptyText}
        onRefresh={this.props.onRefresh}
        renderRow={(rowData,sectionId,rowId)=>this._renderRow(rowData,sectionId,rowId)}
        renderSectionHeader={(sectionData,sectionId)=>this._renderSection(sectionData,sectionId)}
      />
    );
  }
}

DeviceRuntimeSettingView.propTypes = {
  isFetching:PropTypes.bool.isRequired,
  imageId:PropTypes.string,
  sectionData:PropTypes.object.isRequired,
  onRefresh:PropTypes.func.isRequired,
  data:PropTypes.object,
  onSectionClick:PropTypes.func,
  emptyText:PropTypes.string,
}
