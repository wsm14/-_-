import React, { useState, useEffect, Fragment } from "react";
import Taro from "@tarojs/taro";
import { View, Text, ScrollView } from "@tarojs/components";
import classNames from "classnames";
export default ({ data = [], onChange, defaul, visible }) => {
  const [dataIndex, setDataIndex] = useState(null);
  const [TikIndex, setTikIndex] = useState(null);
  const { list = [], hubList, type } = data;
  const [childrenList, setChildrenList] = useState([]);
  const [checked, setChecked] = useState(null);
  const marginTags = (list, num, style, components) => {
    return list.map((item, index) => {
      return (
        <View
          className="marginTags_bottom"
          style={(index + 1) % num !== 0 && style}
        >
          {components(item, index)}
        </View>
      );
    });
  };
  useEffect(() => {
    if (dataIndex === -1 || !dataIndex) {
      setChildrenList(list[0].list);
    } else {
      setChildrenList(hubList[dataIndex - 1].businessHubList);
    }
    Taro.nextTick(() => {
      if (!TikIndex) {
        setTikIndex(dataIndex);
      }
    });
  }, [dataIndex]);
  useEffect(() => {
    if (visible === 0) {
      const { selectIndex, val } = defaul;
      setDataIndex(selectIndex);
      setChecked({ ...val });
    }
  }, [visible]);
  //数据回显
  const setMenu = (item, val, key) => {
    if (item[key] == val[key]) {
      return true;
    } else return false;
  };
  //设置按钮是否为选中
  const filterFont = (val, key, set) => {
    console.log(dataIndex, childrenList);
    if (dataIndex === -1 || !dataIndex) {
      if (val[key]) {
        return val[set];
      } else {
        return undefined;
      }
    } else {
      if (val && val.type !== "all") {
        return val[set];
      } else {
        return hubList[dataIndex - 1]["districtName"];
      }
    }
  };
  const selectIndex = (index) => {
    if (index !== dataIndex) {
      setDataIndex(index);
    }
  };
  const change = (item, key, val) => {
    setChecked(item);
    onChange({
      [type]: {
        selectIndex: dataIndex,
        val: { ...item, selectName: filterFont(item, val, key) },
      },
    });
  };
  return (
    <View className="sub-scorllView-box">
      <ScrollView
        scrollIntoView={`sub-scorll-btn${TikIndex}`}
        scrollY
        className="sub-scorllView-left"
      >
        {list.map((item, index) => {
          const { name } = item;
          return (
            <View
              onClick={() => selectIndex(0)}
              className={classNames(
                "sub-scorll-btn",
                dataIndex === -1 || dataIndex === 0
                  ? "sub-scorll-btnSelect"
                  : "sub-scorll-btnSelectFlase"
              )}
            >
              {name}
            </View>
          );
        })}
        {hubList.map((item, index) => {
          const { districtName } = item;
          return (
            <View
              onClick={() => selectIndex(index + 1)}
              id={`sub-scorll-btn${index + 1}`}
              className={classNames(
                "sub-scorll-btn",
                dataIndex === index + 1
                  ? "sub-scorll-btnSelect"
                  : "sub-scorll-btnSelectFlase"
              )}
            >
              {districtName}
            </View>
          );
        })}
      </ScrollView>
      <ScrollView scrollY className="sub-scorllView-right">
        <View className="sub-scorllView-rightbox">
          {dataIndex === -1 || dataIndex === 0
            ? marginTags(
                childrenList,
                3,
                { marginRight: Taro.pxTransform(23) },
                (item, index) => {
                  return (
                    <View
                      onClick={() => {
                        change(item, "description", "value");
                      }}
                      className={classNames(
                        "sub-scorllView-tag",
                        setMenu(item, checked, "value")
                          ? "sub-scorllView-tagSelect"
                          : "sub-scorllView-tagSelectNo"
                      )}
                    >
                      {item.description}
                    </View>
                  );
                }
              )
            : null}
          {dataIndex && dataIndex > 0
            ? marginTags(
                childrenList,
                3,
                { marginRight: Taro.pxTransform(23) },
                (item, index) => {
                  const { businessHubName, type } = item;
                  console.log(item);
                  return (
                    <View
                      onClick={() => {
                        change(item, "businessHubName", "businessHubIdString");
                      }}
                      className={classNames(
                        "sub-scorllView-tag",
                        type === "all" && !checked.businessHubIdString
                          ? setMenu(item, checked, "districtCode")
                            ? "sub-scorllView-tagSelect"
                            : "sub-scorllView-tagSelectNo"
                          : setMenu(item, checked, "businessHubIdString")
                          ? "sub-scorllView-tagSelect"
                          : "sub-scorllView-tagSelectNo"
                      )}
                    >
                      <View className="sub-scorllView-init font_hide">
                        {businessHubName}
                      </View>
                    </View>
                  );
                }
              )
            : null}
        </View>
      </ScrollView>
    </View>
  );
};
