
'use strict';
import React,{Component} from 'react';
import {
  View,
  ListView,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import Toolbar from '../Toolbar';

import StatableSelectorGroup from '../alarm/StatableSelectorGroup';
import StatableInputGroup from './StatableInputGroup';
import Button from '../Button';
import {GREEN,} from '../../styles/color.js';
import Loading from '../Loading';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class TicketFilter extends Component{
  constructor(props){
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {dataSource: ds.cloneWithRows([0,1,2,3])};
  }
  _renderSeparator(sectionId,rowId){
    return (
      <View key={rowId} style={styles.sepView}></View>
    )
  }
  _renderRow(rowData){
    if(rowData === 0){
      return (
        <StatableInputGroup
          title={localStr('lang_ticket_ticketid')}
          text={this.props.selectDatas.get('ticketStrId')}
          onChanged={(text)=>this.props.filterChanged('ticketStrId',text)} />
      );
    }
    else if(rowData === 1){
      return (
        <StatableSelectorGroup
          title={localStr('lang_alarm_states')}
          data={[localStr('lang_ticket_not_start'),localStr('lang_ticket_going'),localStr('lang_ticket_finished'),localStr('lang_ticket_expired')]}
          selectedIndexes={this.props.selectDatas.get('ticketStatus')}
          onChanged={(index)=>this.props.filterChanged('status',index)} />
      );
    }
    else if(rowData === 2){
      return (
        <StatableSelectorGroup
          title={localStr('lang_alarm_type')}
          data={[localStr('lang_ticket_ticket_planning'),localStr('lang_ticket_ticket_alarm'),localStr('lang_ticket_ticket_scene'),localStr('lang_ticket_ticket_folow')]}
          selectedIndexes={this.props.selectDatas.get('ticketTypes')}
          onChanged={(index)=>this.props.filterChanged('types',index)} />
      );
    }
    else if(rowData === 3){
      if (!this.props.arrBuildsName || this.props.arrBuildsName.length===0) {
        return null;
      }
      return (
        <StatableSelectorGroup
          title={localStr('lang_alarm_position')}
          data={this.props.arrBuildsName}
          selectedIndexes={this.props.selectDatas.get('selectBuilds')}
          onChanged={(index)=>this.props.filterChanged('building',index)} />
      );
    }
    return null;

  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.selectDatas !== this.props.selectDatas){
      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

      this.setState({
        dataSource: ds.cloneWithRows([0,1,2,3])
      });
    }

  }
  render() {
    var list = null
    if(!this.props.isFetching){
      list = (
        <View style={{flex:1}}>
          <ListView
            style={{flex:1,backgroundColor:'transparent'}}
            contentContainerStyle={{padding:16,paddingBottom:bottomHeight,backgroundColor:'transparent'}}
            dataSource={this.state.dataSource}
            renderSeparator={(sectionId, rowId, adjacentRowHighlighted)=> this._renderSeparator(sectionId,rowId)}
            renderRow={(rowData,sectionId,rowId) => this._renderRow(rowData,sectionId,rowId)}
          />
        </View>
      )
    }
    else {
      list = (<Loading />);
    }
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        <Toolbar
          title={localStr('lang_ticket_filter')}
          navIcon="close"
          onIconClicked={this.props.onClose}
          actions={[{
            title:localStr('lang_alarm_filter'),
            show: 'always', showWithText:true}]}
            onActionSelected={[this.props.doFilter]}
          />
        {list}
      </View>
    );
  }
}

TicketFilter.propTypes = {
  selectDatas:PropTypes.object,
  arrBuildsName:PropTypes.array,
  doFilter:PropTypes.func.isRequired,
  isFetching:PropTypes.bool.isRequired,
  onClose:PropTypes.func.isRequired,
  filterChanged:PropTypes.func.isRequired,
}

var bottomHeight = 72;

var styles = StyleSheet.create({
  sepView:{
    height:16,
    backgroundColor:'transparent'
  },
  bottom:{
    position:'absolute',
    left:0,
    right:0,
    bottom:0,
    flex:1,
    height:bottomHeight,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'white'
  },
  button:{
    // marginTop:20,
    height:43,
    flex:1,
    marginHorizontal:16,
    borderRadius:6,

  }
});
