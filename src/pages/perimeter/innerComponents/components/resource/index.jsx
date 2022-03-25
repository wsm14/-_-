import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import {
  backgroundObj,
  GetDistance,
  getLat,
  getLnt,
  computedBeanPrice,
} from "@/utils/utils";
import Taro from "@tarojs/taro";
import days from "dayjs";
import "./index.scss";
export default ({ data, payBeanCommission, onChange }) => {
  let interval = null;
  let collection = true;
  const { contentInfo } = data;
  const { topImg, mixedList } = contentInfo;
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
    const limit = days().format("YYYY-MM-DD");
    let min = days(limit).valueOf() + 86400000;
    const now = days().valueOf();
    setTime(min - now);
  };
  useEffect(() => {
    reloadInfo();
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
          collection && reloadInfo();
        }
      }, 1000);
    }
  }, [time]);
  const template = (item) => {
    const {
      specialGoodsId,
      goodsName,
      goodsImg,
      oriPrice,
      realPrice,
      total,
      remain,
      status,
      relateType,
      ownerId,
      merchantName,
      merchantLogo,
      lnt,
      lat,
      progress,
      showSelledGoods,
      activityGoodType,
      paymentModeObject = {},
    } = item;
    const { type = "defaultMode", cash, bean } = paymentModeObject;
    const render = () => {
      if (type === "defaultMode") {
        return (
          <>
            <View className="resource_price font_hide">
              <View className="resource_rel font_hide">
                <Text className="font24">¥</Text>
                {realPrice}
              </View>
            </View>
            <View className="resource_bean">
              <View className="resource_bean_info public_center">
                <Text className="font24">¥</Text>
                {computedBeanPrice(realPrice, 100 - payBeanCommission)}
              </View>
            </View>
          </>
        );
      } else {
        return (
          <>
            <View className="resource_self"></View>
            <View className="resource_self_price">
              {" "}
              ¥{cash} {bean ? `+${bean}卡豆` : ""}
            </View>
          </>
        );
      }
    };
    const renderProcess = () => {
      return (
        <View className="resource_process_box">
          <View
            style={{ width: remain === 0 ? "100%" : progress * 100 + "%" }}
            className="resource_process_bfb"
          ></View>
          <View className="resource_process_font">
            {showSelledGoods === 0
              ? "新开秒杀"
              : remain === 0
              ? "100%"
              : (progress * 100).toFixed(0) + "%"}
          </View>
        </View>
      );
    };
    const renderIcon = {
      specialGoods: "resource_profile_tag1",
      commerceGoods: "resource_profile_tag2",
      rightGoods: "resource_profile_tag3",
      selfTourGoods: "resource_profile_tag1",
    }[activityGoodType];
    return (
      <View className="resource_template" onClick={() => onChange(item)}>
        <View style={backgroundObj(goodsImg)} className="resource_profile">
          <View className={renderIcon}></View>
        </View>
        <View className="resource_content">
          <View className="resource_name font_noHide">{goodsName}</View>
          <View className="resource_userInfo font_hide">
            <View
              className="resource_userProfile merchant_dakale_logo"
              style={backgroundObj(merchantLogo)}
            ></View>
            <View className="resource_userName font_hide">{merchantName}</View>
            <View className="resource_limit">
              ｜{GetDistance(getLat(), getLnt(), lat, lnt)}
            </View>
          </View>
          {renderProcess()}
          {render()}
        </View>
        {remain !== 0 ? (
          <View className="resource_btn public_center"></View>
        ) : (
          <View className="resource_remain_btn public_center">已售罄</View>
        )}
      </View>
    );
  };
  return (
    <View className="resource_box">
      <View className="resource_banner" style={backgroundObj(topImg)}></View>
      <View className="resource_body">
        <View className="resource_end_time">
          <View className="resource_end_cion"></View>
          <View className="resource_end_djs">
            {showTimeList.map((item, index) => {
              return (
                <View className={`resource_end_djs${index + 1}`}>{item}</View>
              );
            })}
          </View>
        </View>
      </View>
      {mixedList.map((item) => {
        return template(item);
      })}
      <View className="dakale_logo">
        <View className="dakale_logo_image"></View>
      </View>
    </View>
  );
};
