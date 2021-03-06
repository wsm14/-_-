import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import classNames from "classnames";
import { View } from "@tarojs/components";
import "./index.scss";
export default (props) => {
  const {
    fn,
    style,
    tabList,
    current,
    //当前选中 下标
    type,
    lineStyle = {},
    //下面横线样式
    fontStyle = {},
    //文选中字额外颜色样式
    sizeStyle = {},
    //未选中文字大小样式
  } = props;
  const [count, setCount] = useState(null);
  useEffect(() => {
    setCount(current);
  }, [current]);
  if (tabList) {
    return (
      <View style={style}>
        {tabList.map((item, index) => {
          return (
            <View
              className={classNames(
                "tabFont",
                `index${index}`,
                count === index ? "tabChecked" : "tabNoChecked"
              )}
              style={count === index ? fontStyle : sizeStyle}
              onClick={(e) => fn(index)}
            >
              {item}
              {count === index && (
                <View
                  className="tab_line animated fadeIn"
                  style={lineStyle}
                ></View>
              )}
            </View>
          );
        })}
      </View>
    );
  }
  return new Error("未监听初始化数组");
};
