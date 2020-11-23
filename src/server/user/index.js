import {httpGet,httpPost} from "@/api/newRequest";
/*
* params token
* */
import {objStatus} from '@/common/utils'
export const getMainPage = (data,fn) => {
  httpGet({
    url: '/user/userInfo/mainPage',
    data:data
  },res => {
    if(!objStatus(res)){
      return fn(false)
    }
    return  fn(res)
  })
}

