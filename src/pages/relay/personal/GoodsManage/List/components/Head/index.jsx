import React, { useState } from "react";
import Router from "@/common/router";
import { useDidShow } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import { fetchGoodsManageNotCount } from "@/server/relay";
import "./index.scss";

/**
 * 商品库头部区域
 */
export default () => {
  const [count, setCount] = useState(0);

  useDidShow(() => {
    fetchGoodsManageNotCount().then((res) => {
      setCount(Number(res.count || 0));
    });
  });

  // 跳转页面
  const goPage = (routerName, args = {}) => {
    Router({
      routerName,
      args,
    });
  };

  return (
    <View className="GoodsManageList_Head">
      <View className="GoodsManageList_Head_btn">
        <Button
          className="gm_linout"
          disabled={!count}
          onClick={() => goPage("goodsManageImport")}
        >
          导入团购商品({count})
        </Button>
        <Button className="gm_add" onClick={() => goPage("goodsManageEdit")}>
          添加商品
        </Button>
      </View>
    </View>
  );
};
