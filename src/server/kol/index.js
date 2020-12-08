import {httpGet,httpPost} from "@/api/newRequest";
export const saveUserReport = (data,fn) => {
  httpPost({
    url: '/user/userReport/saveUserReport',
    data:data
  },res => fn(res))
}
//举报
export const getKolLever = (data,fn) => {
  httpGet({
    url: '/user/level/getUserLevelProgress',
    data:data
  },res => fn(res))
}
//达人等级  
