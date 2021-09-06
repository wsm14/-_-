import React, { useMemo, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import Template from "./components/index";
import "./index.scss";
export default (props) => {
  const { data = [] } = props;
  if (data.length > 0) {
    return (
      <View className="FormTemplate_box">
        {data.map((item) => {
          return <Template {...item}></Template>;
        })}
      </View>
    );
  } else {
    return null;
  }
};
