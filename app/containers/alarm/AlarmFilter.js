
'use strict';
import React,{Component} from 'react';

import {
  InteractionManager,
} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';

import {filterChanged,filterClosed,
  filterDidChanged,loadAlarmCode,loadAlarmBuildings,resetFilterData} from '../../actions/alarmAction';
import AlarmFilterView from '../../components/alarm/AlarmFilter';

class AlarmFilter extends Component{
  constructor(props){
    super(props);

  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(()=>{
      this.props.loadAlarmCode();
      this.props.loadAlarmBuildings();
    });
    backHelper.init(this.props.navigator,this.props.route.id);
  }
  componentWillReceiveProps(nextProps) {

  }
  componentWillUnmount() {
    backHelper.destroy(this.props.route.id);
    this.props.resetFilterData();
  }
  render() {
    return (
      <AlarmFilterView
        filter={this.props.filter}
        isFetching={this.props.isFetching}
        codes={this.props.codes.toArray()}
        rawCodes={this.props.rawCodes}
        buildings={this.props.buildings.toArray()}
        onClose={()=>{
          this.props.filterClosed();
          this.props.navigator.pop()}}
        doFilter={()=>{
          this.props.filterDidChanged(this.props.filter);
          this.props.navigator.pop();
        }}
        filterChanged={(type,value)=>this.props.filterChanged({type,value})}/>
    );
  }
}

AlarmFilter.propTypes = {
  navigator:PropTypes.object,
  route:PropTypes.object,
  rawCodes:PropTypes.object,
  filter:PropTypes.object,
  isFetching:PropTypes.bool,
  codes:PropTypes.object,
  buildings:PropTypes.object,
  doFilter:PropTypes.func,
  filterChanged:PropTypes.func,
  filterClosed:PropTypes.func,
  resetFilterData:PropTypes.func,
  loadAlarmCode:PropTypes.func,
  loadAlarmBuildings:PropTypes.func,
  filterDidChanged:PropTypes.func,
}

function mapStateToProps(state) {
  var alarmFilter = state.alarm.alarmFilter;
  var filter = alarmFilter.get('temp');
  return {
    filter,
    rawCodes:alarmFilter.get('codes'),
    isFetching:alarmFilter.get('isFetching'),
    codes:alarmFilter.get('filterCodes'),
    buildings:alarmFilter.get('filterBuildings'),
  };
}

export default connect(mapStateToProps,{
  filterChanged,filterDidChanged,loadAlarmCode,resetFilterData,loadAlarmBuildings,filterClosed})(AlarmFilter);
