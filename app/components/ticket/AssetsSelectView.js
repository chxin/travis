
'use strict';
import React,{Component} from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import Toolbar from '../Toolbar';
import List from '../List.js';
import SelectRow from './AssetSelectRow.js';
import SectionTouch from '../SectionTouch.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class AssetsSelectView extends Component{
  constructor(props){
    super(props);
  }
  _renderSection(sectionData,sectionId,sectionIndex){
    var secData = this.props.sectionData.get(sectionId);
    if(!secData) return null;
    return (
      <SectionTouch rowData={secData} onSectionClick={this.props.onSectionClick}/>
    );
  }
  _renderRow(rowData,sectionId,rowId){
    return (
      <SelectRow selKey='Name' rowData={rowData} sectionId={sectionId} rowId={rowId} onRowClick={this.props.onRowClick} />
    );
  }

  render() {
    // console.warn('AssetsSelectView...',this.props.isFetching);
    var disable = !this.props.data || !this.props.selectAssets || this.props.selectAssets.size===0;
    var actions = [{title:localStr('lang_common_finish'),show:'always',disable}];
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        <Toolbar title={this.props.title}
          navIcon="back"
          actions={actions}
          onIconClicked={()=>this.props.onBack()}
          onActionSelected={[()=>{
            this.props.onSave();
          }]}
        />
        <List
          isFetching={this.props.isFetching}
          listData={this.props.data}
          hasFilter={false}
          currentPage={1}
          totalPage={1}
          emptyText={localStr('lang_ticket_notice1')}
          onRefresh={this.props.onRefresh}
          renderRow={(rowData,sectionId,rowId)=>this._renderRow(rowData,sectionId,rowId)}
          renderSectionHeader={(sectionData,sectionId)=>this._renderSection(sectionData,sectionId)}
        />
      </View>
    );
  }
}

AssetsSelectView.propTypes = {
  navigator:PropTypes.object,
  title:PropTypes.string,
  onBack:PropTypes.func.isRequired,
  onSave:PropTypes.func.isRequired,
  user:PropTypes.object,
  onRowClick:PropTypes.func.isRequired,
  onSectionClick:PropTypes.func.isRequired,
  isFetching:PropTypes.bool.isRequired,
  data:PropTypes.object,
  sectionData:PropTypes.object,
  onRefresh:PropTypes.func.isRequired,
  selectAssets:PropTypes.object,
}
