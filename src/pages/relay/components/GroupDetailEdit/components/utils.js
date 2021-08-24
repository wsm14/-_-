import Taro from "@tarojs/taro";
import { upload } from "@/api/upload";

// 选择图片上传
export const uploadImg = (type, onSave) => {
  Taro.chooseImage({
    count: 9,
    sourceType: ["album", "camera"],
    sizeType: ["compressed"],
    success: (res) => {
      const { tempFilePaths } = res;
      upload(tempFilePaths, { img: tempFilePaths }).then((res) => {
        if (type == "smallPicture") {
          onSave({ type, value: res.img.toString() });
          return;
        } else {
          res.img.map((item) => {
            onSave({ type, value: item });
          });
        }
      });
    },
    fail: () => {},
  });
};
