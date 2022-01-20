import React from "react";
import Title from "../../ui/orderTop";
import CodeContent from "../../ui/codeContent";
import ScanCard from "../../ui/scanCard";
import Btn from "../../ui/collectBtn";
import Coupon from "./../../ui/platformGiftCoupon";
export default (props) => {
  return (
    <>
      <Title {...props}></Title>
      <CodeContent {...props}></CodeContent>
      <Coupon {...props}></Coupon>
      <ScanCard {...props}></ScanCard>
      <Btn type={"remove"} {...props}></Btn>
    </>
  );
};
