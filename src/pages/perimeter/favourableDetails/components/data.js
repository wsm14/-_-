const topExtraPx = 40;
export const rssConfigData = (data = {}) => {
  let {
    name,
    time,
    price = 0,
    oldPrice,
    merchantName,
    address,
    city,
    userProfile = "",
    wxCode,
    background = "https://wechat-config.dakale.net/miniprogram/image/icon495.png",
    username,
    merchantLogo,
    tag = "https://wechat-config.dakale.net/miniprogram/image/icon496.png",
  } = data;

  if (
    !userProfile.includes("resource-new.dakale.net") ||
    !userProfile.includes("wechat-config.dakale.net")
  ) {
    userProfile = "https://resource-new.dakale.net/common/default_profile.png";
  }
  if (time && time === ""){
     time =  '长期有效'
  }
  const priceLength = price.toString().length * 35.18552780151367;
  return {
    width: 750, // 画布宽度
    height: 1334, // 画布高度
    backgroundColor: "#108588", // 画布颜色
    blocks: [
      {
        x: 61,
        y: 720,
        height: 45,
        paddingLeft: 15,
        paddingRight: 0,
        borderWidth: 1,
        borderColor: "#EF486F",
        borderRadius: 4,
        zIndex: 998,
        text: {
          width: 151,
          lineHeight: 45,
          text: "卡豆抵扣后", // tag 标签 - 卡豆抵扣后
          fontSize: 24,
          color: "#EF486F",
          zIndex: 999,
          textAlign: "center",
          baseLine: "middle",
        },
      },
    ],
    texts: [
      {
        x: 60,
        y: 610 + topExtraPx,
        text: name, // 套餐名称
        fontSize: 40,
        color: "#333333",
        fontWeight: "bold",
        lineNum: 1,
        width: 600,
        zIndex: 999,
      },
      {
        x: 61,
        y: 674 + 15,
        text: `${time}结束`, // 结束时间
        fontSize: 24,
        color: "#999999",
        lineNum: 1,
        zIndex: 999,
      },
      {
        x: 61,
        y: 840,
        text: "¥", // ¥
        fontSize: 32,
        color: "#EF486F",
        fontWeight: "bold",
        zIndex: 999,
      },
      {
        x: 85,
        y: 840,
        text: price, // 现价
        fontSize: 60,
        color: "#EF486F",
        fontWeight: "bold",
        zIndex: 999,
      },
      {
        x: 61,
        y: 886,
        text: `原价 ¥${oldPrice}`, // 原价
        fontSize: 32,
        color: "#666666",
        textDecoration: "line-through",
        zIndex: 999,
      },
      {
        x: 61,
        y: 1030 + topExtraPx,
        text: merchantName, // 店铺名称
        lineNum: 1,
        fontSize: 32,
        color: "#333333",
        fontWeight: "bold",
        width: 415,
        zIndex: 999,
      },
      {
        x: 61,
        y: 1086 + topExtraPx,
        text: city, // 所在地
        lineNum: 1,
        fontSize: 24,
        color: "#999999",
        width: 415,
        zIndex: 999,
      },
      {
        x: 61,
        y: 1126 + topExtraPx,
        text: address, // 地址
        lineNum: 1,
        fontSize: 24,
        color: "#999999",
        width: 415,
        zIndex: 999,
      },
      {
        x: 139,
        y: 1212 + 20,
        text: "来自", // 用户昵称
        fontSize: 24,
        color: "#333333",
        width: 415,
        zIndex: 999,
      },
      {
        x: 139 + 50,
        y: 1212 + 20,
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
        url: background, // 背景
        width: 750,
        height: 1334,
        y: 0,
        x: 0,
        zIndex: 5,
      },
      {
        url: tag, // 最低到手价
        width: 181,
        height: 52,
        y: 788,
        x: 95 + priceLength,
        zIndex: 999,
      },
      {
        url: merchantLogo, // 封面
        width: 646,
        height: 450,
        y: 128,
        x: 45,
        borderRadius: 16,
        zIndex: 10,
      },
      {
        url: wxCode, // 小程序码
        width: 160,
        height: 160,
        y: 1014,
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
        y: 1192,
        x: 61,
        borderRadius: 68,
        borderWidth: 0,
        zIndex: 111,
      },
    ],
  };
};
