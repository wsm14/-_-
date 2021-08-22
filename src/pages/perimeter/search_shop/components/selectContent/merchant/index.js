import React, { useEffect, useState } from "react";
import Waterfall from "@/components/waterfall";
import { View } from "@tarojs/components";
import Taro, { useReachBottom } from "@tarojs/taro";
import { fetchMerchantListByKeyword } from "@/server/perimeter";
import GroupView from "@/components/componentView/ownerView/ownerGroup";
import ShopView from "@/components/componentView/ownerView/ownerShop";
export default ({ keyword, current, configUserLevelInfo }) => {
  const [data, setData] = useState({
    page: 1,
    limit: 10,
  });
  const [list, setList] = useState([]);
  const [groupInfo, setGroupInfo] = useState(null);
  const [countStatus, setCountStatus] = useState(true);
  useEffect(() => {
    setData({
      page: 1,
      limit: 10,
      keyword: keyword,
    });
    setList([]);
    setGroupInfo(null);
  }, [keyword]);
  useEffect(() => {
    getMerchant();
  }, [data]);

  const getMerchant = () => {
    const { keyword } = data;
    if (keyword) {
      fetchMerchantListByKeyword(data, (res) => {
        const { userMerchantList = [], merchantGroupInfo = null } = res;
        setGroupInfo(merchantGroupInfo);
        if (userMerchantList && userMerchantList.length > 0) {
          setList([...list, ...userMerchantList]);
        } else {
          setCountStatus(false);
        }
      });
    }
  };
  useReachBottom(() => {
    if (countStatus && current == 1) {
      setData({
        ...data,
        page: data.page + 1,
      });
    }
  });
  return (
    <View style={current == 1 ? { display: "block" } : { display: "none" }}>
      <View className="flex_auto">
        {groupInfo && (
          <View className="flex_group">
            <View className="flex_group_topLiner"></View>
            <GroupView data={groupInfo}></GroupView>
            <View className="flex_group_topLiner"></View>
          </View>
        )}

        {list.length > 0 ? (
          <View className="xixihaha">
            <View className="search_merchant_title  font_hide">
              相关商家-{keyword}
            </View>
            {list.map((item) => {
              return (
                <ShopView userInfo={configUserLevelInfo} data={item}></ShopView>
              );
            })}
          </View>
        ) : (
          <View className="search_shopNO">
            <View className="search_shopImg"></View>
            <View className="search_shopImgfont color2 font28">
              暂无结果，换个关键词试试吧
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
