import React, { useState, useEffect } from "react";
import { View, Image, Button } from "@tarojs/components";
import JackNow from "./JackNow";
import Taro from "@tarojs/taro";
import { fetchBlindBoxReward, fetchBlindBoxHelp } from "@/server/blindBox";
import { getUserMomentcheckNew } from "@/server/share";
import Drawer from "@/components/Drawer";
import { loginStatus, backgroundObj } from "@/utils/utils";
import Router from "@/utils/router";
import "./index.scss";
import classNames from "classnames";
const filterList = (list) => {
  let newList = [{}, {}, {}, {}];
  if (list.length >= 4) {
    return list;
  }
  list.forEach((item, index) => {
    newList[index] = item;
  });
  return newList;
};
/**
 * 盲盒区域
 */
export default ({ data, updateInfo, list, updateList }) => {
  const {
    beanNum = "--",
    blindBoxBeanNum = "",
    times,
    ruleTypeBeanStatus,
    surplusBoxBeanTimes,
  } = data;
  const [tabKey, setTabKey] = useState("bean"); // tab key
  const [jpData, setJqData] = useState({});
  const [showNow, setShowNow] = useState(false); // 本期奖池
  const [visible, setVisible] = useState(false);
  const [friendVisible, setFriendVisible] = useState(false);
  const [noCountVisible, setCountVisible] = useState(false);
  const [shareData, setShareData] = useState({});
  const { winningImg } = jpData;
  const {
    blindBoxHelpList = [],
    blindBoxRuleObject = {},
    freeTime,
  } = shareData;
  const { num } = blindBoxRuleObject;
  const bindTab = {
    bean: "卡豆专场",
    invitation: "邀请专场",
  };
  useEffect(() => {
    updateList(tabKey);
  }, [tabKey]);
  const getBlindHelp = () => {
    let user = loginStatus();
    if (!user) {
      return Router({
        routerName: "login",
      });
    } else {
      const { userIdString } = user;
      fetchBlindBoxHelp({
        userId: userIdString,
      }).then((val = {}) => {
        const {
          blindBoxHelpList = [],
          freeTime,
          blindBoxRuleObject = {},
          userInfo,
        } = val;
        setFriendVisible(() => {
          setShareData({
            blindBoxHelpList: filterList(blindBoxHelpList.slice(0, 3)),
            freeTime,
            blindBoxRuleObject,
            userInfo,
          });
          return true;
        });
      });
    }
  };
  const saveBlindBoxReward = () => {
    fetchBlindBoxReward({
      luckDrawType: tabKey,
    })
      .then((val) => {
        setVisible(() => {
          setJqData(val);
          return true;
        });
        updateInfo && updateInfo({ ...data, ...val });
      })
      .catch((e) => {
        const { resultCode } = e;
        if (resultCode === "20260") {
          setCountVisible(true);
        }
      });
  };
  const Template = () => {
    if (tabKey === "bean") {
      if (ruleTypeBeanStatus === "1") {
        return (
          <View
            className="blind_start_beanInfo public_center"
            onClick={(e) => {
              saveBlindBoxReward();
            }}
          >
            <View className="blind_start_count">
              {blindBoxBeanNum}卡豆拆一次
            </View>
          </View>
        );
      } else {
        return (
          <View
            className="blind_start_beanInfo public_center"
            onClick={() => {
              Router({
                routerName: "nearVideo",
                args: {
                  type: "goods",
                },
              });
            }}
          >
            <View className="blind_start_count">卡豆不足? 去捡卡豆</View>
          </View>
        );
      }
    } else {
      if (times > 0) {
        return (
          <View
            className="blind_start"
            onClick={(e) => {
              saveBlindBoxReward();
            }}
          >
            免费拆盲盒X{times}
          </View>
        );
      } else {
        return (
          <View
            className="blind_start"
            onClick={() => {
              if (!loginStatus()) {
                Router({
                  routerName: "login",
                });
              }
            }}
          >
            {loginStatus() && (
              <Button
                style={{
                  width: "100%",
                  height: "100%",
                  background: "none",
                  position: "absolute",
                }}
                openType={"share"}
                data-info="zl"
              ></Button>
            )}
            邀请好友助力 得机会
          </View>
        );
      }
    }
  };
  return (
    <>
      <View className="blind_content">
        {/* 可用卡豆 */}
        <View className="blindC_bean">{beanNum}</View>
        {/* 切换区域
        <View className="blind_tab">
          {Object.keys(bindTab).map((item) => (
            <View
              className={`blind_tab_cell ${
                tabKey === item ? "invitation" : ""
              }`}
              onClick={() => setTabKey(item)}
            >
              {bindTab[item]}
            </View>
          ))}
        </View> */}
        {/* 抽奖区域 */}
        <View
          className={classNames(
            tabKey === "bean" ? "blind_bean" : "blind_friend"
          )}
        ></View>
        {/* 记录按钮 */}
        <View className="blind_jackpot">
          {/* 本期奖池 */}
          <View
            className="blind_jacknow"
            onClick={() => setShowNow(true)}
          ></View>
          {/* 我的奖品 */}
          <View
            className="blind_jackown"
            onClick={() => {
              Router({
                routerName: "blindPrize",
              });
            }}
          ></View>
        </View>
        <Template></Template>
        {/* 開始按鈕 */}

        <View className="blind_logo"></View>
      </View>
      <JackNow
        list={list}
        show={showNow}
        onClose={() => setShowNow(false)}
      ></JackNow>
      {visible && (
        <Drawer
          show={visible}
          close={() => {
            setVisible(() => {
              setJqData({});
              return false;
            });
          }}
        >
          <View className="blind_jp_box">
            <View className="blind_jp_title">恭喜你被超级幸运砸中</View>
            <View className="blind_jp_img">
              <Image
                lazyLoad
                mode={"aspectFill"}
                src={winningImg}
                className="blind_jp_image"
              ></Image>
            </View>

            <View className="blind_jp_btnBox public_auto">
              <View
                onClick={() => {
                  setVisible(false);
                  Router({
                    routerName: "blindPrize",
                  });
                }}
                className="public_center blind_jp_btn"
              >
                去看看
              </View>
              <View
                className="public_center blind_jp_btn"
                onClick={() => {
                  setVisible(() => {
                    setJqData({});
                    return false;
                  });
                }}
              >
                多拆多送
              </View>
            </View>
          </View>
        </Drawer>
      )}
      {friendVisible && (
        <Drawer
          show={friendVisible}
          close={() => {
            setFriendVisible(() => {
              setShareData({});
              return false;
            });
          }}
        >
          <View className="friend_box">
            <View className="friend_title">我的邀请进度</View>
            <View className="friend_wait">
              {freeTime === 0
                ? "等待好友助力"
                : `已获得${freeTime}次免费拆盲盒机会`}
            </View>
            {freeTime === 0 ? (
              <View className="friend_btn public_center">
                {loginStatus() && (
                  <Button
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "none",
                      position: "absolute",
                    }}
                    openType={"share"}
                    data-info="zl"
                  ></Button>
                )}
                立即邀请好友助力
              </View>
            ) : (
              <View
                className="friend_btn public_center"
                onClick={() => {
                  setFriendVisible(() => {
                    setShareData({});
                    return false;
                  });
                }}
              >
                助力成功 马上拆盲盒
              </View>
            )}
            <View className="friend_profileBox">
              {blindBoxHelpList.map((item, index) => {
                const { profile = "" } = item;
                if (!profile) {
                  return (
                    <View
                      style={
                        (index + 1) % 4 === 0
                          ? {}
                          : { marginRight: Taro.pxTransform(22) }
                      }
                      className="friend_share_profile friend_share_proStyle2"
                    ></View>
                  );
                } else {
                  return (
                    <View
                      style={
                        (index + 1) % 4 === 0
                          ? { ...backgroundObj(profile) }
                          : {
                              marginRight: Taro.pxTransform(22),
                              ...backgroundObj(profile),
                            }
                      }
                      className="friend_share_profile friend_share_proStyle1"
                    ></View>
                  );
                }
              })}
            </View>
            <View className="friend_share_desc">
              每邀请{num}个人助力成功，即可获得{blindBoxRuleObject.times}次机会
            </View>
          </View>
        </Drawer>
      )}
      {noCountVisible && (
        <Drawer
          show={noCountVisible}
          close={() => {
            setCountVisible(false);
          }}
        >
          <View className="countVisible_box">
            <View className="countVisible_order_info">
              <View className="countVisible_order_desc">
                您今日在赚豆场抽奖次数
              </View>
              <View className="countVisible_order_desc">已达上限</View>
              <View className="countVisible_order_desc">
                可以去邀请场继续玩哦～
              </View>
              <View className="countVisible_order_btn public_auto">
                <View
                  className="countVisible_order_btnBox countVisible_order_btnStyle1 public_center"
                  onClick={() => setCountVisible(false)}
                >
                  好的 明日再来
                </View>
                <View
                  className="countVisible_order_btnBox countVisible_order_btnStyle2 public_center"
                  onClick={() => {
                    Router({
                      routerName: "nearVideo",
                      args: {
                        type: "goods",
                      },
                    });
                    setCountVisible(false);
                  }}
                >
                  看视频捡豆
                </View>
              </View>
            </View>
          </View>
        </Drawer>
      )}
    </>
  );
};
