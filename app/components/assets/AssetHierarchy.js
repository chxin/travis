
'use strict';
import React,{Component} from 'react';
import {
  View,
  InteractionManager,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';

import Toolbar from '../Toolbar';
import List from '../List.js';
import HierarchyRow from './HierarchyRow';

import TouchFeedback from '../TouchFeedback.js';
import Text from '../Text.js';
import Icon from '../Icon.js';

import {MENU_GRAY,ALARM_RED,BLACK,LIST_BG} from '../../styles/color';

import ModalDropdown from 'react-native-modal-dropdown';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class AssetHierarchyView extends Component{
  constructor(props){
    super(props);
  }
  _renderMenuItem(index)
  {
    if (index==='menuScan') {
      return (
          <View style={{flex:1}}>
            <TouchFeedback
              onPress={()=>{
                this.refs['modalMenu'].hide();
                this.props.onScanClick();
              }}>
              <View style={{flexDirection:'row',alignItems:'center',marginHorizontal:14,height:42}}>
                <Icon type='icon_scan' size={15} color={MENU_GRAY} />
                <Text style={{fontSize:14,color:MENU_GRAY,marginLeft:8}}>{localStr('lang_asset_des2')}</Text>
              </View>
            </TouchFeedback>
          </View>
      );
    }else if (index==='menuBind') {
      return (
        <View style={{flex:1,}}>
          <TouchFeedback
            onPress={()=>{
              this.refs['modalMenu'].hide();
              this.props.onBindClick();
            }}>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginHorizontal:14,height:42}}>
              <Icon type='icon_bind' size={15} color={MENU_GRAY} />
              <Text style={{fontSize:14,color:MENU_GRAY,marginLeft:8}}>{localStr('lang_asset_des3')}</Text>
            </View>
          </TouchFeedback>
        </View>
      );
    }
  }
  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    // console.warn(rowID);
    var key = `spr_${rowID}`;
    if (rowID!=='0'||!this.props.hasBindAuth) {
      return (<View style={{height:1,marginHorizontal:14,backgroundColor:'transparent'}}key={key}/>);
    }
    return (<View style={{height:1,marginHorizontal:14,backgroundColor:'#abafae'}}key={key}/>);
  }
  _getDropMenu()
  {
    var arrMenu=['menuScan'];
    var height=Platform.OS==='ios'?42:42;
    if (this.props.hasBindAuth) {
      arrMenu.push('menuBind');
      height=Platform.OS==='ios'?87:87;
    }
    return (
      <ModalDropdown ref='modalMenu'
        textStyle={{color:'transparent'}}
        style={{height:0,position:'absolute',right:2,top:30,backgroundColor:'transparent'}}
        options={arrMenu}
        renderSeparator={this._renderSeparator.bind(this)}
        dropdownStyle={{flex:1,backgroundColor:'white',shadowColor:'#000',shadowOffset:{width:1,height:2},shadowOpacity:0.5,height}}
        renderRow={(index)=>this._renderMenuItem(index)}
      />
    );
  }
  _renderRow(rowData,sectionId,rowId){
    var isCurrent = false;
    // if(rowData.get('Id') === this.props.currentPanel){
    //   isCurrent = true;
    // }
    return (
      <HierarchyRow currentRouteId={this.props.currentRouteId} isCurrent={isCurrent} rowData={rowData}
        onRowClick={(rowData)=>{
          this.props.onRowClick(rowData);
        }}
      />
    );
  }
  render() {
    var actions = null;
    if(this.props.isFromScan !== true){
      actions = [{
        title:localStr('lang_asset_des2'),
        icon:require('../../images/scan_more/scan_more.png'),
        show: 'always', showWithText: false}];
    }
    // console.warn('AssetHierarchyView..render ',this.props.isFetching,this.props.listData);
    return (
      <View style={{flex:1,backgroundColor:'white',
      }}>
        <Toolbar
          title={this.props.isFromScan?localStr('lang_asset_des4'):this.props.buildData.get('Name')}
          navIcon="back"
          actions={actions}
          onActionSelected={[()=>{
            this.refs['modalMenu'].show();
          }]}
          onIconClicked={()=>this.props.onBack()}/>
          {this._getDropMenu()}
          <List
            isFetching={this.props.isFetching}
            listData={this.props.listData}
            hasFilter={false}
            currentPage={1}
            totalPage={1}
            emptyText={localStr('lang_asset_des5')}
            onRefresh={this.props.onRefresh}
            renderRow={(rowData,sectionId,rowId)=>this._renderRow(rowData,sectionId,rowId)}
          />
      </View>
    );
  }
}

AssetHierarchyView.propTypes = {
  navigator:PropTypes.object,
  onScanClick:PropTypes.func.isRequired,
  onBindClick:PropTypes.func.isRequired,
  user:PropTypes.object,
  currentRouteId:PropTypes.string,
  buildData:PropTypes.object,
  onBack:PropTypes.func.isRequired,
  currentPanel:PropTypes.number,
  isFromScan:PropTypes.bool,
  onRowClick:PropTypes.func.isRequired,
  isFetching:PropTypes.bool.isRequired,
  hasBindAuth:PropTypes.bool.isRequired,
  listData:PropTypes.object,
  onRefresh:PropTypes.func.isRequired,
}
