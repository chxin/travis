
'use strict';
import React,{Component} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import Toolbar from '../Toolbar';
import List from '../List.js';
import SimpleRow from './SimpleRow';
import NetworkImage from '../NetworkImage.js';
import Section from '../Section.js';
import TouchFeedback from '../TouchFeedback.js';
import Icon from '../Icon.js';
import {GRAY} from '../../styles/color.js';
import Text from '../Text.js';
import UploadableImage from '../UploadableImage';
import Toast from 'react-native-root-toast';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class DetailView extends Component{
  constructor(props){
    super(props);
    var {width} = Dimensions.get('window');
    var height = parseInt(width*2/3);
    this.state = {imgWidth:width,imgHeight:height};
  }
  _renderSection(sectionData,sectionId,sectionIndex){
    var sectionTitle = this.props.sectionData.get(sectionId);
    if(!sectionTitle) return null;
    return (
      <Section text={sectionTitle} />
    );
  }
  _renderRow(rowData,sectionId,rowId){
    // console.warn('renderRow',rowData);
    if(sectionId === '0'){
      let imageUri = rowData.get('value');
      var touchItem = null;
      if(this.props.canEdit){
        touchItem = (
          <TouchFeedback
            style={styles.emptyImageContainer}
            onPress={()=>this._addImage()}>
            <View style={{flex:1,}}>

            </View>
          </TouchFeedback>
        );
      }
      if(rowData.get('pendingImageUri')){
        // console.warn('pendingImageUri',rowData.get('pendingImageUri'));
        return (
          <UploadableImage
            name={this.props.ownData.get('Id').toString()}
            postUri={`${this.props.ownData.get('Id')}/logo/upload`}
            uri={rowData.get('pendingImageUri')}
            resizeMode="contain"
            height={this.state.imgHeight} width={this.state.imgWidth}
            loadComplete = {this.props.changeImageComplete} >
            {touchItem}
          </UploadableImage>
        );
      }

      if(imageUri){
        return (
          <NetworkImage
            resizeMode='contain'
            width={this.state.imgWidth}
            height={this.state.imgHeight}
            name={rowData.get('value')}
             >
             {touchItem}
           </NetworkImage>
        );
      }
      else {
        // console.warn('pendingImageUri',rowData.get('pendingImageUri'));

        return (
          <View style={{width:this.state.imgWidth,height:this.state.imgHeight}}>
            <TouchFeedback
              style={styles.emptyImageContainer}
              onPress={()=>this._addImage()}>
              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Icon type="icon_add" color={GRAY} size={60} />
                <Text style={styles.emptyImageText}>{this.props.emptyImageText}</Text>
              </View>

            </TouchFeedback>
          </View>
        );
      }

    }
    return (
      <SimpleRow rowData={rowData} onRowClick={this.props.onRowClick} />
    );
  }
  _addImage(){
    if(this.props.canEdit){
      this.props.changeImage()
    }
    else {
      this._showToast();
    }
  }
  _showToast(){
    Toast.show(localStr('lang_alarm_des1'), {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
    });
  }
  _getToolbar(){
    if(this.props.hasToolbar){
      return (
        <Toolbar
          title={this.props.ownData.get('Name')}
          navIcon="back"
          onIconClicked={()=>this.props.onBack()}
        />
      );
    }
    return null;
  }
  render() {
    if(this.props.errorMessage){
      return  (
        <View style={{flex:1,backgroundColor:'white'}}>
          {this._getToolbar()}
          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Text style={{fontSize:17,color:GRAY}}>{this.props.errorMessage}</Text>
          </View>
        </View>
      )
    }
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        {this._getToolbar()}
          <List
            isFetching={this.props.isFetching}
            listData={this.props.data}
            hasFilter={false}
            currentPage={1}
            totalPage={1}
            emptyText={localStr('lang_asset_des8')}
            onRefresh={this.props.onRefresh}
            renderRow={(rowData,sectionId,rowId)=>this._renderRow(rowData,sectionId,rowId)}
            renderSectionHeader={(sectionData,sectionId)=>this._renderSection(sectionData,sectionId)}
          />
      </View>

    );
  }
}

DetailView.propTypes = {
  navigator:PropTypes.object,
  onBack:PropTypes.func,
  sectionData:PropTypes.object,
  pendingImageUri:PropTypes.string,
  emptyImageText:PropTypes.string,
  changeImageComplete:PropTypes.func.isRequired,
  changeImage:PropTypes.func.isRequired,
  onRowClick:PropTypes.func.isRequired,
  isFetching:PropTypes.bool.isRequired,
  data:PropTypes.object,
  canEdit:PropTypes.bool,
  hasToolbar:PropTypes.bool,
  onRefresh:PropTypes.func.isRequired,
  ownData:PropTypes.object.isRequired,
  errorMessage:PropTypes.string,
}

DetailView.defaultProps = {
  hasToolbar:true
}

var styles = StyleSheet.create({
  emptyImageContainer:{
    flex:1,
  },
  emptyImageText:{
    fontSize:17,
    marginTop:10,
    color:GRAY
  }
});
