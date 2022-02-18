import Taro from "@tarojs/taro";
import { observable } from "mobx";
const goodsStore = observable({
  orderList: [],
  setOrderList(list) {
    this.orderList = [...this.orderList, ...list];
  },
  setNullList() {
    this.orderList = [];
  },
  deleteList(obj, val) {
    this.orderList = this.orderList.filter((item) => {
      return item[val] !== obj[val];
    });
  },
  updateList(obj, val) {
    this.orderList = this.orderList.map((item) => {
      if (item[val] === obj[val]) {
        return obj;
      }
      return item;
    });
  },
});
export default goodsStore;
