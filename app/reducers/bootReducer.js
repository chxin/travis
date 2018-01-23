'use strict';

import {LOAD_CLIPBOARD,RESET_CLIPBOARD} from '../actions/appAction.js';

import Immutable from 'immutable';

var defaultState = Immutable.Map({itemId:null,itemType:null,content:null})//alarm,ticket

function parseClipContent(text) {
  var itemId = null;
  var itemType = null;
  var content = null;
  if(text.indexOf("施耐德电气机器顾问")>=0){
    // 施耐德电气机器顾问提示您有新工单(406)，请按时执行。
    // 施耐德电气机器顾问提示您设备报警(32A35)，请及时检查响应!
    var retAlarmStart = text.match(/施耐德电气机器顾问提示您设备报警\(([a-zA-Z0-9]*)\)，请及时检查响应/);
    var retAlarmEnd = text.match(/施耐德电气机器顾问提示您设备报警\(([a-zA-Z0-9]*)\)已解除/);
    var retTicketStart = text.match(/施耐德电气机器顾问提示您有新工单\(([a-zA-Z0-9]*)\)/);
    var retTicketEnd = text.match(/施耐德电气机器顾问通知您创建的工单\(([a-zA-Z0-9]*)\)/);
    // console.warn('retTicket,retAlarm',retTicket,retAlarm);
    if(retAlarmStart && retAlarmStart.length>1){
      itemId = retAlarmStart[1];
      itemType = 'alarm';
      content='您有报警，请查看!';
    }else if(retAlarmEnd && retAlarmEnd.length>1){
      itemId = retAlarmEnd[1];
      itemType = 'alarm';
      content='报警已解除，请查看!';
    }else if(retTicketStart && retTicketStart.length>1){
      itemId = retTicketStart[1];
      itemType = 'ticket';
      content='您有工单，请查看!';
    }else if(retTicketEnd && retTicketEnd.length>1){
      itemId = retTicketEnd[1];
      itemType = 'ticket';
      // var split=text.split('\n');
      // if (split.length>=3) {
      //   content=split[0]+' '+split[1]+' '+split[2]+'';
      // }
      content='工单已完成，请查看!';
    }
  }
  return {
    itemId,
    itemType,
    content,
  }
}

function loadClipboard(state,action) {
  if(action.content){
    var {itemId,itemType,content} = parseClipContent(action.content);
    return state.set('itemId',itemId).set('itemType',itemType).set('content',content);
  }
  return state;
}

export default function(state=defaultState,action){
  switch (action.type) {
    case LOAD_CLIPBOARD:
      return loadClipboard(state,action);
    case RESET_CLIPBOARD:
      return defaultState;
  }
  return state;
}
