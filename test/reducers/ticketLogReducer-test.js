'use strict'

import Immutable from 'immutable';

import ticketLogReducer from '../../app/reducers/ticket/ticketLogReducer.js';
import {
  TICKET_LOGINFO_CHANGED,
}
from '../../app/actions/ticketAction.js';

import {LOGOUT_SUCCESS} from '../../app/actions/loginAction.js';

import {expectImmutableEqual} from '../util.js';
import {expect} from 'chai';


var defaultState = null;




var deepMerge = (data,originalData=defaultState) =>{
  return originalData.mergeDeep(Immutable.fromJS(data));
}

describe('ticketLogReducer', () => {

  it('should return the initial state', () => {
    expectImmutableEqual(ticketLogReducer(undefined, {}),defaultState);
  })

  describe('TICKET_LOGINFO_CHANGED', () => {

    var getAction = (data) => {
      return {
        type:TICKET_LOGINFO_CHANGED,
        data
      }
    }


    it('should run init', function() {
      var ticketId = 1;
      var actualState = ticketLogReducer(undefined,getAction({
        type:'init',
        old:null,
        ticketId
      }));

      var expectState = Immutable.fromJS({
        TicketId:ticketId,
        Content:'',
        Pictures:[]
      });

      expectImmutableEqual(actualState,expectState);

      actualState = ticketLogReducer(undefined,getAction({
        type:'init',
        old:expectState,
        ticketId
      }));

      expectImmutableEqual(actualState,expectState);


    });

    it('should run content', function() {
      var value = '123';
      var actualState = ticketLogReducer(undefined,getAction({
        type:'content',
        value,
      }));

      var expectState = Immutable.fromJS({
        TicketId:ticketId,
        Content:'',
        Pictures:[]
      });

      expectImmutableEqual(actualState,expectState);

      actualState = ticketLogReducer(undefined,getAction({
        type:'init',
        old:expectState,
        ticketId
      }));

      expectImmutableEqual(actualState,expectState);


    });


  });

  describe('LOGOUT_SUCCESS', () => {
    var getAction = (data) => {
      return {
        type:TICKET_LOGINFO_CHANGED,
        data
      }
    }

    var getLogoutAction = () => {
      return {
        type:LOGOUT_SUCCESS,
      }
    }

    it('should be defaultState when logout', ()=> {
      var ticketId = 1;
      var actualState = ticketLogReducer(undefined,getAction({
        type:'init',
        old:{},
        ticketId
      }));
      actualState = ticketLogReducer(actualState,getLogoutAction());
      expectImmutableEqual(actualState,defaultState);

    });
  });


});
