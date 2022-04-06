import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "@tarojs/components";
import Drawer from "@/components/Drawer";
import { backgroundObj } from "@/utils/utils";
import Router from "@/utils/router";
import Taro from "@tarojs/taro";
import "./index.scss";
export default ({ visible, close, data, joinGroupUserDetail = {} }) => {
  const { togetherEarnGoodsObject = {} } = data;
  const { rewardValue, rewardType = "winRed" } = joinGroupUserDetail;
  const { goodsImg } = togetherEarnGoodsObject;
  if (visible) {
    const template = {
      winGoods: (
        <View className="shopDrawer_box">
          <View className="shopDrawer_content">
            <View
              style={backgroundObj(goodsImg)}
              className="shopDrawer_img"
            ></View>
            <View className="shopDrawer_font">
              恭喜您拼中本次参团商品 并额外获得{rewardValue}卡豆补贴
            </View>
            <View className="shopDrawer_desc shopDrawer_desc_margin">
              100卡豆=1元
            </View>
            <View className="shopDrawer_desc">
              您可在我的卡豆账户中查看详情
            </View>
            <View
              onClick={() => {
                close();
                Router({
                  routerName: "goods",
                });
              }}
              className="shopDrawer_btn public_center"
            >
              查看订单
            </View>
          </View>
        </View>
      ),
      winRed: (
        <View className="shopDrawer_winRed_box">
          <View className="shopDrawer_winRed_rel">
            <Text className="font32">¥ </Text>
            {rewardValue}
          </View>
        </View>
      ),
    }[rewardType];

    return (
      <Drawer show={visible} close={close}>
        {template}
      </Drawer>
    );
  } else return null;
};
