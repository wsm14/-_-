import React, { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, PickerView, PickerViewColumn } from "@tarojs/components";
import cityJson from "./../../../cityJson";
import "./index.scss";

const nowValue = {
  data: {
    provinceCode: "11",
    provinceName: "北京",
    cityCode: "1101",
    cityName: "北京市",
    districtCode: "110101",
    districtName: "东城区",
  },
  value: [0, 0, 0], // 数据的index 回显用
  text: [`北京`, `北京市`, `东城区`], // 数据的text 回显用
};

const filterCity = () => {
  return cityJson
    .filter((i) => i.level === "1")
    .map((i) => ({
      ...i,
      value: i.id,
      label: i.name,
      children: cityJson
        .filter((c) => c.pid === i.id)
        .map((d) => ({
          ...d,
          value: d.id,
          label: d.name,
          children: cityJson
            .filter((g) => g.pid === d.id)
            .map((f) => ({
              ...f,
              label: f.name,
              value: f.id,
            })),
        })),
    }));
};

const CityPicker = (props) => {
  const { onSelect = () => {}, inValue = false, cityFlag = true } = props;

  // 选择后的数据
  const [cityIndex, setCityIndex] = useState(nowValue);

  // 省数据
  const citySelect = filterCity().filter((item) => item.level === "1");

  // 市数据
  const cityDataNew = citySelect[cityIndex.value[0]].children;

  // 区数据
  const areaDataNew = cityDataNew[cityIndex.value[1]].children;

  useEffect(() => {
    // 初始赋值
    if (inValue) {
      setCityIndex(inValue);
    } else {
      const cityP = citySelect[0] || {};
      const cityC = cityDataNew[0] || {};
      const cityA = areaDataNew[0] || {};
      // 默认值
      const cityValue = {
        data: {
          provinceCode: cityP.value,
          provinceName: cityP.label,
          cityCode: cityC.value,
          cityName: cityC.label,
          districtCode: cityA.value,
          districtName: cityA.label,
        },
        value: [0, 0, 0], // 数据的index 回显用
        text: [cityP.label, cityC.label, cityA.label], // 数据的text 回显用
      };
      console.log(cityValue);
      onSelect(cityValue);
      setCityIndex(cityValue);
    }
  }, [inValue]);

  // 选择器变化
  const saveDataCity = (val) => {
    const { value } = cityIndex;
    let aKey = val[0];
    let bKey = val[1];
    let cKey = val[2];
    let arrkey = val;
    if (value[0] != aKey) {
      bKey = 0;
      cKey = 0;
      arrkey = [aKey, bKey, cKey];
    }
    if (value[0] == aKey && value[1] != bKey) {
      cKey = 0;
      arrkey = [aKey, bKey, cKey];
    }
    // 获取数据中省市区的对象值
    const pValue = citySelect[aKey];
    const cValue = pValue.children[bKey];
    const aValue = cValue.children[cKey];

    // 获取数据中省市区的对象值
    const provinceName = pValue.label;
    const cityName = cValue.label;
    const districtName = aValue.label;
    const cityPorps = {
      // 数据的index 提交
      data: {
        provinceCode: pValue.value,
        provinceName,
        cityCode: cValue.value,
        cityName,
        districtCode: aValue.value,
        districtName,
      },
      value: arrkey, // 数据的index 回显用
      text: [provinceName, cityName, districtName], // 数据的text 回显用
    };
    // 选择时间储存
    setCityIndex(cityPorps);
    onSelect(cityPorps);
  };
  console.log(cityFlag);
  return (
    <View className="cityPickerView_Block">
      <PickerView
        value={cityIndex.value}
        indicatorClass="cityPickerView_indicator"
        className="cityPickerView_tool"
        onChange={(e) => {
          console.log(e.detail.value);
          saveDataCity(e.detail.value);
        }}
      >
        <PickerViewColumn>
          {citySelect.map((item, i) => {
            return (
              <View
                className={
                  "cityPickerView_Item" +
                  (cityIndex.value[0] == i ? " select" : "")
                }
              >
                {item.label}
              </View>
            );
          })}
        </PickerViewColumn>
        <PickerViewColumn>
          {cityDataNew.map((item, i) => {
            return (
              <View
                className={
                  "cityPickerView_Item" +
                  (cityIndex.value[1] == i ? " select" : "")
                }
              >
                {item.label}
              </View>
            );
          })}
        </PickerViewColumn>
        {cityFlag && (
          <PickerViewColumn>
            {areaDataNew.map((item, i) => {
              return (
                <View
                  className={
                    "cityPickerView_Item" +
                    (cityIndex.value[2] == i ? " select" : "")
                  }
                >
                  {item.label}
                </View>
              );
            })}
          </PickerViewColumn>
        )}
      </PickerView>
    </View>
  );
};

export default CityPicker;
