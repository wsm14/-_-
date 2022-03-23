import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import { backgroundObj } from "@/utils/utils";
import Router from "@/utils/router";
import "./index.scss";
export default ({ data }) => {
  const [listObj, setListObj] = useState({});
  useEffect(() => {
    setListObj(
      data.reduce((item, val) => {
        if (val.moduleName === "beanDeductionZone") {
          return val;
        } else return item;
      }),
      {}
    );
  }, [data]);

  const { configWindVaneList = [], identification } = listObj;
  return (
    <View className="rebate_box">
      <View className="rebate_img_box public_auto">
        {configWindVaneList.map((item) => {
          const {
            image,
            resourceTemplateContentId,
            payBeanCommission,
            identification,
          } = item;
          return (
            <View
              onClick={() => {
                Router({
                  routerName: "wanderAround",
                  args: {
                    type: "rebate",
                    identification: identification,
                    resourceTemplateContentId,
                    payBeanCommission,
                  },
                });
              }}
              style={backgroundObj(image)}
              className="rebate_info_box"
            ></View>
          );
        })}
      </View>
    </View>
  );
};
