import React, { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { Image } from "@tarojs/components";
import "./index.scss";

/**
 * 图片展示组件
 * @param {String|Array}   src 图片url
 * @param {Number}   width 图片width
 * @param {Number}   height 图片height 不传则默认为 width
 * @param {Boolean}   look 是否点击查看
 * @param {ClassName}   className 图片className
 */
export default ({
  src = '',
  mode = "aspectFill",
  width,
  look = true,
  height,
  className = "",
}) => {
  const [urlArr, setUrlArr] = useState([]);
  const [loading, setLoading] = useState([]);

  useEffect(() => {
    if (!src || !src.length) setUrlArr([]);
    else if (typeof src === "string") setUrlArr(src.split(","));
    else setUrlArr(src);
  }, [src]);

  // 图片宽度 高度
  const styleProps = width
    ? {
        width: Taro.pxTransform(width),
        height: Taro.pxTransform(height || width),
      }
    : {};

  // 点击查看图片
  const handleShowImg = (e, urlItem) => {
    e.stopPropagation();
    if (!urlArr.length || !look) return;
    Taro.previewImage({
      current: urlItem, // 当前显示图片的http链接
      urls: urlArr.map((item) => item.url || item), // 需要预览的图片http链接列表
    });
  };

  return urlArr.map((img, index) => (
    <Image
      lazyLoad
      mode={mode}
      src={img.url || img}
      className={`dakale_wx_cell_img ${className} ${
        !loading.includes(index) ? "loading" : ""
      }`}
      style={styleProps}
      onClick={(e) => handleShowImg(e, img.url || img)}
      onLoad={() => setLoading([...loading, index])}
      onError={(e) => console.log(e)}
    ></Image>
  ));
};
