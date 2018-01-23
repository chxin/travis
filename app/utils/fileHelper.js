'use strict';

export function checkFileNameIsImage(fileName){
  if (!fileName) {
    return true;
  }
  var index = fileName.lastIndexOf('.');
  var type = fileName.substring(index+1);
  type=type.toLowerCase();
  var arrImageTypes=['png','jpg','jpeg','gif'];
  return (arrImageTypes.indexOf(type)!==-1);
}

export function getFileNameFromFilePath(filePath)
{
  if (!filePath) {
    return '';
  }
  var index = filePath.lastIndexOf('/');
  if (index===-1) {
    return filePath;
  }
  var fileName = filePath.substring(index+1);
  return fileName;
}
