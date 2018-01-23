'use strict'

import Immutable from 'immutable';

import alarmFilterReducer from '../../app/reducers/alarm/alarmFilterReducer.js';
import {
  ALARM_FILTER_CHANGED,
  ALARM_FILTER_DIDCHANGED,
  ALARM_NEXTPAGE,
  // ALARM_CODE_REQUEST,
  ALARM_CODE_SUCCESS,
  ALARM_BUILDING_SUCCESS,
  ALARM_FILTER_CLEAR,
}
from '../../app/actions/alarmAction.js';
import {LOGOUT_SUCCESS} from '../../app/actions/loginAction.js';
import {expectImmutableEqual} from '../util.js';
import {expect} from 'chai';

var defaultState = Immutable.fromJS({
    hasFilter:false,
    isFetching:false,
    codes:null,
    buildings:[],
    filterBuildings:[],
    filterCodes: ['故障跳闸','长延时脱扣',
                      '短延时脱扣','瞬时脱扣','接地故障','漏电保护','其他类别'],
    stable:{
      CurrentPage:1,
      ItemsPerPage:20,
      IsSecure:null,
      Level:[],
      HierarchyId:null,
      SortMode:{
        Field:'AlarmTime',
        IsDesc:true
      }
    },
    temp:{
      status:[0],
      level:[0],
      code:[0],
      building:[0]
    }
});

var deepMerge = (data,originalData=defaultState) =>{
  return originalData.mergeDeep(Immutable.fromJS(data));
}

var serverCodes = [{
  "Code": "101",
  "Type": "超高高限"
}, {
  "Code": "102",
  "Type": "超高限"
}, {
  "Code": "103",
  "Type": "欠低限"
}, {
  "Code": "104",
  "Type": "欠低低限"
}, {
  "Code": "105",
  "Type": "IO=1"
}, {
  "Code": "106",
  "Type": "IO=0"
}, {
  "Code": "301",
  "Type": "断路器分闸（OF）"
}, {
  "Code": "302",
  "Type": "电动分闸（SD）"
}, {
  "Code": "303",
  "Type": "故障跳闸（SDE）"
}, {
  "Code": "304",
  "Type": "长延时脱扣（Ir）"
}, {
  "Code": "305",
  "Type": "短延时脱扣（Isd）"
}, {
  "Code": "306",
  "Type": "瞬动脱扣（Ii）"
}, {
  "Code": "307",
  "Type": "接地故障（Ig）"
}, {
  "Code": "308",
  "Type": "漏电保护（Vigi）"
}, {
  "Code": "309",
  "Type": "集成瞬时保护"
}, {
  "Code": "310",
  "Type": "断路器断开"
}, {
  "Code": "311",
  "Type": "弹簧释能"
}, {
  "Code": "501",
  "Type": "BOX与设备通讯故障"
}, {
  "Code": "999",
  "Type": "无法识别报警"
}, {
  "Code": "1000",
  "Type": "枚举量报警"
}];

var serverBuildings = [{
  Id:123,
  Name:'building1'
},{
  Id:234,
  Name:'building2'
}];

