import React from "react";
import { View } from "@tarojs/components";
import BeanGiftPackContent from "../../uiComponents/beanGiftPackContent";
import BeanSelect from "@/components/public_ui/selectKol";
import BeanGiftPackDesc from "../../uiComponents/beanGiftPackDesc";
import Button from "../../uiComponents/submit";

export default (props) => {
  return (
    <View className="beanGiftPackContent">
      <BeanGiftPackContent {...props}></BeanGiftPackContent>
      <BeanSelect {...props}></BeanSelect>
      <BeanGiftPackDesc {...props}></BeanGiftPackDesc>
      <Button {...props}></Button>
    </View>
  );
};
