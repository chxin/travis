'use strict'
import React,{Component} from 'react';
import {
  View,
  ListView,
} from 'react-native';
import PropTypes from 'prop-types';
// import Icon from '../Icon.js';
// import {BLACK,GRAY,GREEN} from '../../styles/color';
import Toolbar from '../Toolbar';
import List from '../List.js';
import SimpleRow from './SimpleRow.js';

export default class DeviceParameterView extends Component{
  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = { dataSource:this.ds.cloneWithRows(props.data)};
  }
  _renderRow(rowData,sectionId,rowId){
    // console.warn('DeviceParameterView_renderRow',rowData);
    return (
      <SimpleRow rowData={rowData} onRowClick={this.props.onRowClick} />
    )
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.data !== this.props.data){
      this.setState({dataSource:this.ds.cloneWithRows(nextProps.data)})
    }
  }
  render(){
    return (
      <View style={{flex:1}}>
        <Toolbar
          title={this.props.title}
          navIcon="back"
          onIconClicked={this.props.onBack} />
        <List
          isFetching={false}
          listData={this.state.dataSource}
          hasFilter={false}
          currentPage={1}
          totalPage={1}
          emptyText=''
          renderRow={(rowData,sectionId,rowId)=>this._renderRow(rowData,sectionId,rowId)}
        />
      </View>
    );
  }
}

DeviceParameterView.propTypes = {
  onBack:PropTypes.func.isRequired,
  data:PropTypes.array.isRequired,
  title:PropTypes.string.isRequired,
  onRowClick:PropTypes.func,
}
