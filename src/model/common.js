import { observable } from "mobx";
import Taro from "@tarojs/taro";
const commonStore = observable({
  beanLimit: "500",
  data: {},
  setBean(e) {
    this.beanLimit = e;
  },
  setShareData(obj) {
    this.data = obj;
  },
});
export default commonStore;
