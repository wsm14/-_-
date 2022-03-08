import React, { useEffect, useState } from "react";
import { View, Image, Text } from "@tarojs/components";
import { observer, MobXProviderContext } from "mobx-react";
import { fetchRightGoods } from "@/server/index";
import {
  template,
  prefectrueGoodsTemplate,
  couponTemplate,
} from "@/components/public_ui/specalTemplate";
import Taro, { useDidShow } from "@tarojs/taro";
import { getListMayLikeCoupon, getGoodsByMerchantId } from "@/server/perimeter";
import Router from "@/utils/router";
import "./index.scss";
/**
 * 盲盒购物区域
 */
export default observer(() => {
  const { store } = React.useContext(MobXProviderContext);
  const { locationStore, authStore, commonStore } = store;
  const { preferentialGlobalDefaultList = [] } = commonStore;
  const [bindGoodList, setBindGoodList] = useState([
    {
      type: "bean", // 卡豆专区
      title: "bean",
      data: [],
    },
    {
      type: "special", // 特惠商品
      title: "bean",
      data: [],
    },
    {
      type: "coupon", // 附近券
      title: "bean",
      data: [],
    },
  ]);
  const [configUserLevelInfo, setConfigUserLevelInfo] = useState({});
  useDidShow(() => {
    Promise.all([
      fetchRightGoods({ page: 1, limit: 3 }),
      getListMayLikeCoupon({ page: 1, limit: 3 }),
      getGoodsByMerchantId({ page: 1, limit: 3 }),
    ]).then((val = [{}, {}, {}]) => {
      const { specialGoodsList = [] } = val[0];
      const { couponList = [] } = val[1];
      setBindGoodList([
        {
          type: "bean", // 卡豆专区
          title: "bean",
          data: specialGoodsList,
          template: (item, config) => prefectrueGoodsTemplate(item, config),
          link: () =>
            Router({
              routerName: "prefecture",
            }),
        },
        {
          type: "special", // 特惠商品
          title: "bean",
          data: val[2].specialGoodsList || [],
          template: (item, config) => template(item, config),
          link: () =>
            Router({
              routerName: "perimeter",
              type: "switchTab",
            }),
        },
        {
          type: "coupon", // 附近券
          title: "bean",
          data: couponList,
          template: (item, config) => couponTemplate(item, config),
          link: () =>
            Router({
              routerName: "perimeter",
              type: "switchTab",
            }),
        },
      ]);
    });
  });
  useEffect(() => {
    if (preferentialGlobalDefaultList.length > 0) {
      let data = preferentialGlobalDefaultList.find((item, val) => {
        const { identification } = item;
        return identification === "otherDefault";
      });
      setConfigUserLevelInfo({
        payBeanCommission:
          data.preferentialActivityRuleObject.payBeanCommission,
      });
    }
  }, [preferentialGlobalDefaultList]);
  return (
    <View className="blind_GoodsContent">
      {bindGoodList.map((item) => {
        if (item.data.length > 0) {
          return (
            <View className="blind_GoodsContent_Gorup">
              <View className={`blind_GoodsContent_title ${item.type}`}></View>
              <View className="blind_Goods_group">
                {item.data.map((val) => {
                  return item.template(val, configUserLevelInfo);
                })}
                <View className="blind_Goods_goAll" onClick={() => item.link()}>
                  查看全部
                </View>
              </View>
            </View>
          );
        } else return null;
      })}
    </View>
  );
});
