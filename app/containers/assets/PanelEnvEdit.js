
'use strict';

import React,{Component} from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';


import {savePanelEnv} from '../../actions/assetsAction';
import EnvEditView from '../../components/assets/EnvEditView';

class PanelEnvEdit extends Component{
  constructor(props){
    super(props);
  }
  _save(text){
    var type = this.props.data.get('type');
    if(type === 'temperature'){
      type = 'InpanelTemperature';
    }
    else if (type === 'busTemperature') {
      type = 'BusLineTemperature';
    }
    else if (type === 'humidity') {
      type = 'InpanelHumidity';
    }
    else if (type === 'dust') {
      type = 'InpanelDustDegree';
    }


    this.props.savePanelEnv(this.props.env.set(type,text).toObject());
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

PanelEnvEdit.propTypes = {
  navigator:PropTypes.object,
  route:PropTypes.object,
  data:PropTypes.object,
  env:PropTypes.object,
  asset:PropTypes.object,
  savePanelEnv:PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  var panelDetailData = state.asset.panelDetailData;
  return {
    env:panelDetailData.get('envObj')
  };
}

export default connect(mapStateToProps,{savePanelEnv})(PanelEnvEdit);
