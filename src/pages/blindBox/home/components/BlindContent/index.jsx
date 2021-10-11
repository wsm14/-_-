import React, { useState } from "react";
import { View, Image } from "@tarojs/components";
import JackNow from "./JackNow";
import Taro from "@tarojs/taro";
import { fetchBlindBoxReward, fetchBlindBoxHelp } from "@/server/blindBox";
import Drawer from "@/components/Drawer";
import { loginStatus } from "@/common/utils";
import Router from "@/common/router";
import "./index.scss";
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
export default ({ data, updateInfo, list }) => {
  const {
    beanNum = "--",
    blindBoxBeanNum = "",
    times,
    ruleTypeBeanStatus,
  } = data;
  const [tabKey, setTabKey] = useState("bean"); // tab key
  const [jpData, setJqData] = useState({});
  const [showNow, setShowNow] = useState(false); // 本期奖池
  const [visible, setVisible] = useState(false);
  const [friendVisible, setFriendVisible] = useState(false);
  const [shareData, setShareData] = useState({});

  const { winningImg } = jpData;
  const { blindBoxHelpList = [], num, freeTime } = shareData;
  const bindTab = {
    bean: "卡豆专场",
    invitation: "邀请专场",
  };
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
            blindBoxHelpList: filterList(blindBoxHelpList),
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
    }).then((val) => {
      setVisible(() => {
        setJqData(val);
        return true;
      });

      updateInfo && updateInfo({ ...data, ...val });
    });
  };
  const Template = () => {
    if (tabKey === "bean") {
      if (ruleTypeBeanStatus === "1") {
        return (
          <View
            className="blind_start"
            onClick={(e) => {
              saveBlindBoxReward();
            }}
          >
            {blindBoxBeanNum}卡豆拆一次
          </View>
        );
      } else {
        return <View className="blind_start">卡豆不足 ?</View>;
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
        return <View className="blind_start">邀请好友助力 得机会</View>;
      }
    }
  };
  // const templateBtn = {
  //   bean:
  //     ruleTypeBeanStatus === "1" ? (
  //       <View className="blind_start" onClick={saveBlindBoxReward}>
  //         {blindBoxBeanNum}卡豆拆一次
  //       </View>
  //     ) : (
  //       <View className="blind_start">卡豆不足 ?</View>
  //     ),
  //   invitation:
  //     times > 0 ? (
  //       <View className="blind_start">免费拆盲盒X{times}</View>
  //     ) : (
  //       <View className="blind_start">邀请好友助力 得机会</View>
  //     ),
  // }[tabKey];
  // 这种写法click直接失效;
  return (
    <>
      <View className="blind_content">
        {/* 可用卡豆 */}
        <View className="blindC_bean">{beanNum}</View>
        {/* 切换区域 */}
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
        </View>
        {/* 抽奖区域 */}
        <View className="blind_prize"></View>
        {/* 记录按钮 */}
        <View className="blind_jackpot">
          {/* 本期奖池 */}
          <View
            className="blind_jacknow"
            onClick={() => setShowNow(true)}
          ></View>
          {/* 我的奖品 */}
          <View className="blind_jackown"></View>
        </View>
        <Template></Template>
        {/* 開始按鈕 */}

        {/* 邀请好友获得免费机会/查看我的助力进度 */}
        {tabKey === "bean" ? (
          <View className="blind_invint">邀请好友获得免费机会 </View>
        ) : (
          <View className="blind_invint" onClick={() => getBlindHelp()}>
            查看我的助力进度{" "}
          </View>
        )}
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
              <View className="public_center blind_jp_btn">去看看</View>
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
              <View className="friend_btn public_center">立即邀请好友助力</View>
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
              2. 每{times}个人助力成功，即可获得{num}次机会
            </View>
          </View>
        </Drawer>
      )}
    </>
  );
};
