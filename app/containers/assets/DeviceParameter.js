
'use strict';

import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';

import DeviceParameterView from '../../components/assets/DeviceParameterView';

class DeviceParameter extends Component{
  constructor(props){
    super(props);
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
      <DeviceParameterView
        data={this.props.data.toArray()}
        onBack={()=>{this.props.navigator.pop()}}
        title={this.props.title}
        onRowClick={this.props.onRowClick}
        />
    );
  }
}
DeviceParameter.propTypes = {
  navigator:PropTypes.object,
  data:PropTypes.object,
  route:PropTypes.object,
  title:PropTypes.string.isRequired,
  onRowClick:PropTypes.func.isRequired,
}

function mapStateToProps(state,ownProps) {
  return {

  };
}

export default connect(mapStateToProps,{})(DeviceParameter);
