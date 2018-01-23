
'use strict';
import React,{Component} from 'react';
import {
  InteractionManager,
} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../utils/backHelper';
import ImagePickerView from '../components/ImagePicker.js';

class ImagePicker extends Component{
  constructor(props){
    super(props);
    this.state = {};
  }
  _onBackClick(){
    this.props.navigator.pop();
  }
  _done(chosenImages){
    this.props.dataChanged(chosenImages);
    this.props.navigator.pop();
  }
  componentDidMount() {
    backHelper.init(this.props.navigator,this.props.route.id);

  }
  componentWillReceiveProps(nextProps) {

  }

  componentWillUnmount() {
    backHelper.destroy(this.props.route.id);
  }

  render() {
    return (
      <ImagePickerView
        max={this.props.max}
        done={(chosenImages)=>this._done(chosenImages)}
        onBack={()=>this._onBackClick()} />
    );
  }
}

ImagePicker.propTypes = {
  navigator:PropTypes.object,
  dataChanged:PropTypes.func,
  max:PropTypes.number,
  route:PropTypes.object,

}
ImagePicker.defaultProps = {
  max:100
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps,{})(ImagePicker);
