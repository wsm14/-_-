/*
 * type：领取消费券  可用与用户领取卡券或渲染不同样式
 * title：标题
 * visible：子集调用父级回调用于关闭弹窗
 * data：数组用于渲染的数据
 */
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "@tarojs/components";
import classNames from "classnames";
import "./index.scss";
import { backgroundObj, toast, navigateTo } from "@/common/utils";
import { acquireCoupon } from "@/server/coupon";
export default (props) => {
  const { title = "", data = [], visible, type } = props;
  useEffect(() => {
    setList(data);
  }, [data]);
  const [list, setList] = useState([]);
  //内部调用数组
  const [idList, setIdList] = useState([]);
  //已领取券
  const template = (item) => {
    const {
      address,
      activeDate,
      endDate,
      activeDays,
      delayDays,
      couponImg,
      couponName,
      couponType,
      merchantId,
      merchantIdString,
      merchantLogo,
      merchantName,
      ownerCouponId,
      ownerId,
      ownerCouponIdString,
      ownerIdString,
      reduceObject: { couponPrice, thresholdPrice },
    } = item;
    return (
      <View className="dakale_gift_coupon">
        <View className="dakale_gift_couponTop">
          <View
            className="dakale_gift_couponCover coupon_shop_icon"
            style={merchantLogo ? backgroundObj(merchantLogo) : {}}
          ></View>
          <View className="dakale_gift_fonts">
            <View className="dakale_gift_title  font_noHide">{couponName}</View>
            <View className="dakale_gift_term">仅限线下到店扫码消费使用</View>
          </View>
        </View>
        <View className="dakale_gift_couponContent">
          <View className="dakale_gift_address font_hide">{address}</View>
          <View className="dakale_gift_date">
            有效期：
            {activeDate && endDate
              ? activeDate + "至" + endDate
              : `领取后${delayDays}天生效 | 有效期：${activeDays}天`}
          </View>
          <View
            className={classNames(
              "dakale_gift_btn",
              !filterList(idList, ownerCouponIdString) && "dakale_gift_opacity"
            )}
            onClick={() => {
              saveCoupon({
                ownerId: ownerIdString,
                ownerCouponId: ownerCouponIdString,
                couponChannel: type,
                merchantId: merchantIdString,
              });
            }}
          >
            {!filterList(idList, ownerCouponIdString) ? "已领" : "领取"}
          </View>
        </View>
      </View>
    );
  };
  //动态和到店打卡渲染模板
  const template1 = (item) => {
    const {
      address,
      activeDate,
      endDate,
      activeDays,
      delayDays,
      couponImg,
      couponName,
      couponType,
      merchantId,
      merchantLogo,
      merchantName,
      ownerCouponId,
      ownerId,
      merchantIdString,
      ownerCouponIdString,
      ownerIdString,
      reduceObject: { couponPrice, thresholdPrice },
    } = item;
    return (
      <View className="dakale_comsume_box">
        <View
          className="dakale_comsume_cover dakale_nullImage"
          style={couponImg ? backgroundObj(couponImg) : {}}
        ></View>
        <View className="dakale_comsume_data">
          <View className="dakale_comsume_user">
            <View
              className="dakale_comsume_userProfile dakale_profile"
              style={couponImg ? backgroundObj(merchantLogo) : {}}
            ></View>
            <View className="dakale_comsume_username font_hide">
              {merchantName}
            </View>
          </View>
          <View className="dakale_comsume_name">{couponName}</View>
          <View
            onClick={() =>
              saveComsume({
                ownerId: ownerIdString,
                ownerCouponId: ownerCouponIdString,
                couponChannel: type,
                merchantId: merchantIdString,
              })
            }
            className={classNames(
              "dakale_comsume_btnBox",
              !filterList(idList, ownerCouponIdString)
                ? "dakale_comsume_btnStyle2"
                : "dakale_comsume_btnStyle1"
            )}
          >
            {!filterList(idList, ownerCouponIdString) ? "去店铺逛逛" : "领券"}
          </View>
          {!filterList(idList, ownerCouponIdString) && (
            <View className="dakale_comsume_couponStatus"></View>
          )}
        </View>
      </View>
    );
  };

  const filterList = (list, id) => {
    let flag = true;
    list.forEach((element) => {
      if (element === id) {
        flag = false;
      }
    });
    return flag;
  };
  const saveCoupon = (obj) => {
    if (!filterList(idList, obj.ownerCouponId)) {
      return;
    }
    acquireCoupon(obj, (res) => {
      toast("领取成功");
      setIdList(new Set([...idList, obj.ownerCouponId]));
    });
  };
  const saveComsume = (obj) => {
    if (!filterList(idList, obj.ownerCouponId)) {
      navigateTo(
        `/pages/perimeter/merchantDetails/index?merchantId=${merchantIdString}`
      );
      return;
    }
    acquireCoupon(obj, (res) => {
      toast("领取成功");
      setIdList(new Set([...idList, obj.ownerCouponId]));
    });
  };
  if (type === "consume") {
    return (
      <View className="dakale_coupon">
        <View
          className="dakale_layer"
          onClick={(e) => {
            e.stopPropagation();
            visible();
          }}
        >
          <View
            className="dakale_gift_comsume"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <View className="dakale_gift_top">
              {title}
              <View
                className="dakale_gift_closeIcon"
                onClick={(e) => {
                  e.stopPropagation();
                  visible();
                }}
              ></View>
            </View>
            <View className="dakale_gift_liner"></View>
            {list.length > 1 ? (
              <ScrollView scrollX className="dakale_comsume_content">
                {list.map((item) => {
                  return template1(item);
                })}
              </ScrollView>
            ) : (
              <View className="dakale_comsume_content">
                {list.map((item) => {
                  return template1(item);
                })}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View catchMove className="dakale_coupon">
        <View
          className="dakale_layer"
          onClick={(e) => {
            e.stopPropagation();
            visible();
          }}
        >
          <View>
            <View
              className="dakale_gift"
              catchMove={false}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {list.length === 1 ? (
                <View className="dakale_gift_ownLength">
                  <View className="dakale_gift_top">{title}</View>
                  <View className="dakale_gift_contentMax dakale_gift_content">
                    {list.map((item) => {
                      return template(item);
                    })}
                  </View>
                  <View
                    className="dakale_gift_btn public_center"
                    onClick={(e) => {
                      e.stopPropagation();
                      visible();
                    }}
                  >
                    知道了
                  </View>
                </View>
              ) : (
                <View className="dakale_gift_twoLength">
                  <View className="dakale_gift_top">{title}</View>
                  <ScrollView scrollY className="dakale_gift_content">
                    {list.map((item) => {
                      return template(item);
                    })}
                  </ScrollView>
                  <View
                    className="dakale_close_btn public_center"
                    onClick={(e) => {
                      e.stopPropagation();
                      visible();
                    }}
                  >
                    知道了
                  </View>
                </View>
              )}
            </View>
            <View className="dakale_layer_close"></View>
          </View>
        </View>
      </View>
    );
  }
};
