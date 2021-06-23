import { observable } from "mobx";
import Taro from "@tarojs/taro";
const authStore = observable({
  userInfo: Taro.getStorageSync("userInfo") || {},
  login: false,
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
    this.login = true
  }
});
export default authStore;
