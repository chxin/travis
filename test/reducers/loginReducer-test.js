
import Immutable from 'immutable';

// import {expect} from 'chai';

import loginReducer from '../../app/reducers/loginReducer.js';
import {LOGIN_INFO_CHANGED,COUNTER_CHANGED,AUTHCODE_SUCCESS} from '../../app/actions/loginAction.js';
import {expectImmutableEqual} from '../util.js';

var defaultState = Immutable.fromJS({
  password:{
    userName:'',
    password:'',
    submitEnable:false,
    isFetching:false,
  },
  mobile:{
    phoneNumber:'',
    validCode:'',
    counter:'',
    submitEnable:false,
    senderEnable:false,
    isFetching:false,
  }
});

var deepMerge = (data,originalData=defaultState) =>{
  return originalData.mergeDeep(Immutable.fromJS(data));
}

describe('loginReducer', () => {

  it('should return the initial state', () => {
    expectImmutableEqual(loginReducer(undefined, {}),defaultState);
  })

  describe('LOGIN_INFO_CHANGED', () => {

      var getAction = (data) => {
        return {
          type:LOGIN_INFO_CHANGED,
          data
        }
      }


      it('sender button should be disabled when phoneNumber is not ok', function() {

        var actualState = loginReducer(undefined,getAction({
          type:'mobile',
          input:'phoneNumber',
          value:'138',
        }));

        var expectState = deepMerge({
          mobile:{
            phoneNumber:'138',
          }
        });

        expectImmutableEqual(actualState,expectState);
      });

      it('sender button should be enabled when phoneNumber is 11 digits', function() {

        var actualState = loginReducer(undefined,getAction({
          type:'mobile',
          input:'phoneNumber',
          value:'13810080309',
        }));

        var expectState = deepMerge({
          mobile:{
            phoneNumber:'13810080309',
            senderEnable:true
          }
        });

        expectImmutableEqual(actualState,expectState);
      });



      it('submit button should be disabled when phoneNumber id ok and validCode is not ok', function() {
        var phoneNumberIsOKState = loginReducer(undefined,getAction({
          type:'mobile',
          input:'phoneNumber',
          value:'13810080309',
        }));

        var actualState = loginReducer(phoneNumberIsOKState,getAction({
          type:'mobile',
          input:'validCode',
          value:'12',
        }));

        var expectState = deepMerge({
          mobile:{
            phoneNumber:'13810080309',
            validCode:'12',
            senderEnable:true,
            submitEnable:false
          }
        });
        expectImmutableEqual(actualState,expectState);
      });

      it('submit button should be enabled when phoneNumber and validCode are ok', function() {
        var phoneNumberIsOKState = loginReducer(undefined,getAction({
          type:'mobile',
          input:'phoneNumber',
          value:'13810080309',
        }));

        var actualState = loginReducer(phoneNumberIsOKState,getAction({
          type:'mobile',
          input:'validCode',
          value:'1234',
        }));

        var expectState = deepMerge({
          mobile:{
            phoneNumber:'13810080309',
            validCode:'1234',
            senderEnable:true,
            submitEnable:true
          }
        });
        expectImmutableEqual(actualState,expectState);
      });

      it('submit button should be enabled when userName and password are ok', function() {
        var userNameIsOKState = loginReducer(undefined,getAction({
          type:'password',
          input:'userName',
          value:'hello',
        }));

        var actualState = loginReducer(userNameIsOKState,getAction({
          type:'password',
          input:'password',
          value:'world',
        }));

        var expectState = deepMerge({
          password:{
            userName:'hello',
            password:'world',
            submitEnable:true
          }
        });
        expectImmutableEqual(actualState,expectState);
      });


    });

    describe('COUNTER_CHANGED & AUTHCODE_SUCCESS', () => {

        var getCountDownAction = () => {
          return {
            type:COUNTER_CHANGED,
          }
        }

        var getAuthCodeAction = () => {
          return {
            type:AUTHCODE_SUCCESS
          }
        }

        var getInfoChangedAction = (data) => {
          return {
            type:LOGIN_INFO_CHANGED,
            data
          }
        }

        it('counter should be 60', function() {

          var actualState = loginReducer(undefined,getAuthCodeAction());

          var expectState = deepMerge({
            mobile:{
              senderEnable:false,
              counter:60
            }
          });

          expectImmutableEqual(actualState,expectState);
        });

        it('counter should decrement', function() {

          var counterStarted = loginReducer(undefined,getAuthCodeAction())

          var actualState = loginReducer(counterStarted,getCountDownAction());

          var expectState = deepMerge({
            mobile:{
              counter:59,
            }
          });

          expectImmutableEqual(actualState,expectState);
        });

        it('counter should empty when counter is zero', function() {

          var counterStarted = loginReducer(undefined,getAuthCodeAction());

          for(var i=0;i<60;++i){
            counterStarted = loginReducer(counterStarted,getCountDownAction());
          }

          var expectState = deepMerge({
            mobile:{
              counter:'',
              senderEnable:true
            }
          });

          expectImmutableEqual(counterStarted,expectState);
        });

        it('counter should be not changed when phoneNumber is changed', function() {

          var actualState = loginReducer(undefined,getAuthCodeAction());
          actualState = loginReducer(actualState,getInfoChangedAction({
            type:'mobile',
            input:'phoneNumber',
            value:'',
          }));
          // console.log('actualState',actualState);
          var expectState = deepMerge({
            mobile:{
              phoneNumber:'',
              senderEnable:false,
              counter:''
            }
          });

          expectImmutableEqual(actualState,expectState);
        });

    });


});
