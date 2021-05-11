const topExtraPx = 40;
export const rssConfigData = (data = {}) => {
  let {
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
          y: 232,
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
          y: 232,
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
          y: 232,
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
          y: 232,
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
          y: 232,
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
          y: 232,
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
  console.log(filterScenesList());
  return {
    width: 750, // 画布宽度
    height: 1334, // 画布高度
    backgroundColor: "#108588", // 画布颜色
    blocks: [
      {
        y: 160,
        x: 0,
        width: 686,
        paddingLeft: 32,
        paddingRight: 32,
        height: 45,
        zIndex: 998,
        text: {
          lineHeight: 56,
          text: merchantName, // 商家名称
          fontSize: 40,
          width: 686,
          paddingLeft: 32,
          paddingRight: 32,
          color: "#333333",
          zIndex: 999,
          textAlign: "center",
          baseLine: "middle",
        },
      },
      ...filterScenesList(),
    ],
    texts: [
      {
        x: 105,
        y: 896,
        lineHeight: 32,
        text: address, // 地址
        fontSize: 24,
        color: "#333333",
        with: 520,
        zIndex: 999,
      },
      {
        x: 105,
        y: 948,
        lineHeight: 32,
        text: businessTime, // 营业时间
        fontSize: 24,
        color: "#333333",
        with: 520,
        zIndex: 999,
      },
      {
        x: 105,
        y: 1000,
        lineHeight: 32,
        text: telephone, // 电话
        fontSize: 24,
        color: "#333333",
        with: 520,
        zIndex: 999,
      },
      {
        x: 61,
        y: 1048,
        lineHeight: 32,
        text: tag, // 标签
        fontSize: 24,
        color: "rgba(153, 153, 153, 1)",
        with: 520,
        zIndex: 999,
      },

      {
        x: 139,
        y: 1134,
        text: "来自", // 用户昵称
        fontSize: 24,
        color: "#333333",
        width: 415,
        zIndex: 999,
      },
      {
        x: 139 + 50,
        y: 1134,
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
        url: "https://wechat-config.dakale.net/miniprogram/image/icon576.png", // 背景
        width: 750,
        height: 1334,
        y: 0,
        x: 0,
        zIndex: 5,
      },

      {
        url: merchantLogo, // 封面
        width: 646,
        height: 450,
        y: 304,
        x: 45,
        borderRadius: 16,
        zIndex: 10,
      },
      {
        url: "https://wechat-config.dakale.net/miniprogram/image/icon577.png", //图标
        width: 36,
        height: 36,
        y: 870,
        x: 61,
        zIndex: 10,
      },
      {
        url: "https://wechat-config.dakale.net/miniprogram/image/icon579.png", // 图标
        width: 36,
        height: 36,
        y: 922,
        x: 61,
        zIndex: 10,
      },
      {
        url: "https://wechat-config.dakale.net/miniprogram/image/icon578.png", //图标

        width: 36,
        height: 36,
        y: 974,
        x: 61,
        zIndex: 10,
      },
      {
        url: wxCode, // 小程序码
        width: 160,
        height: 160,
        y: 931,
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
        y: 1094,
        x: 61,
        borderRadius: 68,
        borderWidth: 0,
        zIndex: 111,
      },
    ],
  };
};
