import React, { useEffect, useState } from "react";
import { Image, View } from "@tarojs/components";
import { navigateTo } from "@/common/utils";
import CouponView from "./../couponView";

export default (props) => {
  const { data = [], visible = true, type } = props;
  const [close, onClose] = useState(true);
  const [list, setList] = useState([]);
  useEffect(() => {
    setList(
      data.filter((item) => {
        return item.bugFlag !== "1";
      })
    );
  }, [data]);
  useEffect(() => {
    onClose(visible);
  }, [visible]);

  return (
    <>
      {list.map((item, index) => {
        const { couponStatus } = item;
        if (!close && index >= 2) {
          return null;
        }
        return <CouponView item={item}></CouponView>;
      })}
      {!close && list.length > 2 && (
        <View
          className="wraparound_couponType_down"
          onClick={() => onClose(true)}
        ></View>
      )}
    </>
  );
};
