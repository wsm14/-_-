import React, { useState } from "react";
import { View, Image } from "@tarojs/components";
import JackNow from "./JackNow";
import { fetchBlindBoxReward } from "@/server/blindBox";
import Drawer from "@/components/Drawer";
import "./index.scss";

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
  const { winningImg } = jpData;
  const bindTab = {
    bean: "卡豆专场",
    invitation: "邀请专场",
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
          <View className="blind_invint">查看我的助力进度 </View>
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
    </>
  );
};
