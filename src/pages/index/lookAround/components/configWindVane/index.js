import React, { useState, useMemo, useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import { backgroundObj } from "@/utils/utils";
import Tarking from "@/components/tracking";
export default ({ list = [], onChange }) => {
  const width = Taro.getSystemInfoSync().windowWidth / 5;
  const windowWidth = Taro.getSystemInfoSync().windowWidth;
  const [left, setLeft] = useState(0);
  useEffect(() => {
    setLeft(0);
  }, [list]);
  const memo = useMemo(() => {
    if (list.length > 0) {
      if (list.length >= 10) {
        return (
          <React.Fragment>
            <ScrollView
              onScroll={(e) => {
                const { scrollLeft, scrollWidth } = e.detail;
                if (scrollLeft === 0) {
                  setLeft(0);
                } else {
                  setLeft((scrollLeft / (scrollWidth - windowWidth)) * 50);
                }
              }}
              scrollX
              className="configWindVane_box"
            >
              <View style={{ paddingTop: Taro.pxTransform(48) }}>
                {list.map((item, index) => {
                  const {
                    image = "",
                    name = "",
                    bubbleFlag,
                    bubbleContent,
                  } = item;
                  if (index < list.length / 2) {
                    return (
                      <View
                        style={{
                          width: width,
                        }}
                        className="configWindVane_user"
                        onClick={() => onChange(item)}
                      >
                        <>
                          <Tarking args={item} name={"lookAroundConfig"}>
                            <View
                              style={backgroundObj(image)}
                              className="configWindVane_profile"
                            >
                              {bubbleFlag === "1" && bubbleContent && (
                                <View className="bubbleContent-info">
                                  {bubbleContent}
                                </View>
                              )}
                            </View>
                            <View className="configWindVane_text">{name}</View>
                          </Tarking>
                        </>
                      </View>
                    );
                  }
                  return null;
                })}
              </View>
              <View style={{ paddingTop: Taro.pxTransform(32) }}>
                {list.map((item, index) => {
                  const {
                    image = "",
                    name = "",
                    bubbleContent,
                    bubbleFlag,
                  } = item;
                  if (index >= list.length / 2) {
                    return (
                      <View
                        onClick={() => onChange(item)}
                        style={{
                          width: width,
                        }}
                        className="configWindVane_user"
                      >
                        <>
                          <Tarking args={item} name={"lookAroundConfig"}>
                            <View
                              style={backgroundObj(image)}
                              className="configWindVane_profile"
                            >
                              {bubbleFlag === "1" && bubbleContent && (
                                <View className="bubbleContent-info">
                                  {bubbleContent}
                                </View>
                              )}
                            </View>
                            <View className="configWindVane_text">{name}</View>
                          </Tarking>
                        </>
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
                if (scrollLeft === 0) {
                  setLeft(0);
                } else {
                  setLeft((scrollLeft / (scrollWidth - windowWidth)) * 50);
                }
              }}
              scrollX
              className="configWindVane_box"
            >
              {list.map((item) => {
                const {
                  image = "",
                  name = "",
                  bubbleContent,
                  bubbleFlag,
                } = item;
                return (
                  <View
                    onClick={() => onChange(item)}
                    style={{
                      width: width,
                      paddingTop: Taro.pxTransform(48),
                    }}
                    className="configWindVane_user"
                  >
                    <>
                      <Tarking args={item} name={"lookAroundConfig"}>
                        <View
                          style={backgroundObj(image)}
                          className="configWindVane_profile"
                        >
                          {bubbleFlag === "1" && bubbleContent && (
                            <View className="bubbleContent-info">
                              {bubbleContent}
                            </View>
                          )}
                        </View>
                        <View className="configWindVane_text">{name}</View>
                      </Tarking>
                    </>
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
