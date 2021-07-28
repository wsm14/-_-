import React from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
export default ({ list = [], userInfo = {}, onChange }) => {
  useEffect(() => {
    setPageDown({
      page: 1,
      limit: 4,
    });
  }, [list]);
  const [pageDown, setPageDown] = useState({ page: 1, limit: 4 });
  const { page, limit } = pageDown;
  const filterBtn = () => {
    if (list.length > page * limit) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <View className="payScice_box">
      <View className="payScice_title"></View>
      <View className="payScice_shop_good"></View>
      <View className="payScice_shop_logo"></View>
    </View>
  );
};
