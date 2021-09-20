const topExtraPx = 40;
export const rssConfigData = (data = {}) => {
  console.log(data);
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
    buyPrice,
    hasCoupon,
    saveMoney,
    tag = "https://wechat-config.dakale.net/miniprogram/image/icon706.png",
  } = data;

  if (
    !userProfile.includes("resource-new.dakale.net") &&
    !userProfile.includes("wechat-config.dakale.net")
  ) {
    userProfile = "https://resource-new.dakale.net/common/default_profile.png";
  }

  if (hasGoods === "1" || hasCoupon === "1") {
    const priceLength = oriPrice.toString().length * 27;
    const priceLengthImg = realPrice.toString().length * 42;
    return {
      width: 750, // 画布宽度
      height: 1334, // 画布高度
      backgroundColor: "#108588", // 画布颜色
      blocks: [
        {
          y: 824,
          width: 636,
          height: 1,
          x: 57,
          borderColor: "#E5E5E5",
          borderWidth: 1,
          zIndex: 20,
        },
      ],
      texts: [
        {
          y: 85,
          width: 646,
          height: 32,
          paddingRight: 32,
          x: 57,
          zIndex: 20,
          text: merchantName,
          fontSize: 32,
          color: "#333333",
          fontWeight: "bold",
          lineNum: 1,
          zIndex: 999,
          lineHeight: 32,
          baseLine: "middle",
        },
        {
          y: 133,
          width: 646,
          height: 24,
          zIndex: 20,
          x: 57,
          text: cityName,
          fontSize: 24,
          color: "#999999",
          fontWeight: "bold",
          lineNum: 1,
          zIndex: 999,
          lineHeight: 24,
          baseLine: "middle",
        },
        {
          x: 57,
          y: 758,
          paddingRight: 81,
          width: 614,
          height: 75,
          text: message, //
          fontSize: 32,
          color: "#333333",
          fontWeight: "bold",
          lineNum: 2,
          zIndex: 999,
          lineHeight: 44,
        },
        {
          x: 209,
          y: 884,
          width: 380,
          height: 40,
          text: goodsName, // 套餐名称
          fontSize: 32,
          color: "#333333",
          fontWeight: "bold",
          lineNum: 1,
          zIndex: 999,
          lineHeight: 40,
        },
        {
          x: 209,
          y: 928,
          text: "原价:",
          lineNum: 1,
          fontSize: 28,
          color: "#999999",
          fontWeight: "bold",
          zIndex: 999,
          addonAfter: {
            type: "text",
            text: "¥" + oriPrice,
            fontSize: 32,
            color: "#999999",
            fontWeight: "bold",
            marginLeft: 5,
            zIndex: 999,
            textDecoration: "line-through",
          },
        },
        {
          x: 209 + (oriPrice.replace(/\./g, "").length + 2) * 31,
          y: 928,
          text: "优惠价:",
          lineNum: 1,
          fontSize: 28,
          color: "#333333",
          zIndex: 999,
          addonAfter: {
            type: "text",
            text: "¥" + buyPrice,
            fontSize: 32,
            color: "#333333",
            fontWeight: "bold",
            marginLeft: 5,
            zIndex: 999,
          },
        },
        {
          x: 341,
          y: 976,
          text: "¥" + saveMoney, // 实际价格, // ¥
          fontSize: 32,
          color: "#EF486F",
          fontWeight: "bold",
          zIndex: 999,
        },
        {
          x: 135,
          y: 1162,
          text: "来自", // 用户昵称
          fontSize: 24,
          color: "#333333",
          width: 415,
          zIndex: 999,
        },
        {
          x: 135 + 50,
          y: 1162,
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
          url: "https://wechat-config.dakale.net/miniprogram/image/icon704.png", // 背景
          width: 750,
          height: 1334,
          y: 0,
          x: 0,
          zIndex: 5,
        },
        {
          url: frontImage, // 视频封面图
          width: 700,
          height: 525,
          y: 169,
          x: 25,
          zIndex: 10,
        },
        {
          url: "https://wechat-config.dakale.net/miniprogram/image/icon581.png", // 播放按钮图片
          width: 80,
          height: 80,
          y: 392,
          x: 335,
          zIndex: 15,
        },
        {
          url: goodsImg, // 商品圖片
          width: 128,
          height: 128,
          y: 854,
          x: 57,
          zIndex: 10,
        },
        {
          url: tag, // 商品圖片
          width: 120,
          height: 40,
          y: 942,
          x: 209,
          zIndex: 10,
        },
        {
          /**
           * 头像默认 https://resource-new.dakale.net/common/default_profile.png
           */
          url: userProfile, // 头像
          width: 64,
          height: 64,
          y: 1121,
          x: 57,
          borderRadius: 68,
          borderWidth: 0,
          zIndex: 111,
        },
        {
          url: wxCode, // 小程序码
          width: 180,
          height: 180,
          y: 1005,
          x: 505,
          borderRadius: 200,
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
          y: 85,
          width: 646,
          height: 32,
          paddingRight: 32,
          x: 57,
          zIndex: 20,
          text: merchantName,
          fontSize: 32,
          color: "#333333",
          fontWeight: "bold",
          lineNum: 1,
          zIndex: 999,
          lineHeight: 32,
          baseLine: "middle",
        },
        {
          y: 133,
          width: 646,
          height: 24,
          zIndex: 20,
          x: 57,
          text: cityName,
          fontSize: 24,
          color: "#999999",
          fontWeight: "bold",
          lineNum: 1,
          zIndex: 999,
          lineHeight: 24,
          baseLine: "middle",
        },
        {
          x: 57,
          y: 758,
          paddingRight: 81,
          width: 614,
          height: 75,
          text: message, //
          fontSize: 32,
          color: "#333333",
          fontWeight: "bold",
          lineNum: 2,
          zIndex: 999,
          lineHeight: 44,
        },
        {
          x: 135,
          y: 994,
          text: "来自", // 用户昵称
          fontSize: 24,
          color: "#333333",
          width: 415,
          zIndex: 999,
        },
        {
          x: 185,
          y: 994,
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
          url: "https://wechat-config.dakale.net/miniprogram/image/icon705.png", // 背景
          width: 750,
          height: 1334,
          y: 0,
          x: 0,
          zIndex: 5,
        },
        {
          url: frontImage, // 视频封面图
          width: 700,
          height: 525,
          y: 169,
          x: 25,
          zIndex: 10,
        },
        {
          url: "https://wechat-config.dakale.net/miniprogram/image/icon581.png", // 播放按钮图片
          width: 80,
          height: 80,
          y: 392,
          x: 335,
          zIndex: 15,
        },
        {
          url: wxCode, // 小程序码
          width: 180,
          height: 180,
          y: 838,
          x: 505,
          borderRadius: 200,
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
          y: 954,
          x: 57,
          borderRadius: 68,
          borderWidth: 0,
          zIndex: 111,
        },
      ],
    };
  }
};
