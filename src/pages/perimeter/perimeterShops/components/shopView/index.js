import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { ScrollView, View, Input } from "@tarojs/components";
import { getMerchantLat } from "@/server/index";
import classNames from "classnames";
import ButtonView from "@/components/Button";
import {
  getLat,
  getLnt,
  GetDistance,
  backgroundObj,
  loginStatus,
  mapGo,
  navigateTo,
  toast,
} from "@/common/utils";
import "./index.scss";
export default (props) => {
  const { keyword = "", close, onInput, onConfirm } = props;
  const [list, setList] = useState([]);
  const getMerchantData = () => {
    if (keyword.length > 0)
      getMerchantLat(
        {
          page: 1,
          limit: 10,
          keyword,
        },
        (res) => {
          const { userMerchantList = [] } = res;
          setList(userMerchantList);
        }
      );
    else {
      setList([]);
    }
  };
  useEffect(() => {
    getMerchantData();
  }, [keyword]);
  const template = (item) => {
    const { lat, lnt, coverImg, merchantName, address } = item;
    return (
      <View className="template_map">
        <View
          onClick={() =>
            mapGo({
              lat,
              lnt,
              address,
              name: merchantName,
            })
          }
          className="template_map_box"
        >
          <View
            className="template_map_img"
            style={backgroundObj(coverImg)}
          ></View>
          <View className="template_map_content">
            <View className="template_map_title font_hide">{merchantName}</View>
            <View className="template_map_address">
              <View className="template_map_left font_hide">{address}</View>
              <View className="template_map_limit">
                {" "}
                {GetDistance(getLat(), getLnt(), lat, lnt)}
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View className="shop_seachView">
      <View className="shop_seach_box">
        <Input
          type={"text"}
          confirmType={"search"}
          onConfirm={onConfirm}
          value={keyword}
          onInput={onInput}
          className="search_shop_input"
          placeholder={"搜一下发现附近好店"}
        ></Input>
        <View onClick={close} className="search_close">
          取消
        </View>
      </View>
      {list.length > 0 ? (
        <View className="shop_seach_top">
          {list.map((item) => {
            return template(item);
          })}
        </View>
      ) : (
        <View>
          <View className="shop_seach_nullStatus"></View>
          <View className="shop_seach_nullfont">
            暂无商家信息，请换一个关键词试试
          </View>
        </View>
      )}
    </View>
  );
};
