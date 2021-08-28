/*
 到点打卡,商户暂不支持到店打卡，请联系商户开通设置
*/
import React, { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import { useReachBottom } from "@tarojs/taro";
import UserCard from "@/relay/components/UserCard";
import { fetchCommunityUser } from "@/server/relay";
import ShareInfo from "@/relay/components/shareInfo";
import { getShareInfo } from "@/server/common";
import { loginStatus } from "@/common/utils";
export default (props) => {
  const { index } = props;
  const [httpData, setHttpData] = useState({
    page: 1,
    limit: 10,
  });
  const [list, setList] = useState([]);
  const [visible, serVisible] = useState(false);
  const [shareData, serShareData] = useState({});
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
  useEffect(() => {
    if (!visible) {
      serShareData({});
    }
  }, [visible]);
  useReachBottom(() => {
    if (index == 0) {
      setHttpData({
        ...httpData,
        page: httpData.page + 1,
      });
    }
  });
  // communityOrganizationId,
  // ownerId,
  return (
    <View className="" style={{ display: index === 0 ? "block" : "none" }}>
      <UserCard
        shareInfo={(val) => {
          const { communityOrganizationId, ownerId } = val;
          if (!loginStatus()) {
          } else {
            getShareInfo(
              {
                shareType: "communityGoods",
                shareId: communityOrganizationId,
                shardingKey: ownerId,
              },
              (res) => {
                serVisible(true);
                serShareData(res);
              }
            );
          }
        }}
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
      <ShareInfo
        onClose={() => {
          setVisible(false);
        }}
        data={shareData}
      ></ShareInfo>
    </View>
  );
};
