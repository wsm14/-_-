import React, { useMemo } from "react";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import { GetDistance, getLnt, getLat, backgroundObj } from "@/common/utils";
import Taro from "@tarojs/taro";
import { template } from "@/components/specalTemplate";
import "./../index.scss";
import Router from "@/common/router";
export default ({ data = [], userInfo = {}, linkTo }) => {
  const { payBeanCommission = 50, shareCommission = 0 } = userInfo;
  const memo = useMemo(() => {
    // const template = (item) => {
    //   const {
    //     goodsId,
    //     goodsName,
    //     goodsImg,
    //     oriPrice,
    //     realPrice,
    //     lnt,
    //     lat,
    //     status,
    //     goodsType,
    //     merchantAddress,
    //     merchantName,
    //     merchantLogo,
    //     merchantId,
    //     specialActivityIdString,
    //     merchantPrice,
    //     merchantIdString,
    //   } = item;

    //   return (
    //     <View
    //       onClick={() => linkTo(specialActivityIdString, merchantIdString)}
    //       style={{ marginBottom: Taro.pxTransform(20) }}
    //       className="lookAround_data_specal"
    //     >
    //       <View className="lookAround_date_specalImage">
    //         <Image src={goodsImg} className="lookAround_date_image" />
    //         <View className="lookAround_active_limit">
    //           {GetDistance(getLat(), getLnt(), lat, lnt)}
    //         </View>
    //         <View className="lookAround_active_bottom lookAround_date_bottom">
    //           <View
    //             style={backgroundObj(merchantLogo)}
    //             className="lookAround_date_profile"
    //           ></View>
    //           <View className="lookAround_date_name font_hide">
    //             {merchantName}
    //           </View>
    //         </View>
    //       </View>
    //       <View className="lookAround_date_content">
    //         <View className="lookAround_date_title font_hide">{goodsName}</View>
    //         <View className="lookAround_date_price">
    //           {" "}
    //           <Text className="lookAround_price_text">¥ </Text>
    //           {realPrice}
    //           {shareCommission !== 0 && (
    //             <View className="lookAround_share_text">
    //               /赚¥ 
    //               {(
    //                 (realPrice - merchantPrice) *
    //                 (shareCommission / 100)
    //               ).toFixed(2)}
    //             </View>
    //           )}
    //         </View>
    //         <View className="lookAround_date_rel">¥ {oriPrice}</View>
    //         <View className="lookAround_bean_border">
    //           <View className="lookAround_bean_box">
    //             卡豆可抵¥ {(realPrice * (payBeanCommission / 100)).toFixed(2)}
    //           </View>
    //         </View>
    //       </View>
    //     </View>
    //   );
    // };
    return (
      <View className="lookAround_active_box">
        <View
          className="lookAround_active_title"
          onClick={() =>
            Router({
              routerName: "specialOffer",
              args: {
                type: "today",
              },
            })
          }
        >
          <View className="lookAround_active_left">
            <View className="lookAround_active_date"></View>
          </View>
          <View className="lookAround_active_right">
            <View className="lookAround_active_date1">爆款好物，福利来袭</View>
          </View>
        </View>
        <View style={{ paddingTop: Taro.pxTransform(32) }}>
          {data.map((item) => {
            return template(item, userInfo);
          })}
        </View>
      </View>
    );
  }, [data, payBeanCommission,shareCommission]);
  return memo;
};
