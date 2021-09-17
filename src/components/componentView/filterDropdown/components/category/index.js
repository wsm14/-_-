import React, { useState, useEffect, Fragment } from "react";
import Taro from "@tarojs/taro";
import { View, Text, ScrollView } from "@tarojs/components";
import classNames from "classnames";
import { getDom } from "@/common/utils";
export default ({ data = [], onChange, defaul, visible }) => {
  const { list = [], type } = data;
  const [dataIndex, setDataIndex] = useState(null);
  const [father, SetFather] = useState(null);
  const [TikIndex, setTikIndex] = useState(null);
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
      setChildrenList(list[0].categoryDTOList);
    } else {
      setChildrenList(list[dataIndex].categoryDTOList);
    }
    Taro.nextTick(() => {
      if (!TikIndex) {
        setTikIndex(dataIndex);
      }
    });
  }, [dataIndex]);
  useEffect(() => {
    if (visible === 1) {
      const { selectIndex, val } = defaul;
      setDataIndex(selectIndex);
      setChecked({ ...val });
      SetFather({ ...val });
    }
  }, [visible]);
  const setMenu = (item = {}, data) => {
    let flag = false;
    if (data && data.categoryIdString) {
      data.categoryIdString.split(",").forEach((value) => {
        if (value === item.categoryIdString) {
          flag = true;
        }
      });
    }
    return flag;
  };
  const selectIndex = (index) => {
    if (index !== dataIndex) {
      setDataIndex(index);
    }
  };
  const saveChange = () => {
    const { fatherId, categoryName } = father;
    console.log(father, checked);
    if (checked && checked.categoryIdString) {
      onChange({
        [type]: {
          selectIndex: dataIndex,
          val: {
            categoryIdString: checked.categoryIdString,
            selectName: categoryName,
            fatherId: fatherId,
            categoryName: categoryName,
          },
        },
      });
    } else {
      onChange({
        [type]: {
          selectIndex: dataIndex,
          val: {
            categoryIdString: fatherId,
            selectName: categoryName,
            fatherId: fatherId,
            categoryName: categoryName,
          },
        },
      });
    }
  };
  const filterFont = (val, key) => {
    // if (val && val.type !== "all") {
    //   return list[dataIndex]["categoryName"] + "/" + val[key];
    // } else {
    return list[dataIndex]["categoryName"];
    // }
  };
  const filterDefault = (item = {}, data) => {
    const { categoryIdString = "" } = item;
    if (data && data.categoryIdString) {
      const changeList = data.categoryIdString.split(",");
      if (setMenu(item, data)) {
        return changeList
          .filter((val) => {
            return val !== categoryIdString;
          })
          .toString();
      } else {
        return [...changeList, item.categoryIdString].toString();
      }
    } else {
      return categoryIdString;
    }
  };
  const change = (item, key, data) => {
    setChecked({ categoryIdString: filterDefault(item, data) });
  };
  return (
    <View>
      <View className="sub-scorllView-box">
        <ScrollView
          scrollIntoView={`menu${TikIndex}`}
          scrollY
          className="sub-scorllView-left1"
        >
          {list.map((item, index) => {
            const { categoryName } = item;
            return (
              <View
                onClick={() => {
                  if (item.type === "father") {
                    setDataIndex(null);
                    setChecked({});
                    SetFather(null);
                    onChange({
                      [type]: {
                        selectIndex: -1,
                        val: {},
                      },
                    });
                  } else {
                    SetFather({ ...item, fatherId: item.categoryIdString });
                    setChecked({});
                    selectIndex(index);
                  }
                }}
                id={`menu${index}`}
                className={classNames(
                  "sub-scorll-btn",
                  ((!dataIndex || dataIndex === -1) && index === 0) ||
                    dataIndex === index
                    ? "sub-scorll-btnSelect"
                    : "sub-scorll-btnSelectFlase"
                )}
              >
                {categoryName}
              </View>
            );
          })}
        </ScrollView>
        <ScrollView scrollY className="sub-scorllView-right1">
          <View className="sub-scorllView-rightbox">
            {marginTags(
              childrenList,
              3,
              { marginRight: Taro.pxTransform(23) },
              (item, index) => {
                return (
                  <View
                    onClick={() => {
                      change(item, "categoryName", checked);
                    }}
                    className={classNames(
                      "sub-scorllView-tag",
                      setMenu(item, checked)
                        ? "sub-scorllView-tagSelect"
                        : "sub-scorllView-tagSelectNo"
                    )}
                  >
                    {item.categoryName}
                  </View>
                );
              }
            )}
          </View>
        </ScrollView>
      </View>
      <View className="sub-scorllView-btnBox public_auto">
        <View
          className="sub-scorllView-btn sub-scorllView-btnStyle1 public_center"
          onClick={() => {
            onChange({
              [type]: {
                selectIndex: -1,
                val: {
                  value: "",
                },
              },
            });
          }}
        >
          重置
        </View>
        <View
          className="sub-scorllView-btn sub-scorllView-btnStyle2 public_center"
          onClick={() => saveChange()}
        >
          确定
        </View>
      </View>
    </View>
  );
};
