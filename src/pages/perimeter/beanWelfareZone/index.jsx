import React, { useState } from "react";
import router from "@/utils/router";
import { useRouter, useDidShow } from "@tarojs/taro";
import { View } from "@tarojs/components";
import {
  fetchGetBeanGiftPackDetail,
  fetchGetBeanCommerceGoodsDetail,
} from "@/server/perimeter";
import { loginStatus } from "@/utils/utils";
import BwzHead from "./components/BwzHead";
import DetailBeanWelfare from "./components/DetailBeanWelfare";
import DetailCommerceGoods from "./components/DetailCommerceGoods";
import DetailTelephoneCharges from "./components/DetailTelephoneCharges";
import BwzRuleFooter from "./components/BwzRuleFooter";
import BeanLackModal from "./components/BeanLackModal";
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

  const [coommList, setCoommList] = useState([]); // 电商品数组
  const [goodsData, setGoodsData] = useState({}); // 当前显示商品数据
  const [beanLack, setBeanLack] = useState(false); // 卡豆不足提示框

  useDidShow(() => {
    fetGetData();
  });

  const fetGetData = () => {
    // 卡豆福利券包 话费福利券包
    if (["beanWelfare", "telephoneCharges"].includes(mode)) {
      fetchGetBeanGiftPackDetail({ giftType: mode, buyFlag: 1 }).then((res) => {
        setGoodsData(res.platformGiftPackInfo);
      });
    } else if (["commerceGoods"].includes(mode)) {
      // 电商品
      fetchGetBeanCommerceGoodsDetail().then((res) => {
        const { activityGoodsList } = res;
        const goods = activityGoodsList[0] || {}; // 显示第一个商品
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
    // 校验是否已经登录
    if (!loginStatus()) {
      router({
        routerName: "login",
      });
      return;
    }
    const {
      platformGiftId,
      ownerIdString: merchantId,
      specialActivityIdString: specialActivityId,
      paymentModeObject = {},
      userBean = 0,
    } = goodsData;
    let args = {};

    // 卡豆福利券包 话费福利券包
    if (["beanWelfare", "telephoneCharges"].includes(mode)) {
      const { bean = 0, type } = paymentModeObject; // 卡豆加现金支付
      // 需要卡豆支付
      if (type === "self") {
        // 用户当前卡豆是否比需要的卡豆少，少则跳提示
        if (userBean - bean < 0) {
          setBeanLack(true);
          return;
        }
      }
      args = { mode: "beanGiftPack", platformGiftId };
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
        <DetailBeanWelfare
          data={goodsData}
          handleGoBuyGoods={handleGoBuyGoods}
        />
      ),
    },
    commerceGoods: {
      bagColor: "#74CBFF",
      showDom: (
        <DetailCommerceGoods
          data={goodsData}
          list={coommList}
          setGoodsData={setGoodsData}
          handleGoBuyGoods={handleGoBuyGoods}
        />
      ),
    },
    telephoneCharges: {
      bagColor: "#FF5A38",
      showDom: (
        <DetailTelephoneCharges
          data={goodsData}
          handleGoBuyGoods={handleGoBuyGoods}
        />
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
      {/* 卡豆不足提示框 */}
      <BeanLackModal
        data={goodsData}
        visible={beanLack}
        onClose={() => setBeanLack(false)}
      ></BeanLackModal>
    </View>
  );
};
