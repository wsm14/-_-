export const rssConfigData = (data = {}) => {
  let {
    background = "https://wechat-config.dakale.net/miniprogram/image/invitation_8.png",
    qcodeUrl,
  } = data;
  return {
    width: 750 * 2, // 画布宽度
    height: 1334 * 2, // 画布高度
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
        width: 180 * 2,
        height: 180 * 2,
        y: 1090 * 2,
        x: 530 * 2,
        borderRadius: 100,
        borderWidth: 0,
        zIndex: 111,
      },
    ],
  };
};
