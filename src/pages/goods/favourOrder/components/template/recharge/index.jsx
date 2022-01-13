import React from "react";
import RechargeContent from "../../uiComponents/rechargeContent";
import BeanSelect from "@/components/public_ui/selectKol";
import RechargeDesc from "../../uiComponents/rechargeDesc";
import Button from "../../uiComponents/submit";
export default (props) => {
  return (
    <>
      <RechargeContent {...props}></RechargeContent>
      <BeanSelect {...props}></BeanSelect>
      <RechargeDesc {...props}></RechargeDesc>
      <Button {...props}></Button>
    </>
  );
};
