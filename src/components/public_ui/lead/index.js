import React, { useEffect, useState } from "react";
import { Text, View } from "@tarojs/components";
import Drawer from "@/components/Drawer";
import Router from "@/utils/router";
import "./index.scss";
export default (props) => {
  const { beanLimitStatus, balance } = props;
  const [bean, setBean] = useState(0);
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState(null);
  useEffect(() => {
    setBean(balance);
  }, [balance]);
  useEffect(() => {
    if (type === "1" && beanLimitStatus === "0") {
      setVisible(true);
    } else {
      setType(beanLimitStatus);
    }
  }, [beanLimitStatus]);
  if (visible) {
    return (
      <Drawer
        show={visible}
        close={() => {
          setVisible(false);
        }}
      >
        <View
          className="lead_bean_box"
          catchMove
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <View className="lead_bean_content public_center">
            <View className="lead_bean_hook"></View>
            <View className="lead_bean_x"></View>
            <View className="lead_bean_bean">{bean}</View>
          </View>
          <View
            className="lead_bean_btn public_center"
            onClick={() => {
              setVisible(false);
              Router({
                routerName: "download",
              });
            }}
          >
            打开「哒卡乐APP」
          </View>
        </View>
      </Drawer>
    );
  } else {
    return null;
  }
};
