/*签到引导*/
import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import Router from "@/utils/router";
import Taro from "@tarojs/taro";
import Tarking from "@/components/tracking";
import Banner from "@/components/banner";
import { fetchBanner } from "@/server/common";
import "./index.scss";
export default ({ data, link }) => {
  const style = {
    width: Taro.pxTransform(702),
    height: Taro.pxTransform(128),
    position: "relative",
  };
  const [listObj, setListObj] = useState({});
  const [list, setList] = useState([]);
  useEffect(() => {
    setListObj(
      data.reduce((item, val) => {
        if (val.moduleName === "signInModule") {
          return val;
        } else return item;
      }),
      {}
    );
  }, [data]);
  useEffect(() => {
    fetchBanner({
      bannerType: "signInModule",
    }).then((val) => {
      const { bannerList = [] } = val;
      setList(bannerList);
    });
  }, []);
  const {} = listObj;
  if (list.length > 0) {
    return (
      <Tarking blockName="signInModule" name={"sign"}>
        <View className="lookAround_sign_box">
          <Banner imgName="coverImg" data={list} boxStyle={style}></Banner>
        </View>
      </Tarking>
    );
  } else {
    return null;
  }
};
