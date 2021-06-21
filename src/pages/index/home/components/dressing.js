import React, { useEffect, useState, useMemo } from "react";
import { View, Image, Text } from "@tarojs/components";
import { useReady } from "@tarojs/taro";
import classNames from "classnames";
import Taro from "@tarojs/taro";
import "./../index.scss";
const marginTags = (list, num, style, components) => {
  return list.map((item, index) => {
    return (
      <View style={(index + 1) % num !== 0 && style}>
        {components(item, index)}
      </View>
    );
  });
};

export default (props) => {
  const {
    distance = "",
    promotionTypeList,
    distanceList,
    categoryList,
    promotionType = "",
    categoryIds = "",
    onClose,
    onReload,
    onConfirm,
    visible
  } = props;
  useEffect(() => {
    setLoadData({
      loadDistance: distance,
      loadPromotionType: promotionType,
      loadCategoryIds: categoryIds,
    });
  }, []);
  const [loadData, setLoadData] = useState({
    loadDistance: "",
    loadPromotionType: "",
    loadCategoryIds: [],
  });

  const { loadDistance, loadPromotionType, loadCategoryIds } = loadData;
  const reload = () => {
    setLoadData({
      loadDistance: "",
      loadPromotionType: "",
      loadCategoryIds: [],
    });
    onReload({
      loadDistance: "",
      loadPromotionType: "",
      loadCategoryIds: [],
    });
    onClose();
  };

  const confirm = () => {
    onConfirm(loadData);
    onClose();
  };
  return (
    <View className={classNames("dressing_box animated")}>
      <View className="dressing_layer  animated fadeInUp">
        <View className="dressing_layer_title">
          商家筛选
          <View
            className="closeIcon home_close"
            onClick={() => onClose()}
          ></View>
        </View>
        <View className="dressing_layer_content">
          <View className="dressing_layer_tagTitle">附近距离</View>
          <View className="dressing_layer_tagContent">
            {marginTags(
              distanceList,
              4,
              { marginRight: Taro.pxTransform(23) },
              (item, index) => {
                return (
                  <View
                    onClick={() => {
                      setLoadData({
                        ...loadData,
                        loadDistance: item.value,
                      });
                    }}
                    className={classNames(
                      "dressing_layer_tahFont",
                      item.value === loadDistance
                        ? "dressing_layer_checked"
                        : "dressing_layer_noChecked"
                    )}
                  >
                    {item.description}
                  </View>
                );
              }
            )}
          </View>

          <View className="dressing_layer_tagTitle">促销优惠</View>
          <View className="dressing_layer_tagContent">
            {marginTags(
              promotionTypeList,
              4,
              { marginRight: Taro.pxTransform(23) },
              (item, index) => {
                return (
                  <View
                    onClick={() => {
                      setLoadData({
                        ...loadData,
                        loadPromotionType: item.value,
                      });
                    }}
                    className={classNames(
                      "dressing_layer_tahFont",
                      item.value === loadPromotionType
                        ? "dressing_layer_checked"
                        : "dressing_layer_noChecked"
                    )}
                  >
                    {item.description}
                  </View>
                );
              }
            )}
          </View>
          <View className="dressing_layer_tagTitle">全部类型</View>
          <View className="dressing_layer_tagContent">
            {marginTags(
              categoryList,
              4,
              { marginRight: Taro.pxTransform(23) },
              (item, index) => {
                return (
                  <View
                    onClick={() => {
                      if (loadCategoryIds.includes(item.categoryIdString)) {
                        setLoadData({
                          ...loadData,
                          loadCategoryIds: [
                            ...loadData.loadCategoryIds.filter(
                              (items) => items !== item.categoryIdString
                            ),
                          ],
                        });
                      } else {
                        setLoadData({
                          ...loadData,
                          loadCategoryIds: [
                            ...loadData.loadCategoryIds,
                            item.categoryIdString,
                          ],
                        });
                      }
                    }}
                    className={classNames(
                      "dressing_layer_tahFont",
                      loadCategoryIds.includes(item.categoryIdString)
                        ? "dressing_layer_checked"
                        : "dressing_layer_noChecked"
                    )}
                  >
                    {item.categoryName}
                  </View>
                );
              }
            )}
          </View>
        </View>
        <View className="dressing_layer_bottom">
          <View onClick={() => reload()} className="dressing_layer_btnReload">
            重置
          </View>
          <View onClick={() => confirm()} className="dressing_layer_btnOk">
            确定
          </View>
        </View>
      </View>
    </View>
  );
};
