/*
 * data, 轮播图数据
 * showToast 是否显示当前张数,
 * imgName 图片参数名称，当传进来的是对象时候填写
 * list 图片数组
 * current 图片当前张数
 * boxStyle 轮播图外边框样式
 * imgStyle 自定义轮播图 样式
 * bottom 底部描点样式
 * */
import React, { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { Swiper, SwiperItem, View, Image } from "@tarojs/components";
import classNames from "classnames";
import Router from "@/utils/router";
import Tarking from "@/components/tracking";
import "./index.scss";
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
    linerSuccessColor = "#108588",
    linerFallColor = "#e5e5e5",
  } = props;
  const [list, setList] = useState([]);
  const [current, setCurrent] = useState("1");
  useEffect(() => {
    data && setList(data);
  }, [data]);
  const linkTo = (item) => {
    if (typeof item === "object") {
      let {
        param = "",
        jumpUrlNew,
        jumpUrlType = "",
        jumpUrl = "",
        resourceTemplateContentId,
        payBeanCommission,
        identification,
      } = item;
      param = (param && JSON.parse(param)) || {};
      jumpUrlNew = (jumpUrlNew && JSON.parse(jumpUrlNew)) || {};
      const { weChatUrl = "" } = jumpUrlNew;
      if (jumpUrlType === "template") {
        Router({
          routerName: "wanderAround",
          args: {
            ...param,
            resourceTemplateContentId,
            payBeanCommission,
            identification,
          },
        });
      }
      if (jumpUrlType === "native" && weChatUrl) {
        Router({
          routerName: weChatUrl,
          args: {
            ...param,
          },
        });
      } else if (jumpUrlType === "h5" && jumpUrl) {
        Router({
          routerName: "webView",
          args: {
            link: jumpUrl.split("?")[0],
            url: jumpUrl.split("?")[1] || "",
          },
        });
      } else return;
    } else {
      if (item && typeof item === "string") {
        Taro.previewImage({
          urls: [item],
        });
      }
    }
  };
  //轮播图点击跳转逻辑
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
              return (
                <SwiperItem style={{ width: "100%", height: "100%" }}>
                  <Tarking
                    style={{ width: "100%", height: "100%" }}
                    args={item}
                    name={"banner"}
                  >
                    <View
                      onClick={() => linkTo(item)}
                      style={
                        imgStyle
                          ? {
                              background: `url(${
                                item[imgName] ? item[imgName] : item
                              }) no-repeat center/cover`,
                            }
                          : {
                              background: `url(${
                                item[imgName] ? item[imgName] : item
                              }) no-repeat  center/cover`,
                            }
                      }
                      key={index}
                      className={classNames(
                        "banner_box dakale_nullImage",
                        borderRadius && "bordersRadius"
                      )}
                    ></View>
                  </Tarking>
                </SwiperItem>
              );
            })}
          </Swiper>
        ) : (
          <View style={style}>
            <Tarking
              style={{ width: "100%", height: "100%" }}
              args={list[0]}
              name={"banner"}
            >
              <View
                onClick={() => linkTo(list[0])}
                style={
                  list.length > 0
                    ? imgStyle
                      ? {
                          background: `url(${
                            list[0][imgName] || list[0]
                          }) no-repeat center/cover`,
                        }
                      : {
                          background: `url(${list[0][imgName]}) no-repeat  center/cover`,
                        }
                    : {}
                }
                className={classNames(
                  "banner_box dakale_nullImage",
                  borderRadius && "bordersRadius"
                )}
              ></View>
            </Tarking>
            <View style={{ width: "100%", height: "100%" }}></View>
          </View>
        )}

        {showNear && list.length > 1 && (
          <View className="show_near" style={{ ...bottom }}>
            {list.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    background:
                      index == current - 1 ? linerSuccessColor : linerFallColor,
                  }}
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
