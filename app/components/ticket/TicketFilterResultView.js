
'use strict';
import React,{Component} from 'react';

import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import Section from '../Section.js';
import List from '../List.js';
import TicketRow from './TicketRow.js';
import Toolbar from '../Toolbar';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class TicketFilterResultView extends Component{
  constructor(props){
    super(props);
  }
  _renderSection(sectionData,sectionId,sectionIndex){
    var sectionTitle = this.props.sectionData.get(sectionId);
    if(!sectionTitle) return null;
    return (
      <Section text={sectionTitle} />
    );
  }
  _renderRow(rowData,sectionId,rowId){
    // console.warn('rowData',rowData);
    return (
      <TicketRow currentRouteId={this.props.currentRouteId} rowData={rowData} onRowClick={this.props.onRowClick} />
    );
  }
  render() {
    // console.warn('TicketFilterResultView render listData...',this.props.isFetching,this.props.listData);
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        <Toolbar title={localStr('lang_ticket_filter_result')}
          navIcon="back"
          onIconClicked={()=>this.props.onBack()}
          />
         <List
           isFetching={this.props.isFetching}
           hasFilter={false}
           listData={this.props.listData}
           currentPage={this.props.currentPage}
           onRefresh={this.props.onRefresh}
           nextPage={this.props.nextPage}
           totalPage={this.props.totalPage}
           emptyText={localStr('lang_ticket_filter_noresult')}
           needGotoTop={true}
           renderSectionHeader={(sectionData,sectionId)=>this._renderSection(sectionData,sectionId)}
           renderRow={(rowData,sectionId,rowId)=>this._renderRow(rowData,sectionId,rowId)}
         />
      </View>
    );
  }
}

TicketFilterResultView.propTypes = {
  onBack:PropTypes.func,
  currentRouteId:PropTypes.string,
  user:PropTypes.object,
  currentPage:PropTypes.number,
  totalPage:PropTypes.number,
  onRowClick:PropTypes.func.isRequired,
  isFetching:PropTypes.bool.isRequired,
  sectionData:PropTypes.object,
  listData:PropTypes.object,
  onRefresh:PropTypes.func.isRequired,
  nextPage:PropTypes.func.isRequired,
}
