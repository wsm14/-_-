import React from "react";
import { View, Text } from "@tarojs/components";
import { backgroundObj } from "@/utils/utils";
import SpecalTop from "./../../uiComponents/specalTop";
import Desc from "./../../uiComponents/specalDesc";
import BeanSelect from "@/components/public_ui/selectKol";
import Button from "./../../uiComponents/submit";
import Router from "@/utils/router";
export default (props) => {
  return (
    <>
      <SpecalTop {...props}></SpecalTop>
      <BeanSelect {...props}></BeanSelect>
      <Desc {...props}></Desc>
      <Button {...props}></Button>
    </>
  );
};
