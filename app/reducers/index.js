
import { combineReducers } from 'redux'
import user from './userReducer';
import login from './loginReducer';
import alarm from './alarm';
import ticket from './ticket';
import asset from './assets';
import version from './versionReducer';
import boot from './bootReducer';
import feedBack from './feedbackReducer';
import {RESET_ERROR_MESSAGE} from '../actions/errorAction.js';
import {LOGOUT_REQUEST,LOGOUT_SUCCESS} from '../actions/loginAction.js';
import {localStr,localFormatStr} from '../utils/Localizations/localization.js';

// Updates error message to notify about the failed fetches.
function error(state = null, action) {
  const { type, error } = action
  if (type === RESET_ERROR_MESSAGE || type===LOGOUT_REQUEST|| type===LOGOUT_SUCCESS) {
    return null
  } else if (error) {
    if(typeof error === 'string'){
      // console.warn('error',error);
      return action.error
    }
    else if(error['message']){
      // console.warn('error message',error['message']);
      if(error['message'] === 'Network request failed'){
        return localStr('lang_commons_notice3');
      }
      return error['message'];
    }
    else if(error['Error']==='403'){
      return '403';//登录失效，请重新登录
    }
    else {
      console.warn('error',action);
      return localStr('lang_commons_notice2');
    }

  }

  return state
}

const rootReducer = combineReducers({
  user,login,asset,alarm,ticket,error,version,boot,feedBack
})

export default rootReducer
