import {httpGet,httpPost} from "@/api/newRequest";
export const saveUserReport = (data,fn) => {
  httpPost({
    url: '/user/userReport/saveUserReport',
    data:data
  },res => fn(res))
}

