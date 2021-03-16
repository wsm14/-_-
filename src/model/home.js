import { observable } from "mobx";
import Taro from "@tarojs/taro";

const homeStore = observable({
  selectObj: {
    scenesIds: "",
    distance: "",
    promotionType: "",
  },
  list: [],
  index: 0,
  setSelectObj(data) {
    const {
      loadDistance = "",
      loadPromotionType = "",
      loadCategoryIds = [],
    } = data;
    this.selectObj = {
      distance: loadDistance,
      scenesIds: loadCategoryIds.join(","),
      promotionType: loadPromotionType,
    };
  },
  setNavitory(list, index) {
    this.list = [...list];
    this.index = index;
  },
  clearNavitor() {
    this.list = [];
    this.index = 0;
  },
});
export default homeStore;
