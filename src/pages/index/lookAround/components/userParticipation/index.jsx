import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import { backgroundObj } from "@/utils/utils";
import Router from "@/utils/router";
import "./index.scss";
export default ({ data, link }) => {
  const [listObj, setListObj] = useState({});
  useEffect(() => {
    setListObj(
      data.reduce((item, val) => {
        if (val.moduleName === "userParticipation") {
          return val;
        } else return item;
      }),
      {}
    );
  }, [data]);

  const { configWindVaneList = [] } = listObj;
  return (
    <View className="userParticipation_link_box">
      <View className="userParticipation_box">
        <View
          onClick={(e) => {
            e.stopPropagation();
            Router({
              routerName: "collageList",
            });
          }}
          className="userParticipation_title"
        >
          <View className="userParticipation_link">领取更多</View>
        </View>

        {configWindVaneList.map((item) => {
          const { image } = item;
          return (
            <View
              style={backgroundObj(image)}
              className="userParticipation_img"
              onClick={() => {
                link(item);
              }}
            ></View>
          );
        })}
      </View>
    </View>
  );
};
