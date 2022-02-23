import React, { useState, useMemo, useRef } from "react";
import { View, Image } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { observer, MobXProviderContext } from "mobx-react";
import { fetchStorage, fakeStorage } from "@/utils/utils";
import days from "dayjs";
import Drawer from "@/components/Drawer";
import Router from "@/utils/router";
import "./index.scss";
import { useEffect } from "react";
let loadingInfo = null;
let times = [];
let day = [];
let only = [];
export default ({ pageName = "wanderAround" }) => {
  const [visible, setVisible] = useState({
    show: false,
    count: 0,
    showData: {},
  });
  const select = () => {
    let drawer = [...only, ...day, ...times];
    const { count, showData } = visible;
    const { frequencyType, configGlobalPopUpId } = showData;
    let list = fetchStorage("configGlobalPopUpDTOS") || [];
    if (frequencyType === "only") {
      let onlyFlag = false;
      list.forEach((item) => {
        if (item.configGlobalPopUpId === configGlobalPopUpId) {
          onlyFlag = true;
        }
      });
      if (!onlyFlag) {
        fakeStorage("configGlobalPopUpDTOS", [
          ...list.slice(0, 9),
          { ...showData },
        ]);
      }
    } else if (frequencyType === "day") {
      let dayFlag = false;
      list.forEach((item) => {
        if (item.configGlobalPopUpId === configGlobalPopUpId) {
          dayFlag = true;
        }
      });
      if (!dayFlag) {
        fakeStorage("configGlobalPopUpDTOS", [
          ...list.slice(0, 9),
          { ...showData, createTime: days().format("YYYY-MM-DD") },
        ]);
      } else {
        fakeStorage(
          "configGlobalPopUpDTOS",
          list.map((item) => {
            if (item.configGlobalPopUpId === configGlobalPopUpId) {
              return { ...item, createTime: days().format("YYYY-MM-DD") };
            }
            return {
              ...item,
            };
          })
        );
      }
    }
    if (count < drawer.length - 1) {
      setVisible({
        ...visible,
        count: count + 1,
        showData: drawer[count + 1],
      });
    } else {
      setVisible({
        show: false,
        count: 0,
        showData: {},
      });
    }
  };
  const { store } = React.useContext(MobXProviderContext);
  const { commonStore } = store;
  const { configGlobalPopUpObjectList = [] } = commonStore;
  useDidShow(() => {
    day = [];
    only = [];
    if (loadingInfo) {
      if (times.length > 0) {
        setVisible({
          show: true,
          count: 0,
          showData: { ...times[0] },
        });
      }
    }
  });
  useEffect(() => {
    const list = fetchStorage("configGlobalPopUpDTOS") || [];
    if (configGlobalPopUpObjectList.length > 0) {
      if (!loadingInfo) {
        let changeList = configGlobalPopUpObjectList.filter((item) => {
          return item.pageName === pageName;
        })[0].configGlobalPopUpDTOS;
        filterList(list, changeList);
        let drawer = [...only, ...day, ...times];
        if (drawer.length > 0) {
          setVisible({
            show: true,
            count: 0,
            showData: { ...drawer[0] },
          });
        }
      }
    }
  }, [configGlobalPopUpObjectList]);

  const filterList = (list, newList) => {
    times = [];
    day = [];
    only = [];
    loadingInfo = true;
    newList.forEach((item) => {
      const {
        configGlobalPopUpId,
        frequencyType,
        activityBeginTime,
        activityEndTime,
      } = item;
      if (frequencyType === "times") {
        times = [...times, { ...item }];
      } else {
        if (frequencyType === "only") {
          let flag = false;
          list.forEach((val) => {
            if (
              configGlobalPopUpId === val.configGlobalPopUpId ||
              (Date.parse(new Date()) > days(activityBeginTime).valueOf() &&
                Date.parse(new Date()) < days(activityEndTime))
            ) {
              flag = true;
            }
          });
          if (!flag) {
            console.log(item, 12312323);
            only = [...only, { ...item }];
          }
        } else {
          let flag = false;
          list.forEach((val) => {
            if (
              configGlobalPopUpId === val.configGlobalPopUpId &&
              days(new Date()).valueOf() - days(val.createTime).valueOf() <
                86400000
            ) {
              flag = true;
            }
          });
          if (!flag) {
            day = [...day, { ...item }];
          }
        }
      }
    });
  };
  const linkTo = (data) => {
    const { popUpUrl, popUpType, jumpUrl, param } = data;
    if (popUpType === "url") {
      Router({
        routerName: "webView",
        args: {
          link: popUpUrl,
        },
      });
    } else {
      Router({
        routerName: JSON.parse(jumpUrl).weChatUrl,
        params: {
          ...JSON.parse(param),
        },
      });
    }
  };
  const { show, count, showData } = visible;
  const { popUpImage } = showData;
  if (show)
    return (
      <Drawer show={show} close={select}>
        <Image
          onClick={() => linkTo(showData)}
          mode="widthFix"
          style={{ width: "640rpx", height: "auto" }}
          src={popUpImage}
        ></Image>
      </Drawer>
    );
  else {
    return null;
  }
};
