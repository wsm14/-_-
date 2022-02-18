import Taro from "@tarojs/taro";
import { observable } from "mobx";
const activeInfoStore = observable({
  activityStatus: "0",
  needCountDown: "0",
  dayCount: 0,
  setCount: 0,
  setInfo(obj) {
    const { activityStatus, needCountDown, dayCount } = obj;
    this.activityStatus = activityStatus;
    this.needCountDown = needCountDown;
    this.dayCount = dayCount;
    this.setCount = 1;
  },
});
export default activeInfoStore;
