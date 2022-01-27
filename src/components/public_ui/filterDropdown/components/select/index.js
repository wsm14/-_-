import React, { useState, useEffect, Fragment } from "react";
import Taro from "@tarojs/taro";
import { View, Text, ScrollView } from "@tarojs/components";
import classNames from "classnames";

export default ({
  data = [],
  onChange,
  defaul,
  visible,
  configUserLevelInfo,
}) => {
  const { list = [], type } = data;
  const { shareCommission } = configUserLevelInfo;
  const [checked, setChecked] = useState({});
  useEffect(() => {
    if (visible === 2) {
      const { selectIndex, val } = defaul;
      console.log(val);
      setChecked({ ...val });
    }
  }, [visible]);
  const change = (item, key) => {
    setChecked(item);
    onChange({
      [type]: {
        val: { ...item, selectName: item[key] },
      },
    });
  };
  return (
    <View className="sub-scorllView-box">
      <ScrollView scrollY className="sub-scorllView-own">
        <View className="sub-scorllView-ownPad">
          {list.map((item, index) => {
            if (index === 2 && !shareCommission) {
              return null;
            }
            return (
              <View
                onClick={() => {
                  change(item, "name");
                }}
                className={classNames(
                  ".sub-ownPad-text",
                  ((!checked || (checked && !checked.value)) && index === 0) ||
                    item.value === checked.value
                    ? "sub-ownPad-checked"
                    : "sub-ownPad-noChecked"
                )}
              >
                {item.description}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};
