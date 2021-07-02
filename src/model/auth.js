import { observable } from "mobx";
import Taro from "@tarojs/taro";
const authStore = observable({
  userInfo: Taro.getStorageSync("userInfo") || {},
  login: 0,
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
  setLoginStatus() {
    this.login = this.login + 1
  }
});
export default authStore;
