import React from "react";
import MerchantTop from "./../../uiComponents/merchantTop";
import Content from "./../../uiComponents/scanContent";
import Button from "../../uiComponents/submit";

export default (props) => {
  return (
    <>
      <MerchantTop {...props}></MerchantTop>
      <Content {...props}></Content>
      <Button {...props}></Button>
    </>
  );
};
