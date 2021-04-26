import React, { useEffect, useState } from "react";
import Tabs from "@/components/tabs";
import Taro from "@tarojs/taro";
import MerchantView from "./merchant/index";
import KolView from "./kol/index";
import UserView from "./user/index";
import TipView from "./tip/index";
export default ({ userList = [], setting, fn, keyword }) => {
  const [list, setList] = useState([]);
  const [keywords, setKeyword] = useState("");
  const [count, setCount] = useState(0);
  const tabStyle = {
    height: Taro.pxTransform(88),
    borderRadius: "0px 0px 20px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#FFFFFF",
    padding: `0 ${Taro.pxTransform(173)}`,
    position: "fixed",
    left: 0,
    right: 0,
    zIndex: 100,
    top: Taro.pxTransform(88),
  };
  useEffect(() => {
    setList(userList);
  }, [userList]);
  useEffect(() => {
    setKeyword(keyword);
  }, [keyword]);
  useEffect(() => {
    setCount(setting.current);
  }, [setting.current]);
  console.log(setting);
  return (
    <>
      <Tabs fn={(e) => fn(e)} style={tabStyle} {...setting}></Tabs>
      {<MerchantView current={count} keyword={keywords}></MerchantView>}
      {<KolView current={count} keyword={keywords}></KolView>}
      {<UserView current={count} keyword={keywords}></UserView>}
      {<TipView current={count} keyword={keywords}></TipView>}
    </>
  );
};
