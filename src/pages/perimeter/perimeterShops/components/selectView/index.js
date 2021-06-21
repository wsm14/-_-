import React, { useEffect, useState, useMemo } from "react";
import { View, Image, Text, ScrollView } from "@tarojs/components";
import { useReady } from "@tarojs/taro";
import classNames from "classnames";
import Taro from "@tarojs/taro";
import "./index.scss";
import { getDom } from "@/common/utils";
import { Children } from "react";
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

export default (props) => {
  const { data, onClose, onConfirm, selectData, visible } = props;
  const [loadData, setLoadData] = useState([]);
  const [searchIndex, setIndex] = useState(0);
  const [distance, setDistance] = useState(0);
  const [heightArr, setHeightList] = useState([]);
  const [useData, setUseData] = useState({
    limit: {},
    smartSiftType: [],
    categoryIds: {},
    configWindVaneId: [],
    consumptionScope: {},
    childType: {},
  });

  useEffect(() => {
    setLoadData(data);
  }, [data]);
  useEffect(() => {
    setTimeout(() => selectHeight(), 1);
  }, [loadData]);
  useEffect(() => {
    if (visible) {
      setUseData(selectData);
    }
  }, [visible]);
  const onChange = (items, item) => {
    const { childList = [] } = items;
    const { key, value, children, only, type } = item;
    if (children === true) {
      if (Object.keys(useData[type]).length !== 0) {
        if (useData[type][key] === items[key]) {
          setUseData({
            ...useData,
            childType: {},
            [type]: {},
          });
          setLoadData(loadData.splice(3, 1));
        } else {
          setUseData({
            ...useData,
            childType: {},
            [type]: {
              ...items,
            },
          });
          setLoadData(
            loadData.splice(3, 1, {
              type: "childType",
              title: "经营品类",
              only: true,
              children: null,
              key: "categoryName",
              value: "categoryIdString",
              list: childList,
            })
          );
        }
      } else {
        setUseData({
          ...useData,
          childType: {},
          [type]: {
            ...items,
          },
        });
        setLoadData(
          loadData.splice(3, 0, {
            type: "childType",
            title: "经营品类",
            only: true,
            children: null,
            key: "categoryName",
            value: "categoryIdString",
            list: childList,
          })
        );
      }
      setLoadData(data);
    } else if (children === null && only) {
      if (Object.keys(useData[type]).length > 0) {
        setUseData({
          ...useData,
          [type]: useData[type][value] === items[value] ? {} : { ...items },
        });
      } else {
        setUseData({
          ...useData,
          [type]: {
            ...items,
          },
        });
      }
    } else if (children === null && !only) {
      if (!useData[type] || useData[type].length === 0) {
        setUseData({
          ...useData,
          [type]: [{ ...items }],
        });
      } else {
        if (
          useData[type]
            .map((val) => {
              return val[value];
            })
            .includes(items[value])
        ) {
          setUseData({
            ...useData,
            [type]: useData[type].filter((val) => {
              return val[value] !== items[value];
            }),
          });
        } else {
          setUseData({
            ...useData,
            [type]: [...useData[type], { ...items }],
          });
        }
      }
    }
  };
  const computedDom = (index) => {
    setIndex(index);
  };
  const selectHeight = () => {
    let arr = [];
    let h = 0;
    const query = Taro.createSelectorQuery();
    query.selectAll(".selectTemplate_right_tagMargin").boundingClientRect();
    query.exec(function (res) {
      res[0].forEach((item) => {
        h += item.height;
        arr.push(h);
      });
      setHeightList(arr);
    });
  };
  const scrollEvent = (event) => {
    if (heightArr.length == 0) {
      return;
    }
    let scrollTop = event.detail.scrollTop;
    if (scrollTop >= distance) {
      //页面向上滑动
      //如果右侧当前可视区域最底部到顶部的距离 超过 当前列表选中项距顶部的高度（且没有下标越界），则更新左侧选中项
      if (
        searchIndex + 1 < heightArr.length &&
        scrollTop >= heightArr[searchIndex]
      ) {
        setIndex(searchIndex + 1);
      }
    } else {
      //页面向下滑动
      //如果右侧当前可视区域最顶部到顶部的距离 小于 当前列表选中的项距顶部的高度，则更新左侧选中项
      if (searchIndex - 1 >= 0 && scrollTop < heightArr[searchIndex - 1]) {
        setIndex(searchIndex - 1);
      }
    }
    //更新到顶部的距离
    setDistance(scrollTop);
  };

  const reload = () => {
    setUseData({
      limit: {},
      smartSiftType: [],
      categoryIds: {},
      configWindVaneId: [],
      consumptionScope: {},
      childType: {},
    });
    if (loadData.length === 6) {
      setLoadData(
        loadData.filter((item) => {
          return item.type !== "childType";
        })
      );
    }
  };
  const confirm = () => {
    onConfirm(useData, loadData);
    onClose();
  };
  return (
    <View className={classNames("selectTemplate_box animated")}>
      <View className="selectTemplate_layer  animated fadeInUp">
        <View className="selectTemplate_layer_title">
          商家筛选
          <View
            className="closeIcon home_close"
            onClick={() => onClose()}
          ></View>
        </View>
        <View className="selectTemplate_layer_content">
          <ScrollView className="selectTemplate_content_left" scrollY>
            {loadData.map((item, index) => {
              return (
                <View
                  onClick={() => {
                    computedDom(index);
                  }}
                  className={classNames(
                    `selectTemplate_left_tagBox  public_center selectTemplate_left_tagBox${index}`,
                    searchIndex === index
                      ? "selectTemplate_left_color1"
                      : "selectTemplate_left_color2"
                  )}
                >
                  {item.title}
                </View>
              );
            })}
          </ScrollView>
          <ScrollView
            className="selectTemplate_content_right"
            scrollIntoView={`selectTemplate_right_tagMargin${searchIndex}`}
            scrollY
            scrollTop={distance}
          >
            <View className="selectTemplate_right_tagBox">
              {loadData.map((item, index) => {
                const { title, key, value, list, only, type } = item;
                return (
                  <View
                    className={classNames(
                      "selectTemplate_right_tagMargin",
                      `selectTemplate_right_tagMargin${index}`
                    )}
                  >
                    <View
                      id={`selectTemplate_right_tagMargin${index}`}
                      className={classNames(
                        "selectTemplate_right_title",
                        `selectTemplate_right_tagMargin${index}`
                      )}
                    >
                      {" "}
                      {title}
                    </View>
                    <View className="selectTemplate_right_tagCenter">
                      {marginTags(
                        list,
                        3,
                        {
                          marginRight: Taro.pxTransform(24),
                        },
                        (items, index) => {
                          return (
                            <View
                              className={classNames(
                                "selectTemplate_right_tag public_center",
                                !only
                                  ? useData[type]
                                      .map((val) => {
                                        return val[value];
                                      })
                                      .includes(items[value])
                                    ? "selectTemplate_right_color2"
                                    : "selectTemplate_right_color1"
                                  : useData[type][key] === items[key]
                                  ? "selectTemplate_right_color2"
                                  : "selectTemplate_right_color1"
                              )}
                              onClick={() => onChange(items, item)}
                            >
                              {items[key]}
                            </View>
                          );
                        }
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
        <View className="selectTemplate_layer_bottom">
          <View
            onClick={() => reload()}
            className="selectTemplate_layer_btnReload"
          >
            重置
          </View>
          <View
            onClick={() => confirm()}
            className="selectTemplate_layer_btnOk"
          >
            确定
          </View>
        </View>
      </View>
    </View>
  );
};
