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
export default ({ pageName = "wanderAround", stopVideo, initVideo }) => {
  const [GlobalDrawerList, setGlobalDrawerList] = useState([]);
  const [visible, setVisible] = useState({
    show: false,
    count: 0,
    showData: {},
  });
  const select = () => {
    let drawer = [...GlobalDrawerList];
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
      initVideo && initVideo();
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
  useEffect(() => {
    const list = fetchStorage("configGlobalPopUpDTOS") || [];
    let changeList = configGlobalPopUpObjectList.filter((item) => {
      return item.pageName === pageName;
    })[0];
    changeList = changeList && changeList.configGlobalPopUpDTOS;
    if (!changeList) {
      initVideo && initVideo();
      return;
    }
    setGlobalDrawerList(filterList(list, changeList));
  }, []);

  useEffect(() => {
    const list = fetchStorage("configGlobalPopUpDTOS") || [];
    if (configGlobalPopUpObjectList.length > 0) {
      let changeList = configGlobalPopUpObjectList.filter((item) => {
        return item.pageName === pageName;
      })[0];
      changeList = changeList && changeList.configGlobalPopUpDTOS;
      if (!changeList) {
        initVideo && initVideo();
        return;
      }
      setGlobalDrawerList(filterList(list, changeList));
    } else {
      initVideo && initVideo();
    }
  }, [configGlobalPopUpObjectList]);
  useEffect(() => {
    if (GlobalDrawerList.length > 0) {
      stopVideo && stopVideo();
      setVisible({
        show: true,
        count: 0,
        showData: { ...GlobalDrawerList[0] },
      });
    }
  }, [GlobalDrawerList]);
  //数组发生变化并且有数据的情况下打开弹窗
  const filterList = (list, newList) => {
    //list 条件数组 newList 后端返回数组
    let setList = [];
    // 初始化满足条件的数组
    newList.forEach((item) => {
      const {
        configGlobalPopUpId,
        frequencyType,
        activityBeginTime,
        activityEndTime,
      } = item;
      if (frequencyType === "times") {
        setList = [...setList, { ...item }];
      } else {
        if (frequencyType === "only") {
          let flag = false;
          list.forEach((val) => {
            if (
              configGlobalPopUpId === val.configGlobalPopUpId &&
              Date.parse(new Date()) > days(activityBeginTime).valueOf() &&
              Date.parse(new Date()) < days(activityEndTime)
            ) {
              flag = true;
            }
          });
          if (!flag) {
            setList = [...setList, { ...item }];
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
            setList = [...setList, { ...item }];
          }
        }
      }
    });
    return setList;
  };
  //过滤后端给的弹窗数组并且返回满足条件的弹窗数组
  const linkTo = (data) => {
    const { popUpUrl, jumpUrl, param, jumpUrlType } = data;
    if (!jumpUrlType) {
      return;
    } else {
      if (jumpUrlType === "h5") {
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
    }
  };
  const { show, showData } = visible;
  const { popUpImage } = showData;
  if (show)
    return (
      <Drawer show={show} close={() => select()}>
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
