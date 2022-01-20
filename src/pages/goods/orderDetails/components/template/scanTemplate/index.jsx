import React from "react";
import Title from "./../../ui/orderTop";
import CodeContent from "./../../ui/codeContent";
import ScanCard from "./../../ui/scanCard";
import VirtualCard from "./../../ui/virtualCard";
import Btn from "./../../ui/collectBtn";
export default (props) => {
  const { data } = props;
  const { orderType } = data;
  return (
    <>
      <Title {...props}></Title>
      <CodeContent {...props}></CodeContent>
      {orderType === "virtualProduct" ? (
        <VirtualCard {...props}></VirtualCard>
      ) : (
        <ScanCard {...props}></ScanCard>
      )}

      <Btn type={"remove"} {...props}></Btn>
    </>
  );
};
