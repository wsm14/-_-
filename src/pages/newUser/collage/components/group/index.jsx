import React, { useEffect, useState, useRef } from "react";
import Taro, { useReachBottom } from "@tarojs/taro";
import { Image, Text, View } from "@tarojs/components";
import classNames from "classnames";
import { toast } from "@/utils/utils";
import Empty from "@/components/Empty";
import Shop from "./../shop";
export default ({ type, status, onChange, data, updateData }) => {
  const [select, setSelect] = useState({
    list: [
      { key: "开团中", val: 0 },
      { key: "开团成功", val: 1 },
      { key: "开团失败", val: 2 },
    ],
  });
  const { list } = select;
  return (
    <>
      <View className="collage_tab_box">
        {list.map((item, index) => {
          return (
            <View
              onClick={() => {
                onChange(index);
              }}
              className={status === item.val && "collage_tab"}
            >
              {item.key}
              {status === item.val && (
                <View className="collage_tab_liner"></View>
              )}
            </View>
          );
        })}
      </View>
      <Empty
        pt={true}
        pylb={"暂无开团记录"}
        show={data.length === 0}
        type={"shop"}
        toast={"赶快去选品中开团赚钱吧"}
      ></Empty>
      {data.map((item) => {
        return <Shop updateData={updateData} data={item} type={type}></Shop>;
      })}
    </>
  );
};
