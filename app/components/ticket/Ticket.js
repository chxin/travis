
'use strict';
import React,{Component} from 'react';

import {
  View,
  Platform,
  ViewPagerAndroid,
  SegmentedControlIOS
} from 'react-native';
import PropTypes from 'prop-types';

import Toolbar from '../Toolbar';
// import Loading from '../Loading';
import PagerBar from '../PagerBar.js';
import {GREEN,TAB_BORDER} from '../../styles/color.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class Ticket extends Component{
  constructor(props){
    super(props);
  }
  _tabChanged(event){
    // console.warn('_tabChanged',event.nativeEvent.selectedSegmentIndex);
    this.props.indexChanged(event.nativeEvent.selectedSegmentIndex);
  }
  _onPageSelected(e){
    // console.warn('_onPageSelected...',e.nativeEvent.position);
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
    var array = [localStr('lang_ticket_last'),localStr('lang_ticket_today'),localStr('lang_ticket_future')];
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
            }
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
    // console.warn('componentWillReceiveProps...',this.props.currentIndex,nextProps.currentIndex);
    // if(nextProps.currentIndex !== this.props.currentIndex){
      if(this._viewPager){
        this._viewPager.setPage(nextProps.currentIndex);
      }
    // }
  }
  render() {
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        <Toolbar title={localStr('lang_ticket_myticket')}
          actions={[{
          title:localStr('lang_ticket_filter_ticket'),
          iconType:'filter',
          show: 'always', showWithText: false},
          {title:localStr('lang_ticket_create_ticket'),
          iconType:'add',
          code:'TicketEditPrivilegeCode',
          show: 'always', showWithText: false}
        ]}
        onActionSelected={[this.props.onFilterTicket,this.props.onCreateTicket]}
         />
        {this._getTabControl()}
        {this._getView()}
      </View>

    );
  }
}

Ticket.propTypes = {
  navigator:PropTypes.object,
  contentView:PropTypes.object,
  indexChanged:PropTypes.func.isRequired,
  currentIndex:PropTypes.number.isRequired,
  onCreateTicket:PropTypes.func.isRequired,
  onFilterTicket:PropTypes.func.isRequired,
}
