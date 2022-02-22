import React, { useState } from "react";
import Taro from "@tarojs/taro";
import { View, AdCustom } from "@tarojs/components";
export default ({}) => {
  const [visible, setVisible] = useState(true);
  const setError = (e) => {
    setVisible(false);
  };
  if (visible) {
    return (
      <AdCustom
        style="height: 100vh;"
        unitId="adunit-e1807058db30465d"
        adIntervals={30}
        onError={(e) => setError(e)}
      ></AdCustom>
    );
  } else {
    return <View style="height: 100vh;"></View>;
  }
};
