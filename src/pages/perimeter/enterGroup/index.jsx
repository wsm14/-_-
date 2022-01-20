import React, { useEffect, useState } from "react";
import router from "@/utils/router";
import { useRouter } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import Toast from "@/components/toast";
import "./index.scss";

export default () => {
  // 路由获取参数 mode select 选择模式 list 列表管理
  const routeParams = useRouter().params;
  const { mode = "userCenter" } = routeParams;

  const [showType, setShowType] = useState("userCenter");
  const [toastShow, setToastShow] = useState(false);

  useEffect(() => {
    setShowType(mode);
  }, []);

  // 按钮点击事件
  const handleBtnClick = () => {
    if (showType === "userCenter") {
    } else if (showType === "getBean") {
      setToastShow(true);
    } else if (showType === "getGroup") {
      setShowType("userCenter");
    } else if (showType === "goUse") {
      router({
        type: "switchTab",
        routerName: "perimeter",
      });
    }
  };

  const imageData = {
    // 个人中心进入
    userCenter: {
      bag: "https://wechat-config.dakale.net/miniprogram/image/enterGroup_bag.png",
      btn: "https://wechat-config.dakale.net/miniprogram/image/enterGroup_btn.png",
    },
    // 领取卡豆
    getBean: {
      bag: "https://wechat-config.dakale.net/miniprogram/image/enterGroup_bag2.png",
      btn: "https://wechat-config.dakale.net/miniprogram/image/enterGroup_getBean.png",
      bagClass: "invite",
    },
    // 加入社群
    getGroup: {
      bag: "https://wechat-config.dakale.net/miniprogram/image/enterGroup_bag2.png",
      btn: "https://wechat-config.dakale.net/miniprogram/image/enterGroup_getGroup.png",
      bagClass: "invite",
    },
    // 去使用
    goUse: {
      bag: "https://wechat-config.dakale.net/miniprogram/image/enterGroup_bag2.png",
      btn: "https://wechat-config.dakale.net/miniprogram/image/enterGroup_goUse.png",
      bagClass: "invite",
    },
  };

  return (
    <View className="enterGroup_box">
      {/* 小程序个人中心进入背景 */}
      <Image
        src={imageData[showType].bag}
        className={`enterGroup_bag ${imageData[showType].bagClass}`}
      ></Image>
      {/* 小程序个人中心进入背景加群按钮 */}
      <View className="enterGroup_btn_content">
        <View className="enterGroup_btn">
          <Image
            src={imageData[showType].btn}
            className={`enterGroup_btn ${showType}`}
            onClick={handleBtnClick}
          ></Image>
          {/* 加入社群按钮 */}
          <View className="enterGroup_hidden">
            <cell url="https://work.weixin.qq.com/gm/2bb7c5d5c05ebae070b893e0671fc458"></cell>
          </View>
        </View>
      </View>

      {toastShow && (
        <Toast
          btn="立即去加群"
          close={() => setToastShow(false)}
          onSubmit={() => setShowType("userCenter")}
        >
          <View className="total_content">请先加入福利群</View>
        </Toast>
      )}
    </View>
  );
};
