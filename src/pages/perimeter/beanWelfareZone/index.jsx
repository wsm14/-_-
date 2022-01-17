import React, { useEffect, useState } from "react";
import router from "@/utils/router";
import { useRouter } from "@tarojs/taro";
import { View } from "@tarojs/components";
import {
  fetchGetBeanGiftPackDetail,
  fetchGetBeanCommerceGoodsDetail,
} from "@/server/perimeter";
import BwzHead from "./components/BwzHead";
import BwzGoodContent from "./components/BwzGoodContent";
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
      fetchGetBeanGiftPackDetail({ giftType: mode }).then((res) => {
        console.log(res);
        setGoodsData(res.platformGiftPackInfo);
      });
    } else if (["commerceGoods"].includes(mode)) {
      fetchGetBeanCommerceGoodsDetail().then((res) => {
        console.log(res);
      });
    }
  };

  const propsData = {
    beanWelfare: { bagColor: "#FF4040" },
    commerceGoods: { bagColor: "#74CBFF" },
    telephoneCharges: { bagColor: "#FF5A38" },
  }[mode];

  return (
    <View
      className="beanWelfareZone_content"
      style={{ backgroundColor: propsData.bagColor }}
    >
      {/* 头部背景文案 */}
      <BwzHead data={goodsData}></BwzHead>
      {/* 中部 商品展示区域 */}
      <BwzGoodContent data={goodsData}></BwzGoodContent>
      {/* 底部 获取卡豆提示 跳转app 购买说明 哒卡乐slogan */}
      <BwzRuleFooter></BwzRuleFooter>
    </View>
  );
};
