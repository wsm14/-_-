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
    goodsImg,
    goodsName,
    oriPrice,
    realPrice,
  } = data;

  if (
    !userProfile.includes("resource-new.dakale.net") &&
    !userProfile.includes("wechat-config.dakale.net")
  ) {
    userProfile = "https://resource-new.dakale.net/common/default_profile.png";
  }

  if (hasGoods === "1") {
    const priceLength = realPrice.toString().length * 27;
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
          x: 209,
          y: 842,
          width: 380,
          height: 40,
          text: goodsName, // 套餐名称
          fontSize: 28,
          color: "#333333",
          fontWeight: "bold",
          lineNum: 1,
          zIndex: 999,
          lineHeight: 40,
        },
        {
          x: 209,
          y: 890,
          width: 380,
          height: 32,
          text: "卡豆抵扣后", //横幅
          fontSize: 24,
          color: "rgba(239, 72, 111, 1)",
          lineNum: 1,
          zIndex: 999,
          lineHeight: 32,
        },
        {
          x: 209,
          y: 936,
          text: "¥", // ¥
          fontSize: 32,
          color: "#EF486F",
          fontWeight: "bold",
          zIndex: 999,
        },
        {
          x: 235,
          y: 936,
          text: realPrice, // 现价
          fontSize: 32,
          color: "#EF486F",
          fontWeight: "bold",
          zIndex: 999,
        },
        {
          x: 379 + priceLength,
          y: 936,
          text: `原价 ¥${oriPrice}`, // 原价
          fontSize: 20,
          color: "#666666",
          textDecoration: "line-through",
          lineHeight: 28,
          zIndex: 999,
        },
        {
          x: 61,
          y: 1042,
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
          y: 1098,
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
          y: 1138,
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
          y: 1224,
          text: "来自", // 用户昵称
          fontSize: 24,
          color: "#333333",
          width: 415,
          zIndex: 999,
        },
        {
          x: 139 + 50,
          y: 1224,
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
          zIndex: 10,
        },
        {
          url: "https://wechat-config.dakale.net/miniprogram/image/icon581.png", // 播放按钮图片
          width: 80,
          height: 80,
          y: 313,
          x: 328,
          zIndex: 15,
        },
        {
          url: goodsImg, // 播放按钮图片
          width: 132,
          height: 132,
          y: 818,
          x: 61,
          zIndex: 10,
        },
        {
          url: "https://wechat-config.dakale.net/miniprogram/image/icon496.png", // 最低到手价
          width: 150,
          height: 40,
          y: 905,
          x: 209 + priceLength,
          zIndex: 999,
        },
        {
          /**
           * 头像默认 https://resource-new.dakale.net/common/default_profile.png
           */
          url: userProfile, // 头像
          width: 64,
          height: 64,
          y: 1184,
          x: 61,
          borderRadius: 68,
          borderWidth: 0,
          zIndex: 111,
        },
        {
          url: wxCode, // 小程序码
          width: 160,
          height: 160,
          y: 1006,
          x: 523,
          borderRadius: 100,
          borderWidth: 0,
          zIndex: 111,
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
          zIndex: 10,
        },
        {
          url: "https://wechat-config.dakale.net/miniprogram/image/icon581.png", // 播放按钮图片
          width: 80,
          height: 80,
          y: 313,
          x: 328,
          zIndex: 15,
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