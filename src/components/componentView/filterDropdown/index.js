import Taro from "@tarojs/taro";
import React, { useState, useEffect, Fragment } from "react";
import { View, Text, ScrollView } from "@tarojs/components";
import Near from "./components/near";
import Categorys from "./components/category";
import Selects from "./components/select";
import classNames from "classnames";
import "./index.scss";
import { getDom } from "@/common/utils";
const filterOnChange = (item) => {
  const { near, category, select } = item;
  let nearVal = near.val;
  let categoryVal = category.val;
  let selectVal = select.val;
  let limit = "";
  let districtCode = "";
  let businessHubId = "";
  let categoryId = "";
  if (categoryVal.categoryIdString || categoryVal.fatherId) {
    categoryId = categoryVal.categoryIdString || categoryVal.fatherId;
  }

  if (nearVal.type === "all") {
    limit = "";
    businessHubId = "";
    districtCode = nearVal.districtCode;
  }
  if (!nearVal.type && nearVal.businessHubIdString) {
    console.log(nearVal, 111);
    limit = "";
    districtCode = "";
    businessHubId = nearVal.businessHubIdString;
  }
  if (nearVal.value) {
    console.log(nearVal, 222);
    limit = nearVal.value;
    districtCode = "";
    businessHubId = "";
  }
  return {
    a: selectVal.value,
    categoryId,
    limit,
    businessHubId,
    districtCode,
  };
};
export default ({ filterData = [], confirm }) => {
  useEffect(() => {
    setData(JSON.parse(JSON.stringify(filterData)));
  }, [filterData]);
  const [data, setData] = useState([]);
  const [menuLayerHeight, setMenuLayerHeight] = useState(0);
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
        value: "",
      },
    },
  });
  const [visible, setVisible] = useState({
    index: -1,
  });
  const { near, category, select } = selectData;
  const { index } = visible;
  useEffect(() => {
    confirm(filterOnChange(selectData));
  }, [selectData]);
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
          setVisible({
            index: -1,
          });
        }}
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
      setVisible({ index: val });
    }
  };

  return (
    <View>
      <View className="nav" id="dakale_nav">
        {data.map((item, val) => {
          const { name, type } = item;

          return (
            <View
              onClick={() => seletCollection(val)}
              className={classNames(
                "navMenu",
                index === val ? "navMenuSelect" : "navMenuNormal"
              )}
            >
              {selectData[type].val.selectName ? (
                <Text className={"color4"}>
                  {selectData[type].val.selectName}
                </Text>
              ) : (
                name
              )}
            </View>
          );
        })}
      </View>
      <View className="sub-menu-layerBox">
        <View
          className={classNames(
            "sub-menu-layer",
            index === -1 ? "sub-menu-trantionOut" : "sub-menu-trantionInit"
          )}
        >
          {template}
        </View>
        <View
          catchMove
          onClick={() => onClose()}
          style={{ top: menuLayerHeight }}
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
