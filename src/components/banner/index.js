/*
 * style 轮播图框样式,
 * data, 轮播图数据
 * showToast 是否显示当前张数,
 * imgName 图片参数名称
 * list 图片数组
 * current 图片当前张数
 *
 * */
import React, { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { Swiper, SwiperItem, View, Image } from "@tarojs/components";
import classNames from "classnames";
import "./index.scss";
import { navigateTo } from "@/common/utils";
export default (props) => {
  const {
    style = {
      width: "100%",
      height: "100%",
    },
    data,
    showToast,
    imgName,
    boxStyle,
    imgStyle,
    showNear,
    borderRadius,
    bottom = {},
  } = props;
  const [list, setList] = useState([]);
  const [current, setCurrent] = useState("1");
  useEffect(() => {
    data && setList(data);
  }, [data]);
  if (list.length > 0) {
    return (
      <View style={!boxStyle ? { position: "relative" } : { ...boxStyle }}>
        {list.length > 1 ? (
          <Swiper
            style={style}
            circular
            autoplay
            onChange={(e) => {
              setCurrent(e.detail.current + 1);
            }}
          >
            {list.map((item, index) => {
              const { jumpUrl } = item;
              return (
                <SwiperItem style={{ width: "100%", height: "100%" }}>
                  <View
                    // onClick={() =>{if(jumpUrl){navigateTo(`/pages/share/webView/index?link=${jumpUrl}`)}}}
                    style={
                      imgStyle
                        ? {
                            background: `url(${
                              item[imgName] ? item[imgName] : item
                            }) no-repeat`,
                            backgroundSize: "100% 100%",
                          }
                        : {
                            background: `url(${
                              item[imgName] ? item[imgName] : item
                            }) no-repeat center center/contain`,
                          }
                    }
                    key={index}
                    className={classNames(
                      "banner_box dakale_nullImage",
                      borderRadius && "bordersRadius"
                    )}
                  ></View>
                </SwiperItem>
              );
            })}
          </Swiper>
        ) : (
          <View style={style}>
            <View style={{ width: "100%", height: "100%" }}>
              <View
                style={
                  list.length > 0
                    ? imgStyle
                      ? {
                          background: `url(${
                            list[0][imgName] || list[0]
                          }) no-repeat center/cover`,
                        }
                      : {
                          background: `url(${list[0][imgName]}) no-repeat center center/contain`,
                        }
                    : {}
                }
                className={classNames(
                  "banner_box dakale_nullImage",
                  borderRadius && "bordersRadius"
                )}
              ></View>
            </View>
          </View>
        )}

        {showNear && list.length > 1 && (
          <View className="show_near" style={{ ...bottom }}>
            {list.map((item, index) => {
              return (
                <View
                  key={index}
                  className={classNames(
                    index == current - 1
                      ? "show_near_linerTrue"
                      : "show_near_false"
                  )}
                ></View>
              );
            })}
          </View>
        )}
        {showToast && list.length > 1 && (
          <View className="banner_toast">
            <View className="banner_tags">{current + "/" + data.length}</View>
          </View>
        )}
      </View>
    );
  } else return null;
};
