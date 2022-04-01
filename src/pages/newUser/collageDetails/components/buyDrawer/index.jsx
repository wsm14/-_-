import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "@tarojs/components";
import Drawer from "@/components/Drawer";
import Empty from "@/components/Empty";
import { backgroundObj } from "@/utils/utils";
import Taro from "@tarojs/taro";
import "./index.scss";
export default ({ visible, close, list }) => {
  if (visible) {
    return (
      <Drawer show={visible} close={close}>
        <View className="buyDrawer_box">
          <View className="buyDrawer_title">参团详情</View>
          <Empty
            pt={true}
            pylb={"暂无参团记录"}
            show={list.length === 0}
            type={"shop"}
            toast={"赶紧邀请好友一起拼团吧！"}
          ></Empty>
          <ScrollView scrollY className="buyDrawer_body">
            {list.map((item) => {
              const { username, profile, createTime } = item;
              return (
                <View className="buyDrawer_list_box">
                  <View
                    style={backgroundObj(profile)}
                    className="buyDrawer_list_profile merchant_dakale_logo"
                  ></View>
                  <View className="buyDrawer_list_userName font_hide">
                    {username}
                  </View>
                  <View className="buyDrawer_list_right">{createTime}</View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </Drawer>
    );
  } else return null;
};
