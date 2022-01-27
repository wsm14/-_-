import React, { useState } from "react";
import { View, Swiper, SwiperItem, Image, Button } from "@tarojs/components";
import "./index.scss";

/**
 * mode
 * commerceGoods-电商品
 */
export default ({ data = {}, list = [], setGoodsData, handleGoBuyGoods }) => {
  const [index, setIndex] = useState(0);

  const {
    paymentModeObject = {}, // 卡豆加现金支付
  } = data;
  const { bean = 0, type } = paymentModeObject; // 卡豆加现金支付

  return (
    <View className="bwzGoodContent_content commerceGoods">
      <Swiper
        className="bwzgc_commerceGoods_Swiper"
        previousMargin="40rpx"
        nextMargin="40rpx"
        current={index}
        onChange={(e) => {
          setIndex(e.detail.current);
          const goods = list[e.detail.current];
          setGoodsData({
            ...(goods || {}),
            giftImg: goods.goodsImg,
            giftName: goods.goodsName,
            giftValue: goods.oriPrice,
            buyPrice: goods.realPrice,
          });
        }}
      >
        {list.map((item) => {
          const {
            oriPrice = 0,
            realPrice = 0,
            paymentModeObject: gpay = {},
            specialActivityIdString,
          } = item;
          const { bean: gbean = 0, cash = 0, type: gType } = gpay; // 卡豆加现金支付
          return (
            <SwiperItem
              className="bwzgc_commerceGoods_SwiperItem"
              key={specialActivityIdString}
            >
              <View className="bwzgc_commerceGoods_detail">
                <Image
                  src={item.goodsImg}
                  mode="aspectFill"
                  className="bwzgc_commerceGoods_img"
                ></Image>
                <View className="bwzgc_commerceGoods_info">
                  <View className="bwzgc_commerceGoods_name">
                    {item.goodsName}
                  </View>
                  <View>
                    <View className="bwzgc_commerceGoods_oldPrice">
                      原价：¥{oriPrice}
                    </View>
                    <View className="bwzgc_commerceGoods_tag"></View>
                    <View
                      className={`bwzgc_commerceGoods_price ${
                        gType === "self" && "bean"
                      }`}
                    >
                      ¥{gType === "self" ? `${cash}+${gbean}` : realPrice}
                    </View>
                  </View>
                </View>
              </View>
            </SwiperItem>
          );
        })}
      </Swiper>
      <Button className="bwzgc_beanWelfareZone_btn" onClick={handleGoBuyGoods}>
        {type === "self" ? `${bean}卡豆抵扣购买` : `直接购买`}
      </Button>
    </View>
  );
};