describe('alarmFilterReducer', () => {

  it('should return the initial state', () => {
    expectImmutableEqual(alarmFilterReducer(undefined, {}),defaultState);
  })

  describe('ALARM_NEXTPAGE', () => {

      var getAction = (data) => {
        return {
          type:ALARM_NEXTPAGE,
          data
        }
      }


      it('currentpage should be increment 1', function() {

        var actualState = alarmFilterReducer(undefined,getAction());

        var expectState = deepMerge({
          stable:{
            CurrentPage:2,
          }
        });

        expectImmutableEqual(actualState,expectState);

      });

    });

    describe('ALARM_CODE_SUCCESS', () => {
      var getAlarmCodeAction = (data) => {
        return {
          type:ALARM_CODE_SUCCESS,
          response:{
            Result:serverCodes
          }
        }
      }

      it('codes count should ok', ()=> {
        var actualState = alarmFilterReducer(undefined,getAlarmCodeAction());

        expect(
          actualState.get('codes').size
        ).to.equal(serverCodes.length);
      });
    });

    describe('ALARM_BUILDING_SUCCESS', () => {
      var getAlarmBuildingAction = (data) => {
        return {
          type:ALARM_BUILDING_SUCCESS,
          response:{
            Result:serverBuildings
          }
        }
      }

      it('building count should ok', ()=> {
        var actualState = alarmFilterReducer(undefined,getAlarmBuildingAction());

        expect(
          actualState.get('buildings').size
        ).to.equal(serverBuildings.length);

        expect(
          actualState.get('filterBuildings').size
        ).to.equal(serverBuildings.length+1);

      });

      it('building and filterBuildings should ok', ()=> {
        var actualState = alarmFilterReducer(undefined,getAlarmBuildingAction());

        var expectState = deepMerge({
          buildings:serverBuildings.map((item)=> {return {id:item.Id,name:item.Name}}),
          filterBuildings:['全部楼宇'].concat(serverBuildings.map((item)=>item.Name))
        });
        expectImmutableEqual(actualState,expectState);
      });
    });


    describe('ALARM_FILTER_DIDCHANGED', () => {

        var getDidAction = (data) => {
          return {
            type:ALARM_FILTER_DIDCHANGED,
            data
          }
        }

        var getAction = (data) => {
          return {
            type:ALARM_FILTER_CHANGED,
            data
          }
        }

        var getNextPageAction = (data) => {
          return {
            type:ALARM_NEXTPAGE,
            data
          }
        }

        var getAlarmCodeAction = (data) => {
          return {
            type:ALARM_CODE_SUCCESS,
            response:{
              Result:serverCodes
            }
          }
        }

        var getAlarmBuildingAction = (data) => {
          return {
            type:ALARM_BUILDING_SUCCESS,
            response:{
              Result:serverBuildings
            }
          }
        }

        var initialState = null;

        beforeEach(()=>{
          initialState = alarmFilterReducer(undefined,getNextPageAction());

          initialState = alarmFilterReducer(initialState,getAlarmCodeAction());

          initialState = alarmFilterReducer(initialState,getAlarmBuildingAction());

        })


        it('stable filter change be ok when status,level,code,building changed to index 1', function() {

          initialState = ['status','level','code','building'].reduce((state,type)=>{
              return alarmFilterReducer(state,getAction({
                type,
                value:1
              }));
          },initialState);

          var actualState = alarmFilterReducer(initialState,getDidAction());



          var expectState = deepMerge({
            stable:{
              CurrentPage:1,
              IsSecure:false,
              Level:[3],
              AlarmCode:'303',
              HierarchyId:123
            },
            hasFilter:true
          },initialState);



          expectImmutableEqual(actualState,expectState);

        });


        it('stable filter change be ok when status,level,code,building changed to index 2', function() {

          initialState = ['status','level','code','building'].reduce((state,type)=>{
              return alarmFilterReducer(state,getAction({
                type,
                value:2
              }));
          },initialState);

          var actualState = alarmFilterReducer(initialState,getDidAction());

          var expectState = deepMerge({
            stable:{
              CurrentPage:1,
              IsSecure:true,
              Level:[1,2],
              AlarmCode:'304',
              HierarchyId:234
            },
            hasFilter:true
          },initialState);

          expectImmutableEqual(actualState,expectState);

        });
    });

    describe('ALARM_FILTER_CHANGED', () => {

        var getAction = (data) => {
          return {
            type:ALARM_FILTER_CHANGED,
            data
          }
        }


        it('status,level,code,building should be changed', function() {

          ['status','level','code','building'].forEach((type)=>{

            [1,2,0].reduce((state,current)=>{
              var actualState = alarmFilterReducer(state,getAction({
                type,
                value:current
              }));

              var expectState = deepMerge({
                temp:{
                  [type]:[current],
                }
              });

              expectImmutableEqual(actualState,expectState);

              return actualState;

            },undefined)
          })
        });
    });

    describe('ALARM_FILTER_CLEAR', () => {

      var getChangedAction = (data) => {
        return {
          type:ALARM_NEXTPAGE,
          data
        }
      }

      var getClearAction = (data) => {
        return {
          type:ALARM_FILTER_CLEAR,
          data
        }
      }


      it('filter should be equal to defaultState after clearing filter', function() {

        var actualState = alarmFilterReducer(undefined,getChangedAction());
        actualState = alarmFilterReducer(undefined,getClearAction());

        expectImmutableEqual(actualState,defaultState);

      });

    });

    describe('LOG_OUT', () => {
      var getAction = (data) => {
        return {
          type:ALARM_FILTER_CHANGED,
          data
        }
      }

      var getLogoutAction = () => {
        return {
          type:LOGOUT_SUCCESS,
        }
      }

      it('logout', ()=> {
        var actualState = alarmFilterReducer(undefined,getAction({
          type:'status',
          value:1
        }));
        actualState = alarmFilterReducer(actualState,getLogoutAction());
        expectImmutableEqual(actualState,defaultState);

      });
    });

});
