import React from "react";
import router from "@/utils/router";
import Taro, { useRouter } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import "./index.scss";

/**
 * 底部显示说明和提示，logo
 * mode
 * telephoneCharges-话费福利券包
 * commerceGoods-电商品
 * beanWelfare-卡豆福利券包
 */
export default () => {
  const routeParams = useRouter().params;
  const { mode = "telephoneCharges" } = routeParams;

  const desc = `1. 购买期间，此活动区域的商品不支持退款。
  2. 购买的商品如果账户卡豆不足时，无法购买，可通过刷视频/做日常任务赚取更多。
  3. 禁止使用非法手段进行刷取卡豆，一经发现，平台将会对于账号进行处罚。
  4. 如有任何疑问请联系客服400-800-5881`;

  const showContent = {
    telephoneCharges: {
      bag: "https://wechat-config.dakale.net/miniprogram/image/beanWelfareZone_500_tip.png",
      height: 430,
      goAppBag: "#ED310B",
      goAppColor: "#FF5A38",
      desc,
    },
    commerceGoods: {
      bag: "https://wechat-config.dakale.net/miniprogram/image/beanWelfareZone_2500_tip.png",
      height: 420,
      goAppBag: "#2EA6EE",
      goAppColor: "#2EA6EE",
      desc,
    },
    beanWelfare: {
      bag: "https://wechat-config.dakale.net/miniprogram/image/beanWelfareZone_5000_tip.png",
      height: 420,
      goAppBag: "#E21616",
      goAppColor: "#EE1111",
      desc: `1. 购买期间，此活动区域的商品不支持退款。
      2. 购买的券包包含多张券，具体以商品详情介绍为准。
      3. 购买的商品如果账户卡豆不足时，无法购买，可通过刷视频/做日常任务赚取更多。
      4. 禁止使用非法手段进行刷取卡豆，一经发现，平台将会对于账号进行处罚。
      5. 如有任何疑问请联系客服400-800-5881`,
    },
  }[mode];

  return (
    <View className="bwzRuleFooter_content">
      {/* 底部 获取卡豆提示 */}
      <View
        className="bwzFooter_getBeanTip"
        style={{
          backgroundImage: `url(${showContent.bag})`,
          height: Taro.pxTransform(showContent.height),
        }}
        onClick={() => router({ routerName: "home", type: "switchTab" })}
      ></View>
      {/* 底部 跳转app */}
      <View
        className="bwzFooter_goApp"
        style={{ backgroundColor: showContent.goAppBag }}
      >
        <View className="goApp_text">打开哒卡乐APP 每天再领200卡豆</View>
        <Button className="open_app" style={{ color: showContent.goAppColor }}>
          立即打开
        </Button>
      </View>
      {/* 底部 购买说明 */}
      <View className="bwzRuleFooter_Rule">
        <View className="bwzrule_detail">
          <View className="bwzrule_detail_title">购买说明</View>
          <View className="bwzrule_detail_gorup">{showContent.desc}</View>
        </View>
      </View>
      {/* 底部 哒卡乐slogan */}
      <View className="bwzRuleFooter_footer dkl_slogan"></View>
    </View>
  );
};
