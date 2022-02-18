import React, { useEffect, useState } from "react";
import CouponView from "./../couponView";
export default (props) => {
  const { data = [], visible = true } = props;
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
        return <CouponView item={item}></CouponView>;
      })}
    </>
  );
};
