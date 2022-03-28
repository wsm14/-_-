import React, { useEffect, useState, useRef } from "react";
import Taro, { useReachBottom } from "@tarojs/taro";
import { Image, Text, View } from "@tarojs/components";
import classNames from "classnames";
import { toast } from "@/utils/utils";
import Shop from "./../shop";
export default ({}) => {
  const [select, setSelect] = useState({
    list: [
      { key: "开团中", val: 0 },
      { key: "开团成功", val: 1 },
      { key: "开团失败", val: 2 },
    ],
    val: 0,
  });
  const { list, val } = select;
  return (
    <>
      <View className="collage_tab_box">
        {list.map((item, index) => {
          return (
            <View
              onClick={() => {
                setSelect({
                  list,
                  val: item.val,
                });
              }}
              className={val === item.val && "collage_tab"}
            >
              {item.key}
              {val === item.val && <View className="collage_tab_liner"></View>}
            </View>
          );
        })}
      </View>
      <Shop></Shop>
    </>
  );
};
