
'use strict';
import React,{Component} from 'react';
import {
  View,
  Platform,
  // Dimensions,
  ViewPagerAndroid,
  SegmentedControlIOS
} from 'react-native';
import PropTypes from 'prop-types';

import Toolbar from '../Toolbar';
import Text from '../Text';
import Loading from '../Loading';
// import SimpleRow from './SimpleRow';
// import NetworkImage from '../NetworkImage.js';
import PagerBar from '../PagerBar.js';
import {GREEN,TAB_BORDER,GRAY} from '../../styles/color.js';
// import ViewPager from '../ViewPager.android.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class DeviceDetailView extends Component{
  constructor(props){
    super(props);
    // console.warn('DeviceDetailView',props);
  }
  _tabChanged(event){
    // console.warn('_tabChanged',event.nativeEvent.selectedSegmentIndex);
    this.props.indexChanged(event.nativeEvent.selectedSegmentIndex);
  }
  _onPageSelected(e){
    if(e.nativeEvent.position !== this.props.currentIndex){
      this.props.indexChanged(e.nativeEvent.position);
    }
  }
  _pagerBarClicked(index){
    // console.warn('index',index);
    if(this.props.currentIndex !== index){
      this.props.indexChanged(index);
    }
  }
  _getTabArray(){
    // console.warn('deviceData',this.props.deviceData);
    if(!this.props.deviceData){
      return [];
    }
    // console.warn('hasRealtime',this.props.hasRealtime);
    // console.warn('hasRuntime',this.props.hasRuntime);

    var array = [localStr('lang_asset_des13')];
    if(this.props.hasRealtime){
      array.push(localStr('lang_asset_des14'));
    }
    if(this.props.hasRuntime){
      array.push(localStr('lang_asset_des15'));
    }
    if(this.props.has6Dashboard){
      array.push(localStr('lang_asset_des16'));
    }
    array.push('维修历史');
    return array;
  }
  _getTabControl(){
    var array = this._getTabArray();
    // console.warn('array',array);
    if(array.length > 1){
      if(Platform.OS === 'android'){
        return (
          <PagerBar
            barStyle={{
              borderBottomWidth:1,
              borderColor:TAB_BORDER,
            }}
            array={array}
            currentIndex={this.props.currentIndex}
            onClick={(index)=>this._pagerBarClicked(index)} />
        )
      }
      else {
        // console.warn('SegmentedControlIOS',this.props.currentIndex);
        return (
          <View style={{
              backgroundColor:'transparent',
              paddingVertical:16,
              borderBottomWidth:1,
              borderColor:TAB_BORDER,
              paddingHorizontal:32}}>
            <SegmentedControlIOS
              momentary={false}
              selectedIndex={this.props.currentIndex}
              onChange={(event)=>this._tabChanged(event)}
              tintColor={GREEN}
              values={array}
               />
          </View>
        )
      }
    }

  }
  _getView(){
    if(!this.props.deviceData){
      return (
        <Loading />
      )
    }
    if(Platform.OS === 'ios'){
      return this.props.contentView;
    }
    else {
      return (
        <ViewPagerAndroid
          ref={(viewPager) => { this._viewPager = viewPager; }}
          style={{flex:1}}
          initialPage={this.props.currentIndex}
          onPageSelected={(e)=>this._onPageSelected(e)}
        >
        {
          this._getTabArray().map((item,index)=>{
            var contentView = null;
            if(this.props.currentIndex === index){
              contentView = this.props.contentView;
              // console.warn('contentView',contentView,index,this.props.currentIndex);
            }
            // console.warn('contentView',contentView);
            return (
              <View key={index} style={{flex:1}}>
              {
                contentView
              }
              </View>
            )
          })
        }
      </ViewPagerAndroid>
      )
    }
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.currentIndex !== this.props.currentIndex){
      if(this._viewPager){
        this._viewPager.setPage(nextProps.currentIndex);
      }
    }
  }
  render() {
    if(this.props.errorMessage){
      return  (
        <View style={{flex:1,backgroundColor:'white'}}>
          <Toolbar
            title={this.props.title}
            navIcon="back"
            noShadow={true}
            onIconClicked={()=>this.props.onBack()}
          />
          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Text style={{fontSize:17,color:GRAY}}>{this.props.errorMessage}</Text>
          </View>
        </View>
      )
    }
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        <Toolbar
          title={this.props.title}
          navIcon="back"
          noShadow={true}
          onIconClicked={()=>this.props.onBack()}
        />
        {this._getTabControl()}
        {this._getView()}
      </View>

    );
  }
}

DeviceDetailView.propTypes = {
  navigator:PropTypes.object,
  onBack:PropTypes.func.isRequired,
  contentView:PropTypes.object,
  indexChanged:PropTypes.func.isRequired,
  currentIndex:PropTypes.number.isRequired,
  hasRealtime:PropTypes.bool.isRequired,
  hasRuntime:PropTypes.bool.isRequired,
  deviceData:PropTypes.object,
  title:PropTypes.string.isRequired,
  errorMessage:PropTypes.string,
}
