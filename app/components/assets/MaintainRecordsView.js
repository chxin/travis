
'use strict';
import React,{Component} from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import Text from '../Text';
import Icon from '../Icon.js';
import {GRAY,BLACK,ALARM_RED,GREEN,LOGOUT_RED,LINE} from '../../styles/color';
import TouchFeedback from '../TouchFeedback';
import ListSeperator from '../ListSeperator';
import Toolbar from '../Toolbar';
import List from '../List.js';
import MaintainRecordRow from './MaintainRecordRow.js';
import Section from '../Section.js';
import RowDelete from '../RowDelete.js'
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class MaintainRecordsView extends Component{
  constructor(props){
    super(props);
  }
  _renderHiddenRow(rowData,sectionId,rowId,closeRow){
    // console.warn('_renderHiddenRow');
    return (
      <RowDelete onPress={()=>{
          closeRow();
          this.props.onRowLongPress(rowData)}} />
    )
  }
  _renderSeperator(sectionId,rowId){
    var isLastRow=false;
    // var secRowCounts=this.props.logs.getSectionLengths();
    // // console.warn('bb',secRowCounts[sectionId],sectionId,rowId);
    if (this.props.listData.getRowCount()===Number(rowId)+1)
      isLastRow=true;
    // console.warn('aa',rowId,this.props.logs.getSectionLengths(),this.props.logs.getRowCount());
    return (
      <ListSeperator key={sectionId+rowId} marginWithLeft={isLastRow?0:20}/>
    );
  }
  _renderRow(rowData,sectionId,rowId,closeRow){
    // console.warn('rowData',rowData);
    return (
      <MaintainRecordRow
        key={rowId}
        rowData={rowData}
        onRowLongPress={this.props.onRowLongPress}
        onRowClick={(rowData)=>{
          closeRow();
          this.props.onRowClick(rowData)
        }}
        />
    );
  }

  _renderSection(sectionData,sectionId,sectionIndex){
    var sectionTitle = this.props.sectionData.get(sectionId);
    if(!sectionTitle) return null;
    return (
      <View style={{height:44,backgroundColor:'#f0f0f5'}}>
      </View>
    );
  }
  _getAssetNoView()
  {
    var textView=(
      <View style={{flex:1,}}>
        <Text numberOfLines={1} style={{fontSize:14,color:'#8e8e9c'}}>
          {'资产编号：DS20170306DS20170306DS20170306DS20170306'}
        </Text>
      </View>
    );
    if (true) {
      textView=(
        <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
          <Icon type="icon_notification" color={LOGOUT_RED} size={15} />
          <Text numberOfLines={1} style={{fontSize:14,color:LOGOUT_RED,marginLeft:3}}>
            {'无资产编号，请尽快填写。'}
          </Text>
        </View>
      );
    }
    return textView;
  }
  _getSubToolbarView()
  {
    return (
      <View style={{
          height:44,backgroundColor:'#F0F0F5',
          alignItems:'center',paddingHorizontal:16,
          flexDirection:'row',borderTopWidth:1,
          borderBottomWidth:1,borderColor:LINE
        }}>
        {this._getAssetNoView()}
        <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
          <TouchFeedback
            onPress={()=>{
              this.props.onFilterClick();
            }}>
            <View style={{width:30,height:30,alignItems:'center',justifyContent:'flex-end',flexDirection:'row'}}>
              <Icon type="icon_filter" color={GREEN} size={16} />
            </View>
          </TouchFeedback>

          <TouchFeedback
            onPress={()=>{
              this.props.onAddClick();
            }}>
            <View style={{width:30,height:30,alignItems:'center',justifyContent:'flex-end',flexDirection:'row'}}>
              <Icon type="icon_add" color={GREEN} size={16} />
            </View>
          </TouchFeedback>
        </View>
      </View>
    )
  }
  render() {
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        {this._getSubToolbarView()}
        <List
          needGotoTop={true}
          isFetching={this.props.isFetching}
          listData={this.props.listData}
          hasFilter={this.props.hasFilter}
          currentPage={this.props.currentPage}
          nextPage={this.props.nextPage}
          onRefresh={this.props.onRefresh}
          totalPage={this.props.totalPage}
          clearFilter={this.props.clearFilter}
          onFilterClick={this.props.onFilterClick}
          swipable={true}
          renderSeperator={(sectionId,rowId)=>this._renderSeperator(sectionId,rowId)}
          renderRow={(rowData,sectionId,rowId,rowMap)=>this._renderRow(rowData,sectionId,rowId,rowMap)}
          renderHiddenRow={(rowData,sectionId,rowId,rowMap)=>this._renderHiddenRow(rowData,sectionId,rowId,rowMap)}
          renderSectionHeader={(sectionData,sectionId)=>this._renderSection(sectionData,sectionId)}
          emptyText={'无设备维修历史记录'}
          filterEmptyText={'没有符合条件的内容'}
        />
      </View>
    );
  }
}

MaintainRecordsView.propTypes = {
  user:PropTypes.object,
  currentPage:PropTypes.number,
  totalPage:PropTypes.number,
  hasFilter:PropTypes.bool.isRequired,
  onRowClick:PropTypes.func.isRequired,
  onFilterClick:PropTypes.func.isRequired,
  onAddClick:PropTypes.func.isRequired,
  onRowLongPress:PropTypes.func.isRequired,
  clearFilter:PropTypes.func.isRequired,
  isFetching:PropTypes.bool.isRequired,
  listData:PropTypes.object,
  sectionData:PropTypes.object,
  onRefresh:PropTypes.func.isRequired,
  nextPage:PropTypes.func.isRequired,
}
