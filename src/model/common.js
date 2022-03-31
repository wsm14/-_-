import { observable } from "mobx";
import Taro from "@tarojs/taro";
const commonStore = observable({
  beanLimit: "500",
  balance: "0",
  data: {},
  overallBanner: [],
  floatList: [],
  configGlobalPopUpObjectList: [],
  preferentialGlobalDefaultList:[],
  festivalConfigs:[],
  setOverAllBanner(e) {
    this.overallBanner = e;
  },
  setFloatList(e) {
    this.setFloatList = e;
  },
  setBean(e) {
    this.beanLimit = e;
  },
  setBalancen(e) {
    this.balance = e;
  },
  setShareData(obj) {
    this.data = obj;
  },
  setCommonData(key, val) {
    this[key] = val;
  },
});
export default commonStore;
