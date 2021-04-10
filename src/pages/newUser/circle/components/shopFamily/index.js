import React, { Component, useState, useEffect } from "react";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import { user } from "@/api/api";
import { toast, getDom } from "@/common/utils";
import { httpGet } from "@/api/newRequest";
import Card from "./../card";
import List from "./../shopList";
import Consent from "./../consent";
export default (props) => {
  const [data, setData] = useState({});
  const [list, setList] = useState([]);
  const [httpData, setHttpData] = useState({
    page: 1,
    limit: 10,
    countStatus: true,
  });
  useEffect(() => {
    getUserDetails();
    getUserList();
  }, []);
  useEffect(() => {
    getUserList();
  }, [httpData.page]);
  const getUserDetails = () => {
    const {
      shopFamily: { getMyMerchant },
    } = user;
    httpGet(
      {
        data: {},
        url: getMyMerchant,
      },
      (res) => {
        setData({ ...res });
      }
    );
  };
  const getUserList = () => {
    const {
      shopFamily: { getMyMerchantList },
    } = user;
    httpGet(
      {
        data: httpData,
        url: getMyMerchantList,
      },
      (res) => {
        const { userList } = res;
        if (userList && userList.length > 0) {
          setList([...list, ...userMerchantList]);
        } else {
          setHttpData({
            ...httpData,
            countStatus: false,
          });
        }
      }
    );
  };
  const setReachBottom = () => {
    const { page, limit, countStatus } = httpData;
    if (countStatus) {
      setHttpData({
        ...httpData,
        page: httpData.page + 1,
      });
    }
  };
  const { totalCount } = data;
  const { countStatus } = httpData;
  console.log(list);
  return (
    <View className="page_family">
      <View className="family_box">
        <Card data={data}></Card>
      </View>
      <View className="family_details">
        <View className="familyTitle">我的家店</View>
        <View className="familyVital">
          {totalCount == "0" ? "暂无家店" : `共有${totalCount || "0"}家家店`}
        </View>
      </View>

    
        {list && list.length > 0 ? (
          <ScrollView
            scrollY
            onScrollToLower={() => setReachBottom()}
            className="consent_family"
          >
            <List list={list}></List>
            {!countStatus && (
              <View className="list_countStatus">- 暂无更多 -</View>
            )}
          </ScrollView>
        ) : (
          <Consent></Consent>
        )}
     
    </View>
  );
};
