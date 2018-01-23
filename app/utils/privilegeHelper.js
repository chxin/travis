'use strict'

var _codes;

const CodeMap = {
  TicketEditPrivilegeCode:'2135',
  TicketExecutePrivilegeCode:'2133',
  AssetEditPrivilegeCode:'2105',
  FeedbackPrivilegeCode:'0',
}

export default {
  setPrivilegeCodes:(codes)=>{
    // console.warn('codes',codes);
    _codes = codes;
  },
  hasAuth:(code)=>{
    if(_codes){
      if (code==='FeedbackPrivilegeCode') {
        return true;
      }
      //code can be 'TicketEditPrivilegeCode' or 2135
      if(CodeMap[code]){
        code = CodeMap[code];
      }
      else {
        console.warn('PrivilegeCode does not exist:%s',code);
      }
      // console.warn('code',code);
      code = _codes.find((item)=> item === code);
      // console.warn('code',code);

      if(code){
        return true;
      }
    }
    return false;
  }
}
