import React, { useState, useEffect } from "react";
import { View, ScrollView } from "@tarojs/components";

export default (props) => {
  const { onChange } = props;
  const [visible, setVisible] = useState(true);
  if (visible) {
    return (
      <View className="reloadBottom public_center">
        <View className="reloadBottom_box  public_auto">
          <View className="reloadBottom_left">
            <View
              className="home_close close_box"
              onClick={() => setVisible(false)}
            ></View>
            更多福利请关注哒卡乐公众号
          </View>
          <View
            onClick={() => onChange && onChange()}
            className="reloadBottom_right public_center"
          >
            戳一下
          </View>
        </View>
      </View>
    );
  } else {
    return null;
  }
};
