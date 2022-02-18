import React, { useState } from "react";
import Taro, { useReady } from "@tarojs/taro";
import { View } from "@tarojs/components";
import router from "@/utils/router";
import "./index.scss";

/*
   site 是否占位 
   theme 主题颜色 white black 默认黑色black
   backFlag 是否开始导航
   select 是否开启导航切换
  */
const NavigationBar = ({
  getHeight,
  children,
  onBackClick,
  theme = "black",
  site = true,
  backFlag = false,
  title = "",
}) => {
  // 导航栏高度
  const [navBarHeight, setNavBarHeight] = useState(0);
  // 胶囊距右方间距（方保持左、右间距一致）
  const [menuRight, setMenuRight] = useState(0);
  // 胶囊距底部间距（保持底部间距一致）
  const [menuBotton, setMenuBotton] = useState(0);
  // 胶囊高度（自定义内容可与胶囊高度保证一致）
  const [menuHeight, setMenuHeight] = useState(0);

  useReady(() => {
    // 获取系统信息
    const systemInfo = Taro.getSystemInfoSync();
    // 胶囊按钮位置信息
    const menuButtonInfo = Taro.getMenuButtonBoundingClientRect();
    // 导航栏高度 = 状态栏到胶囊的间距（胶囊距上距离-状态栏高度） * 2 + 胶囊高度 + 状态栏高度
    const navH =
      (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 +
      menuButtonInfo.height +
      systemInfo.statusBarHeight +
      4;
    setNavBarHeight(navH);
    getHeight && getHeight(navH);
    setMenuRight(systemInfo.screenWidth - menuButtonInfo.right);
    setMenuBotton(menuButtonInfo.top - systemInfo.statusBarHeight);
    setMenuHeight(
      menuButtonInfo.height + (menuButtonInfo.top - systemInfo.statusBarHeight)
    );
  });

  return (
    <View>
      <View
        className="navBar_block"
        style={site ? { height: navBarHeight } : ""}
      >
        <View className={`nav-bar`} style={{ height: navBarHeight }}>
          <View
            style={{
              position: "absolute",
              height: menuHeight,
              minHeight: menuHeight,
              lineHeight: menuHeight + "px",
              left: menuRight,
              right: menuRight,
              bottom: menuBotton,
            }}
          >
            <View
              className="nav_title"
              style={{
                justifyContent: !title ? "flex-start" : "center",
                color: {
                  white: "#ffffff",
                  black: "#333333",
                }[theme],
              }}
            >
              {backFlag && (
                <View
                  className={`naviton_title_backStyle ${
                    { white: "go_back_iconWhite", black: "go_back_iconBlack" }[
                      theme
                    ]
                  }`}
                  onClick={() =>
                    onBackClick ? onBackClick() : router.back(() => {}, 1)
                  }
                ></View>
              )}
              {title}
            </View>
          </View>
        </View>
      </View>
      {children}
    </View>
  );
};

export default NavigationBar;
