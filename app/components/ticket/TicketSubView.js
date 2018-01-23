
'use strict';
import React,{Component} from 'react';

import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import Section from '../Section.js';
import List from '../List.js';
import TicketRow from './TicketRow.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class TicketSubView extends Component{
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
      <TicketRow rowData={rowData} onRowClick={this.props.onRowClick} />
    );
  }
  render() {
    // console.warn('TicketSubView render listData...',this.props.isFetching,this.props.listData);
    return (
      <List
        needGotoTop={true}
        isFetching={this.props.isFetching}
        hasFilter={false}
        listData={this.props.listData}
        currentPage={this.props.currentPage}
        onRefresh={this.props.onRefresh}
        nextPage={this.props.nextPage}
        totalPage={this.props.totalPage}
        emptyText={localStr('lang_ticket_noticket')}
        renderSectionHeader={(sectionData,sectionId)=>this._renderSection(sectionData,sectionId)}
        renderRow={(rowData,sectionId,rowId)=>this._renderRow(rowData,sectionId,rowId)}
      />
    );
  }
}

TicketSubView.propTypes = {
  user:PropTypes.object,
  currentPage:PropTypes.number,
  totalPage:PropTypes.number,
  onRowClick:PropTypes.func.isRequired,
  isFetching:PropTypes.bool.isRequired,
  sectionData:PropTypes.object,
  listData:PropTypes.object,
  onRefresh:PropTypes.func.isRequired,
  nextPage:PropTypes.func.isRequired,
  keyType:PropTypes.string,
}
