import React, { useEffect, useState } from "react";
import Tabs from "@/components/tabs";
import Taro from "@tarojs/taro";
import MerchantView from "./merchant/index";
import KolView from "./watchVideo/index";
import UserView from "./user/index";
import ShopView from "./shop/index";
export default ({
  setting,
  fn,
  keyword,
  configUserLevelInfo,
  store,
  // childRef,
}) => {
  const [keywords, setKeyword] = useState("");
  const [count, setCount] = useState(0);
  const tabStyle = {
    height: Taro.pxTransform(96),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#FFFFFF",
    padding: `0 ${Taro.pxTransform(97)}`,
    position: "fixed",
    left: 0,
    right: 0,
    zIndex: 1050,
    top: Taro.pxTransform(88),
    borderBottom: "1px  solid #E5E5E5;",
  };
  useEffect(() => {
    setKeyword(keyword);
  }, [keyword]);
  useEffect(() => {
    setCount(setting.current);
  }, [setting.current]);
  return (
    <>
      <Tabs
        fn={(e) => fn(e)}
        lineStyle={{
          background: "##07C0C2",
          width: Taro.pxTransform(40),
          height: Taro.pxTransform(4),
          borderRadius: Taro.pxTransform(2),
        }}
        fontStyle={{ color: "#07C0C2", fontSize: Taro.pxTransform(32) }}
        sizeStyle={{ fontSize: Taro.pxTransform(32), color: "#999999" }}
        style={tabStyle}
        {...setting}
      ></Tabs>
      {
        <MerchantView
          configUserLevelInfo={configUserLevelInfo}
          current={count}
          keyword={keywords}
        ></MerchantView>
      }
      {<KolView store={store} current={count} keyword={keywords}></KolView>}
      {
        <ShopView
          current={count}
          configUserLevelInfo={configUserLevelInfo}
          keyword={keywords}
          // child={childRef}
        ></ShopView>
      }
      {<UserView current={count} keyword={keywords}></UserView>}
    </>
  );
};
