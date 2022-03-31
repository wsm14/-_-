import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import Router from "@/utils/router";
import { backgroundObj } from "@/utils/utils";
import Tarking from "@/components/tracking";
import days from "dayjs";
import "./index.scss";
export default ({ data }) => {
  const [listObj, setListObj] = useState({});
  let interval = null;
  let collection = true;
  const [time, setTime] = useState(null);
  const [showTimeList, setShowTimeList] = useState([]);
  const filterLimit = (s) => {
    if (s && s > 0) {
      let resource = parseInt(s); // 秒
      let minute = 0;
      let house = 0;

      if (resource > 60) {
        //如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minute = parseInt(resource / 60);
        //获取秒数，秒数取佘，得到整数秒数
        resource = parseInt(resource % 60);
        //秒数
        if (minute > 60) {
          //获取小时，获取分钟除以60，得到整数小时
          house = parseInt(minute / 60);
          //获取小时后取佘的分，获取分钟除以60取佘的分
          minute = parseInt(minute % 60);
        }
      }
      return [
        house ? (house < 10 ? "0" + parseInt(house) : house) : "00",
        minute ? (minute < 10 ? "0" + parseInt(minute) : minute) : "00",
        resource ? (resource < 10 ? "0" + parseInt(resource) : resource) : "00",
      ];
    } else return null;
  };
  const reloadInfo = () => {
    const limit = days().format("YYYY-MM-DD");
    let min = days(limit).valueOf() + 86400000;
    const now = days().valueOf();
    setTime(min - now);
  };
  useEffect(() => {
    reloadInfo();
    return () => {
      collection = false;
    };
  }, []);
  useEffect(() => {
    if (time) {
      let computed = 0;
      interval = setInterval(() => {
        computed = computed + 1000;
        if (time - computed >= 0 && collection) {
          setShowTimeList(filterLimit((time - computed) / 1000));
        } else {
          clearInterval(interval);
          collection && reloadInfo();
        }
      }, 1000);
    }
  }, [time]);
  useEffect(() => {
    setListObj(
      data.reduce((item, val) => {
        if (val.moduleName === "fieldResource") {
          return val;
        } else return item;
      }),
      {}
    );
  }, [data]);
  const { configWindVaneList = [] } = listObj;
  return (
    <View className="fieldResource_box">
      <View className="fieldResource_end_djs">
        {showTimeList.map((item, index) => {
          return <View className={`resource_end_djs${index + 1}`}>{item}</View>;
        })}
      </View>
      <View className="fieldResource_s"></View>
      <View className="fieldResource_h"></View>
      {configWindVaneList.map((item, index) => {
        const {
          templateType,
          resourceTemplateContentId,
          payBeanCommission,
          image,
          identification,
        } = item;
        return (
          <Tarking blockName="fieldResource" args={item} name={"FieldResource"}>
            <View
              style={backgroundObj(image)}
              onClick={() =>
                Router({
                  routerName: "wanderAround",
                  args: {
                    type: templateType,
                    identification: identification,
                    resourceTemplateContentId,
                    payBeanCommission,
                  },
                })
              }
              className={`fieldResource_image_box fieldResource_image_style${
                index + 1
              }`}
            ></View>
          </Tarking>
        );
      })}
    </View>
  );
};
