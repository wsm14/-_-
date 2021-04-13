import { observable } from "mobx";
import Taro from "@tarojs/taro";
const authStore = observable({
  userInfo: Taro.getStorageSync("userInfo") || {},
  shareType: {
  },
  setUserInfoStore(obj) {
    this.userInfo = obj;
  },
  setShareType(obj) {
    this.shareType = {
      ...obj,
    };
  },
});
export default authStore;
