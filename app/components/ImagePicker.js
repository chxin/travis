'use strict';
import React,{Component} from 'react';
import PropTypes from 'prop-types';

import {
  View,
  StyleSheet,
  Platform,
  NativeModules,
  CameraRoll,
  Dimensions,
  ScrollView,
  Alert,
  InteractionManager,
 } from 'react-native'
import Icon from './Icon.js';
import TouchFeedback from './TouchFeedback';
import Toolbar from './Toolbar';
import Text from './Text';
import ImagePickerItem from './ImagePickerItem.js';
import Toast from 'react-native-root-toast';
import fileHelper from '../utils/fileHelper.js';
import {localStr,localFormatStr} from '../utils/Localizations/localization.js';

var {ImagePickerManager} = NativeModules;
import Permissions from 'react-native-permissions';

export default class ImagePicker extends Component {
  constructor(props){
    super(props);
    this.state = {endCursor:null,hasMoreImage:true,images:[],chosenImages:[]};
  }
  _getParams(){
    var param = {
      first:20,
    };
    if(this.state.endCursor){
      param.after = this.state.endCursor;
    }

    return param;
  }
  async _getImages(){
    var obj = await CameraRoll.getPhotos(this._getParams());
    // console.warn('page_info',obj.edges);
    var array = this.state.images.concat(obj.edges);

    this.setState({
      endCursor:obj['page_info']['end_cursor'],
      hasMoreImage:obj['page_info']['has_next_page'],
      images:array});

  }
  _imagePressed(image){
    var ret = this.state.chosenImages;
    var index = ret.findIndex((item)=> item.uri === image.uri);
    if(index >= 0){
      ret.splice(index,1);
    }
    else {
    // console.warn('image choose ',image);
      if(ret.length === this.props.max){
        Toast.show(localFormatStr('lang_commons_notice20',this.props.max),{
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
        });
        return;
      }
      ret.push(image);
    }
    this.setState({chosenImages:ret});
  }
  _onScroll(evt){
    // console.warn('scroll',evt.nativeEvent.layoutMeasurement);
    // console.warn('scroll',evt.nativeEvent.contentOffset);
    // console.warn('scroll',evt.nativeEvent.contentSize);
    var {layoutMeasurement,contentOffset,contentSize} = evt.nativeEvent;
    if(this.state.hasMoreImage){
      if((contentOffset.y+layoutMeasurement.height + 200) > contentSize.height ){
        this._getImages();
      }
    }

  }
  _takePhoto(){
    Permissions.getPermissionStatus('camera').then(response => {
        //response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
        console.warn('check',response);
        if (response==='authorized'||response==='undetermined') {

        }else {
          Alert.alert(
            '',
            localStr('lang_commons_notice14'),
            [
              {text:localStr('lang_ticket_cancel'), onPress: () => {
                return;
              }},
              {text:localStr('lang_commons_notice15'), onPress: () => {
                if (Permissions.canOpenSettings()) {
                  Permissions.openSettings();
                }
                return;
              }}
            ]
          )
          // this._mounted(false);
        }
    });
    var options = {
      title: '', // specify null or empty string to remove the title
      cancelButtonTitle: localStr('lang_ticket_cancel'),
      takePhotoButtonTitle: localStr('lang_commons_notice16'), // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: localStr('lang_commons_notice17'), // specify null or empty string to remove this button
      cameraType: 'back', // 'front' or 'back'
      mediaType: 'photo', // 'photo' or 'video'
      // aspectX: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      // aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      quality: 0.5, // 0 to 1, photos only
      angle: 0, // android only, photos only
      allowsEditing: false,
      noData: true,

    };
    ImagePickerManager.launchCamera(options, (response) => {
      console.warn('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.warn('ImagePickerManager Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either data:
        // const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

        // var fileName=fileHelper.getFileNameFromFilePath(response.uri);
        // console.warn('fileName..',fileName);
        var fileName='';
        // uri (on iOS)
        var source;
        if(Platform.OS === 'ios'){
          source = {name:fileName,uri: response.uri.replace('file://', ''), isStatic: true};
        }
        else {
          source = {name:fileName,uri: response.uri, isStatic: true};
        }
        // console.warn('origURL',response.origURL);

        CameraRoll.saveToCameraRoll(source.uri);


        // uri (on android)
        // const source = {uri: response.uri, isStatic: true};
        this.props.done([source]);

      }
    });
  }
  _renderImages(){

    var listOfImage = this.state.images.map((item,index)=>{
      // console.warn('item',item);
      var image = item.node.image;
      // var fileName=fileHelper.getFileNameFromFilePath(image.uri);
      // console.warn('fileName',fileName);
      var findIndex = this.state.chosenImages.findIndex((item)=>item.uri === image.uri);
      var selected = false;
      if(findIndex >=0 ){
        selected=true;
      }
      return (
        <ImagePickerItem
          key={index}
          imagePressed={(image)=>this._imagePressed(image)}
          source={image} selected={selected} />
      )

    })
    var {width} = Dimensions.get('window');
    var whStyle = {width:width/3,height:width/3};
    listOfImage.unshift(
      <View key={'add'} style={[styles.addStyle,whStyle]}>
        <TouchFeedback onPress={()=>this._takePhoto()} style={{flex:1}}>
          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Icon type="photo" color={'white'} size={whStyle.width/3} />
            <Text style={{color:'white',marginTop:6}}>{localStr('lang_commons_notice21')}</Text>
          </View>
        </TouchFeedback>
      </View>
    );
    return listOfImage;
  }
  _getToolbar(){
    var title = localStr('lang_commons_notice18');
    if(this.state.chosenImages.length > 0){
      title = `${title}（${this.state.chosenImages.length}/${this.props.max}）`;
    }
    return (
      <Toolbar title={title}
        navIcon="back"
        actions={[{
          title:localStr('lang_common_finish'),
          show: 'always', showWithText: true
        }]}
        onIconClicked={()=>this.props.onBack()}
        onActionSelected={[()=>{
          this.props.done(this.state.chosenImages);
        }]}
      />
    )
  }
  componentDidMount() {
    if(Platform.OS === 'android'){
      InteractionManager.runAfterInteractions(() => {
        this._getImages();
      });
    }else {
      Permissions.getPermissionStatus('photo').then(response => {
          // response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
          console.warn('check',response);
          if (response==='authorized'||response==='undetermined') {
            InteractionManager.runAfterInteractions(() => {
              this._getImages();
            });
          }else {
            Alert.alert(
              '',
              localStr('lang_commons_notice19'),
              [
                {text: localStr('lang_ticket_cancel'), onPress: () => {
                }},
                {text: localStr('lang_commons_notice15'), onPress: () => {
                  if (Permissions.canOpenSettings()) {
                    Permissions.openSettings();
                  }
                }}
              ]
            )
          }
      });
    }
  }
  render () {
    return (
      <View style={{flex:1}}>
        {this._getToolbar()}
        <ScrollView
          scrollEventThrottle={200}
          style={styles.scrollView}
          onScroll={(evt)=>this._onScroll(evt)}
          contentContainerStyle={styles.content}>
          {this._renderImages()}
        </ScrollView>
      </View>
    );
  }
}

ImagePicker.propTypes = {
  onBack:PropTypes.func,
  done:PropTypes.func,
  max:PropTypes.number,
}
ImagePicker.defaultProps = {
  max:100,
}

const styles = StyleSheet.create({
  scrollView:{
    flex:1,

  },
  content:{
    flexWrap:'wrap',
    flexDirection:'row'
  },



  addStyle: {
    backgroundColor:'gray',
    justifyContent:'center',
    alignItems:'center'
  }
})
