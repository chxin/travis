
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
import Button from '../Button';
import {GREEN,} from '../../styles/color.js';
import Loading from '../Loading';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class MaintainFilterView extends Component{
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
    // console.warn('_renderRow');
    if(rowData === 0){
      return (
        <StatableSelectorGroup
          title={localStr('lang_alarm_states')}
          data={[localStr('lang_alarm_not_resolved'),localStr('lang_alarm_already_resolved')]}
          selectedIndexes={this.props.filter.get('status')}
          onChanged={(index)=>this.props.filterChanged('status',index)} />
      );
    }
    else if(rowData === 1){
      return (
        <StatableSelectorGroup
          title={localStr('lang_alarm_leveldes')}
          data={[localStr('lang_alarm_high_level'),localStr('lang_alarm_midd_level'),localStr('lang_alarm_low_level')]}
          selectedIndexes={this.props.filter.get('level')}
          onChanged={(index)=>this.props.filterChanged('level',index)} />
      );
    }
    else if(rowData === 2){
      return (
        <StatableSelectorGroup
          title={localStr('lang_alarm_category')}
          data={this.props.codes}
          selectedIndexes={this.props.filter.get('code')}
          onChanged={(index)=>this.props.filterChanged('code',index)} />
      );
    }
    else if(rowData === 3){
      if (!this.props.buildings || this.props.buildings.length===0) {
        return null;
      }
      return (
        <StatableSelectorGroup
          title={localStr('lang_alarm_position')}
          data={this.props.buildings}
          selectedIndexes={this.props.filter.get('building')}
          onChanged={(index)=>this.props.filterChanged('building',index)} />
      );
    }
    return null;

  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.filter !== this.props.filter){
      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

      this.setState({
        dataSource: ds.cloneWithRows([0,1,2,3])
      });
    }

  }
  render() {
    var list = null
    if(this.props.rawCodes && !this.props.isFetching){
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
          title={localStr('lang_alarm_filterdes')}
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

MaintainFilterView.propTypes = {
  filter:PropTypes.object,
  codes:PropTypes.array,
  rawCodes:PropTypes.object,
  buildings:PropTypes.array,
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
