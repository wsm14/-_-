import React, { useEffect, useState } from "react";
import { View, Button } from "@tarojs/components";
import { useDidShow, useShareAppMessage } from "@tarojs/taro";
import PersonnelSwiper from "./components/PersonnelSwiper";
import BlindContent from "./components/BlindContent";
import BindGetNumber from "./components/BindGetNumber";
import GoodsContent from "./components/GoodsContent";
import Footer from "./components/Footer";
import {
  fetchBlindBoxConfig,
  fetchBlindBoxBarrage,
  fetchBlindBoxRewardJackpot,
} from "@/server/blindBox";
import { getShareInfo } from "@/server/common";
import { loginStatus } from "@/common/utils";
import "./index.scss";
/**
 * 盲盒首页
 */
export default () => {
  const [data, setData] = useState({});
  const [barrage, setBarrage] = useState([]);
  const [jpList, setJpList] = useState([]);
  const [shareZl, setShareZl] = useState(null);
  const [shareMh, setShareMh] = useState(null);
  useDidShow(() => {
    dataInit();
    getbarrage();
    getRewardJackpot();
    getShareData();
  });
  useShareAppMessage((res) => {
    if (res.from === "button") {
      const { dataset } = res.target;
      const { info } = dataset;
      if (info === "mh") {
        const { title, miniProgramUrl, image } = shareMh;
        return {
          title: title,
          imageUrl: image,
          path: "/" + miniProgramUrl,
        };
      } else {
        const { title, miniProgramUrl, image } = shareZl;
        return {
          title: title,
          imageUrl: image,
          path: "/" + miniProgramUrl,
        };
      }
    }
  });
  const getShareData = () => {
    if (loginStatus() && (!shareZl || !shareMh)) {
      getShareInfo({ shareType: "blindBox", subType: "invitation" }).then(
        (val = {}) => {
          setShareZl(val);
        }
      );
      getShareInfo({ shareType: "blindBox" }).then((val) => {
        setShareMh(val);
      });
    }
  };
  const getRewardJackpot = () => {
    fetchBlindBoxRewardJackpot().then((val) => {
      const { blindBoxProductObjectList = [] } = val;
      setJpList(blindBoxProductObjectList);
    });
  };
  const dataInit = () => {
    fetchBlindBoxConfig().then((val = {}) => {
      setData(val);
    });
  };
  const getbarrage = () => {
    fetchBlindBoxBarrage({ size: 50 }).then((val) => {
      const { blindBoxBarrageList = [] } = val;
      setBarrage(blindBoxBarrageList);
    });
  };

  return (
    <View className="blind_home">
      {/* 头部 */}
      <View className="blind_home_head">
        <View
          className="blind_home_share"
          onClick={() => {
            if (!loginStatus()) {
              Router({
                routerName: "login",
              });
            }
          }}
        >
          {loginStatus() && (
            <Button
              style={{
                width: "100%",
                height: "100%",
                background: "none",
                position: "absolute",
              }}
              openType={"share"}
              data-info="mh"
            ></Button>
          )}
        </View>
        <View className="blind_home_rule"></View>
      </View>
      {/* 获奖信息滚动横幅 */}
      <PersonnelSwiper list={barrage}></PersonnelSwiper>
      {/* 盲盒区域 */}
      <BlindContent
        list={jpList}
        data={data}
        updateInfo={setData}
      ></BlindContent>
      {/* 获取盲盒机会 */}
      <BindGetNumber data={data}></BindGetNumber>
      {/* 购物区域 */}
      <GoodsContent data={data}></GoodsContent>
      {/* 底部logo */}
      <Footer></Footer>
    </View>
  );
};
