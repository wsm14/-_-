import React from "react";
import { View, Text, ScrollView } from "@tarojs/components";
import classNames from "classnames";
import RecommendSpecal from "@/components/public_ui/specalActive";
import { backgroundObj } from "@/utils/utils";
import Router from "@/utils/router";
export default ({ data = {}, list = [], configUserLevelInfo }) => {
  const {
    userRedEnvelopesReceive,
    sendUser = {},
    envelopesType,
    personAmount,
    content,
    status,
  } = data;
  const { profile, username } = sendUser;

  const handleBean = () => {
    return (
      <>
        <View className="Grab_showBean_num">
          <Text className="Grab_showBean_font1 bold">
            {userRedEnvelopesReceive &&
              (userRedEnvelopesReceive.bean / 100).toFixed(2)}
          </Text>
          <Text className="Grab_showBean_font2">元</Text>
        </View>
        <View className="Grab_showBean_desc">
          （{userRedEnvelopesReceive && userRedEnvelopesReceive.bean}卡豆）
        </View>
        <View
          className="Grab_showBean_go"
          onClick={() =>
            Router({
              routerName: "wallet",
            })
          }
        >
          已存入卡豆钱包，可消费抵扣 {" >"}
        </View>
        <View className="Grab_showBean_submitBox public_auto">
          <View
            className="Grab_showBean_btnBox Grab_showBean_btnBg2"
            onClick={() =>
              Router({
                routerName: "home",
                type: "switchTab",
              })
            }
          ></View>
          <View
            className="Grab_showBean_btnBox Grab_showBean_btnBg1"
            onClick={() =>
              Router({
                routerName: "perimeter",
                type: "switchTab",
              })
            }
          ></View>
        </View>
      </>
    );
  };
  const notHandleBean = () => {
    return (
      <>
        <View className="Grab_notHandleBean_num">
          {status == "2" ? "该红包已超过领取时间" : "手慢了，卡豆领完了"}
        </View>
        <View className="Grab_notHandleBean_btn">
          <View
            className="Grab_showBean_btnBox Grab_showBean_btnBg3"
            onClick={() =>
              Router({
                routerName: "home",
                type: "switchTab",
              })
            }
          ></View>
        </View>
      </>
    );
  };
  return (
    <View className="animated fadeIn">
      <View className="Grab_showBean_height"></View>
      <View className="Grab_showBean_box">
        <View className="Grab_showBean_user">
          <View
            className="Grab_showBean_userProfile"
            style={backgroundObj(profile)}
          ></View>
          <View className="Grab_showBean_userName font_hide">
            {username}发的卡豆红包
          </View>
          <View
            className={classNames(
              "Grab_showBean_tagBox",
              envelopesType === "normal"
                ? "Grab_showBean_tagBg2"
                : "Grab_showBean_tagBg1"
            )}
          ></View>
        </View>
        <View className="Grab_showBean_toast">{content}</View>
        {userRedEnvelopesReceive ? handleBean() : notHandleBean()}
        <View className="Grab_showBean_zhu">注：使用100卡豆消费可抵扣1元</View>
        <View className="Grab_showBean_liner"></View>
        <View className="Grab_showBean_people">
          领取详情（{list.length}/{personAmount}）
        </View>
        <ScrollView scrollY className="Grab_showBean_handerPeo">
          {list.map((item = {}, index) => {
            const { receiveUser = {}, createTime, bean, isBestLuck } = item;
            const { profile, username } = receiveUser;
            return (
              <View className="Grab_people_list">
                <View
                  className="Grab_people_profile"
                  style={backgroundObj(profile)}
                ></View>
                <View className="Grab_people_content">
                  <View className="Grab_people_contentTop font_hide">
                    <View className="Grab_people_contentLeft font_hide">
                      {username}
                    </View>
                    <View className="Grab_people_contentRight">
                      {(bean / 100).toFixed(2)}元({bean}卡豆)
                    </View>
                  </View>
                  <View className="Grab_people_contentTime">{createTime}</View>
                  {isBestLuck === 1 && (
                    <View className="Grab_winning">手气最佳</View>
                  )}
                  {index !== list.length - 1 && (
                    <View className="Grab_people_contentliner"></View>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
      <View className="Grab_showBean_gg">
        <RecommendSpecal
          current={true}
          userInfo={configUserLevelInfo}
        ></RecommendSpecal>
      </View>
    </View>
  );
};
