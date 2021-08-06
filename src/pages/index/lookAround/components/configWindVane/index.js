import React, { useState, useMemo } from "react";
import Taro from "@tarojs/taro";
import { View, ScrollView, Image } from "@tarojs/components";
import { backgroundObj } from "@/common/utils";
export default ({ list = [], onChange }) => {
  const width = Taro.getSystemInfoSync().windowWidth / 5;
  const windowWidth = Taro.getSystemInfoSync().windowWidth;
  const [left, setLeft] = useState(0);
  const memo = useMemo(() => {
    if (list.length > 0) {
      if (list.length >= 10) {
        return (
          <React.Fragment>
            <ScrollView
              onScroll={(e) => {
                const { scrollLeft, scrollWidth } = e.detail;
                setLeft((scrollLeft / (scrollWidth - windowWidth)) * 50);
              }}
              scrollX
              className="configWindVane_box"
            >
              <View>
                {list.map((item, index) => {
                  const { image = "", name = "" } = item;
                  if (index < list.length / 2) {
                    return (
                      <View
                        style={{
                          width: width,
                        }}
                        className="configWindVane_user"
                        onClick={() => onChange(item)}
                      >
                        <View
                          style={backgroundObj(image)}
                          className="configWindVane_profile"
                        ></View>
                        <View className="configWindVane_text">{name}</View>
                      </View>
                    );
                  }
                  return null;
                })}
              </View>
              <View>
                {list.map((item, index) => {
                  const { image = "", name = "" } = item;
                  if (index >= list.length / 2) {
                    return (
                      <View
                        onClick={() => onChange(item)}
                        style={{
                          marginTop: Taro.pxTransform(32),
                          width: width,
                        }}
                        className="configWindVane_user"
                      >
                        <View
                          style={backgroundObj(image)}
                          className="configWindVane_profile"
                        ></View>
                        <View className="configWindVane_text">{name}</View>
                      </View>
                    );
                  }
                  return null;
                })}
              </View>
            </ScrollView>
            {list.length > 10 && (
              <View className="lookAround_category_liner">
                <View
                  style={{ left: left + "%" }}
                  className="slider-inside"
                ></View>
              </View>
            )}
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment>
            <ScrollView
              onScroll={(e) => {
                const { scrollLeft, scrollWidth } = e.detail;
                setLeft((scrollLeft / (scrollWidth - windowWidth)) * 50);
              }}
              scrollX
              className="configWindVane_box"
            >
              {list.map((item) => {
                const { image = "", name = "" } = item;
                return (
                  <View
                    onClick={() => onChange(item)}
                    style={{
                      width: width,
                    }}
                    className="configWindVane_user"
                  >
                    <View
                      style={backgroundObj(image)}
                      className="configWindVane_profile"
                    ></View>
                    <View className="configWindVane_text">{name}</View>
                  </View>
                );
              })}
            </ScrollView>
            {list.length > 5 && (
              <View className="lookAround_category_liner">
                <View
                  style={{ left: left + "%" }}
                  className="slider-inside"
                ></View>
              </View>
            )}
          </React.Fragment>
        );
      }
    } else {
      return null;
    }
  }, [list, left]);
  return memo;
};
