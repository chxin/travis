'use strict'

import Immutable from 'immutable';

import ticketReducer from '../../app/reducers/ticket/ticketReducer.js';
import {
  TICKET_LOAD_BYID_REQUEST,
  TICKET_LOAD_BYID_SUCCESS,
  TICKET_LOAD_BYID_FAILURE,
}
from '../../app/actions/ticketAction.js';

import {LOGOUT_SUCCESS} from '../../app/actions/loginAction.js';

import {expectImmutableEqual} from '../util.js';
import {expect} from 'chai';


var defaultState = Immutable.fromJS({
  isFetching:false,
  data:null
});





var deepMerge = (data,originalData=defaultState) =>{
  return originalData.mergeDeep(Immutable.fromJS(data));
}

var result = {
	"Id": 287,
	"TicketNum": "BJDH-BJ160425003",
	"SeqNum": 3,
	"TicketType": 2,
	"CustomerId": 306549,
	"StartTime": "2016-04-25T00:00:00",
	"EndTime": "2016-04-25T00:00:00",
	"ActualStartTime": "2016-04-26T15:24:41.9",
	"ActualEndTime": null,
	"Content": "级别: 中级; 类别: 超高限; 点位: 盘柜内温度; 实际值: 87.9989; 设定值: 55; 位置: 北京施耐德电气大厦-A区配电室-3号变B402",
	"CreateUser": 300361,
	"CreateTime": "2016-04-25T15:55:48.583",
	"CreateUserName": "angel",
	"AssetNames": ["3号变400V总进线"],
	"BuildingNames": ["北京施耐德电气大厦"],
	"ExecutorNames": ["angel"],
	"Status": 2,
	"Assets": [{
		"Id": 746,
		"TicketId": 287,
		"HierarchyId": 306680,
		"BuildingId": 306552,
		"BuildingName": "北京施耐德电气大厦",
		"HierarchyName": "3号变400V总进线",
		"BuildingPictureKey": "img-cover-100643"
	}],
	"Documents": [],
	"Executors": [{
		"Id": 698,
		"TicketId": 287,
		"UserId": 300361,
		"UserName": "angel"
	}],
	"Logs": [{
		"Id": 84,
		"TicketId": 287,
		"Content": "公共号经济层次感高耗能",
		"CreateUser": 300361,
		"CreateTime": "2016-04-27T07:18:30.96",
		"CreateUserName": "angel",
		"UpdateUser": null,
		"UpdateTime": "0001-01-01T00:00:00",
		"Pictures": [{
			"PictureId": "image-ticket-log-287-300361-1461712708744-0",
			"Content": null
		}]
	}]
};

describe('ticketReducer', () => {

  it('should return the initial state', () => {
    expectImmutableEqual(ticketReducer(undefined, {}),defaultState);
  })

  describe('TICKET_LOAD_BYID_REQUEST', () => {

    var getAction = (data) => {
      return {
        type:TICKET_LOAD_BYID_REQUEST,
        data
      }
    }


    it('isFetching should be true when TICKET_LOAD_BYID_REQUEST', function() {

      var actualState = ticketReducer(undefined,getAction());

      var expectState = deepMerge({
        isFetching:true
      });

      expectImmutableEqual(actualState,expectState);

    });

  });

  describe('TICKET_LOAD_BYID_SUCCESS', () => {
    var getAction = (ticketId) => {
      return {
        type:TICKET_LOAD_BYID_SUCCESS,
        body:{
          ticketId
        },
        response:{
          Result:result
        }
      }
    }

    it('data should have value', ()=> {
      var actualState = ticketReducer(undefined,getAction());

      var expectState = Immutable.fromJS(result);
      expectImmutableEqual(actualState.get('data'),expectState);

    });

  });

  describe('TICKET_LOAD_BYID_FAILURE', () => {
    var getAction = (ticketId) => {
      return {
        type:TICKET_LOAD_BYID_FAILURE,
        body:{
          ticketId
        },
        error:{
          Error:'040001307022'
        }
      }
    }

    it('should has default state and error message', ()=> {
      var action = getAction();
      var actualState = ticketReducer(undefined,action);
      expectImmutableEqual(actualState,defaultState);
      expect(action.error).to.equal(localStr('lang_alarm_des1'));

    });
  });

  describe('LOGOUT_SUCCESS', () => {
    var getAction = (ticketId) => {
      return {
        type:TICKET_LOAD_BYID_SUCCESS,
        body:{
          ticketId
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
      var actualState = ticketReducer(undefined,getAction());
      actualState = ticketReducer(actualState,getLogoutAction());
      expectImmutableEqual(actualState,defaultState);

    });
  });


});
