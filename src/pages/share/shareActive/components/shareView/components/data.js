export const rssConfigData = (data = {}) => {
  let {
    background = "https://resource-new.dakale.net/common/activity/88activityBackgroundIos.png",
    qcodeUrl,
    username = "",
  } = data;
  return {
    width: 750 * 2, // 画布宽度
    height: 1334 * 2, // 画布高度
    blocks: [
      {
        y: 1189 * 2,
        height: 24 * 2,
        textAlign: "center",
        zIndex: 998,
        width: 686 * 2,
        lineNum: 1,
        x: 32 * 2,
        text: {
          lineHeight: 56 * 2,
          text: `来自${username}的邀请`, // 商家名称
          fontSize: 24 * 2,
          color: "#FFFFFF",
          zIndex: 999,
          textAlign: "center",
          baseLine: "middle",
          x: 32 * 2,
          lineNum: 1,
        },
      },
    ],

    images: [
      {
        url: background, // 背景
        width: 750 * 2,
        height: 1334 * 2,
        y: 0,
        x: 0,
        zIndex: 5,
      },
      {
        url: qcodeUrl, // 背景
        width: 200 * 2,
        height: 200 * 2,
        y: 961 * 2,
        x: 275 * 2,
        borderRadius: 390,
        borderWidth: 0,
        zIndex: 111,
      },
    ],
  };
};
