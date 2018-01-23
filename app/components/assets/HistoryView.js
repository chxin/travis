
'use strict';
import React,{Component} from 'react';

import {
  View,
  Platform,
  ViewPagerAndroid,
  SegmentedControlIOS,
  DatePickerAndroid,
  DatePickerIOS,
  Alert
} from 'react-native';
import PropTypes from 'prop-types';

import Toolbar from '../Toolbar';
// import Loading from '../Loading';
import PagerBar from '../PagerBar.js';
import {GREEN,TAB_BORDER,LINE} from '../../styles/color.js';
import HistoryControl from './HistoryControl.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

import moment from 'moment';

export default class HistoryView extends Component{
  constructor(props){
    super(props);
    this.state={openDatePicker:false,newDate:null};
  }
  _getDatePicker(){
    if(Platform.OS === 'ios' && this.state.openDatePicker){
      // var value=this.props.filter.get('StartTime');
      // var date = moment(value);
      var date=this.state.newDate;
      return (
        <DatePickerIOS style={{borderTopWidth:1,borderColor:LINE,backgroundColor:'white',zIndex:1}} date={date} mode="date"
          onDateChange={(date1)=>{
            // console.warn(date1);
            this.setState({'newDate':date1});
            }} />
      );
    }
  }
  async _showPicker() {
    if(Platform.OS === 'android'){
      try {
        var value=this.props.filter.get('StartTime');
        var date = moment(value);
        var options = {date:date.toDate()}

        var {action, year, month, day} = await DatePickerAndroid.open(options);
        // console.warn('date',year,month,day);

        if (action !== DatePickerAndroid.dismissedAction) {
          var date = moment({year,month,day,hour:8});//from timezone
          // console.warn('moment',date);
          this.setState({'newDate':date});
          if (!this._checkDateIsValid())
            return;
          this.props.onDateChanged(this.state.newDate);
        }
        // console.warn('ddd',this.state.openDatePicker);
        this.setState({openDatePicker:false});

      } catch ({code, message}) {
        // console.warn(`Error in example '${stateKey}': `, message);
      }
    }
  }
  _checkDateIsValid()
  {
    if(this.state.newDate>moment()){
      Alert.alert(
        '',
        localStr('lang_asset_des27'),
        [
          {text: localStr('lang_ticket_OK'), onPress: () =>{
            this.setState({openDatePicker:false});
          }}
        ]
      )
      return false;
    }
    return true;
  }
  _didDateClick()
  {
    if (this.props.currentIndex!==0) {
      this.setState({'newDate':moment()});
      return;
    }

    if (Platform.OS==='ios') {
      if (this.state.openDatePicker) {
        if (!this._checkDateIsValid())
          return;
        this.props.onDateChanged(this.state.newDate);
      }
    }

    var value=this.props.filter.get('StartTime');
    var date = moment(value);
    this.setState({openDatePicker:!this.state.openDatePicker,newDate:date.toDate()});
    this._showPicker();
  }
  _tabChanged(event){
    // console.warn('_tabChanged',event.nativeEvent.selectedSegmentIndex);
    this.setState({openDatePicker:false});
    this.props.indexChanged(event.nativeEvent.selectedSegmentIndex);
  }
  _onPageSelected(e){
    // console.warn('_onPageSelected...',e.nativeEvent.position);
    this.setState({openDatePicker:false});
    if(e.nativeEvent.position !== this.props.currentIndex){
      this.props.indexChanged(e.nativeEvent.position);
    }
  }
  _pagerBarClicked(index){
    // console.warn('index',index);
    this.setState({openDatePicker:false});
    if(this.props.currentIndex !== index){
      this.props.indexChanged(index);
    }
  }
  // REMTimeStepYear = 5,
  //   REMTimeStepMonth = 3,
  //   REMTimeStepWeek = 2,
  //   REMTimeStepDay = 1,
  //   REMTimeStepHour = 0,
  _getTabArray(){
    var array = [localStr('lang_asset_step_day'),localStr('lang_asset_step_hours')];
    if (this.props.isEnergyData) {
      array = [localStr('lang_asset_step_day'),localStr('lang_asset_step_weeks'),localStr('lang_asset_step_month'),localStr('lang_asset_step_year')];
    }
    return array;
  }
  _getControlView()
  {
    return (
      <HistoryControl
        filter={this.props.filter}
        enablePrview={this.props.enablePrview}
        enableNext={this.props.enableNext}
        enableDatePicker={this.props.currentIndex===0}
        isEnergyData={this.props.isEnergyData}
        onDateClick={()=>this._didDateClick()}
        onLeftClick={()=>{
          if (this.state.openDatePicker) {
            return;
          }
          this.props.onLeftClick()
        }}
        onRightClick={()=>{
          if (this.state.openDatePicker) {
            return;
          }
          this.props.onRightClick();
        }}>
      </HistoryControl>
    );
  }
  _getTabControl(){
    var array = this._getTabArray();
    if(array.length > 1){
      if(Platform.OS === 'android'){
        return (
          <View style={{
            backgroundColor:'transparent',
            paddingVertical:8,
            paddingLeft:16,
            flexDirection:'row'
          }}>
            <View style={{flex:1}}>
              <PagerBar
                barStyle={{
                  borderBottomWidth:1,
                  borderColor:TAB_BORDER,
                  width:220,
                }}
                array={array}
                currentIndex={this.props.currentIndex}
                onClick={(index)=>this._pagerBarClicked(index)} />
            </View>
            <View style={{
                alignItems:'flex-end',
                justifyContent:'flex-end',
                right:16,
            }}>
              {this._getControlView()}
            </View>
          </View>
        )
      }
      else {
        return (
          <View style={{
            backgroundColor:'transparent',
            paddingVertical:8,
            paddingLeft:16,
            flexDirection:'row'
          }}>
            <View style={{flex:1}}>
              <SegmentedControlIOS
                style={{
                width:200}}
                enabled={!this.props.isFetching}
                momentary={false}
                selectedIndex={this.props.currentIndex}
                onChange={(event)=>this._tabChanged(event)}
                tintColor={GREEN}
                values={array}
                 />
            </View>
            <View style={{
                alignItems:'flex-end',
                justifyContent:'flex-end',
                right:16,
            }}>
              {this._getControlView()}
            </View>
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
              <View key={index} style={{flex:1}} accessible={false} pointerEvents='none'>
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
        <Toolbar
          title={`${this.props.name}-${this.props.isEnergyData?localStr('lang_asset_des25'):localStr('lang_asset_des26')}(${this.props.unit})`}
          navIcon="back"
          noShadow={true}
          onIconClicked={()=>this.props.onBack()}
          actions={[]}
         />
        {this._getTabControl()}
        {this._getDatePicker()}
        {this._getView()}
      </View>
    );
  }
}

HistoryView.propTypes = {
  navigator:PropTypes.object,
  onBack:PropTypes.func.isRequired,
  filter:PropTypes.object,
  enablePrview:PropTypes.bool,
  enableNext:PropTypes.bool,
  isEnergyData:PropTypes.bool,
  isFetching:PropTypes.bool,
  contentView:PropTypes.object,
  indexChanged:PropTypes.func.isRequired,
  currentIndex:PropTypes.number.isRequired,
  onDateChanged:PropTypes.func.isRequired,
  onLeftClick:PropTypes.func.isRequired,
  onRightClick:PropTypes.func.isRequired,
  name:PropTypes.string.isRequired,
  unit:PropTypes.string.isRequired,
}
