
'use strict';

import React,{Component} from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';


import {saveRoomEnv} from '../../actions/assetsAction';
import EnvEditView from '../../components/assets/EnvEditView';

class RoomEnvEdit extends Component{
  constructor(props){
    super(props);
  }
  _save(text){
    var type = this.props.data.get('type');
    if(type === 'temperature'){
      type = 'IndoorTemperature';
    }
    else if (type === 'humidity') {
      type = 'IndoorHumidity';
    }
    else if (type === 'dust') {
      type = 'IndoorDustDegree';
    }


    this.props.saveRoomEnv(this.props.env.set(type,text).toObject());
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
      <EnvEditView
        save={(text)=>this._save(text)}
        data={this.props.data}
        onBack={()=>{this.props.navigator.pop()}} />
    );
  }
}

RoomEnvEdit.propTypes = {
  navigator:PropTypes.object,
  route:PropTypes.object,
  data:PropTypes.object,
  env:PropTypes.object,
  asset:PropTypes.object,
  saveRoomEnv:PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  var roomDetailData = state.asset.roomDetailData;
  return {
    env:roomDetailData.get('envObj')
  };
}

export default connect(mapStateToProps,{saveRoomEnv})(RoomEnvEdit);
