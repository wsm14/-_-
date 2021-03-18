import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Image, ScrollView, Text, View } from "@tarojs/components";
import Banner from "@/components/banner";
import { perimeter } from "@/api/api";
import { httpGet } from "@/api/newRequest";
import classNames from "classnames";
import {
  filterStrList,
  filterWeek,
  loginStatus,
  format,
  setBuyRule,
} from "@/common/utils";
import { shopCard, shopGoodsDetails } from "@/components/publicShopStyle";
import MakePhone from "@/components/payTelephone";
import "./index.scss";
import { loginBtn } from "@/common/authority";
import { navigateTo } from "../../../common/utils";
import ActivityStatus from "./components/index";
import { getShareParamInfo } from "@/server/common";
import Router from "@/common/router";
class MerchantDetails extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        specialActivityId:
          getCurrentInstance().router.params.specialActivityId || "",
        merchantId: getCurrentInstance().router.params.merchantId || "",
      },
      lnt: Taro.getStorageSync("lnt"),
      lat: Taro.getStorageSync("lat"),
      specialGoodsInfo: {}, //商品详情
      index: 0,
      visible: false,
    };
  }
  componentWillMount() {
    const { scene } = getCurrentInstance().router.params;
    const { httpData } = this.state;
    if (scene) {
      getShareParamInfo({ uniqueKey: scene }, (res) => {
        const {
          shareParamInfo: { param },
        } = res;
        if (param && JSON.parse(param)) {
          param = JSON.parse(param);
          this.setState(
            {
              httpData: { ...httpData, ...param },
            },
            (res) => {
              this.getDetailsById();
            }
          );
        }
      });
    } else {
      this.getDetailsById();
    }
  }
  componentDidShow() {
    const { index } = this.state;
    if (index !== 0) {
      this.getDetailsById();
    }
  }
  getDetailsById() {
    const { getSpecialGoodsDetail } = perimeter;
    const { httpData, index } = this.state;
    httpGet(
      {
        url: getSpecialGoodsDetail,
        data: httpData,
      },
      (res) => {
        const { specialGoodsInfo } = res;
        this.setState({
          specialGoodsInfo,
          index: index + 1,
        });
      }
    );
  }
  onShareAppMessage() {
    const {
      specialGoodsInfo: { goodsName, allImgs },
      httpData: { merchantId, specialActivityId },
    } = this.state;
    let userInfo = loginStatus() || {};
    const { userIdString } = userInfo;
    if (loginStatus()) {
      return {
        title: goodsName,
        imageUrl: allImgs[0],
        path: `/pages/perimeter/favourableDetails/index?shareUserId=${userIdString}&shareUserType=user&merchantId=${merchantId}&specialActivityId=${specialActivityId}`,
      };
    } else {
      return {
        title: goodsName,
        imageUrl: allImgs[0],
      };
    }
  }

  onShareTimeline() {
    const {
      specialGoodsInfo: { goodsName, allImgs },
      httpData: { merchantId, specialActivityId },
    } = this.state;
    let userInfo = loginStatus() || {};
    const { userIdString } = userInfo;
    if (loginStatus()) {
      return {
        title: goodsName,
        imageUrl: allImgs[0],
        path: `/pages/perimeter/favourableDetails/index?shareUserId=${userIdString}&shareUserType=user&merchantId=${merchantId}&specialActivityId=${specialActivityId}`,
      };
    } else {
      return {
        title: goodsName,
        imageUrl: allImgs[0],
      };
    }
  }
  onReady() {
    // 生命周期函数--监听页面初次渲染完成
  }
  render() {
    const {
      specialGoodsInfo: {
        oriPrice,
        realPrice,
        activityEndTime,
        goodsName,
        allowExpireRefund,
        allowRefund,
        needOrder,
        goodsStock,
        useStartTime,
        useEndTime,
        useWeek,
        useTime,
        goodsDesc,
        telephone,
        specialActivityIdString,
        merchantIdString,
        allImgs,
        goodsDescImg,
        status,
        ownerType = "merchant",
        activityStartTime,
        buyRule = "unlimited",
        dayMaxBuyAmount = 0,
        maxBuyAmount = 0,
        goodsType = "single",
        packageGroupObjects = [],
      },
      specialGoodsInfo,
      kolMomentsInfo,
      visible,
      // https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/icon469.png
    } = this.state;
    const payBtn = () => {
      if (!format(activityStartTime)) {
        return (
          <View className="shopdetails_shop_goshop shopdetails_shop_option">
            即将开抢
          </View>
        );
      } else if (format(activityStartTime)) {
        return (
          <View className="shopdetails_kol_goshop">
            <View
              onClick={() =>
                loginBtn(() =>
                  navigateTo(
                    `/pages/goods/favourOrder/index?specialActivityId=${specialActivityIdString}&merchantId=${merchantIdString}`
                  )
                )
              }
              className="shopdetails_kol_btnBox shopdetails_kol_btnColor1"
            >
              <View className="shopdetails_kol_font1">自购返</View>
              <View className="shopdetails_kol_font2">￥1.90</View>
            </View>
            <View className="shopdetails_kol_btnBox shopdetails_kol_btnColor2">
              <View className="shopdetails_kol_font1">分享赚</View>
              <View className="shopdetails_kol_font2">￥1.90</View>
            </View>
          </View>
        );
      } else {
        <View
          className="shopdetails_shop_goshop"
          onClick={() =>
            loginBtn(() =>
              navigateTo(
                `/pages/goods/favourOrder/index?specialActivityId=${specialActivityIdString}&merchantId=${merchantIdString}`
              )
            )
          }
        >
          立即购买
        </View>;
      }
    };
    if (Object.keys(specialGoodsInfo).length > 0) {
      if (status !== "0") {
        return (
          <View className="favourable_Details">
            <View className="shopDetails_banner dakale_nullImage">
              <Banner
                autoplay={
                  filterStrList(allImgs || []).length > 1 ? true : false
                }
                imgStyle
                data={filterStrList(allImgs || [])}
                style={{ width: "100%", height: "100%" }}
                boxStyle={{ width: "100%", height: "100%" }}
              ></Banner>
            </View>
            <View className="shopdetails_price">
              <View className="shopdetails_priceBox">
                <View className="shopdetails_top public_auto">
                  <View className="shopdetails_priceIcon">哒卡乐专享价</View>
                  <View className="shopdetails_time">
                    活动截止日期：{activityEndTime || "--"}
                  </View>
                </View>
                <View className="shopdetails_bottom public_auto">
                  <View className="shopdetails_setprice">
                    <Text className="shopdetails_bigFont">¥</Text>
                    {realPrice || "--"}
                    <Text className="shopdetails_lineFont">
                      ¥ {oriPrice || "--"}
                    </Text>
                  </View>
                  <View className="shopdetails_setbean">
                    {format(activityStartTime) ? "门店抢购中" : "即将开抢"}
                  </View>
                </View>
              </View>
            </View>
            {/*使用商家*/}
            <View className="shopdetails_getShop">
              <View className="shopdetails_title font_noHide">
                {goodsName || "--"}
              </View>
              <View className="shopDetails_tab">
                {/*<View className='shopDetails_tab_icon'></View>*/}
                {/*<View className='shopDetails_tab_font'>可叠加3张使用</View>*/}
                {needOrder === "0" && (
                  <>
                    <View className="shopDetails_tab_icon"></View>
                    <View className="shopDetails_tab_font">免预约</View>
                  </>
                )}

                {allowRefund === "1" && (
                  <>
                    <View className="shopDetails_tab_icon"></View>
                    <View className="shopDetails_tab_font">随时退</View>
                  </>
                )}
                {allowExpireRefund === "1" && (
                  <>
                    <View className="shopDetails_tab_icon"></View>
                    <View className="shopDetails_tab_font">过期退</View>
                  </>
                )}

                <>
                  <View className="shopDetails_tab_icon"></View>
                  <View className="shopDetails_tab_font">卡豆抵扣</View>
                </>
                <View
                  onClick={() => Router({ routerName: "interests"})}
                  className="shop_question question_icon"
                ></View>
              </View>
              <View className="shopdetails_getPrice">
                <View className="shopdetails_getPrice_tag">
                  {goodsStock !== "0" ? "剩余数量" + goodsStock : "已售罄"}
                </View>

                {setBuyRule(buyRule, dayMaxBuyAmount, maxBuyAmount) && (
                  <View className="shopdetails_getPrice_tag">
                    {setBuyRule(buyRule, dayMaxBuyAmount, maxBuyAmount)}
                  </View>
                )}
              </View>
            </View>

            <View className="shopdetails_shop_merchantShop">
              {shopCard(this, specialGoodsInfo)}
              {ownerType === "group" && (
                <View className="shopdetails_group">
                  查看全部6家适用商家{" >"}
                </View>
              )}
            </View>

            {goodsType === "package" && (
              <View className="shopdetails_shop_packageGroup">
                <View className="shopdetails_shop_groupTitle">套餐详情</View>
                {packageGroupObjects.map((item) => {
                  const { packageGoodsObjects = [], groupName } = item;
                  return (
                    <View className="shopdetails_shop_package">
                      <View className="shopdetails_package_title">
                        · {groupName}（{packageGoodsObjects.length}）
                      </View>
                      {packageGoodsObjects.map((val) => {
                        const { goodsName, goodsNum, goodsPrice } = val;
                        return (
                          <View className="shopdetails_package_goods public_auto">
                            <View>
                              {goodsName}（{goodsNum}份）
                            </View>
                            <View>¥{goodsPrice}</View>
                          </View>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            )}

            {goodsDesc && (
              <View className="shopdetails_shop_details">
                <View className="shopdetails_shop_merchantDetails">
                  商品描述
                </View>
                <View className="shopdetails_dec">
                  <Text>{goodsDesc.replace(/\\n/g, "\n")}</Text>
                </View>

                <View className="shopdetails_Image">
                  {goodsDescImg &&
                    filterStrList(goodsDescImg).map((item) => {
                      return (
                        <Image
                          mode="widthFix"
                          src={item}
                          style={{ width: "100%" }}
                        ></Image>
                      );
                    })}
                </View>
              </View>
            )}
            {/*使用方法*/}
            <View className="shopdetails_shop_player">
              <View className="shopdetails_play_title">使用方法</View>
              <View className="shopdetails_play_img"></View>
            </View>
            {/*使用须知*/}
            <View className="shopdetails_shop_toast">
              <View className="shop_toastTitle">使用须知</View>
              <View className="shop_toastDec shop_toastDate">有效期：</View>
              <View className="shop_toastText">
                <Text className="shop_toastTextColor">
                  {useStartTime + " 至 " + useEndTime}{" "}
                </Text>
                ，请在有效期内使用；
              </View>
              <View className="shop_toastDec shop_getDate">使用时间：</View>
              <View className="shop_toastText">
                <Text className="shop_toastTextColor">
                  {filterWeek(useWeek) + " " + useTime}
                </Text>
                ，具体以门店供应时段为准；
              </View>
              <View className="shop_toastDec shop_showNow">购买须知：</View>
              <View
                style={{ lineHeight: Taro.pxTransform(36) }}
                className="shop_toastText"
              >
                到店后，在APP/小程序我的—卡券中找到相应的券码，将
                券码出示给店员，直接验码核销，要补差价的另行补齐；
              </View>
            </View>
            {/*使用规则*/}
            <View className="shopdetails_shop_toast">
              <View className="shop_toastTitle">使用规则</View>

              <View className="shop_toastText shop_toastTextHeight">
                本券不可拆分使用，不支持外卖点餐、电商订购等；不可转让、转售、转发、截图，也不能兑换现金；不可伪造，伪造无效。
              </View>
              <View className="shop_toastText shop_toastTextHeight">
                本券一经核销即为使用，卡券详情可查看存根信息；
              </View>
              <View className="shop_toastText shop_toastTextHeight">
                如对订单有疑问，请到商家咨询，或者拨打哒卡乐官方客服电话：400-800-5881进行咨询。
              </View>
              <View className="shop_toastText shop_toastTextHeight">
                *最终解释权归杭州哒卡乐智能科技有限公司所有
              </View>
            </View>
            <View className="shopdetails_shop_btn">
              <View className="shopdetails_shop_price">
                <View className="shopdetails_shop_priceTop">
                  <Text className="font20">¥</Text>
                  {realPrice}
                </View>
                <View className="shopdetails_shop_real">
                  <Text className="shopdetails_shop_realStatus1">
                    ¥ {oriPrice}
                  </Text>
                  <Text className="shopdetails_shop_realStatus2">
                    {((Number(realPrice) / Number(oriPrice)) * 10).toFixed(2)}折
                  </Text>
                </View>
              </View>
              {payBtn()}
            </View>
          </View>
        );
      } else {
        return <ActivityStatus></ActivityStatus>;
      }
    } else return null;
  }
}
export default MerchantDetails;
