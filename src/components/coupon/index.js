import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "@tarojs/components";
import classNames from "classnames";
import "./index.scss";
import { backgroundObj, toast } from "@/common/utils";
import { acquireCoupon } from "@/server/coupon";
export default (props) => {
  const { title = "", data = [], visible,type } = props;
  useEffect(() => {
    setList(data);
  }, [data]);
  const [list, setList] = useState([]);
  const [idList,setIdList] = useState([])
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
            className="dakale_gift_couponCover dakale_nullImage"
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
            {activeDate && endDate ? activeDate + "-" + endDate : `领取后${delayDays}天生效 | 有效期：${activeDays}天`}
          </View>
          <View className={classNames("dakale_gift_btn",!filterList(idList,ownerCouponIdString) && 'dakale_gift_opacity')} onClick={() => {saveCoupon({ownerId:ownerIdString,ownerCouponId:ownerCouponIdString,couponChannel:type})}}>
            {!filterList(idList,ownerCouponIdString)?'已领':'领取'}
          </View>
        </View>
      </View>
    );
  };
  const  filterList =  (list,id) => {
    let  flag = true
      list.forEach(element => {
        if(element === id){
          flag = false
        }
      });
      return flag
  }
  const saveCoupon =(obj) => {
    if(!filterList(idList,obj.ownerCouponId)){
      return
    }
    acquireCoupon(obj,res => {
       toast('领取成功') 
       setIdList(new Set([...idList,obj.ownerCouponId]))
    })
  }
  return (
    <View catchMove className="dakale_coupon">
      <View
        className="dakale_layer"
        onClick={(e) => {
          e.stopPropagation();
          visible();
        }}
      >
        <View
          className="dakale_gift"
          catchMove={false}
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
          <ScrollView scrollY className="dakale_gift_content">
            {list.map((item) => {
              return template(item);
            })}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};
