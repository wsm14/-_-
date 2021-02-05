//店铺 ui
import React from "react";
import { CoverView, CoverImage } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { GetDistance, filterStrList, getLat, getLnt } from "@/common/utils";
import Router from "@/common/router";
import classNames from "classnames";
import "./index.scss";
export const createMerchantByMap = (item) => {
  const {
    coverImg,
    merchantId,
    merchantName,
    businessHub,
    categoryName,
    perCapitaConsumption,
    lat,
    lnt,
    markFlag,
    markBean,
    tag,
    goodsList,
    couponTitlesJson = [],
  } = item;
  // if (!goodsList || goodsList.length === 0) {
  return (
    <CoverView
      onClick={() => {
        Router({ routerName: "merchantDetails", args: { merchantId } });
      }}
      className="createMerchantByMap_box"
    >
      <CoverView className="createMerchantByMap_child_box">
        <CoverImage
          lazyLoad
          mode="center"
          className="createMerchantByMap_image"
          src={coverImg}
        ></CoverImage>
        <CoverView className="createMerchantByMap_child_right">
          <CoverView className="createMerchantByMap_text">
            <CoverView className="createMerchantByMap_child_title1 font_hide color1 font28">
              {merchantName}
            </CoverView>
            <CoverView className="createMerchantByMap_child_title2">
              {businessHub && (
                <CoverView style={{ marginRight: Taro.pxTransform(12) }}>
                  {businessHub + ""}
                </CoverView>
              )}
              {categoryName && (
                <CoverView style={{ marginRight: Taro.pxTransform(12) }}>
                  {categoryName + " "}
                </CoverView>
              )}
              {perCapitaConsumption && (
                <CoverView>
                  {"人均" + perCapitaConsumption + " "}
                </CoverView>
              )}
              <CoverView className="createMerchantByMap_child_marginRight">
                距你 {GetDistance(getLat(), getLnt(), lat, lnt)}
              </CoverView>
            </CoverView>
            <CoverView className="createMerchantByMap_child_title3">
              {filterStrList(tag).map((val) => {
                return (
                  <CoverView className="createMerchantByMap_child_tags">
                    {val}
                  </CoverView>
                );
              })}
            </CoverView>
          </CoverView>
        </CoverView>
      </CoverView>

      {couponTitlesJson.length > 0 && (
        <CoverView className="createMerchantByMap_child_coupon1">
          {couponTitlesJson.map((items) => {
            const { couponType, couponName } = items;
            return (
              <CoverView
                className={classNames(
                  "createMerchantByMap_coupon_tags",
                  couponType === "reduce"
                    ? "createMerchantByMap_coupon_tagsBg1"
                    : "createMerchantByMap_coupon_tagsBg2"
                )}
              >
                {couponName}
              </CoverView>
            );
          })}
        </CoverView>
      )}
      <CoverView className="createMerchantByMap_liner_view"></CoverView>
      <CoverView className="createMerchantByMap_getBean">
        <CoverView className="createMerchantByMap_ben_font">
          到店打卡捡豆
        </CoverView>
        <CoverImage
          className="createMerchantByMap_ben_icon"
          src="https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/icon430.png"
        ></CoverImage>
        <CoverView className="createMerchantByMap_ben_font">
          +{markBean}
        </CoverView>
      </CoverView>
    </CoverView>
  );
  // } else {
  //   return (
  //     <CoverView
  //       className="createMerchantByMap_byGoods"
  //       onClick={() => {
  //         Router({ routerName: "merchantDetails", args: { merchantId } });
  //       }}
  //     >
  //       <CoverView className="createMerchantByMap_byGoodsBox">
  //         <CoverView className="createMerchantByMap_byGoodsContent">
  //           <CoverView className="createMerchantByMap_byGoodsTitle">
  //             {merchantName}
  //           </CoverView>
  //           <CoverView className="createMerchantByMap_child_title2">
  //             {businessHub && (
  //               <CoverView style={{ paddingRight: Taro.pxTransform(12) }}>
  //                 {businessHub + ""}
  //               </CoverView>
  //             )}
  //             {categoryName && (
  //               <CoverView style={{ paddingRight: Taro.pxTransform(12) }}>
  //                 {categoryName + " "}
  //               </CoverView>
  //             )}
  //             {perCapitaConsumption && (
  //               <CoverView style={{ paddingRight: Taro.pxTransform(5) }}>
  //                 {"人均" + perCapitaConsumption + " "}
  //               </CoverView>
  //             )}
  //             <CoverView className="createMerchantByMap_child_marginRight">
  //               距你 {GetDistance(getLat(), getLnt(), lat, lnt)}
  //             </CoverView>
  //           </CoverView>
  //           <CoverView className="createMerchantByMap_child_title3">
  //             {filterStrList(tag).map((val) => {
  //               return (
  //                 <CoverView className="createMerchantByMap_child_tags">
  //                   {val}
  //                 </CoverView>
  //               );
  //             })}
  //           </CoverView>
  //           {couponTitlesJson.length > 0 && (
  //             <CoverView className="createMerchantByMap_child_coupon">
  //               {couponTitlesJson.map((items) => {
  //                 const { couponType, couponName } = items;
  //                 return (
  //                   <CoverView
  //                     className={classNames(
  //                       "createMerchantByMap_coupon_tags",
  //                       couponType === "reduce"
  //                         ? "createMerchantByMap_coupon_tagsBg1"
  //                         : "createMerchantByMap_coupon_tagsBg2"
  //                     )}
  //                   >
  //                     {couponName}
  //                   </CoverView>
  //                 );
  //               })}
  //             </CoverView>
  //           )}
  //           <CoverView className="createMerchantByMap_byGoodsView">
  //             {goodsList.map((items, indexs) => {
  //               if (indexs <= 2) {
  //                 return (
  //                   <CoverView className="createMerchantByMap_byGoodsImageBox">
  //                     <CoverImage
  //                       className="createMerchantByMap_byGoodsImage"
  //                       src={items.goodsImg}
  //                     ></CoverImage>
  //                     <CoverView className="createMerchantByMap_byGoodsImagefont font_hide">
  //                       {items.goodsName}
  //                     </CoverView>
  //                     <CoverView className="createMerchantByMap_byGoodsImageprice font_hide">
  //                       {"¥" + items.price}
  //                     </CoverView>
  //                   </CoverView>
  //                 );
  //               }
  //             })}
  //           </CoverView>
  //         </CoverView>
  //         <CoverView className="createMerchantByMap_liner_view"></CoverView>
  //         <CoverView className="createMerchantByMap_getBean">
  //           到店打卡捡豆
  //           <CoverImage
  //             className="createMerchantByMap_ben_icon"
  //             src="https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/icon430.png"
  //           ></CoverImage>
  //           +{markBean}
  //         </CoverView>
  //       </CoverView>
  //     </CoverView>
  //   );
  // }
};
