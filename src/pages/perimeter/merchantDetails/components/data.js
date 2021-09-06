export const rssConfigData = (data = {}) => {
  let {
    background = "https://wechat-config.dakale.net/miniprogram/image/icon704.png",
    merchantName,
    scenesList = [],
    address,
    businessTime,
    telephone,
    userProfile = "",
    wxCode,
    username,
    merchantLogo,
    tag,
  } = data;

  if (
    !userProfile.includes("resource-new.dakale.net") &&
    !userProfile.includes("wechat-config.dakale.net")
  ) {
    userProfile = "https://resource-new.dakale.net/common/default_profile.png";
  }
  const filterScenesList = () => {
    if (scenesList.length === 1) {
      return [
        {
          x: 316,
          y: 137,
          width: 128,
          height: 48,
          backgroundColor: "rgba(16, 133, 136, 0.1)",
          borderRadius: 8,
          zIndex: 998,
          text: {
            width: 128,
            height: 48,
            lineHeight: 48,
            text: scenesList[0], // 商家名称
            fontSize: 24,
            color: "#108588",
            zIndex: 999,
            textAlign: "center",
            baseLine: "middle",
          },
        },
      ];
    } else if (scenesList.length === 2) {
      return [
        {
          x: 239,
          y: 137,
          width: 128,
          height: 48,
          backgroundColor: "rgba(16, 133, 136, 0.1)",
          borderRadius: 8,
          zIndex: 998,
          text: {
            width: 128,
            height: 48,
            lineHeight: 48,
            text: scenesList[0], // 商家名称
            fontSize: 24,
            color: "#108588",
            zIndex: 999,
            textAlign: "center",
            baseLine: "middle",
          },
        },
        {
          x: 383,
          y: 137,
          width: 128,
          height: 48,
          backgroundColor: "rgba(16, 133, 136, 0.1)",
          borderRadius: 8,
          zIndex: 998,
          text: {
            width: 128,
            height: 48,
            lineHeight: 48,
            text: scenesList[1], // 商家名称
            fontSize: 24,
            color: "#108588",
            zIndex: 999,
            textAlign: "center",
            baseLine: "middle",
          },
        },
      ];
    } else if (scenesList.length > 2) {
      return [
        {
          x: 172,
          y: 137,
          width: 128,
          height: 48,
          backgroundColor: "rgba(16, 133, 136, 0.1)",
          borderRadius: 8,
          zIndex: 998,
          text: {
            width: 128,
            height: 48,
            lineHeight: 48,
            text: scenesList[0], // 商家名称
            fontSize: 24,
            color: "#108588",
            zIndex: 999,
            textAlign: "center",
            baseLine: "middle",
          },
        },
        {
          x: 316,
          y: 137,
          width: 128,
          height: 48,
          backgroundColor: "rgba(16, 133, 136, 0.1)",
          borderRadius: 8,
          zIndex: 998,
          text: {
            width: 128,
            height: 48,
            lineHeight: 48,
            text: scenesList[1], // 商家名称
            fontSize: 24,
            color: "#108588",
            zIndex: 999,
            textAlign: "center",
            baseLine: "middle",
          },
        },
        {
          x: 460,
          y: 137,
          width: 128,
          height: 48,
          backgroundColor: "rgba(16, 133, 136, 0.1)",
          borderRadius: 8,
          zIndex: 998,
          text: {
            width: 128,
            height: 48,
            lineHeight: 48,
            text: scenesList[2], // 商家名称
            fontSize: 24,
            color: "#108588",
            zIndex: 999,
            textAlign: "center",
            baseLine: "middle",
          },
        },
      ];
    } else if (scenesList.length === 0) {
      return [];
    } else {
      return [];
    }
  };
  return {
    width: 750, // 画布宽度
    height: 1334, // 画布高度
    backgroundColor: "#108588", // 画布颜色
    blocks: [...filterScenesList()],
    texts: [
      {
        x: 57,
        y: 85,
        width: 646,
        height: 32,
        paddingRight: 32,
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
        x: 105,
        y: 795,
        width: 600,
        height: 24,
        paddingRight: 32,
        text: address,
        fontSize: 24,
        color: "#333333",
        fontWeight: "bold",
        lineNum: 1,
        zIndex: 999,
        lineHeight: 24,
        baseLine: "middle",
      },
      {
        x: 105,
        y: 854,
        lineHeight: 32,
        text: businessTime, // 营业时间
        fontSize: 24,
        color: "#333333",
        width: 600,
        zIndex: 999,
      },
      {
        x: 105,
        y: 906,
        lineHeight: 32,
        text: telephone, // 电话
        fontSize: 24,
        color: "#333333",
        width: 600,
        height: 32,
        lineNum: 1,
        zIndex: 999,
      },
      {
        x: 61,
        y: 966,
        lineHeight: 32,
        text: tag, // 标签
        fontSize: 24,
        color: "rgba(153, 153, 153, 1)",
        width: 600,
        lineNum: 1,
        zIndex: 999,
      },

      {
        x: 139,
        y: 1161,
        text: "来自", // 用户昵称
        fontSize: 24,
        color: "#333333",
        width: 415,
        zIndex: 999,
      },
      {
        x: 139 + 50,
        y: 1161,
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
        y: 217,
        x: 25,
        borderRadius: 16,
        zIndex: 10,
      },
      {
        url: "https://wechat-config.dakale.net/miniprogram/image/icon577.png", //图标
        width: 36,
        height: 36,
        y: 777,
        x: 61,
        zIndex: 10,
      },
      {
        url: "https://wechat-config.dakale.net/miniprogram/image/icon579.png", // 图标
        width: 36,
        height: 36,
        y: 829,
        x: 61,
        zIndex: 10,
      },
      {
        url: "https://wechat-config.dakale.net/miniprogram/image/icon578.png", //图标
        width: 36,
        height: 36,
        y: 881,
        x: 61,
        zIndex: 10,
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
    ],
  };
};
