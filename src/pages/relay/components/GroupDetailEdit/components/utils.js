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
        if (type == "smallImage") {
          onSave({ contentType: type, content: res.img.toString() });
          return;
        } else {
          res.img.map((item) => {
            onSave({ contentType: type, content: item });
          });
        }
      });
    },
    fail: () => {},
  });
};
