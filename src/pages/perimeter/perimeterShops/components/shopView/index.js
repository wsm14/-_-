import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { ScrollView, View } from "@tarojs/components";
import classNames from "classnames";
import ButtonView from "@/components/Button";
import "./index.scss";

export default (props) => {
  const { data, configUserLevelInfo } = props;
  const { payBeanCommission = 50, shareCommission = 0 } = configUserLevelInfo;
  const { specialGoodsFlag, couponFlag } = data;
  const [select, setSelect] = useState(null);
  useEffect(() => {
    if (specialGoodsFlag === "1") {
      setSelect(0);
    } else if (couponFlag === "1") {
      setSelect(1);
    }
  }, [data]);
  const tabSelect = (num) => {
    if (specialGoodsFlag === "1" && couponFlag === "1") {
      if (num !== select) {
        setSelect(num);
      } else return;
    } else return;
  };
  console.log(111);
  if (specialGoodsFlag === "1" || couponFlag === "1") {
    return (
      <View
        className="shopView_box"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <View className="shopView_title color1">
          {specialGoodsFlag === "1" && (
            <View
              className={classNames(
                "shopView_title_style",
                select === 0 ? "color1 bold" : "color2"
              )}
              onClick={() => tabSelect(0)}
            >
              特价活动
              {select === 0 &&
                specialGoodsFlag === "1" &&
                couponFlag === "1" && <View className="shopView_liner"></View>}
            </View>
          )}
          {couponFlag === "1" && (
            <View
              className={classNames(
                "shopView_title_style",
                select === 1 ? "color1 bold" : "color2"
              )}
              onClick={() => tabSelect(1)}
            >
              优惠券
              {select === 1 &&
                specialGoodsFlag === "1" &&
                couponFlag === "1" && <View className="shopView_liner"></View>}
            </View>
          )}
        </View>
        <ScrollView scrollX className="shopView_template">
          <View className="shopView_template_inline">
            <View className="shopView_template_box">
              <View className="shopView_template_cover"></View>
              <View className="shopView_template_right">
                <View className="shopView_template_name font_hide">
                  可甜可盐单人套餐可甜可盐单人套餐可甜可盐单人套餐可甜可盐单人套餐可甜可盐单人套餐
                </View>
                <View className="shopView_template_bean">卡豆抵扣到手价</View>
                <View className="shopView_template_price">
                  <View className="color1 bold font24">¥ </View>
                  <View className="color1 bold font32">29.99 </View>
                  <View className="color2 real_price font20">¥99.00</View>
                </View>
                <View className="shopView_template_earn">
                  <View
                    className="shopView_earn_box"
                    style={{
                      border: `1px solid #EF476F`,
                    }}
                  >
                    {" "}
                    赚¥14.99
                  </View>
                </View>
              </View>
              <ButtonView>
                {" "}
                <View className="shopView_template_btn public_center">
                  立即抢购
                </View>
              </ButtonView>
            </View>
          </View>

          <View className="shopView_template_inline">
            <View className="shopView_template_box">
              <View className="shopView_template_cover"></View>
              <View className="shopView_template_right">
                <View className="shopView_template_name font_hide">
                  可甜可盐单人套餐可甜可盐单人套餐可甜可盐单人套餐可甜可盐单人套餐可甜可盐单人套餐
                </View>
                <View className="shopView_template_bean">卡豆抵扣到手价</View>
                <View className="shopView_template_price">
                  <View className="color1 bold font24">¥ </View>
                  <View className="color1 bold font32">29.99 </View>
                  <View className="color2 real_price font20">¥99.00</View>
                </View>
                <View className="shopView_template_earn">
                  <View
                    className="shopView_earn_box"
                    style={{
                      border: `1px solid #EF476F`,
                    }}
                  >
                    {" "}
                    赚¥14.99
                  </View>
                </View>
              </View>
              <ButtonView>
                {" "}
                <View className="shopView_template_btn public_center">
                  立即抢购
                </View>
              </ButtonView>
            </View>
          </View>

          <View className="shopView_template_inline">
            <View className="shopView_template_box">
              <View className="shopView_template_cover"></View>
              <View className="shopView_template_right">
                <View className="shopView_template_name font_hide">
                  可甜可盐单人套餐可甜可盐单人套餐可甜可盐单人套餐可甜可盐单人套餐可甜可盐单人套餐
                </View>
                <View className="shopView_template_bean">卡豆抵扣到手价</View>
                <View className="shopView_template_price">
                  <View className="color1 bold font24">¥ </View>
                  <View className="color1 bold font32">29.99 </View>
                  <View className="color2 real_price font20">¥99.00</View>
                </View>
                <View className="shopView_template_earn">
                  <View
                    className="shopView_earn_box"
                    style={{
                      border: `1px solid #EF476F`,
                    }}
                  >
                    {" "}
                    赚¥14.99
                  </View>
                </View>
              </View>
              <ButtonView>
                {" "}
                <View className="shopView_template_btn public_center">
                  立即抢购
                </View>
              </ButtonView>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  } else {
    return null;
  }
};
