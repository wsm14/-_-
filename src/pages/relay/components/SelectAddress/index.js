import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import { getLat, getLnt, resiApiKey } from "@/common/utils";
import { getRestapiAddress } from "@/server/common";
import Drawer from "@/relay/components/layerlayout";
import "./index.scss";
export default (props) => {
  const { show = false, onClose, onSubmit } = props;
  const [data, setData] = useState([]);
  const setMap = () => {
    const latitude = getLat();
    const longitude = getLnt();
    if (latitude && longitude) {
      getRestapiAddress(
        {
          location: `${longitude},${latitude}`,
          key: resiApiKey,
          extensions: "all",
        },
        (res) => {
          const { info, regeocode = {} } = res;
          if (info === "OK") {
            console.log(res);
          } else {
          }
        }
      );
    }
  };
  useEffect(() => {
    if (show) {
      setMap();
    }
  }, [show]);
  return (
    <Drawer
      title={"请选择位置"}
      show={show}
      height={586}
      overflow={true}
      onClose={() => onClose()}
    >
      <ScrollView scrollY className="SelectAddress_scroll">
        <View className="SelectAddress_scroll_padding">
          <View
            onClick={() => onSubmit()}
            className="SelectAddress_scroll_template"
          >
            <View className="SelectAddress_scroll_name font_hide"></View>
            <View className="SelectAddress_scroll_name1 font_hide"></View>
          </View>
        </View>
      </ScrollView>
    </Drawer>
  );
};
