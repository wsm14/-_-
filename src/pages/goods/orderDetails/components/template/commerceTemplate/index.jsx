import React from "react";
import Title from "./../../ui/orderTop";
import CodeContent from "./../../ui/codeContent";
import CommerceCard from "./../../ui/commerceCard";
import Btn from "./../../ui/collectBtn";
export default (props) => {
  return (
    <>
      <Title {...props}></Title>
      <CodeContent {...props}></CodeContent>
      <CommerceCard {...props}></CommerceCard>
      <Btn {...props}></Btn>
    </>
  );
};
