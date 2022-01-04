import React from "react";
import { View, Text } from "@tarojs/components";
import { backgroundObj } from "@/utils/utils";
import CommerTop from "./../../uiComponents/commerTop";
import CommerCard from "./../../uiComponents/commerContent";
import Desc from "./../../uiComponents/commerDesc";
import BeanSelect from "@/components/public_ui/selectKol";
import Button from "./../../uiComponents/submit";
export default (props) => {
  return (
    <>
      <CommerTop {...props}></CommerTop>
      <CommerCard {...props}></CommerCard>
      <BeanSelect {...props}></BeanSelect>
      <Desc {...props}></Desc>
      <Button {...props}></Button>
    </>
  );
};
