import {httpGet,httpPost} from "@/api/newRequest";
export const getGoodsByMerchantId = (data,fn) => {
   httpGet({
     url: '/user/specialGoods/listMayLikeSpecialGoods',
     data:data
   },res => fn(res))
}

