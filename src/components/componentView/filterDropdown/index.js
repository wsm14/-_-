/*
 *  filterData  类型 Array 渲染的筛选项 confirm
 *  confirm  类型 function 渲染的筛选项 确定选择项返回对应的数据
 *  configUserLevelInfo 类型 object 达人等级
 *  top 类型 boolean 是否置顶
 *  scrollName 类型 string 打开筛选时卷曲到耨个元素
 *  setTop 类型 object  打开筛选时置顶的距离
 *  callback 解决动画问题内部所调用的回调
 */
import Taro, { usePageScroll } from "@tarojs/taro";
import React, { useState, useEffect, Fragment } from "react";
import { View, Text, ScrollView } from "@tarojs/components";
import Near from "./components/near";
import Categorys from "./components/category";
import Selects from "./components/select";
import classNames from "classnames";
import "./index.scss";
import { getDom, computedSize, filterIndex } from "@/common/utils";
const filterOnChange = (item) => {
  const { near, category, select } = item;
  let nearVal = near.val;
  let categoryVal = category.val;
  let selectVal = select.val;
  let distance = "";
  let districtCode = "";
  let businessHubId = "";
  let categoryIds = "";
  if (categoryVal.categoryIdString || categoryVal.fatherId) {
    categoryIds = categoryVal.categoryIdString || categoryVal.fatherId;
  }

  if (nearVal.type === "all") {
    distance = "";
    businessHubId = "";
    districtCode = nearVal.districtCode;
  }
  if (!nearVal.type && nearVal.businessHubIdString) {
    distance = "";
    districtCode = "";
    businessHubId = nearVal.businessHubIdString;
  }
  if (nearVal.value) {
    distance = nearVal.value;
    districtCode = "";
    businessHubId = "";
  }
  return {
    sortRule: selectVal.value,
    categoryIds,
    distance,
    businessHubId,
    districtCode,
  };
};
export default ({
  filterData = [],
  confirm,
  defaultData = null,
  configUserLevelInfo,
  top = false,
  scrollName,
  setTop = {
    falgNav: false,
    topNav: 0,
    setNav: 0,
  },
  callback,
}) => {
  const [data, setData] = useState([]);
  const [menuLayerHeight, setMenuLayerHeight] = useState(0);
  const [falg, setFlag] = useState(null);
  const [navFlag, setNavFlag] = useState(false);
  const [selectData, setSelectData] = useState({
    near: {
      selectIndex: -1,
      val: {
        value: "",
      },
    },
    category: {
      selectIndex: -1,
      val: {
        value: "",
      },
    },
    select: {
      selectIndex: -1,
      val: {
        description: "按距离排序",
        name: "距离",
        selectName: "距离",
        value: "distanceSort",
      },
    },
  });
  const [visible, setVisible] = useState({
    index: -1,
  });
  const { near, category, select } = selectData;
  const { falgNav, topNav, setNav } = setTop;
  const { index } = visible;
  useEffect(() => {
    setData(JSON.parse(JSON.stringify(filterData)));
    Taro.nextTick(() => {
      if (defaultData) {
        setSelectData({
          ...selectData,
          category: {
            ...filterIndex(
              (filterData[1] && filterData[1].list) || [],
              defaultData
            ),
          },
        });
      }
    });
  }, [filterData]);
  usePageScroll((e) => {
    if (falgNav) {
      const { scrollTop } = e;
      if (scrollTop >= topNav) {
        setNavFlag(true);
      } else {
        setNavFlag(false);
      }
    } else return;
  });

  useEffect(() => {
    if (index !== -1) {
      getDom("#dakale_nav", (res) => {
        setMenuLayerHeight(res[0].top);
      });
    }
  }, [index]);
  const template = {
    0: (
      <Near
        onChange={(item) => {
          setSelectData({ ...selectData, ...item });
          confirm(filterOnChange({ ...selectData, ...item }));
          setVisible({
            index: -1,
          });
        }}
        visible={index}
        defaul={near}
        data={data[0]}
      ></Near>
    ),
    1: (
      <Categorys
        onChange={(item) => {
          confirm(filterOnChange({ ...selectData, ...item }));
          setSelectData({ ...selectData, ...item });
          setVisible({
            index: -1,
          });
        }}
        visible={index}
        defaul={category}
        data={data[1]}
      ></Categorys>
    ),
    2: (
      <Selects
        onChange={(item) => {
          setSelectData({ ...selectData, ...item });
          confirm(filterOnChange({ ...selectData, ...item }));
          setVisible({
            index: -1,
          });
        }}
        configUserLevelInfo={configUserLevelInfo}
        visible={index}
        defaul={select}
        data={data[2]}
      ></Selects>
    ),
  }[index];
  const onClose = () => {
    setVisible({
      index: -1,
    });
  };
  const seletCollection = (val) => {
    if (val === index) {
      setVisible({ index: -1 });
    } else {
      if (top && !navFlag) {
        Taro.pageScrollTo({
          selector: scrollName || ".dakale_nav_box",
          top: 0,
          success: (res) => {
            if (callback) {
              callback && callback(() => setVisible({ index: val }));
            } else {
              setVisible({ index: val });
            }
          },
        });
      } else {
        setVisible({ index: val });
      }
    }
  };
  return (
    <View catchMove className="dakale_nav_box">
      <View
        className="nav"
        style={
          falgNav && navFlag
            ? { position: "fixed", top: setNav, left: 0, right: 0 }
            : {}
        }
        id="dakale_nav"
      >
        <View className="nav_lineBox">
          {data.map((item, val) => {
            const { name, type } = item;
            return (
              <View
                onClick={() => seletCollection(val)}
                className={classNames(
                  "navMenu  font_hide",
                  index === val ? "navMenuSelect" : "navMenuNormal"
                )}
              >
                {selectData[type].val.selectName ? (
                  <Text className={"navMenu_text color4 font_hide"}>
                    {selectData[type].val.selectName}
                  </Text>
                ) : (
                  name
                )}
              </View>
            );
          })}
        </View>
      </View>
      <View className="sub-menu-layerBox">
        <View
          style={
            falgNav && navFlag
              ? { position: "fixed", top: computedSize(44) + setNav }
              : {}
          }
          className={classNames(
            "sub-menu-layer",
            index === -1 ? "sub-menu-trantionOut" : "sub-menu-trantionInit"
          )}
        >
          {template}
        </View>
        <View
          onClick={() => onClose()}
          className={classNames(
            "sub-menu-bottom",
            index === -1
              ? "sub-menuBottom-trantionOut"
              : "sub-menuBottom-trantionInit"
          )}
        ></View>
      </View>
    </View>
  );
};
