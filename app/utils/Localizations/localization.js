
import LocalizedStrings from 'react-native-localization';
import en from './en.js';
import zh from './zh.js';

let strings = new LocalizedStrings({
 en,zh
});

export function localStr(key)
{
  return strings[key];
}

export function localFormatStr(key,...values)
{
  return strings.formatString(strings[key],...values);
}

export function getLanguage() {
  return strings.getLanguage();
}

export function getInterfaceLanguage() {
  return strings.getInterfaceLanguage();
}


// eg:
// import local from '../utils/Localizations/localization.js';
// local.setLanguage('zh');
// console.warn('constructor',local.getAvailableLanguages());
// console.warn('constructor',local.formatString(local.str0,1000));
//  console.warn('constructor',local.getString('str0','zh'));
// console.warn('constructor',local.str0);
