export const rssConfigData = (data = {}) => {
  console.log(data);
  let {
    backgroundColor = "",
    background = "",
    wxCode = "", ///
    username = "",
  } = data;
  return {
    width: 750, // 画布宽度
    height: 1624, // 画布高度
    backgroundColor: backgroundColor, // 画布颜色
    blocks: [
      {
        x: 0,
        y: 1418,
        width: 750,
        height: 30,
        zIndex: 998,
        textAlign: "center",
        text: {
          width: 750,
          textAlign: "center",
          text: username, // 用户昵称
          lineNum: 1,
          fontSize: 28,
          color: "#ffffff",
          fontWeight: "bold",
          zIndex: 999,
        },
      },
      {
        x: 0,
        y: 1458,
        width: 750,
        height: 28,
        zIndex: 998,
        textAlign: "center",
        text: {
          width: 750,
          textAlign: "center",
          text: "邀请你加入哒卡乐", // 用户昵称
          lineNum: 1,
          fontSize: 28,
          color: "#ffffff",
          zIndex: 999,
        },
      },
    ],
    images: [
      {
        url: background, // 背景
        width: 750,
        height: 1140,
        y: 154,
        x: 0,
        zIndex: 5,
      },
      {
        url: wxCode, // 小程序码
        width: 228,
        height: 228,
        y: 1163,
        x: 260,
        borderRadius: 4,
        borderWidth: 0,
        zIndex: 111,
      },
    ],
  };
};
