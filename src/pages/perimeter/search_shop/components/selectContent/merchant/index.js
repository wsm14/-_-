import React, { useEffect, useState } from "react";
import Waterfall from "@/components/waterfall";
import { View } from "@tarojs/components";
import Taro, { useReachBottom } from "@tarojs/taro";
import { getSearchConditions } from "@/server/perimeter";
import "./../../../index.scss";
import { backgroundObj, GetDistance, getLat, getLnt } from "@/common/utils";
import classNames from "classnames";
import Router from "@/common/router";
export default ({ keyword, current }) => {
  const [data, setData] = useState({
    page: 1,
    limit: 10,
  });
  const [list, setList] = useState([]);
  const [countStatus, setCountStatus] = useState(true);
  useEffect(() => {
    setData({
      page: 1,
      limit: 10,
      keyword: keyword,
    });
    setList([]);
  }, [keyword]);
  useEffect(() => {
    getMerchant();
  }, [data]);

  const template = (item, index) => {
    const {
      address,
      coverImg,
      merchantName,
      lat,
      lnt,
      businessHub,
      perCapitaConsumption,
      businessTime,
      markFlag,
      specialGoodsFlag,
      markBean,
      userMerchantIdString,
    } = item;
    const bottomRender = () => {
      if (markFlag === "1" || specialGoodsFlag === "1") {
        return (
          <View
            className={classNames(
              "search_merchant_specail",
              businessTime && "search_merchant_buss"
            )}
            onClick={() =>
              Router({
                routerName: "merchantDetails",
                args: {
                  merchantId: userMerchantIdString,
                },
              })
            }
          >
            {markFlag === "1" && (
              <View className="search_merchant_bean">打卡捡豆{markBean}</View>
            )}
            {specialGoodsFlag === "1" && (
              <View className="search_merchant_goods public_center">
                优惠活动热卖中
              </View>
            )}
          </View>
        );
      } else return null;
    };
    return (
      <View className="search_merchant_box">
        <View
          className="search_merchantCard_box"
          onClick={() =>
            Router({
              routerName: "merchantDetails",
              args: {
                merchantId: userMerchantIdString,
              },
            })
          }
        >
          <View
            className="search_merchantCard_profile"
            style={backgroundObj(coverImg)}
          ></View>
          <View className="search_merchantCard_content">
            <View className="search_merchantCard_name font_hide">
              {merchantName}
            </View>
            <View className="search_merchantCard_limit">
              {GetDistance(getLat(), getLnt(), lat, lnt)}｜{businessHub}
              ｜人均￥{perCapitaConsumption}
            </View>
            <View className="search_merchantCard_time">
              {businessTime
                ? `营业时间 ${businessTime.split(",")[0]}`
                : bottomRender()}
            </View>
          </View>
        </View>
        {businessTime && bottomRender()}
      </View>
    );
  };
  const getMerchant = () => {
    const { keyword } = data;
    if (keyword) {
      getSearchConditions(data, (res) => {
        const { userMerchantList } = res;
        if (userMerchantList && userMerchantList.length > 0) {
          setList([...list, ...userMerchantList]);
        } else {
          setCountStatus(false);
        }
      });
    }
  };
  useReachBottom(() => {
    if (countStatus && current == 0) {
      setData({
        ...data,
        page: data.page + 1,
      });
    }
  });
  return (
    <View style={current == 1 ? { display: "block" } : { display: "none" }}>
      <View className="flex_auto">
        {list.length > 0 ? (
          <View className="search_shopPubu">
            {list.map((item) => {
              return template(item);
            })}
          </View>
        ) : (
          <View className="search_shopNO">
            <View className="search_shopImg"></View>
            <View className="search_shopImgfont color2 font28">
              暂无找到想要的结果，换个关键词试试吧
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
