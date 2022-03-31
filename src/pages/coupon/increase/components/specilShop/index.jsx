/*券的为你推荐*/
import React, { useState, useRef, useEffect } from "react";
import { ScrollView, View } from "@tarojs/components";
import Taro, { useReachBottom } from "@tarojs/taro";
import Tabs from "@/components/tabs";
import {
  template,
  couponTemplate,
} from "@/components/public_ui/specalTemplate";
import {
  fetchCouponAvailableSpecial,
  fetchAvailableOwnerCoupon,
} from "@/server/coupon";
import Empty from "@/components/Empty";
import "./index.scss";
export default (props) => {
  const { data } = props;
  const tabStyle = {
    height: Taro.pxTransform(96),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#FFFFFF",
    padding: `0 ${Taro.pxTransform(176)}`,
    left: 0,
    right: 0,
    zIndex: 1050,
    top: Taro.pxTransform(88),
    borderBottom: "1px  solid #E5E5E5;",
  };
  const [httpData, setHttpData] = useState({
    page: 1,
    limit: 10,
  });
  const [httpData1, setHttpData1] = useState({ page: 1, limit: 10 });
  const [setting, setSetting] = useState({
    tabList: ["特惠商品", "优惠券"],
    current: 0,
  });
  const [list, setList] = useState([]);
  const [list1, setList1] = useState([]);
  const getData = () => {
    fetchCouponAvailableSpecial({
      ...httpData,
      ...data,
    }).then((val) => {
      const { specialGoodsList = [] } = val;
      setList([...list, ...specialGoodsList]);
    });
  };
  const getData1 = () => {
    fetchAvailableOwnerCoupon({
      ...httpData1,
      ...data,
    }).then((val) => {
      const { couponList = [] } = val;
      setList1([...list1, ...couponList]);
    });
  };
  useEffect(() => {
    getData();
  }, [httpData.page]);
  useEffect(() => {
    getData1();
  }, [httpData1.page]);
  const getDown = () => {
    setHttpData({
      ...httpData,
      page: httpData.page + 1,
    });
  };
  const getDown1 = () => {
    setHttpData1({
      ...httpData1,
      page: httpData1.page + 1,
    });
  };
  useReachBottom(() => {
    if (setting.current === 0) {
      getDown();
    } else {
      getDown1();
    }
  });
  return (
    <View className="commerceShop_info">
      <Tabs
        fn={(e) => {
          if (e !== setting.current) {
            setSetting({ ...setting, current: e });
          }
        }}
        style={tabStyle}
        fontStyle={{ color: "#07C0C2", fontSize: Taro.pxTransform(32) }}
        sizeStyle={{ fontSize: Taro.pxTransform(32), color: "#999999" }}
        {...setting}
      ></Tabs>
      <View className="specilShop_swiper_box">
        <Empty
          show={setting.current === 0 ? list.length === 0 : list1.length === 0}
          type={"shop"}
          toast={"暂无商品"}
        ></Empty>
        {setting.current === 0
          ? list.map((item) => {
              return template(item, {});
            })
          : list1.map((item) => {
              return couponTemplate(item, {});
            })}
      </View>
    </View>
  );
};
