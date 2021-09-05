import React, { useState, useEffect } from "react";
import Taro, { useReachBottom, usePullDownRefresh } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { fetchDicPlayer, fakeSubscribe } from "@/server/relay";
import classNames from "classnames";
import Router from "@/common/router";
import "./index.scss";

/**
 * 我的社群
 */

export default () => {
  // 请求参数
  const [pages, setPages] = useState({
    page: 1,
    limit: 10,
  });
  const [dataList, setDataList] = useState([]); // 列表数据

  useEffect(() => {
    fetchGetList();
  }, [pages]);

  // 下拉刷新
  usePullDownRefresh(() => {
    getNewData(pages);
  });

  // 下拉加载
  useReachBottom(() => {
    setPages({ ...pages, page: pages.page + 1 });
  });

  // 获取新数据
  const getNewData = (newObj = {}) => {
    setPages(() => {
      setDataList([]);
      return {
        ...pages,
        ...newObj,
        page: 1,
      };
    });
  };

  // 获取列表参数
  const fetchGetList = () => {
    fetchDicPlayer(pages).then((res) => {
      console.log(res);
      const { communityUserList = [] } = res;
      setDataList((old) => [...old, ...communityUserList]);
    });
    Taro.stopPullDownRefresh(); // 停止刷新
  };

  return (
    <View className="Teamplayer_content">
      {dataList.length ? (
        <View className="teamPlayer_group">
          {dataList.map((item, index) => (
            <View
              onClick={(e) => {
                e.stopPropagation();
                Router({
                  routerName: "communityGroup",
                  args: {
                    ownerId: item.teamUserId,
                  },
                });
              }}
              className="teamPlayer_cell"
            >
              <View
                className="teamPlayer_head"
                style={{
                  backgroundImage: `url(${item.profile})`,
                }}
              ></View>
              <View
                className={`teamPlayer_name ${
                  item.subsribe == 1 ? "take" : ""
                }`}
              >
                {item.username}
              </View>
              {item.subscribeFlag === "0" ? (
                <View
                  className="teamPlayer_card_btn public_center"
                  onClick={(e) => {
                    e.stopPropagation();
                    fakeSubscribe({
                      teamUserId: item.teamUserId,
                    }).then((val) => {
                      setDataList(
                        dataList.map((val) => {
                          if (val.teamUserId === item.teamUserId) {
                            return {
                              ...val,
                              subscribeFlag: "1",
                            };
                          } else {
                            return { ...val };
                          }
                        })
                      );
                    });
                  }}
                >
                  + 订阅
                </View>
              ) : (
                <View
                  className="teamPlayer_card_nobtn public_center"
                  onClick={(e) => {
                    e.stopPropagation();
                    fakeSubscribe({
                      teamUserId: item.teamUserId,
                    }).then((val) => {
                      setDataList(
                        dataList.map((val) => {
                          if (val.teamUserId === item.teamUserId) {
                            return {
                              ...val,
                              subscribeFlag: "0",
                            };
                          } else {
                            return { ...val };
                          }
                        })
                      );
                    });
                  }}
                >
                  已订阅{" "}
                </View>
              )}
            </View>
          ))}
        </View>
      ) : (
        <View className="teamPlayer_null">暂无团员</View>
      )}
    </View>
  );
};
