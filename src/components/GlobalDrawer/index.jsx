import React, { useState } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { observer, MobXProviderContext } from "mobx-react";
import { fetchStorage } from "@/utils/utils";
import day from "dayjs";
import "./index.scss";
import { useEffect } from "react";
export default ({}) => {
  const [times, setTimes] = useState([]);
  const [day, setDay] = useState([]);
  const [only, setOnly] = useState([]);
  const { store } = React.useContext(MobXProviderContext);
  const { commonStore } = store;
  const { configGlobalPopUpObjectList = [] } = commonStore;
  const list = fetchStorage("configGlobalPopUpObjectList") || [];
  useEffect(() => {
    if (configGlobalPopUpObjectList.length > 0) {
    }
  }, [configGlobalPopUpObjectList]);

  const filterList = (list, newList) => {
    newList.forEach((item) => {
      const { pageName, configGlobalPopUpDTOS } = item;
      const {
        configGlobalPopUpId,
        frequencyType,
        activityBeginTime,
        activityEndTime,
      } = configGlobalPopUpDTOS;
      if (frequencyType === "times") {
        setTimes([...times, { ...item }]);
      } else {
        if (frequencyType === "only") {
          let flag = false;
          list.forEach((val) => {
            if (
              configGlobalPopUpId ===
                val.configGlobalPopUpDTOS.configGlobalPopUpId ||
              (Date.parse(new Date()) > dayjs(activityBeginTime).valueOf() &&
                Date.parse(new Date()) < dayjs(activityEndTime))
            ) {
              flag = true;
            }
          });
          if (!flag) {
            setOnly([...only, { ...item }]);
          }
        } else {
        }
      }
    });
  };
};
