import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import { getLat, getLnt, resiApiKey, toast } from "@/common/utils";
import { getRestapiAddress } from "@/server/common";
import Drawer from "@/relay/components/layerlayout";
import "./index.scss";
export default (props) => {
  const { show = false, onClose, onSubmit } = props;
  const [data, setData] = useState([]);
  const { formatted_address = "", pois = [] } = data;
  const setMap = () => {
    const latitude = getLat();
    const longitude = getLnt();
    if (latitude && longitude) {
      getRestapiAddress(
        {
          location: `${longitude},${latitude}`,
          key: resiApiKey,
          extensions: "all",
          radius: 100,
        },
        (res) => {
          const { info, regeocode = {} } = res;
          if (info === "OK") {
            setData(regeocode);
          } else {
            toast("获取地址实时定位失败");
            onClose && onClose();
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
      onClose={onClose}
    >
      <ScrollView scrollY className="SelectAddress_scroll">
        <View className="SelectAddress_scroll_padding">
          {pois.map((item) => {
            const { address, location = "" } = item;
            const [lat, lnt] = location.split(",");
            return (
              <View
                onClick={() => {
                  onSubmit({ address: address, lat, lnt });
                }}
                className="SelectAddress_scroll_template"
              >
                <View className="SelectAddress_scroll_name font_hide">
                  {address}
                </View>
                <View className="SelectAddress_scroll_name1 font_hide">
                  {formatted_address}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </Drawer>
  );
};
