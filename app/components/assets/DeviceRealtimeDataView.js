'use strict'

import React,{Component} from 'react';
import PropTypes from 'prop-types';
// import Icon from '../Icon.js';
// import {BLACK,GRAY,GREEN} from '../../styles/color';
import List from '../List.js';
import SimpleRow from './SimpleRow.js';
import Section from '../Section.js';

export default class DeviceRuntimeSettingView extends Component{
  constructor(props){
    super(props);
  }
  _renderSection(sectionData,sectionId,sectionIndex){
    if(!this.props.sectionData || !this.props.sectionData.get(sectionId)){
      return null
    }
    return (
      <Section text={this.props.sectionData.get(sectionId)} />
    );
  }
  _renderRow(rowData){
    return (
      <SimpleRow rowData={rowData} onRowClick={this.props.onRowClick} />
    )
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
  sectionData:PropTypes.object.isRequired,
  onRefresh:PropTypes.func.isRequired,
  data:PropTypes.object,
  onRowClick:PropTypes.func,
  emptyText:PropTypes.string,
}
