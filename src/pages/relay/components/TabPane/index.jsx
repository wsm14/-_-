import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import "./index.scss";

/**
 * tab选择器
 * @param {number} current 当前选择项目
 * @param {Array} list 渲染数组
 * @param {String} className 外围样式
 * @param {Function} onClick 点击事件
 */
export default ({ onClick, className, list = [], current = "", style }) => {
  const [count, setCount] = useState(current || "");

  useEffect(() => {
    setCount(current);
  }, [current]);

  // 遍历对象
  const arrObject = (obj) => {
    return Object.keys(obj).map((item) => ({
      label: obj[item],
      value: item,
    }));
  };

  /**
   *  判断传入select 类型
   *  [] | {}
   */
  let selectList = [];
  if (Array.isArray(list)) {
    if (list[0].label) {
      selectList = list;
    } else
      selectList = list.map((item, index) => ({ label: item, value: index }));
  } else {
    // 若为对象则将遍历成数组赋值
    selectList = arrObject(list);
  }

  return (
    <View className={`tab_content ${className}`} style={style}>
      {selectList.map((item) => {
        if (item != false)
          return (
            <View
              className={`tabFont 
                  ${count === item.value ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setCount(item.value);
                onClick && onClick(item.value);
              }}
            >
              {item.label}
            </View>
          );
      })}
    </View>
  );
};
