const topExtraPx = 40;
export const rssConfigData = (data = {}) => {
  let {
    name,
    time,
    price = 0,
    oldPrice = "",
    merchantName,
    city,
    userProfile = "",
    wxCode,
    background = "https://wechat-config.dakale.net/miniprogram/image/icon704.png",
    username,
    merchantLogo,
    buyPrice,
    tag = "https://wechat-config.dakale.net/miniprogram/image/icon706.png",
    saveMoney = 0,
    shareImg = "",
    rightFlag = "0",
    paymentModeObject,
  } = data;
  const { bean = "", cash = "" } = paymentModeObject;
  if (
    !userProfile.includes("resource-new.dakale.net") &&
    !userProfile.includes("wechat-config.dakale.net")
  ) {
    userProfile = "https://resource-new.dakale.net/common/default_profile.png";
  }
  if (time && time === "") {
    time = "长期有效";
  }
  if (rightFlag === "1") {
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
          text: city,
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
          y: 754,
          text: name, // 商品名称
          lineNum: 1,
          fontSize: 40,
          color: "#333333",
          fontWeight: "bold",
          width: 415,
          zIndex: 999,
        },
        {
          x: 57,
          y: 810,
          text: `${time}`, // 结束时间
          fontSize: 24,
          color: "#999999",
          lineNum: 1,
          zIndex: 999,
        },
        {
          x: 57,
          y: 850 + 20,
          text: "原价:", //原价
          lineNum: 1,
          fontSize: 32,
          color: "#999999",
          fontWeight: "bold",
          maxWidth: 200,
          zIndex: 999,
          addonAfter: {
            type: "text",
            text: "¥" + oldPrice, //原价格
            fontSize: 36,
            color: "#999999",
            marginLeft: 5,
            zIndex: 999,
            textDecoration: "line-through",
          },
        },
        {
          x: 57,
          y: 904 + 20,
          text: "卡豆价:", //原价
          lineNum: 1,
          fontSize: 32,
          color: "#333333",
          fontWeight: "bold",
          maxWidth: 200,
          zIndex: 999,
          addonAfter: {
            type: "text",
            text: `¥${cash.toFixed(2)}+${bean} 卡豆`, //原价格
            fontSize: 36,
            color: "#EF486F",
            marginLeft: 5,
            zIndex: 999,
            fontWeight: "bold",
          },
        },
        {
          x: 139,
          y: 1141 + 20,
          text: "来自", // 用户昵称
          fontSize: 24,
          color: "#333333",
          width: 415,
          zIndex: 999,
        },

        {
          x: 139 + 50,
          y: 1141 + 20,
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
          url: merchantLogo, // 封面
          width: 700,
          height: 525,
          y: 169,
          x: 25,
          zIndex: 10,
        },
        {
          url: wxCode, // 小程序码
          width: 180,
          height: 180,
          y: 1005,
          x: 505,
          borderRadius: 200,
          zIndex: 111,
        },
        {
          /**
           * 头像默认 https://resource-new.dakale.net/common/default_profile.png
           */
          url: userProfile, // 头像
          width: 64,
          height: 64,
          y: 1122,
          x: 57,
          borderRadius: 68,
          borderWidth: 0,
          zIndex: 111,
        },
      ],
    };
  } else {
    if (shareImg) {
      return {
        width: 750, // 画布宽度
        height: 1334, // 画布高度
        blocks: [
          {
            width: 200,
            height: 200,
            y: 1112,
            x: 520,
            backgroundColor: "#FFFFFF",
            zIndex: 15,
            borderRadius: 200,
          },
        ],
        texts: [
          {
            x: 118,
            y: 1262 + 20,
            text: "来自", // 用户昵称
            fontSize: 24,
            color: "#ffffff",
            width: 415,
            zIndex: 999,
          },
          {
            x: 118 + 50,
            y: 1262 + 20,
            text: username, // 用户昵称
            lineNum: 1,
            fontSize: 24,
            color: "#ffffff",
            fontWeight: "bold",
            maxWidth: 200,
            zIndex: 999,
            addonAfter: {
              type: "text",
              text: "的推荐", // 用户昵称后缀
              fontSize: 24,
              color: "#ffffff",
              marginLeft: 5,
              zIndex: 999,
            },
          },
        ],
        images: [
          {
            url: shareImg, // 背景
            width: 750,
            height: 1334,
            y: 0,
            x: 0,
            zIndex: 5,
          },
          {
            url: wxCode, // 小程序码
            width: 180,
            height: 180,
            y: 1122,
            x: 530,
            borderRadius: 200,
            borderColor: "#EF476F",
            zIndex: 111,
          },
          {
            /**
             * 头像默认 https://resource-new.dakale.net/common/default_profile.png
             */
            url: userProfile, // 头像
            width: 64,
            height: 64,
            y: 1242,
            x: 40,
            borderRadius: 68,
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
            text: city,
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
            y: 754,
            text: name, // 商品名称
            lineNum: 1,
            fontSize: 40,
            color: "#333333",
            fontWeight: "bold",
            width: 415,
            zIndex: 999,
          },
          {
            x: 57,
            y: 810,
            text: `${time}`, // 结束时间
            fontSize: 24,
            color: "#999999",
            lineNum: 1,
            zIndex: 999,
          },
          {
            x: 57,
            y: 868,
            text: "原价:",
            lineNum: 1,
            fontSize: 32,
            color: "#999999",
            fontWeight: "bold",
            zIndex: 999,
            addonAfter: {
              type: "text",
              text: "¥" + oldPrice, // 用户昵称后缀
              fontSize: 36,
              color: "#999999",
              fontWeight: "bold",
              marginLeft: 5,
              zIndex: 999,
              textDecoration: "line-through",
            },
          },
          {
            x: 60 + (oldPrice.replace(/\./g, "").length + 2) * 35,
            y: 868,
            text: "优惠价:",
            lineNum: 1,
            fontSize: 36,
            color: "#333333",
            zIndex: 999,
            addonAfter: {
              type: "text",
              text: "¥" + buyPrice,
              fontSize: 40,
              color: "#333333",
              fontWeight: "bold",
              marginLeft: 5,
              zIndex: 999,
            },
          },
          {
            x: 139,
            y: 1141 + 20,
            text: "来自", // 用户昵称
            fontSize: 24,
            color: "#333333",
            width: 415,
            zIndex: 999,
          },
          {
            x: 139 + 50,
            y: 1141 + 20,
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
          {
            x: 208,
            y: 948,
            text: "¥" + saveMoney, // 真实价格
            lineNum: 1,
            fontSize: 36,
            color: "#EF476F",
            fontWeight: "bold",
            width: 415,
            zIndex: 999,
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
            url: tag, // 标签
            width: 144,
            height: 48,
            y: 910,
            x: 52,
            zIndex: 10,
          },
          {
            url: merchantLogo, // 封面
            width: 700,
            height: 525,
            y: 169,
            x: 25,
            zIndex: 10,
          },
          {
            url: wxCode, // 小程序码
            width: 180,
            height: 180,
            y: 1005,
            x: 505,
            borderRadius: 200,
            zIndex: 111,
          },
          {
            /**
             * 头像默认 https://resource-new.dakale.net/common/default_profile.png
             */
            url: userProfile, // 头像
            width: 64,
            height: 64,
            y: 1122,
            x: 57,
            borderRadius: 68,
            borderWidth: 0,
            zIndex: 111,
          },
        ],
      };
    }
  }
};
