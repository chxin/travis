'use strict'

import Immutable from 'immutable';

import ticketReducer from '../../app/reducers/ticket/ticketListReducer.js';
import {
  TICKET_LOAD_SUCCESS,
  TICKET_LOAD_REQUEST,
  TICKET_LOAD_FAILURE,
  TICKET_EXECUTE_SUCCESS,
  TICKET_FINISH_SUCCESS,
}
from '../../app/actions/ticketAction.js';

import {LOGOUT_SUCCESS} from '../../app/actions/loginAction.js';

import {expectImmutableEqual} from '../util.js';
import {expect} from 'chai';


var defaultState = Immutable.fromJS({
  data:null,
  hasAuth:null,
  pageCount:0,
  isFetching:false,
  filter:{
    TicketTaskType:1,
    CurrentPage:1,
    ItemsPerPage:20
  }
});




var deepMerge = (data,originalData=defaultState) =>{
  return originalData.mergeDeep(Immutable.fromJS(data));
}

var result = {
  "PageCount": 2,
	"TotalItemsCount": 299,
	"Items": [{
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
		},]
};

describe('ticketListReducer', () => {

  it('should return the initial state', () => {
    expectImmutableEqual(ticketReducer(undefined, {}),defaultState);
  })

  describe('TICKET_LOAD_REQUEST', () => {

    var getAction = (data) => {
      return {
        type:TICKET_LOAD_REQUEST,
        data
      }
    }


    it('isFetching should be true when TICKET_LOAD_REQUEST', function() {

      var actualState = ticketReducer(undefined,getAction());

      var expectState = deepMerge({
        isFetching:true
      });

      expectImmutableEqual(actualState,expectState);

    });

  });

  // describe('ALARM_LOAD_FAILURE', () => {
  //
  //   var getAction = (data) => {
  //     return {
  //       type:ALARM_LOAD_FAILURE,
  //       error:{
  //         Result:null
  //       }
  //     }
  //   }
  //
  //
  //   it('should be defaultState and error message when ALARM_LOAD_FAILURE', function() {
  //
  //     var action = getAction();
  //     var actualState = alarmReducer(undefined,action);
  //
  //     expect(action.error).to.equal('无相关权限');
  //
  //     expectImmutableEqual(actualState,defaultState);
  //
  //   });
  //
  // });

  describe('TICKET_LOAD_SUCCESS', () => {
    var getAction = (page=1) => {
      return {
        type:TICKET_LOAD_SUCCESS,
        body:{
          CurrentPage:page
        },
        response:{
          Result:result
        }
      }
    }

    it('pageCount count should 2', ()=> {
      var actualState = ticketReducer(undefined,getAction());

      expect(
        actualState.get('pageCount')
      ).to.equal(result.PageCount);
    });

    it('item length count should 1', ()=> {
      var actualState = ticketReducer(undefined,getAction());

      expect(
        actualState.get('data').size
      ).to.equal(result.Items.length);
    });

    it('item length count should 2 when append data', ()=> {
      var actualState = ticketReducer(ticketReducer(undefined,getAction()),getAction(2));

      expect(
        actualState.get('data').size
      ).to.equal(result.Items.length*2);
    });
  });

  describe('TICKET_EXECUTE_SUCCESS', () => {
    var getAction = () => {
      return {
        type:TICKET_LOAD_SUCCESS,
        body:{
          CurrentPage:1
        },
        response:{
          Result:result
        }
      }
    }

    var getExecuteAction = (ticketId) => {
      return {
        type:TICKET_EXECUTE_SUCCESS,
        body:{
          ticketId
        },
        response:{
          Result:{
            ActualStartTime:'2016-04-13T00:00:00',
            Status:2
          }
        }
      }
    }

    it('should change Status and ActualStartTime when execute', ()=> {

      var actualState = ticketReducer(undefined,getAction());

      var expectState = deepMerge({
        data:[{
          Status:getExecuteAction().response.Result.Status,
          ActualStartTime:getExecuteAction().response.Result.ActualStartTime
        }]
      },actualState);


      var ticketId = actualState.getIn(['data',0,'Id']);
      actualState = ticketReducer(actualState,getExecuteAction(ticketId));

      expectImmutableEqual(actualState,expectState);

    });
  });

  describe('TICKET_FINISH_SUCCESS', () => {
    var getAction = () => {
      return {
        type:TICKET_LOAD_SUCCESS,
        body:{
          CurrentPage:1
        },
        response:{
          Result:result
        }
      }
    }

    var getExecuteAction = (ticketId) => {
      return {
        type:TICKET_FINISH_SUCCESS,
        body:{
          ticketId
        },
        response:{
          Result:{
            ActualEndTime:'2016-04-13T00:00:00',
            Status:2
          }
        }
      }
    }

    it('should change Status and ActualEndTime when execute', ()=> {

      var actualState = ticketReducer(undefined,getAction());

      var expectState = deepMerge({
        data:[{
          Status:getExecuteAction().response.Result.Status,
          ActualEndTime:getExecuteAction().response.Result.ActualEndTime
        }]
      },actualState);


      var ticketId = actualState.getIn(['data',0,'Id']);
      actualState = ticketReducer(actualState,getExecuteAction(ticketId));

      expectImmutableEqual(actualState,expectState);

    });
  });

  describe('LOG_OUT', () => {
    var getAction = (page=1) => {
      return {
        type:TICKET_LOAD_SUCCESS,
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
      var actualState = ticketReducer(undefined,getAction());
      actualState = ticketReducer(actualState,getLogoutAction());
      expectImmutableEqual(actualState,defaultState);

    });
  });


});
