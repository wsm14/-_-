import React, { useState, useEffect, Fragment } from "react";
import Taro from "@tarojs/taro";
import { View, Text, ScrollView } from "@tarojs/components";
import classNames from "classnames";
import { getDom } from "@/common/utils";
export default ({ data = [], onChange, defaul, visible }) => {
  const { list = [], type } = data;
  const [dataIndex, setDataIndex] = useState(null);
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
      console.log(defaul);
      const { selectIndex, val } = defaul;
      setDataIndex(selectIndex);
      setChecked({ ...val });
    }
  }, [visible]);
  const setMenu = (item = {}, val, key) => {
    let flag = false;
    if (val && val[key] && val[key].includes(item[key])) {
      return true;
    } else return false;
  };
  const selectIndex = (index) => {
    if (index !== dataIndex) {
      setDataIndex(index);
    }
  };
  const filterFont = (val, key) => {
    // if (val && val.type !== "all") {
    //   return list[dataIndex]["categoryName"] + "/" + val[key];
    // } else {
    return list[dataIndex]["categoryName"];
    // }
  };
  const filterDefault = (item = {}) => {
    const { categoryIdString = "" } = item;
    const { fatherId } = checked;
    if (fatherId && checked.type === "all") {
      return categoryIdString;
    } else {
      if (checked && checked.categoryIdString) {
        const changeList = checked.categoryIdString.split(",");
        if (changeList.includes(categoryIdString)) {
          return changeList
            .filter((val) => {
              return val !== categoryIdString;
            })
            .toString();
        } else {
        }
      } else {
        return categoryIdString;
      }
    }
  };
  const change = (item, key) => {
    const { fatherId, categoryIdString } = item;
    if (fatherId && item.type === "all") {
      setChecked(item);
      onChange({
        [type]: {
          selectIndex: dataIndex,
          val: { ...item, selectName: filterFont(item, key) },
        },
      });
    } else {
      setChecked(() => {
        onChange({
          [type]: {
            selectIndex: dataIndex,
            val: {
              categoryIdString: filterDefault(item),
              selectName: filterFont(item, key),
            },
          },
        });
        return { categoryIdString: filterDefault(item) };
      });
    }
  };
  return (
    <View className="sub-scorllView-box">
      <ScrollView
        scrollIntoView={`menu${TikIndex}`}
        scrollY
        className="sub-scorllView-left"
      >
        {list.map((item, index) => {
          const { categoryName } = item;
          return (
            <View
              onClick={() => {
                if (item.type === "father") {
                  setChecked({});
                  onChange({
                    [type]: {
                      selectIndex: -1,
                      val: {},
                    },
                  });
                } else {
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
      <ScrollView scrollY className="sub-scorllView-right">
        <View className="sub-scorllView-rightbox">
          {marginTags(
            childrenList,
            3,
            { marginRight: Taro.pxTransform(23) },
            (item, index) => {
              const { fatherId } = item;
              return (
                <View
                  onClick={() => {
                    change(item, "categoryName");
                  }}
                  className={classNames(
                    "sub-scorllView-tag",
                    fatherId
                      ? fatherId === checked.fatherId
                        ? "sub-scorllView-tagSelect"
                        : "sub-scorllView-tagSelectNo"
                      : setMenu(item, checked, "categoryIdString")
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
  );
};
