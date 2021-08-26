/*
 到点打卡,商户暂不支持到店打卡，请联系商户开通设置
*/
import React, { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import { useReachBottom } from "@tarojs/taro";
import UserCard from "@/relay/components/UserCard";
import { fetchCommunityUser } from "@/server/relay";
export default (props) => {
  const { index } = props;
  const [httpData, setHttpData] = useState({
    page: 1,
    limit: 10,
  });
  const [list, setList] = useState([]);
  const fetchList = (type = "pageUp") => {
    fetchCommunityUser(httpData).then((res) => {
      const { communityOrganizationList = [] } = res;
      if (type === "pageUp") {
        setList([...list, ...communityOrganizationList]);
      } else {
        setList(communityOrganizationList);
      }
    });
  };
  useEffect(() => {
    fetchList();
  }, [httpData.page]);
  useReachBottom(() => {
    if (index == 0) {
      setHttpData({
        ...httpData,
        page: httpData.page + 1,
      });
    }
  });
  return (
    <View className="" style={{ display: index === 0 ? "block" : "none" }}>
      <UserCard
        upDateList={(item) => {
          const { ownerId } = item;
          setList(
            list.map((val) => {
              if (val.ownerId === ownerId)
                return {
                  ...val,
                  subscribeFlag: "1",
                };
              return val;
            })
          );
        }}
        list={list}
      ></UserCard>
    </View>
  );
};
