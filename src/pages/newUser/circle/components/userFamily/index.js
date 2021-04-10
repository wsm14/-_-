import React, { Component, useEffect, useState } from "react";
import { View, Text, ScrollView } from "@tarojs/components";
import { useReachBottom } from "@tarojs/taro";
import "./index.scss";
import Card from "./../card";
import List from "./../list";
import { user } from "@/api/api";
import { toast } from "@/common/utils";
import { httpGet } from "@/api/newRequest";
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
      userFamily: { getFamilyUser },
    } = user;
    httpGet(
      {
        data: {},
        url: getFamilyUser,
      },
      (res) => {
        setData({ ...res });
      }
    );
  };
  const getUserList = () => {
    const {
      userFamily: { getListUser },
    } = user;
    httpGet(
      {
        data: httpData,
        url: getListUser,
      },
      (res) => {
        const { userList } = res;
        if (userList && userList.length > 0) {
          setList([...list, ...userList]);
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
    const { countStatus } = httpData;
    console.log(111, countStatus);
    if (countStatus) {
      setHttpData({
        ...httpData,
        page: httpData.page + 1,
      });
    }
  };
  const {
    sumBean,
    sumBeanUnit,
    todaySumBean,
    todaySumBeanUnit,
    totalCount,
  } = data;
  const { countStatus } = httpData;
  console.log(list);
  return (
    <View className="page_family">
      <View className="family_box">
        <Card data={data}></Card>
      </View>
      <View className="family_details">
        <View className="familyTitle">我的家人</View>
        <View className="familyVital">
          {totalCount == "0" ? "暂无家人" : `共有${totalCount || "0"}位家人`}
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
