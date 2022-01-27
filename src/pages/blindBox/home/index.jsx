import React, { useEffect, useState } from "react";
import { View, Button } from "@tarojs/components";
import Taro, {
  useDidShow,
  useShareAppMessage,
  usePullDownRefresh,
} from "@tarojs/taro";
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
import { fetchShareInfo } from "@/server/common";
import { loginStatus } from "@/utils/utils";
import Router from "@/utils/router";
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
    getShareData();
  });
  usePullDownRefresh(() => {
    let time = setTimeout(() => {
      clearTimeout(time);
      Taro.stopPullDownRefresh();
    }, 500);
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
      fetchShareInfo({ shareType: "blindBox", subType: "invitation" }).then(
        (val = {}) => {
          setShareZl(val);
        }
      );
      fetchShareInfo({ shareType: "blindBox" }).then((val) => {
        setShareMh(val);
      });
    }
  };
  const getRewardJackpot = (val) => {
    fetchBlindBoxRewardJackpot({ luckDrawType: val }).then((val) => {
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
          className="blind_home_rule"
          onClick={() =>
            Router({
              routerName: "webView",
              args: {
                link: `https://dakale-wx-hutxs-1302395972.tcloudbaseapp.com/${
                  process.env.NODE_ENV === "development" ? "dev" : "product"
                }/wechant/page/common/blindBoxRule.html`,
              },
            })
          }
        ></View>
      </View>
      {/* 获奖信息滚动横幅 */}
      <PersonnelSwiper list={barrage}></PersonnelSwiper>
      {/* 盲盒区域 */}
      <BlindContent
        list={jpList}
        updateList={(e) => {
          getRewardJackpot(e);
        }}
        data={data}
        updateInfo={setData}
      ></BlindContent>
      {/* 获取盲盒机会 */}
      {/* <BindGetNumber data={data}></BindGetNumber> */}
      {/* 购物区域 */}
      {/* <GoodsContent data={data}></GoodsContent> */}
      {/* 底部logo */}
      {/* <Footer></Footer> */}
    </View>
  );
};
