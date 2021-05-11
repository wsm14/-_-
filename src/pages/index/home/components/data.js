const topExtraPx = 40;
export const rssConfigData = (data = {}) => {
  let {
    hasGoods,
    userProfile = "",
    wxCode,
    username,
    frontImage,
    message,
    merchantName,
    cityName,
    address,
  } = data;

  if (
    !userProfile.includes("resource-new.dakale.net") &&
    !userProfile.includes("wechat-config.dakale.net")
  ) {
    userProfile = "https://resource-new.dakale.net/common/default_profile.png";
  }
  // const priceLength = price.toString().length * 35.18552780151367;
  if (hasGoods === "1") {
    return {
      width: 750, // 画布宽度
      height: 1334, // 画布高度
      backgroundColor: "#108588", // 画布颜色
      texts: [
        {
          x: 61,
          y: 638,
          paddingRight: 81,
          width: 614,
          height: 75,
          text: message, // 套餐名称
          fontSize: 32,
          color: "#333333",
          fontWeight: "bold",
          lineNum: 2,
          zIndex: 999,
          lineHeight: 44,
        },
      ],
      images: [
        {
          url: "https://wechat-config.dakale.net/miniprogram/image/icon580.png", // 背景
          width: 750,
          height: 1334,
          y: 0,
          x: 0,
          zIndex: 5,
        },
        {
          url: frontImage, // 视频封面图
          width: 646,
          height: 450,
          y: 128,
          x: 45,
          zIndex: 5,
        },
        {
          url: "https://wechat-config.dakale.net/miniprogram/image/icon581.png", // 播放按钮图片
          width: 80,
          height: 80,
          y: 313,
          x: 328,
          zIndex: 10,
        },
      ],
    };
  } else {
    return {
      width: 750, // 画布宽度
      height: 1334, // 画布高度
      backgroundColor: "#108588", // 画布颜色
      texts: [
        {
          x: 61,
          y: 638,
          paddingRight: 81,
          width: 614,
          height: 75,
          text: message, // 套餐名称
          fontSize: 32,
          color: "#333333",
          fontWeight: "bold",
          lineNum: 2,
          zIndex: 999,
          lineHeight: 44,
        },
        {
          x: 61,
          y: 866,
          width: 416,
          height: 44,
          text: merchantName, // 商家名称
          fontSize: 32,
          color: "#333333",
          fontWeight: "bold",
          lineNum: 1,
          zIndex: 999,
          lineHeight: 44,
        },
        {
          x: 61,
          y: 922,
          width: 416,
          height: 32,
          text: cityName, // 地区
          fontSize: 24,
          color: "rgba(153, 153, 153, 1)",
          lineNum: 1,
          zIndex: 999,
          lineHeight: 32,
        },
        {
          x: 61,
          y: 962,
          width: 416,
          height: 32,
          text: address, // 地区
          fontSize: 24,
          color: "rgba(153, 153, 153, 1)",
          lineNum: 1,
          zIndex: 999,
          lineHeight: 32,
        },
        {
          x: 139,
          y: 1048,
          text: "来自", // 用户昵称
          fontSize: 24,
          color: "#333333",
          width: 415,
          zIndex: 999,
        },
        {
          x: 139 + 50,
          y: 1048,
          text: username, // 用户昵称
          lineNum: 1,
          fontSize: 24,
          color: "#333333",
          fontWeight: "bold",
          maxWidth: 200,
          zIndex: 999,
          addonAfter: {
            type: "text",
            text: "的推荐", // 用户昵称后缀
            fontSize: 24,
            color: "#333333",
            marginLeft: 5,
            zIndex: 999,
          },
        },
      ],
      images: [
        {
          url: "https://wechat-config.dakale.net/miniprogram/image/icon582.png", // 背景
          width: 750,
          height: 1334,
          y: 0,
          x: 0,
          zIndex: 5,
        },
        {
          url: frontImage, // 视频封面图
          width: 646,
          height: 450,
          y: 128,
          x: 45,
          zIndex: 5,
        },
        {
          url: "https://wechat-config.dakale.net/miniprogram/image/icon581.png", // 播放按钮图片
          width: 80,
          height: 80,
          y: 313,
          x: 328,
          zIndex: 10,
        },
        {
          url: wxCode, // 小程序码
          width: 160,
          height: 160,
          y: 826,
          x: 523,
          borderRadius: 100,
          borderWidth: 0,
          zIndex: 111,
        },
        {
          /**
           * 头像默认 https://resource-new.dakale.net/common/default_profile.png
           */
          url: userProfile, // 头像
          width: 64,
          height: 64,
          y: 1004,
          x: 61,
          borderRadius: 68,
          borderWidth: 0,
          zIndex: 111,
        },
      ],
    };
  }
};
