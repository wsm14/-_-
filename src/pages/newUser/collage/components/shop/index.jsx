import React, { useEffect, useState, useRef } from "react";
import Taro, { useReachBottom } from "@tarojs/taro";
import { Image, Text, View } from "@tarojs/components";
import classNames from "classnames";
import { fakeStartGroup } from "@/server/user";
import { toast, backgroundObj } from "@/utils/utils";
import days from "dayjs";
import Router from "@/utils/router";
export default ({ type = 0, data }) => {
  const {
    togetherGroupConfigId,
    joinUserNum,
    status,
    startGroupNum,
    togetherEarnGoodsObject = {},
    togetherGroupRuleObject = {},
    groupId,
    togetherRebateParamObject = {},
    rewardType,
    createTime,
  } = data;

  let interval = null;
  let collection = true;
  const [time, setTime] = useState(null);
  const [showTimeList, setShowTimeList] = useState([]);
  const filterLimit = (s) => {
    if (s && s > 0) {
      let resource = parseInt(s); // 秒
      let minute = 0;
      let house = 0;

      if (resource > 60) {
        //如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minute = parseInt(resource / 60);
        //获取秒数，秒数取佘，得到整数秒数
        resource = parseInt(resource % 60);
        //秒数
        if (minute > 60) {
          //获取小时，获取分钟除以60，得到整数小时
          house = parseInt(minute / 60);
          //获取小时后取佘的分，获取分钟除以60取佘的分
          minute = parseInt(minute % 60);
        }
      }
      return [
        house ? (house < 10 ? "0" + parseInt(house) : house) : "00",
        minute ? (minute < 10 ? "0" + parseInt(minute) : minute) : "00",
        resource ? (resource < 10 ? "0" + parseInt(resource) : resource) : "00",
      ];
    } else return null;
  };
  const reloadInfo = () => {
    let min = days(createTime).valueOf() + 86400000;
    const now = days().valueOf();
    setTime(min - now);
  };
  console.log(showTimeList);
  useEffect(() => {
    return () => {
      collection = false;
    };
  }, []);
  useEffect(() => {
    if (time) {
      let computed = 0;
      interval = setInterval(() => {
        computed = computed + 1000;
        if (time - computed >= 0 && collection) {
          setShowTimeList(filterLimit((time - computed) / 1000));
        } else {
          clearInterval(interval);
        }
      }, 1000);
    }
  }, [time]);
  const {
    goodsIdString,
    ownerIdString,
    goodsType,
    goodsName,
    goodsImg,
    oriPrice,
    togetherPrice,
    costPrice,
    goodsDesc,
    goodsDescImg,
  } = togetherEarnGoodsObject;
  const { notWinFee, teamLeaderFee } = togetherRebateParamObject;
  useEffect(() => {
    if (status === "0") {
      reloadInfo();
    }
  }, [status]);
  const template = () => {
    return (
      <View className="collage_shop_content font_hide">
        <View
          style={backgroundObj(goodsImg)}
          className="collage_shop_profile"
        ></View>
        <View className="collage_shop_right">
          <View className="collage_shop_title font_hide">{goodsName}</View>
          <View className="collage_shop_price">
            <Text className="color1 font20">拼团价:</Text>
            <Text className="color3 font28">¥{togetherPrice}</Text>
            <Text className="color2 font20"> 原价:</Text>
            <Text className="color2 font24 text_through">¥{oriPrice}</Text>
          </View>
          <View className="collage_shop_tagsBox">
            <View className="collage_shop_tag collage_shop_tagStyle1 public_center">
              开团返佣{teamLeaderFee}元
            </View>
            <View className="collage_shop_tag collage_shop_tagStyle2 public_center">
              参与红包{notWinFee}元
            </View>
          </View>
        </View>
      </View>
    );
  };
  const bottom = {
    0: (
      <View className="collage_shop_bottom">
        <View className="collage_shop_liner"></View>
        <View className="collage_shop_btnBox public_auto">
          <View className="collage_bottom_left">
            10人成团 | {startGroupNum}人开团中
          </View>
          <View
            className="collage_bottom_open"
            onClick={() => {
              fakeStartGroup({
                togetherGroupConfigId,
              });
              Router({
                routerName: "download",
              });
            }}
          >
            开团
          </View>
        </View>
      </View>
    ),
    1: (
      <View className="collage_shop_bottom">
        <View className="collage_shop_stepBox">
          <View className="collage_shop_step">
            <View className="collage_shop_stepContent"></View>
          </View>
          <View className="collage_shop_stepFont">
            <Text className="color1">{joinUserNum}</Text>/10
          </View>
        </View>
        <View className="collage_shop_liner"></View>
        <View className="collage_shop_btnBox public_auto">
          <View className="collage_bottom_left">
            等待成团 | {showTimeList[0]}小时{showTimeList[1]}分{showTimeList[2]}
            秒后结束
          </View>
          <View className="collage_bottom_right">邀请好友</View>
        </View>
      </View>
    ),
    2: (
      <View className="collage_shop_bottom">
        <View className="collage_shop_stepBox">
          <View className="collage_shop_step">
            <View className="collage_shop_stepContent"></View>
          </View>
          <View className="collage_shop_stepFont">
            <Text className="color1">6</Text>/10
          </View>
        </View>
        <View className="collage_shop_liner"></View>
        <View className="collage_shop_btnBox">
          <View className="collage_bottom_left">
            等待成团 | 5小时24分32秒后结束
          </View>
        </View>
      </View>
    ),
  }[type];
  return (
    <View className="collage_shop_box">
      {template()}
      {bottom}
    </View>
  );
};
