export const rssConfigData = (data = {}) => {
  console.log(data);
  let {
    userProfile = "",
    background = "https://wechat-config.dakale.net/miniprogram/image/invitation_8.png",
    wxCode = "", ///
    username = "",
  } = data;
  console.log(userProfile);
  if (
    !userProfile.includes("resource-new.dakale.net") &&
    !userProfile.includes("wechat-config.dakale.net")
  ) {
    userProfile = "https://resource-new.dakale.net/common/default_profile.png";
  }
  return {
    width: 750, // 画布宽度
    height: 1334, // 画布高度
    texts: [
      {
        x: 110,
        y: 1250 + 10,
        text: "来自", // 用户昵称
        fontSize: 24,
        color: "#ffffff",
        width: 415,
        zIndex: 999,
      },
      {
        x: 110 + 50,
        y: 1250 + 10,
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
        url: background, // 背景
        width: 750,
        height: 1334,
        y: 0,
        x: 0,
        zIndex: 5,
      },
      {
        url: wxCode, // 小程序码
        width: 140,
        height: 140,
        y: 1110,
        x: 550,
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
        y: 1221,
        x: 32,
        borderRadius: 68,
        borderWidth: 0,
        zIndex: 111,
      },
    ],
  };
};
