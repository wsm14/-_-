import React, { useEffect, useState } from "react";
import router from "@/utils/router";
import { useRouter } from "@tarojs/taro";
import { View } from "@tarojs/components";
import {
  fetchGetBeanGiftPackDetail,
  fetchGetBeanCommerceGoodsDetail,
} from "@/server/perimeter";
import BwzHead from "./components/BwzHead";
import BeanWelfareDetail from "./components/BeanWelfareDetail";
import CommerceGoodsDetail from "./components/CommerceGoodsDetail";
import TelephoneChargesDetail from "./components/TelephoneChargesDetail";
import BwzRuleFooter from "./components/BwzRuleFooter";
import "./index.scss";

/**
 * mode
 * telephoneCharges-话费福利券包
 * commerceGoods-电商品
 * beanWelfare-卡豆福利券包
 */
export default () => {
  const routeParams = useRouter().params;
  const { mode = "telephoneCharges" } = routeParams;

  const [goodsData, setGoodsData] = useState({}); // 当前商品数据
  const [coommList, setCoommList] = useState([]); // 电商品数组

  useEffect(() => {
    fetGetData();
  }, []);

  const fetGetData = () => {
    // 卡豆福利券包 话费福利券包
    if (["beanWelfare", "telephoneCharges"].includes(mode)) {
      fetchGetBeanGiftPackDetail({ giftType: mode, buyFlag: 1 }).then((res) => {
        setGoodsData(res.platformGiftPackInfo);
      });
    } else if (["commerceGoods"].includes(mode)) {
      fetchGetBeanCommerceGoodsDetail().then((res) => {
        const { activityGoodsList } = res;
        const goods = activityGoodsList[0] || {};
        setCoommList(activityGoodsList);
        setGoodsData({
          ...(goods || {}),
          giftValue: goods.oriPrice,
          buyPrice: goods.realPrice,
        });
      });
    }
  };

  // 购买商品
  const handleGoBuyGoods = () => {
    const {
      platformGiftId,
      ownerIdString: merchantId,
      specialActivityIdString: specialActivityId,
    } = goodsData;
    let args = {};

    if (["beanWelfare", "telephoneCharges"].includes(mode)) {
      args = { mode: "beanGiftPack", platformGiftId }; // 卡豆福利券包 话费福利券包
    } else if (["commerceGoods"].includes(mode)) {
      args = { merchantId, specialActivityId }; // 电商品
    }

    router({
      routerName: "favourableOrder",
      args,
    });
  };

  const propsData = {
    beanWelfare: {
      bagColor: "#FF4040",
      showDom: (
        <BeanWelfareDetail
          data={goodsData}
          handleGoBuyGoods={handleGoBuyGoods}
        ></BeanWelfareDetail>
      ),
    },
    commerceGoods: {
      bagColor: "#74CBFF",
      showDom: (
        <CommerceGoodsDetail
          data={goodsData}
          list={coommList}
          setGoodsData={setGoodsData}
          handleGoBuyGoods={handleGoBuyGoods}
        ></CommerceGoodsDetail>
      ),
    },
    telephoneCharges: {
      bagColor: "#FF5A38",
      showDom: (
        <TelephoneChargesDetail
          data={goodsData}
          handleGoBuyGoods={handleGoBuyGoods}
        ></TelephoneChargesDetail>
      ),
    },
  }[mode];

  return (
    <View
      className="beanWelfareZone_content"
      style={{ backgroundColor: propsData.bagColor }}
    >
      {/* 头部背景文案 */}
      <BwzHead data={goodsData}></BwzHead>
      {/* 中部 商品展示区域 */}
      {propsData.showDom}
      {/* 底部 获取卡豆提示 跳转app 购买说明 哒卡乐slogan */}
      <BwzRuleFooter></BwzRuleFooter>
    </View>
  );
};
