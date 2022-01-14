import React from "react";
import { useRouter } from "@tarojs/taro";
import {
  View,
  Text,
  Swiper,
  SwiperItem,
  Image,
  Button,
} from "@tarojs/components";
import "./index.scss";

/**
 * mode
 * telephoneCharges-话费福利券包
 * commerceGoods-电商品
 * beanWelfare-卡豆福利券包
 */
export default ({ data }) => {
  const routeParams = useRouter().params;
  const { mode = "telephoneCharges" } = routeParams;

  const showContent = {
    telephoneCharges: {
      class: "telephoneCharges",
      showDom: (
        <View>
          <View className="bwzgc_telephoneCharges_name">10元话费抵扣券</View>
          <View className="bwzgc_telephoneCharges_price">
            <Text className="bwzgc_telephoneCharges_buyPrice">¥5.00+500</Text>
          </View>
          <Button className="bwzgc_beanWelfareZone_btn">500卡豆抵扣购买</Button>
        </View>
      ),
    },
    commerceGoods: {
      class: "commerceGoods",
      showDom: (
        <View>
          <Swiper
            className="bwzgc_commerceGoods_Swiper"
            previousMargin="40rpx"
            nextMargin="40rpx"
          >
            <SwiperItem className="bwzgc_commerceGoods_SwiperItem">
              <View className="bwzgc_commerceGoods_detail">
                <Image className="bwzgc_commerceGoods_img"></Image>
                <View className="bwzgc_commerceGoods_info">
                  <View className="bwzgc_commerceGoods_name">
                    电商品电商品电商品电
                  </View>
                  <View>
                    <View className="bwzgc_commerceGoods_oldPrice">
                      原价：¥10.00
                    </View>
                    <View className="bwzgc_commerceGoods_tag"></View>
                    <View className="bwzgc_commerceGoods_price">
                      ¥25.00+2500
                    </View>
                  </View>
                </View>
              </View>
            </SwiperItem>
          </Swiper>
          <Button className="bwzgc_beanWelfareZone_btn">500卡豆抵扣购买</Button>
        </View>
      ),
    },
    beanWelfare: {
      class: "beanWelfare",
      showDom: (
        <View>
          <View
            className="bwzgc_beanWelfare_Swiper"
            style={{ justifyContent: "center" }}
          >
            <View className="bwzgc_beanWelfare_cell">
              <View className="bwzgc_beanWelfare_type">商品通用券</View>
              <View className="bwzgc_beanWelfare_price">
                <Text>25</Text>
              </View>
              <View className="bwzgc_beanWelfare_rule">满100可用</View>
              <View className="bwzgc_beanWelfare_num">数量：2张</View>
            </View>
          </View>
          <View className="bwzgc_beanWelfare_name">100元平台通用券包</View>
          <View className="bwzgc_beanWelfare_groupPrice">原价：¥10.00</View>
          <View className="bwzgc_beanWelfare_buyPrice">¥5.00+500</View>
          <Button className="bwzgc_beanWelfareZone_btn">500卡豆抵扣购买</Button>
        </View>
      ),
    },
  }[mode];

  return (
    <View className={`bwzGoodContent_content ${showContent.class}`}>
      {showContent.showDom}
    </View>
  );
};
