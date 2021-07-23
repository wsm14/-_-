import Taro from "@tarojs/taro";
import { observable } from "mobx";
const activeStatus = observable({
  activityStatus: "0",
  needCountDown: "0",
  dayCount: 0,
  setInfo(obj) {
    const { activityStatus, needCountDown, dayCount } = obj;
    this.activityStatus = activityStatus;
    this.needCountDown = needCountDown;
    this.dayCount = dayCount;
  },
});
export default activeStatus;
