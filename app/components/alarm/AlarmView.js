
'use strict';
import React,{Component} from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import Toolbar from '../Toolbar';
import List from '../List.js';
import AlarmRow from './AlarmRow.js';
import Section from '../Section.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class Alarm extends Component{
  constructor(props){
    super(props);
  }
  _renderRow(rowData,sectionId,rowId){
    // console.warn('rowData',rowData);
    return (
      <AlarmRow rowData={rowData} onRowClick={this.props.onRowClick} />
    );
  }

  _renderSection(sectionData,sectionId,sectionIndex){
    var sectionTitle = this.props.sectionData.get(sectionId);
    if(!sectionTitle) return null;
    return (
      <Section text={sectionTitle} />
    );
  }


  render() {
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        <Toolbar title={localStr('lang_alarm_problem_alarm')}
          actions={[{
            title:localStr('lang_alarm_filter'),
            icon:require('../../images/filter/filter.png'),
            show: 'always', showWithText: false}]}
          onActionSelected={[this.props.onFilterClick]} />
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
            renderRow={(rowData,sectionId,rowId)=>this._renderRow(rowData,sectionId,rowId)}
            renderSectionHeader={(sectionData,sectionId)=>this._renderSection(sectionData,sectionId)}
            emptyText={localStr('lang_alarm_noalarm')}
            filterEmptyText={localStr('lang_alarm_nofilteralarm')}
          />
      </View>

    );
  }
}

Alarm.propTypes = {
  user:PropTypes.object,
  currentPage:PropTypes.number,
  totalPage:PropTypes.number,
  hasFilter:PropTypes.bool.isRequired,
  onRowClick:PropTypes.func.isRequired,
  onFilterClick:PropTypes.func.isRequired,
  clearFilter:PropTypes.func.isRequired,
  isFetching:PropTypes.bool.isRequired,
  listData:PropTypes.object,
  sectionData:PropTypes.object,
  onRefresh:PropTypes.func.isRequired,
  nextPage:PropTypes.func.isRequired,
}
