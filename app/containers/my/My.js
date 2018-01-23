
'use strict';
import React,{Component} from 'react';
import {
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';

import {logout} from '../../actions/loginAction';
import About from './About';
import QRCode from './QRCode';
import NameEdit from './NameEdit';
import MyView from '../../components/my/My';
import notificationHelper from '../../utils/notificationHelper';
import appInfo from '../../utils/appInfo.js';
import FeedBack from './FeedBack.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

class My extends Component{
  constructor(props){
    super(props);
  }
  _logout(){
    Alert.alert(
      '',
      localStr('lang_my_des27'),
      [
        {text: localStr('lang_ticket_cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: localStr('lang_my_des28'), onPress: () => {

          notificationHelper.unbind();
          this.props.logout();
        }}
      ]
    )
  }
  _onRowClick(rowId){
    if(rowId === 2){
      this.props.navigator.push({id:'about',component:About});
    }
    else if (rowId === 1) {
      this.props.navigator.push({id:'qrcode',component:QRCode});
    }else if (rowId === 3) {
      this.props.navigator.push({id:'nameEdit',component:NameEdit});
    }else if (rowId === 4) {
      this.props.navigator.push({id:'feedback',component:FeedBack});
    }
  }
  componentDidMount() {
    // backHelper.init(this.props.navigator,this.props.route.id);
  }
  componentWillReceiveProps(nextProps) {
  }
  componentWillUnmount() {
    // backHelper.destroy(this.props.route.id);
  }
  render() {
    var appInfomation=appInfo.get();
    return (
      <MyView
        onLogout={()=>this._logout()}
        user={this.props.user}
        canEditRealName={!this.props.demoUser}
        oldVersion={appInfomation.versionName}
        hasNewVersion={this.props.version.get('hasNewVersion')}
        onRowClick={(rowId)=>this._onRowClick(rowId)}/>
    );
  }
}

My.propTypes = {
  navigator:PropTypes.object,
  route:PropTypes.object,
  user:PropTypes.object,
  version:PropTypes.object,
  demoUser:PropTypes.bool,
  logout:PropTypes.func,
}

function mapStateToProps(state) {
  var demoUser=!!(state.user.get('isDemoUser') && state.user.get('user'));
  return {
    user:state.user.get('user'),
    version:state.version,
    demoUser
  };
}

export default connect(mapStateToProps,{logout})(My);
