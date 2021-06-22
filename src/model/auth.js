import { observable } from "mobx";
import Taro from "@tarojs/taro";
const authStore = observable({
  userInfo: Taro.getStorageSync("userInfo") || {},
  login: false,
  shareType: {
  },
  setUserInfoStore(obj) {
    this.userInfo = obj;
    this.login = true
  },
  setShareType(obj) {
    this.shareType = {
      ...obj,
    };
  },
});
export default authStore;
