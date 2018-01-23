
'use strict';
import React,{Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';

import Toolbar from '../Toolbar';
import Text from '../Text';
import Button from '../Button';
import TouchFeedback from '../TouchFeedback';
import {LINE,LOGOUT_RED,LIST_BG,GRAY} from '../../styles/color';
import ListSeperator from '../ListSeperator';
import Icon from '../Icon.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class MyView extends Component{
  constructor(props){
    super(props);
    // var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    // this.state = {dataSource: ds.cloneWithRows([0,1,2,3])};
  }
  _logout(){
    this.props.onLogout();
  }
  _renderName()
  {
    var text = this.props.user.get('Name');

    return (
      <View style={styles.row}>
        <Text style={styles.rowPrimaryText}>{localStr('lang_login_nameinputdes')}</Text>
        <Text style={styles.rowSecondaryText}>{text}</Text>
      </View>
    )
  }
  _getNavIcon(isNav){
    if(isNav){
      return (
        <Icon type='arrow_right' size={16} color={GRAY} />
      )
    }
  }
  _renderDisplayName(){
    var value = this.props.user.get('RealName')
    return (
      <TouchFeedback style={[{backgroundColor:'white'},styles.rowHeight]} onPress={()=>{
          if (this.props.canEditRealName) {
            this.props.onRowClick(3);
          }}}>
        <View style={[styles.row]}>
          <Text style={styles.rowPrimaryText}>
            {localStr('lang_my_des22')}
          </Text>
          <View style={{flex:1,alignItems:'center', flexDirection:'row'}}>
            <Text numberOfLines={1} lineBreakModel='charWrapping' style={styles.valueText}>
              {value}
            </Text>
            {this._getNavIcon(this.props.canEditRealName)}
          </View>
        </View>
      </TouchFeedback>
    );
  }
  _renderQRCode(){
    return (
      <TouchFeedback onPress={()=>{this.props.onRowClick(1)}}>
        <View style={styles.row}>
          <Text style={styles.rowPrimaryText}>{localStr('lang_my_des23')}</Text>
          <Image style={styles.qrcode} source={require("../../images/qrcode/qrcode.png")} />
        </View>
      </TouchFeedback>
    )
  }
  _getVersion(isShow)
  {
    return isShow&&(
      <Text numberOfLines={1} lineBreakModel='charWrapping' style={styles.versionText}>
        {this.props.oldVersion}
      </Text>
    );
  }
  _getNeedUpgradeIcon()
  {
    var upIcon=null;
    if (this.props.hasNewVersion) {
      upIcon=(
        <View style={{backgroundColor:'red',width:10,height:10,borderWidth:1,borderColor:'red',borderRadius:5,}}>
        </View>
      );
    }
    return upIcon;
  }
  _renderFeedback()
  {
    return (
      <TouchFeedback style={[{backgroundColor:'white'},styles.rowHeight]} onPress={()=>{
          this.props.onRowClick(4);
        }}>
        <View style={[styles.row]}>
          <Text style={styles.rowPrimaryText}>
            {localStr('lang_my_des13')}
          </Text>
          <View style={{flex:1,alignItems:'center',justifyContent:'flex-end',flexDirection:'row'}}>
            <Text numberOfLines={1} lineBreakModel='charWrapping' style={styles.versionText}>
              {''}
            </Text>
            {this._getNavIcon(true)}
          </View>
        </View>
      </TouchFeedback>
    );
  }
  _renderAbout(){
    return (
      <TouchFeedback style={[{backgroundColor:'white'},styles.rowHeight]} onPress={()=>{
          this.props.onRowClick(2);
        }}>
        <View style={[styles.row]}>
          <Text style={styles.rowPrimaryText}>
            {Platform.OS==='android'?localStr('lang_my_des4'):localStr('lang_my_des5')}
          </Text>
          <View style={{flex:1,alignItems:'center',justifyContent:'flex-end',flexDirection:'row'}}>
            {this._getNeedUpgradeIcon()}
            {this._getVersion(Platform.OS==='android')}
            {this._getNavIcon(true)}
          </View>
        </View>
      </TouchFeedback>
    );
  }
  _renderRow(rowId){
    if(rowId === 0){
      return this._renderName();
    }else if(rowId === 1){
      return this._renderDisplayName();
    }
    else if (rowId === 2) {
      return this._renderQRCode();
    }
    else if (rowId === 3){
      return this._renderFeedback();
    }
    else if (rowId === 4){
      return this._renderAbout();
    }
  }
  _renderSeparator(sectionId,rowId){
    return (
      <View key={rowId} style={styles.sepView}></View>
    )
  }

  _renderFooter(){
    return (
      <Button
        style={{
          backgroundColor:LOGOUT_RED,
          marginTop:42,
          height:48,marginHorizontal:16,
          borderRadius:6,
        }}
        textStyle={{
          fontSize:15,
          color:'#ffffff'
        }}
        text={localStr('lang_my_des24')} onClick={()=>this._logout()} />
    );
  }
  // render() {
  //   console.warn('view render');
  //   return (
  //     <View style={{flex:1,backgroundColor:'white'}}>
  //       <Toolbar title=localStr('lang_my_des25')  />
  //       <ListView
  //         style={{flex:1,backgroundColor:'transparent'}}
  //         contentContainerStyle={{flex:1,backgroundColor:'transparent'}}
  //         dataSource={this.state.dataSource}
  //         renderSeparator={(sectionId, rowId, adjacentRowHighlighted)=> this._renderSeparator(sectionId,rowId)}
  //         renderRow={(rowData,sectionId,rowId) => this._renderRow(rowData,sectionId,rowId)}
  //         renderFooter={() => this._renderFooter()}
  //       />
  //     </View>
  //
  //   );
  // }
  _getSection()
  {
    return (<View style={{
        borderColor:LIST_BG,
        borderBottomWidth:20,
        }}>
      {}
    </View>);
  }
  _getToolbar(data){
    return (
      <Toolbar title={localStr('lang_my_des25')}  />
    );
  }
  render() {
    return (
      <View style={{flex:1,backgroundColor:LIST_BG}}>
        {this._getToolbar(this.props.user)}
        {this._getSection()}
          <ListSeperator/>
            {this._renderRow(0)}
          <ListSeperator/>
            {this._renderRow(1)}
          <ListSeperator/>
            {this._renderRow(2)}
          <ListSeperator/>
            {this._renderRow(3)}
          <ListSeperator/>
            {this._renderRow(4)}
          <ListSeperator/>

          {this._renderFooter()}
      </View>
    );
  }
}

MyView.propTypes = {
  navigator:PropTypes.object,
  user:PropTypes.object,
  canEditRealName:PropTypes.bool,
  oldVersion:PropTypes.string,
  hasNewVersion:PropTypes.bool,
  onLogout:PropTypes.func.isRequired,
  onRowClick:PropTypes.func.isRequired,
}

var styles = StyleSheet.create({
  row:{
    height:56,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:'white',
    paddingHorizontal:16
  },
  rowPrimaryText:{
    fontSize:17,
    color:'black'
  },
  rowSecondaryText:{
    fontSize:17,
    color:'gray'
  },
  valueText:{
    textAlign:'right',
    flex:1,
    marginLeft:10,
    fontSize:17,
    color:GRAY
  },
  versionText:{
    textAlign:'right',
    // flex:1,
    marginLeft:10,
    fontSize:17,
    color:GRAY
  },
  qrcode:{
    width:20,
    height:20
  },
  sepView:{
    height:1,
    // flex:1,
    backgroundColor:LINE
  }
});
