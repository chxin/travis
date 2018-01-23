
'use strict';

import React,{Component} from 'react';
import {InteractionManager,Platform} from 'react-native';
import PropTypes from 'prop-types';

import {loadHistoryDatas,updateStepData,resetHistoryData} from '../../actions/historyAction.js';
import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';
import HistoryView from '../../components/assets/HistoryView';
import HistoryDataView from '../../components/assets/HistoryDataView';

import moment from 'moment';

var Orientation = require('react-native-orientation');

var _startToExit=false;

class History extends Component{
  constructor(props){
    super(props);
    this.state = {currSegnmentIndex:0};
  }
  _onLeftClick()
  {
    if (this.props.isFetching) {
      return;
    }
    this.props.updateStepData({'type':'left','index':this.state.currSegnmentIndex,'isEnergyData':this.props.isEnergyData});
  }
  _onRightClick()
  {
    if (this.props.isFetching) {
      return;
    }
    this.props.updateStepData({'type':'right','index':this.state.currSegnmentIndex,'isEnergyData':this.props.isEnergyData});
  }
  _onDateSelect(date1)
  {
    console.warn('DatePickerIOS...',date1);
    if (this.props.isFetching) {
      return;
    }
    this.props.updateStepData({'type':'center','index':this.state.currSegnmentIndex,'isEnergyData':this.props.isEnergyData,'newDate':date1});
  }
  _indexChanged(index)
  {
    if (this.props.isFetching) {
      return;
    }
    this.setState({currSegnmentIndex:index});
    this.props.updateStepData({'type':'step','index':index,'isEnergyData':this.props.isEnergyData});
  }
  _gotoDetail(rowData,rowId){
    // console.warn('SinglePhotos',this.props.arrPhotos.size,rowId,rowData);
  }
  _loadHistoryDatas(filter)
  {
    var endTime=moment(filter.get('EndTime')).add(8,'h').unix();
    var step=filter.get('Step');
    var param={
      'Parameters':[{'Unit':this.props.unit,'Id':this.props.uniqueId}],
      'NeedNavigator':0,
      'EndTime': endTime,//1476835200,
	    'Interval': step,//1,
	    'IsIncludeLast': 1
    }
    this.props.loadHistoryDatas(param);
  }
  _getCurrentContentView(){
    var obj = {
      isFetching:this.props.isFetching,
      data:this.props.data,
      isEnergyData:this.props.isEnergyData,
      step:this.props.filter.get('Step'),
    };

    var component = (
      <HistoryDataView {...obj} />
    );
    return component;
  }
  _orientationDidChange(orientation){
    if (Platform.OS === 'android'||_startToExit) {
      // Orientation.lockToPortrait();
      return;
    }
    if (orientation === 'LANDSCAPE') {
      //do something with landscape layout
    } else {
      //do something with portrait layout
      Orientation.lockToLandscape();
    }
  }
  componentWillMount()
  {
    this.props.resetHistoryData();
  }
  componentDidMount() {
    Orientation.lockToLandscape();//ios is here
    Orientation.addOrientationListener(this._orientationDidChange);
    // StatusBar.setHidden(true);
    InteractionManager.runAfterInteractions(()=>{
      this._loadHistoryDatas(this.props.filter);

      backHelper.init(this.props.navigator,this.props.route.id,()=>{
        Orientation.lockToPortrait();//when hardware back
        this.props.navigator.pop();
      });
    });

  }
  componentWillReceiveProps(nextProps) {
    if(this.props.filter !== nextProps.filter){
      InteractionManager.runAfterInteractions(()=>{
        this._loadHistoryDatas(nextProps.filter);
      });
    }
  }
  componentWillUnmount() {
    // StatusBar.setHidden(false);
    backHelper.destroy(this.props.route.id);
  }
  render() {
    return (
      <HistoryView
        onBack={()=>{
          _startToExit=true;
          Orientation.removeOrientationListener(this._orientationDidChange);
          Orientation.lockToPortrait();//when left top button back
          InteractionManager.runAfterInteractions(()=>{
            this.props.navigator.pop();
          });
        }}
        name={this.props.name}
        unit={this.props.unit}
        isFetching={this.props.isFetching}
        isEnergyData={this.props.isEnergyData}
        filter={this.props.filter}
        enablePrview={this.props.enablePrview}
        enableNext={this.props.enableNext}
        currentIndex={this.state.currSegnmentIndex}
        indexChanged={(index)=>{this._indexChanged(index)}}
        contentView={this._getCurrentContentView()}
        onDateChanged={(date)=>this._onDateSelect(date)}
        onLeftClick={()=>this._onLeftClick()}
        onRightClick={()=>this._onRightClick()}
        />
    )
  }
}

History.propTypes = {
  navigator:PropTypes.object,
  route:PropTypes.object,
  user:PropTypes.object,
  filter:PropTypes.object,
  data:PropTypes.object,
  enablePrview:PropTypes.bool,
  enableNext:PropTypes.bool,
  isFetching:PropTypes.bool,
  loadHistoryDatas:PropTypes.func,
  updateStepData:PropTypes.func,
  resetHistoryData:PropTypes.func,
  isEnergyData:PropTypes.bool,
  name:PropTypes.string,
  unit:PropTypes.string,
  uniqueId:PropTypes.number,
}

function mapStateToProps(state,ownProps) {
  var historyData = state.asset.historyData;
  // console.warn('mapStateToProps...',historyData);
  var unit=ownProps.unit.toLowerCase();
  var arrEnergyDatas=['kwh','kvah','kvarh'];
  return {
    user:state.user.get('user'),
    unit:ownProps.unit,
    isEnergyData:historyData.get('isEnergyData'),
    isFetching:historyData.get('isFetching'),
    filter:historyData.get('filter'),
    data:historyData.get('data'),
    enablePrview:historyData.get('enablePrview'),
    enableNext:historyData.get('enableNext'),
  };
}

export default connect(mapStateToProps,{loadHistoryDatas,updateStepData,resetHistoryData})(History);
