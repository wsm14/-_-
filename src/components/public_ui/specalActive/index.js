import React, { useState, useRef, useEffect } from "react";
import { ScrollView, View } from "@tarojs/components";
import Taro, { useReachBottom } from "@tarojs/taro";
import { getGoodsByMerchantId } from "@/server/perimeter";
import { template } from "./../specalTemplate";
import { observer, MobXProviderContext } from "mobx-react";
import "./index.scss";
export default (props) => {
  const { title, current = false, page, defaultData = null } = props;
  const [userInfo, setUserInfo] = useState({});
  /*
    为你推荐 商品组件  
    current @params {boolean} false 开启翻页  true  最多两条数据  
    userInfo @params {object} 用户哒人身份信息
    */
  const [data, setData] = useState([]);
  const [httpData, setHttpData] = useState(null);
  const [count, countType] = useState(true);
  const { store } = React.useContext(MobXProviderContext);
  const { commonStore } = store;
  const { preferentialGlobalDefaultList } = commonStore;
  useEffect(() => {
    if (preferentialGlobalDefaultList.length > 0) {
      let data = preferentialGlobalDefaultList.find((item) => {
        const { identification } = item;
        return identification === "otherDefault";
      });
      setUserInfo({
        payBeanCommission:
          data.preferentialActivityRuleObject.payBeanCommission,
      });
    }
  }, [preferentialGlobalDefaultList]);
  useEffect(() => {
    if (!defaultData) {
      if (current) {
        setHttpData({
          page: 1,
          limit: 10,
        });
      } else {
        setHttpData({
          page: 1,
          limit: 2,
        });
      }
    }
  }, []);
  useEffect(() => {
    if (count && httpData) {
      getLovely();
    }
  }, [httpData]);
  useEffect(() => {
    if (defaultData) {
      const { categoryId } = defaultData;
      setData([]);
      setHttpData({
        page: 1,
        limit: 10,
        categoryIds: categoryId,
      });
    }
  }, [defaultData]);
  useReachBottom(() => {
    getDown();
  });
  const getLovely = () => {
    getGoodsByMerchantId(httpData, (res) => {
      const { specialGoodsList } = res;
      if (specialGoodsList && specialGoodsList.length > 0) {
        setData([...data, ...specialGoodsList]);
      } else {
        countType(false);
      }
    });
  };
  const getDown = () => {
    if (count && current) {
      setHttpData({
        ...httpData,
        page: httpData.page + 1,
      });
    }
  };
  if (data.length > 0) {
    return (
      <View className="specalActive_box">
        <View className="specalActive_title">为您推荐</View>
        <View className="specalActive_liner"></View>
        <View className="specalActive_goods">
          {data.map((item) => {
            return template(item, userInfo);
          })}
        </View>
      </View>
    );
  }
  return null;
};
