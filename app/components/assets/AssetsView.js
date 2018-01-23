
'use strict';
import React,{Component} from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import Toolbar from '../Toolbar';
import List from '../List.js';
import AssetRow from './AssetRow';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class AssetsView extends Component{
  constructor(props){
    super(props);
  }
  _renderRow(rowData,sectionId,rowId){
    return (
      <AssetRow rowData={rowData} onRowClick={this.props.onRowClick} />
    );
  }
  render() {
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        <Toolbar title={localStr('lang_alarm_assetdes')}
          actions={[{
            title:localStr('lang_alarm_filter'),
            icon:require('../../images/scan/scan.png'),
            show: 'always', showWithText: false}]}
          onActionSelected={[this.props.onScanClick]}/>
          <List
            isFetching={this.props.isFetching}
            listData={this.props.listData}
            hasFilter={this.props.hasFilter}
            currentPage={this.props.currentPage}
            totalPage={this.props.totalPage}
            emptyText={localStr('lang_asset_des6')}
            onRefresh={this.props.onRefresh}
            renderRow={(rowData,sectionId,rowId)=>this._renderRow(rowData,sectionId,rowId)}
          />
      </View>

    );
  }
}

AssetsView.propTypes = {
  navigator:PropTypes.object,
  onScanClick:PropTypes.func.isRequired,
  user:PropTypes.object,
  currentPage:PropTypes.number,
  totalPage:PropTypes.number,
  hasFilter:PropTypes.bool.isRequired,
  onRowClick:PropTypes.func.isRequired,
  isFetching:PropTypes.bool.isRequired,
  listData:PropTypes.object,
  onRefresh:PropTypes.func.isRequired,
  nextPage:PropTypes.func.isRequired,
}
