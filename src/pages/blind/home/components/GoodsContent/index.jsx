import React from "react";
import { View, Image, Text } from "@tarojs/components";
import "./index.scss";

/**
 * 盲盒购物区域
 */
export default () => {
  const bindGoodList = [
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
  ];

  return (
    <View className="blind_GoodsContent">
      {bindGoodList.map((item) => (
        <View className="blind_GoodsContent_Gorup">
          <View className={`blind_GoodsContent_title ${item.type}`}></View>
          <View className="blind_Goods_group">
            <View className="blind_Goods_cell">
              <Image
                src={
                  "https://wechat-config.dakale.net/miniprogram/blind/home/home_head.png"
                }
                mode="aspectFill"
                className="blind_Goods_img"
              ></Image>
              <View className="blind_Goods_info">
                <View className="blind_Goods_name">
                  特价红富士特价红富士特价特价红富士特价红富士特价红…
                </View>
                {item.type == "coupon" && (
                  <View className="blind_Goods_coupon">满60元可用</View>
                )}
                <View className="blind_Goods_store">
                  <Image
                    src={
                      "https://wechat-config.dakale.net/miniprogram/blind/home/home_head.png"
                    }
                    mode="aspectFill"
                    className="blind_Goods_storeIcon"
                  ></Image>
                  <View className="blind_Goods_storeName">
                    鲜丰水果鲜丰水果
                  </View>
                  ｜200m
                </View>
                <View className="blind_Goods_footer">
                  {item.type !== "coupon" && (
                    <View className="blind_Goods_priceContent">
                      原价: <Text className="blind_Goods_price">¥9.99</Text>
                    </View>
                  )}
                  <View className="blind_Goods_tools">
                    <View className="blind_Goods_left">
                      {
                        {
                          // 卡豆专区
                          bean: (
                            <>
                              <View className="blind_Goods_ohterPriceTag">
                                专区
                              </View>
                              <View className="blind_Goods_ohterPrice">
                                ¥0.1+1000
                              </View>
                            </>
                          ),
                          // 特惠商品
                          special: (
                            <>
                              <View className="blind_Goods_oriContent">
                                优惠价:
                                <Text className="blind_Goods_oriPrice">
                                  ¥9.99
                                </Text>
                              </View>
                              <View className="lookAround_new_bean">
                                <View className="bean_getInfo lookAround_new_img"></View>
                                <View className="lookAround_new_pay">¥999</View>
                              </View>
                            </>
                          ),
                          // 附近券
                          coupon: (
                            <>
                              <View className="blind_Goods_oriContent">
                                优惠价:
                                <Text className="blind_Goods_oriPrice">
                                  ¥9.99
                                </Text>
                              </View>
                              <View className="lookAround_new_bean">
                                <View className="bean_getInfo lookAround_new_img"></View>
                                <View className="lookAround_new_pay">¥999</View>
                              </View>
                            </>
                          ),
                        }[item.type]
                      }
                    </View>
                    <View className="blind_Goods_right">分享赚</View>
                  </View>
                </View>
              </View>
            </View>
            <View className="blind_Goods_goAll">查看全部</View>
          </View>
        </View>
      ))}
    </View>
  );
};
