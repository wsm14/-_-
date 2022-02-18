export const rssConfigData = (data = {}) => {
  let { wxCode, frontImage } = data;

  return {
    width: 750, // 画布宽度
    height: 1334, // 画布高度
    backgroundColor: "#108588", // 画布颜色
    images: [
      {
        url: frontImage, // 背景
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
        y: 1088,
        x: 280,
        borderRadius: 185,
        borderWidth: 0,
        zIndex: 111,
      },
    ],
  };
};
