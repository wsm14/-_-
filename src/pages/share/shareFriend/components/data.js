export const rssConfigData = (data = {}) => {
  console.log(data);
  let {
    background = "",
    wxCode = "", ///
    username = "",
  } = data;
  return {
    width: 750, // 画布宽度
    height: 1333, // 画布高度
    blocks: [
      {
        x: 0,
        y: 1243,
        width: 750,
        height: 30,
        zIndex: 998,
        textAlign: "center",
        text: {
          width: 750,
          textAlign: "center",
          text: username + "邀请你加入哒卡乐", // 用户昵称
          lineNum: 1,
          fontSize: 28,
          color: "#ffffff",
          fontWeight: "bold",
          zIndex: 999,
        },
      },
    ],
    images: [
      {
        width: 750,
        height: 1333,
        y: 0,
        x: 0,
        zIndex: 5,
        url: background,
      },
      {
        url: wxCode, // 小程序码
        width: 215,
        height: 215,
        y: 989,
        x: 267,
        borderRadius: 4,
        borderWidth: 0,
        zIndex: 111,
      },
    ],
  };
};
