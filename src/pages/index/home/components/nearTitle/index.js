import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import Router from "@/common/router";
import { fetchSpecialForRecommend } from "@/server/index";
import { getBanner } from "@/server/common";
import "./index.scss";
import {
  backgroundObj,
  getLat,
  getLnt,
  computedBeanPrice,
} from "@/common/utils";
export default (props) => {
  const { reload, configUserLevelInfo, browseType } = props;
  const [list, setList] = useState([]);
  const [bannerList, setBannerList] = useState([]);
  const { payBeanCommission = 50 } = configUserLevelInfo;
  const fetchGoods = () => {
    fetchSpecialForRecommend(
      {
        page: 1,
        limit: 2,
        specialFilterType: "hot",
      },
      (res) => {
        const { specialGoodsList = [] } = res;
        setList(specialGoodsList);
      }
    );
  };
  const fetchBanner = () => {
    getBanner({ bannerType: "popularityRanking" }, (res) => {
      const { bannerList = [] } = res;
      setBannerList(bannerList);
    });
  };

  useEffect(() => {
    fetchGoods();
    fetchBanner();
  }, []);
  useEffect(() => {
    if (reload) {
      fetchGoods();
      fetchBanner();
    }
  }, [reload]);

  const template = (item) => {
    const {
      goodsName,
      goodsImg,
      realPrice,
      specialActivityIdString,
      merchantIdString,
    } = item;
    return (
      <View
        className="nearTitle_shop_box"
        onClick={() =>
          Router({
            routerName: "favourableDetails",
            args: {
              specialActivityId: specialActivityIdString,
              merchantId: merchantIdString,
            },
          })
        }
      >
        <View
          className="nearTitle_shop_img"
          style={backgroundObj(goodsImg)}
        ></View>
        <View className="nearTitle_shop_name font_hide">{goodsName}</View>
        <View className="nearTitle_shop_price font_hide">
          <View className="font24">¥ </View>
          <View>{" " + computedBeanPrice(realPrice, payBeanCommission)}</View>
        </View>
        <View className="nearTitle_bean_toast">卡豆抵扣到手价</View>
      </View>
    );
  };
  if (list.length > 0) {
    return (
      <View className="nearTitle_box">
        <View className="nearTitle_left">
          <View className="nearTitle_shop">
            <View className="nearTitle_name">周边特惠</View>
            <View className="nearTitle_tag public_center">限时折扣</View>
          </View>
          <View className="nearTitle_active">
            {list.map((item) => {
              return template(item);
            })}
          </View>
        </View>
        <View className="nearTitle_right">
          <View
            style={backgroundObj(bannerList[0] && bannerList[0].coverImg)}
            className="nearTitle_right_activeBox nearTitle_right_activeIcon1"
            onClick={() => {
              if (bannerList[0] && bannerList[0].jumpUrl) {
                let { jumpUrlNew, jumpUrlType, jumpUrl } = bannerList[0];
                jumpUrlNew = (jumpUrlNew && JSON.parse(jumpUrlNew)) || {};
                const { weChatUrl } = jumpUrlNew;
                if (jumpUrlType === "native" && weChatUrl) {
                  Router({
                    routerName: weChatUrl,
                  });
                } else if (jumpUrlType === "h5" && jumpUrl) {
                  Router({
                    routerName: "webView",
                    args: {
                      link: jumpUrl.split("?")[0],
                      url: jumpUrl.split("?")[1] || "",
                    },
                  });
                } else return;
              }
            }}
          >
            <View className="nearTitle_right_rank">人气排行榜</View>
            <View className="nearTitle_right_details">吃喝玩乐指南榜单</View>
            <View className="nearTitle_right_logo nearTitle_right_logoIcon1"></View>
          </View>
          <View
            className="nearTitle_right_activeBox nearTitle_right_activeIcon2"
            onClick={() =>
              Router({
                routerName: "perimeterShops",
              })
            }
          >
            <View className="nearTitle_right_rank">周边好店</View>
            <View className="nearTitle_right_details">玩转周边小众打卡地</View>
            <View className="nearTitle_right_logo nearTitle_right_logoIcon2"></View>
          </View>
        </View>
      </View>
    );
  } else {
    return null;
  }
};
