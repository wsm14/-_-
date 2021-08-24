import React, { useState, useEffect } from "react";
import { View, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";

export default ({ count = 5, data = [], onChange }) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    if (data && data.length) {
      setList([...JSON.parse(JSON.stringify(data))]);
    }
  }, [data]);

  const uploadImg = () => {
    Taro.chooseImage({
      count,
      sourceType: ["album"],
      sizeType: ["compressed"],
      success: (res) => {
        const { tempFilePaths } = res;
        setList([...list, ...tempFilePaths]);
        onChange([...list, ...tempFilePaths]);
      },
      fail: (res) => {},
    });
  };

  const showImage = (item) => {
    Taro.previewImage({
      current: item, // 当前显示图片的http链接
      urls: list,
    });
  };

  const removeImage = (countNum) => {
    let newList = list.filter((item, index) => {
      return index !== countNum;
    });
    setList(newList);
    onChange && onChange(newList);
  };

  const renderUpload = () => {
    return (
      <View className="upload_img_box" onClick={() => uploadImg()}>
        <>
          <View className="add-bar_1"></View>
          <View className="add-bar-2"></View>
        </>
      </View>
    );
  };

  const renderImg = (item, index) => {
    return (
      <View className="upload_img_cell" onClick={() => showImage(item)}>
        <View
          className="remove-bar"
          onClick={(e) => {
            e.stopPropagation();
            removeImage(index);
          }}
        ></View>
        <Image
          style={{ width: "100%", height: "100%" }}
          src={item}
          lazyLoad
          mode={"aspectFill"}
        ></Image>
      </View>
    );
  };

  return (
    <View className="upload_box">
      {list.map((item, index) => {
        return renderImg(item, index);
      })}
      {count > list.length && renderUpload()}
    </View>
  );
};
