'use strict'

import Immutable from 'immutable';

import alarmReducer from '../../app/reducers/alarm/alarmReducer.js';
import {
  ALARM_LOAD_SUCCESS,
  ALARM_LOAD_REQUEST,
  ALARM_LOAD_FAILURE,
}
from '../../app/actions/alarmAction.js';

import {LOGOUT_SUCCESS} from '../../app/actions/loginAction.js';

import {expectImmutableEqual} from '../util.js';
import {expect} from 'chai';


var defaultState = Immutable.fromJS({
  data:null,
  pageCount:0,
  isFetching:false,
});


var deepMerge = (data,originalData=defaultState) =>{
  return originalData.mergeDeep(Immutable.fromJS(data));
}

var result = {
  "PageCount": 2,
	"TotalItemsCount": 299,
	"Items": [{
			"Id": 180605,
			"Code": "超高限",
			"Parameter": "功率因数",
			"ActualValue": "1",
			"ResetValue": null,
			"ThresholdValue": "0.5",
			"AlarmUser": null,
			"SecureUser": null,
			"AlarmUserInfo": null,
			"SecureUserInfo": null,
			"AlarmTime": "2016-04-26T15:59:00",
			"SecureTime": null,
			"Comment": null,
			"Level": 1,
			"Status": [],
			"AlarmHierarchy": null,
			"HierarchyId": 306686,
			"TicketId": null,
			"Description": "高报警 当前值:1 设定值:0.5",
			"TargetPath": "北京施耐德电气大厦-A区配电室-3号变B412",
			"DeviceName": "3#冷冻水泵",
			"RoomName": "A区配电室",
			"CustomerName": "北京东华电气设备有限公司"
		}]
};

describe('alarmReducer', () => {

  it('should return the initial state', () => {
    expectImmutableEqual(alarmReducer(undefined, {}),defaultState);
  })

  describe('ALARM_LOAD_REQUEST', () => {

    var getAction = (data) => {
      return {
        type:ALARM_LOAD_REQUEST,
        data
      }
    }


    it('isFetching should be true when ALARM_LOAD_REQUEST', function() {

      var actualState = alarmReducer(undefined,getAction());

      var expectState = deepMerge({
        isFetching:true
      });

      expectImmutableEqual(actualState,expectState);

    });

  });

  describe('ALARM_LOAD_FAILURE', () => {

    var getAction = (data) => {
      return {
        type:ALARM_LOAD_FAILURE,
        error:{
          Result:null
        }
      }
    }


    it('should be defaultState and error message when ALARM_LOAD_FAILURE', function() {

      var action = getAction();
      var actualState = alarmReducer(undefined,action);

      expect(action.error).to.equal('无相关权限');

      expectImmutableEqual(actualState,defaultState);

    });

  });

  describe('ALARM_LOAD_SUCCESS', () => {
    var getAction = (page=1) => {
      return {
        type:ALARM_LOAD_SUCCESS,
        body:{
          CurrentPage:page
        },
        response:{
          Result:result
        }
      }
    }

    it('pageCount count should 2', ()=> {
      var actualState = alarmReducer(undefined,getAction());

      expect(
        actualState.get('pageCount')
      ).to.equal(result.PageCount);
    });

    it('item length count should 1', ()=> {
      var actualState = alarmReducer(undefined,getAction());

      expect(
        actualState.get('data').size
      ).to.equal(result.Items.length);
    });

    it('item length count should 2 when append data', ()=> {
      var actualState = alarmReducer(alarmReducer(undefined,getAction()),getAction(2));

      expect(
        actualState.get('data').size
      ).to.equal(result.Items.length*2);
    });
  });

  describe('LOG_OUT', () => {
    var getAction = (page=1) => {
      return {
        type:ALARM_LOAD_SUCCESS,
        body:{
          CurrentPage:page
        },
        response:{
          Result:result
        }
      }
    }

    var getLogoutAction = () => {
      return {
        type:LOGOUT_SUCCESS,
      }
    }

    it('should be defaultState when logout', ()=> {
      var actualState = alarmReducer(undefined,getAction());
      actualState = alarmReducer(actualState,getLogoutAction());
      expectImmutableEqual(actualState,defaultState);

    });
  });


});
