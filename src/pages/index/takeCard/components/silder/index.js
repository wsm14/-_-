import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { CoverImage, CoverView, ScrollView } from "@tarojs/components";
import { createMerchantByMap } from "./../template/index";
import "./index.scss";

export default (props) => {
  const height = (760 / 1334) * Taro.getSystemInfoSync().windowHeight;
  const { data } = props;
  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const { markers } = data;
    let filterList = markers.filter((item, index) => {
      if (index !== 0) {
        return item;
      }
    });
    setList(filterList);
  }, [data]);

  return (
    <CoverView className="silder_box">
      <CoverView
        className="silder_liner_box"
        onClick={() => {
          setVisible(!visible);
          console.log(111);
        }}
      >
        <CoverView className="silder_liner"></CoverView>
        <CoverView className="silder_number color2 font24">
          已展示{list.length}个结果
        </CoverView>
      </CoverView>
      {
        <CoverView
          style={
            visible
              ? { display: "block", maxHeight: height }
              : { display: "none", maxHeight: height }
          }
          className="silder_merchantDetails"
        >
          {list.map((item) => {
            return (
              <CoverView
                className="silder_showDwon"
                style={{ marginBottom: Taro.pxTransform(24) }}
              >
                {createMerchantByMap(item)}
              </CoverView>
            );
          })}
          <CoverView className="silder_merchantMagin"></CoverView>
        </CoverView>
      }
    </CoverView>
  );
};
