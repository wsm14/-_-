/*
 * style 瀑布宽度
 * list 瀑布数组
 * createDom 创建元素方法
 * imgHight 图片高度
 * imgWidth 图片宽度
 * setWidth 比例后宽度
 * */

import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import { getDom, computedHeight } from "@/utils/utils";
import Taro from "@tarojs/taro";
import "./index.scss";
export default (props) => {
  const {
    style,
    list,
    createDom,
    imgHight,
    imgWidth,
    setWidth,
    noMargin,
    store,
  } = props;
  const [leftList, setLeftList] = useState([]);
  const [rightList, setRightList] = useState([]);
  useEffect(() => {
    filterBox(list);
  }, [list]);
  const filterBox = (list) => {
    let left = [];
    let right = [];
    let leftNum = 0;
    let rightNum = 0;
    list.forEach((item, index) => {
      if (leftNum <= rightNum) {
        left.push({ ...item, momentIndex: index });
        if (item[imgWidth] && item[imgHight] && setWidth) {
          leftNum += computedHeight(item[imgWidth], item[imgHight], setWidth);
        } else {
          if (parseInt(imgHight)) {
            leftNum += parseInt(imgHight) / 4;
          } else {
            leftNum += 400;
          }
        }
      } else {
        right.push({ ...item, momentIndex: index });
        if (item[imgWidth] && item[imgHight] && setWidth) {
          rightNum += computedHeight(item[imgWidth], item[imgHight], setWidth);
        } else {
          if (parseInt(imgHight)) {
            rightNum += parseInt(imgHight) / 4;
          } else {
            rightNum += 400;
          }
        }
      }
    });
    setLeftList(left);
    setRightList(right);
  };
  if (list) {
    return (
      <View style={noMargin ? noMargin : {}} className="page_content">
        <View style={style ? { ...style } : {}} className="page_left">
          {leftList.map((item) => {
            return createDom(item, list, store);
          })}
        </View>
        <View style={style ? { ...style } : {}} className="page_right">
          {rightList.map((item) => {
            return createDom(item, list, store);
          })}
        </View>
      </View>
    );
  }
  return null;
};
