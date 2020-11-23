import {httpGet,httpPost} from "@/api/newRequest";
export const getMerchantLat = (data,fn) => {
  httpGet({
    url: '/user/userMerchant/listMapSearchMerchantByLatAndLnt',
    data:data
  },res => fn(res))
}

