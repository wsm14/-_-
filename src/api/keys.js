import md5 from 'md5'
import Qs from 'qs'
function setString(randomFlag, min, max) {
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    // 随机产生
    if(randomFlag){
        range = Math.round(Math.random() * (max-min)) + min;
    }
    for(var i=0; i<range; i++){
        let pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
}
const auth_secret_key = '733828mtizndu2cshfp1468889281801r9uv0aaji10';
function sort(obj) {
 // if(window.sessionStorage.getItem('token')){
 //   obj.token = window.sessionStorage.getItem('token')
 // }
  let setObj = {
      ...obj,
  }
  let Array = Object.keys(setObj).sort();
  let NewObject = {};
  Array.forEach(item => {
      NewObject[item] = setObj[item];
  })
    return NewObject
} //数据ASCII 排序
function ConversionGet(obj) {
  let  newObj = JSON.stringify(obj);
  // newObj = newObj.replace(/\\/g, "")
  Object.keys(obj).forEach(item=>{
    if(obj[item] instanceof Array == false){
      newObj = newObj.replace(`"${obj[item]}"`, `${obj[item]}`)
      if(item == 'couponDesc') {
        let filterObj = JSON.stringify({couponDesc:obj.couponDesc})
        filterObj = filterObj.split(':')[1]
        filterObj = filterObj.substring(1,filterObj.length - 2)
        let filter = filterObj.replace(/\\n/g,"\n")
        newObj = newObj.replace(`"${filterObj}"`,filter)
      }
    }
    newObj = newObj.replace(`"${item}"`, `${item}`)
    newObj = newObj.replace(`,${item}`, `&${item}`)
    newObj = newObj.replace(`${item}:`, `${item}=`)
  })
  newObj = newObj.slice(1,newObj.length-1)
  return newObj
}//get请求数据加密处理
function ConversionPost(obj) {
 let  newObj = JSON.stringify(obj);
  newObj = newObj.replace(/\\/g, "")
  Object.keys(obj).forEach(item=>{
    newObj = newObj.replace(`"${obj[item]}"`, `${obj[item]}`)
    newObj = newObj.replace(`"${item}"`, `${item}`)
    newObj = newObj.replace(`,${item}`, `&${item}`)
    newObj = newObj.replace(`${item}:`, `${item}=`)
  })
  newObj = newObj.slice(1,newObj.length-1)
  return newObj
}//post数据加密处理
export function encrypt(type,data) {
  let setMd5 = {...sort(data)}
  setMd5.auth_time_stamp = new Date().getTime().toString();
  setMd5.auth_nonce = setString(true, 10, 28);
  setMd5.auth_secret_key = auth_secret_key
  if(type === 'get'){
    let setStringMd5 = ConversionGet(setMd5)
    setStringMd5 =setStringMd5.toLowerCase();
    let Md5data = md5(setStringMd5)
    delete setMd5.auth_secret_key;
    setMd5.auth_sign = Md5data
    return  setMd5
  }
  else{
    let setStringMd5 = ConversionPost(setMd5)
    setStringMd5 =setStringMd5.toLowerCase();
    let Md5data = md5(setStringMd5)
    delete setMd5.auth_secret_key;
    setMd5.auth_sign = Md5data
    return setMd5
  }
}//处理完成后返回加密数据

