import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { getBusinessHub } from "@/server/common";
import { Image, View, ScrollView } from "@tarojs/components";
import classNames from "classnames";
import "./index.scss";
const marginTags = (list = [], num, style, components) => {
  return list.map((item, index) => {
    return (
      <View className="inline_block" style={(index + 1) % num !== 0 && style}>
        {components(item, index)}
      </View>
    );
  });
};
export default (props) => {
  const {
    selectData = "",
    visible,
    onClose,
    onShow,
    onSuccess,
    httpData,
  } = props;
  const [select, setSelect] = useState(-1);
  const [selectList, setSelectList] = useState([
    { label: "所在商圈", val: 0, select: "", name: "businessHubIds" },
    { label: "促销优惠", val: 1, select: "", name: "smartSiftType" },
    { label: "人均消费", val: 2, select: "", name: "consumptionScope" },
  ]);
  const [businessIndex, setBusinessIndex] = useState(0);
  const [businessHubList, setBusinessHubList] = useState([]);
  const [specailList, setSpecail] = useState([
    { value: "markFlag", description: "捡豆打卡" },
    { value: "special", description: "特价活动" },
    { value: "reduce", description: "优惠券" },
  ]);
  const [priceList, setPriceList] = useState([
    { value: "0-50", description: "50以下" },
    { value: "50-100", description: "50-100" },
    { value: "100-200", description: "100-200" },
    { value: "200-500", description: "200-500" },
    { value: "500-1000", description: "500-1000" },
    { value: "1000-2000", description: "1000-2000" },
    { value: "2000", description: "2000以上" },
  ]);
  const [selectHab, setSelectHab] = useState("");
  const [selectSpecail, setSelectSpecail] = useState("");
  const [selectPrice, setSelectPrice] = useState("");

  useEffect(() => {
    if (businessHubList.length === 0) {
      getBusinessHub({}, (res) => {
        const { businessHubList } = res;
        setBusinessHubList(businessHubList);
      });
    }
  }, []);
  useEffect(() => {
    const {
      businessHubIds = "",
      consumptionScope = "",
      smartSiftType = "",
    } = httpData;
    if (visible) {
      setSelectHab(businessHubIds);
      setSelectSpecail(smartSiftType);
      setSelectPrice(consumptionScope);
    }
  }, [visible]);
  const selectFn = (val) => {
    if (select === val) {
      onClose();
      setSelect(-1);
    } else {
      setSelect(val);
      onShow();
    }
  };

  const selectHabList = (index) => {
    if (index === businessIndex) {
      return;
    } else {
      setBusinessIndex(index);
    }
  };
  const selectHabName = (val) => {
    if (val === selectHab) {
      return;
    } else {
      setSelectHab(val);
    }
  };
  const selectPriceFn = (val) => {
    if (val === selectPrice) {
      return;
    } else {
      setSelectPrice(val);
    }
  };
  const selectSpecailFn = (val) => {
    if (val === selectSpecail) {
      return;
    } else {
      setSelectSpecail(val);
    }
  };

  const reload = () => {
    switch (select) {
      case 0:
        setSelectHab("");
        break;
      case 1:
        setSelectSpecail("");
        break;
      case 2:
        setSelectPrice("");
        break;
    }
  };
  const handleSuccess = () => {
    switch (select) {
      case 0:
        return {
          businessHubIds: selectHab,
        };
        break;
      case 1:
        return {
          smartSiftType: selectSpecail,
        };
        break;
      case 2:
        return {
          consumptionScope: selectPrice,
        };
        break;
    }
    setSelect(-1);
  };
  const selectIndex = {
    0: (
      <View>
        <ScrollView scrollY className="bissbules_left">
          {businessHubList.map((item, index) => {
            return (
              <View
                onClick={() => {
                  selectHabList(index);
                }}
                className={classNames(
                  "bissbules_box",
                  businessIndex === index
                    ? "bissbules_box_color1"
                    : "bissbules_box_color2"
                )}
              >
                {item.districtName}
              </View>
            );
          })}
        </ScrollView>
        <ScrollView scrollY className="bissbules_right">
          <View className="bissbules_right_padding">
            {businessHubList[businessIndex] &&
              marginTags(
                [
                  {
                    businessHubIdString: "",
                    businessHubName: "全部商圈",
                  },
                  ...businessHubList[businessIndex].businessHubList,
                ],
                3,
                { marginRight: Taro.pxTransform(24), display: "inline-block" },
                (item, index) => {
                  return (
                    <View
                      onClick={() => {
                        selectHabName(item.businessHubIdString);
                      }}
                      className={classNames(
                        "bissbules_box font_hide",
                        selectHab === item.businessHubIdString
                          ? "bissbules_box_color1"
                          : "bissbules_box_color2"
                      )}
                    >
                      {item.businessHubName}
                    </View>
                  );
                }
              )}
          </View>
        </ScrollView>
      </View>
    ),
    1: (
      <ScrollView scrollY className="other_box">
        {marginTags(
          [{ value: "", description: "全部" }, ...specailList],
          4,
          { marginRight: Taro.pxTransform(23), display: "inline-block" },
          (item, index) => {
            return (
              <View
                onClick={() => {
                  selectSpecailFn(item.value);
                }}
                className={classNames(
                  "bissbules_box font_hide",
                  selectSpecail === item.value
                    ? "bissbules_box_color1"
                    : "bissbules_box_color2"
                )}
              >
                {item.description}
              </View>
            );
          }
        )}
      </ScrollView>
    ),
    2: (
      <ScrollView scrollY className="other_box">
        {marginTags(
          [{ value: "", description: "全部" }, ...priceList],
          4,
          { marginRight: Taro.pxTransform(23), display: "inline-block" },
          (item, index) => {
            return (
              <View
                onClick={() => {
                  selectPriceFn(item.value);
                }}
                className={classNames(
                  "bissbules_box font_hide",
                  selectPrice === item.value
                    ? "bissbules_box_color1"
                    : "bissbules_box_color2"
                )}
              >
                {item.description}
              </View>
            );
          }
        )}
      </ScrollView>
    ),
  }[select];

  return (
    <View
      className={classNames(
        select === -1 && !visible ? "select_little_box" : "select_box"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
        setSelect(-1);
      }}
    >
      <View
        className="select_box_filter"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {selectList.map((item, index) => {
          console.log(httpData[item.name]);
          return (
            <View
              onClick={(e) => {
                selectFn(item.val);
                e.stopPropagation();
              }}
              className={classNames(
                httpData[item.name] && select === -1
                  ? "select_has_data"
                  : item.val === select
                  ? "select_box_style select_box_checked"
                  : "select_box_style select_box_noChecked"
              )}
            >
              {item.label}
            </View>
          );
        })}
      </View>
      {select !== -1 && visible && (
        <View
          className="select_box_tags"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <View className="select_box_content">{selectIndex}</View>
          <View className="select_box_btn">
            <View
              className="select_btn_box1 public_center"
              onClick={() => reload()}
            >
              重置
            </View>
            <View
              className="select_btn_box2 public_center"
              onClick={() => {
                onSuccess(handleSuccess());
              }}
            >
              确定
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
