import React, { useState, useEffect, useRef } from "react";
import {
  Canvas,
  CoverView,
  Swiper,
  SwiperItem,
  Text,
  View,
  Image,
} from "@tarojs/components";
import QR from "wxmp-qrcode";
import "./../index.scss";
import classNames from "classnames";
import { backgroundObj, filterWeek } from "@/common/utils";
import drawQrcode from "weapp-qrcode";
import Taro from "@tarojs/taro";

export default (props) => {
  const { data, fn } = props;
  const [orderResult, setOrderResult] = useState({});
  const [current, setCurrent] = useState(0);
  const [list, setList] = useState([]);
  console.log(data);
  const qrwh = (304 / 750) * Taro.getSystemInfoSync().windowWidth;
  useEffect(() => {
    const { orderGoodsVerifications } = data;
    setOrderResult(data);
    if (orderGoodsVerifications && Array.isArray(orderGoodsVerifications)) {
      setList(orderGoodsVerifications);
    }
  }, [data]);
  const { merchantImg, goodsName } = orderResult;
  useEffect(() => {
    setTimeout(() => {
      list.forEach((item, index) => {
        const { verificationUrl } = item;
        if (item.status === "0") {
          drawQrcode({
            width: qrwh,
            height: qrwh,
            background: "#FFFFFF",
            canvasId: `canvas${index}`,
            text: verificationUrl,
          });
        }
      });
    }, 1);
  }, [list]);
  const setCode = () => {
    return (
      <View className="codeBox public_center">
        <Swiper
          current={current}
          onChange={(e) => {
            const {
              detail: { current },
            } = e;
            setCurrent(current);
          }}
          style={{ width: qrwh, height: qrwh }}
        >
          {list.map((item, index) => {
            return (
              <SwiperItem>
                {item.status === "1" ? (
                  <View
                    style={{ width: qrwh, height: qrwh }}
                    className="code_onloader bgCode public_center"
                  ></View>
                ) : (
                  <Canvas
                    id={"canvas" + index}
                    style={{ width: qrwh, height: qrwh }}
                    canvasId={"canvas" + index}
                  ></Canvas>
                )}
              </SwiperItem>
            );
          })}
        </Swiper>

        <View
          onClick={() => onChangeLeft()}
          className="code_left codeLeft_icon codePosition"
        ></View>
        <View
          onClick={() => onChangeRight()}
          className="code_right codeLeft_right codePosition"
        ></View>
      </View>
    );
  };
  const onChangeLeft = () => {
    if (current === 0) {
      return setCurrent(list.length - 1);
    }
    return setCurrent(current - 1);
  };
  const onChangeRight = () => {
    if (current === list.length - 1) {
      return setCurrent(0);
    }
    return setCurrent(current + 1);
  };

  return (
    <View className="paySuccess_box">
      <View className="paySuccess_cover">
        <Image
          style={{ width: "100%", height: "100%" }}
          src={merchantImg}
        ></Image>
      </View>
      <View className="paySuccess_goodName">{goodsName}</View>
      <View className="paySuccess_count">数量:{list.length}</View>
      {setCode()}
      {list.length > 0 && (
        <View
          style={
            list[current]["status"] === "1"
              ? { color: "#CCCCCC", textDecoration: "line-through" }
              : {}
          }
          className={classNames("color1 font24 code_num")}
        >
         券码：{list[current]["verificationCode"]}
        </View>
      )}
      <View className="public_center color1 font24 code_count">
        {current + 1 + "/" + list.length}{" "}
      </View>
      <View
        onClick={() => fn && fn()}
        className="public_center font24 color2 code_onRead"
      >
        <View className="onReadly_icon onReadly_iconBox"></View>
        如果券码不显示，点这里刷新
      </View>
      <View className='pay_goLiner'></View>
    </View>
  );
};
