const topExtraPx = 40;
export const rssConfigData = (data = {}) => {
  let {
    body,
    createTime,
    frontImage,
    image,
    miniProgramUrl,
    ownerName,
    ownerProfile,
    title,
    qcodeUrl,
    price,
  } = data;

  if (
    !ownerProfile.includes("resource-new.dakale.net") &&
    !ownerProfile.includes("wechat-config.dakale.net")
  ) {
    ownerProfile = "https://resource-new.dakale.net/common/default_profile.png";
  }
  return {
    width: 750, // 画布宽度
    height: 1261, // 画布高度
    backgroundColor: "#FFFFFF",
    texts: [
      {
        y: 40 + 20,
        width: 546,
        height: 32,
        zIndex: 20,
        x: 133,
        text: ownerName, //用户名
        fontSize: 32,
        color: "#333333",
        fontWeight: "bold",
        lineNum: 1,
        zIndex: 999,
        lineHeight: 32,
        baseLine: "middle",
      },
      {
        y: 91 + 20,
        width: 546,
        height: 32,
        zIndex: 20,
        x: 133,
        text: createTime, //创建时间
        fontSize: 24,
        color: "#999999",
        fontWeight: "bold",
        lineNum: 1,
        zIndex: 999,
        lineHeight: 24,
        baseLine: "middle",
      },
      {
        y: 756 + 20,
        width: 546,
        height: 120,
        zIndex: 20,
        x: 34,
        text: title, //标题
        fontSize: 32,
        color: "#333333",
        fontWeight: "bold",
        lineNum: 2,
        zIndex: 999,
        lineHeight: 60,
        baseLine: "middle",
      },
      {
        x: 34,
        y: 896 + 20,
        width: 546,
        height: 72,
        zIndex: 110,
        text: body, //描述
        fontSize: 32,
        color: "#999999",
        fontWeight: "bold",
        lineNum: 2,
        lineHeight: 36,
        baseLine: "middle",
      },
      {
        x: 34,
        y: 1069 + 20,
        text: "¥",
        lineNum: 1,
        fontSize: 24,
        color: "#EF476F",
        fontWeight: "bold",
        zIndex: 999,
        addonAfter: {
          type: "text",
          text: price,
          fontSize: 32,
          color: "#EF476F",
          fontWeight: "bold",
          marginLeft: 5,
          zIndex: 999,
        },
      },
    ],
    images: [
      {
        /**
         * 商品图
         */
        url: frontImage, // 商品图
        width: 750,
        height: 563,
        x: 0,
        y: 154,
        borderWidth: 0,
        zIndex: 111,
      },
      {
        /**
         * 头像默认 https://resource-new.dakale.net/common/default_profile.png
         */
        url: ownerProfile, // 头像
        width: 80,
        height: 80,
        y: 34,
        x: 34,
        borderRadius: 80,
        borderWidth: 0,
        zIndex: 111,
      },
      {
        /**
         * 二维码
         */
        url: qcodeUrl, // 二维码
        width: 193,
        height: 193,
        y: 1026,
        x: 514,
        borderWidth: 0,
        zIndex: 111,
      },
      {
        /**
         * 头像默认 https://resource-new.dakale.net/common/default_profile.png
         */
        url: ownerProfile, // 头像
        width: 80,
        height: 80,
        y: 34,
        x: 34,
        borderRadius: 80,
        borderWidth: 0,
        zIndex: 111,
      },
      {
        /**
         * 提示框
         */
        url: "https://wechat-config.dakale.net/miniprogram/relay/relay_loct.png", // 提示框
        width: 304,
        height: 33,
        y: 1145,
        x: 34,
        borderWidth: 0,
        zIndex: 111,
      },
    ],
  };
};
