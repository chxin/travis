'use strict'
import React,{Component} from 'react';

import {
  View,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import Text from '../Text';
// import TouchFeedback from '../TouchFeedback';
import {GRAY,LINE_HISTORY} from '../../styles/color.js';
// import Icon from '../Icon.js';
import IconButton from '../IconButton.js';
import Button from '../Button.js';
import moment from 'moment';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class HistoryControl extends Component{
  constructor(props){
    super(props);
  }
  _updateTimeDescrip()
  {
    // console.warn('_updateTimeDescrip...',this.props.filter);
    var StartTime=this.props.filter.get('StartTime');
    var EndTime=this.props.filter.get('EndTime');
    var step=this.props.filter.get('Step');
    if (step===1) {
      return StartTime.format(localStr('lang_asset_des19'));
    }else if (step===0) {
      return `${StartTime.format(localStr('lang_asset_des20'))}~${EndTime.format("HH:mm")}`;
    }else if (step===2) {
      var tempEndT=moment(EndTime).subtract(1,'s');
      return `${StartTime.format(localStr('lang_asset_des19'))}~${tempEndT.format(localStr('lang_asset_des21'))}`;
    }else if (step===3) {
      return `${StartTime.format(localStr('lang_asset_des22'))}`;
    }else if (step===5) {
      return `${StartTime.format(localStr('lang_asset_des23'))}`;
    }
  }
  render(){
    var {enablePrview,enableNext} = this.props;
    return (
      <View style={styles.rowStyle}>
        <IconButton
          style={{width:30}}
          iconType="icon_arrow_left"
          normalColor={LINE_HISTORY}
          disableColor={GRAY}
          onClick={()=>this.props.onLeftClick()}
          disabled={!enablePrview} />
        <Button
          style={[{backgroundColor:'transparent'}]}
          textStyle={styles.titleText}
          text={this._updateTimeDescrip()}
          disabled={!this.props.enableDatePicker}
          onClick={()=>this.props.onDateClick()} />
        <IconButton
          style={{width:30}}
          iconType="icon_arrow_right"
          normalColor={LINE_HISTORY}
          disableColor={GRAY}
          onClick={()=>this.props.onRightClick()}
          disabled={!enableNext} />
      </View>
    );
  }
}

HistoryControl.propTypes = {
  isEnergyData:PropTypes.bool,
  onLeftClick:PropTypes.func.isRequired,
  onRightClick:PropTypes.func.isRequired,
  onDateClick:PropTypes.func.isRequired,
  enablePrview:PropTypes.bool,
  enableNext:PropTypes.bool,
  enableDatePicker:PropTypes.bool,
  filter:PropTypes.object,
}

HistoryControl.defaultProps = {
  enableDatePicker:true,
}

var styles = StyleSheet.create({
  rowStyle:{
    flex:1,
    flexDirection:'row',
    alignItems:'center',
  },
  titleText:{
    fontSize:16,
    color:LINE_HISTORY,
    // flex:1,
    // backgroundColor:'white',
  },
});
