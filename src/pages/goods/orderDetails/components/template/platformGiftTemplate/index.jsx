import React from "react";
import Title from "../../ui/orderTop";
import CodeContent from "../../ui/codeContent";
import PlatformCard from "../../ui/platformCard";
import Btn from "../../ui/collectBtn";
import Coupon from "./../../ui/platformGiftCoupon";
export default (props) => {
  return (
    <>
      <Title {...props}></Title>
      <CodeContent {...props}></CodeContent>
      <Coupon {...props}></Coupon>
      <PlatformCard {...props}></PlatformCard>
      <Btn type={"remove"} {...props}></Btn>
    </>
  );
};
