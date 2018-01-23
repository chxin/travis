
'use strict';

import React,{Component} from 'react';
import {InteractionManager,View} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';
import SinglePhotosView from '../../components/assets/SinglePhotosView';
import PhotoShow from './PhotoShow';
// import Loading from '../../components/Loading';

class SinglePhotos extends Component{
  constructor(props){
    super(props);
    this.state = {showPhoto:false};
  }
  _gotoDetail(rowData,rowId,thumbImageInfo){
    // console.warn('SinglePhotos',this.props.arrPhotos.size,rowId,rowData);
    this.props.navigator.push({
      id:'photo_show',
      component:PhotoShow,
      passProps:{
        index:rowId,
        arrPhotos:this.props.arrPhotos,
        thumbImageInfo:thumbImageInfo,
        type:'singlePhoto',
      }
    });
  }
  _showPhoto(){
    this.setState({showPhoto:true});
  }
  componentDidMount() {
    backHelper.init(this.props.navigator,this.props.route.id);
    InteractionManager.runAfterInteractions(()=>{
      this._showPhoto();
    });
  }
  componentWillReceiveProps(nextProps) {

  }
  componentWillUnmount() {
    backHelper.destroy(this.props.route.id);
  }
  render() {
    if(!this.state.showPhoto){
      return (
        <View style={{flex:1,backgroundColor:'white'}}>
        </View>
      );
    }
    return (
      <SinglePhotosView
        data={this.props.arrPhotos}
        onRowClick={(rowData,rowId,thumbImageInfo)=>this._gotoDetail(rowData,rowId,thumbImageInfo)}
        onBack={()=>this.props.navigator.pop()} />
    );
  }
}

SinglePhotos.propTypes = {
  navigator:PropTypes.object,
  route:PropTypes.object,
  user:PropTypes.object,
  hierarchyId:PropTypes.number,
  arrPhotos:PropTypes.object,//immutable
}

function mapStateToProps(state,ownProps) {
  return {
    user:state.user.get('user'),
  };
}

export default connect(mapStateToProps,{})(SinglePhotos);
