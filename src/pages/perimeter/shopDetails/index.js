import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Image, ScrollView, Text, View } from "@tarojs/components";
import Banner from "@/components/banner";
import { perimeter } from "@/api/api";
import { httpGet } from "@/api/newRequest";
import { nullShop } from "@/components/publicShopStyle";
import classNames from "classnames";
import {
  backgroundObj,
  GetDistance,
  filterSetting,
  filterStrList,
  filterWeek,
  navigateTo,
} from "@/common/utils";
import {
  exploreShop,
  shopCard,
  shopGoodsDetails,
} from "@/components/publicShopStyle";
import MakePhone from "@/components/payTelephone";
import Lovely from "@/components/lovely";
import "./index.scss";
import { loginBtn } from "@/common/authority";
import ActivityStatus from "./components/index";
class MerchantDetails extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        kolActivityId:
          getCurrentInstance().router.params.kolActivityIdString || "",
        merchantId: getCurrentInstance().router.params.merchantId || "",
      },
      httpDataById: {
        kolActivityId:
          getCurrentInstance().router.params.kolActivityIdString || "",
        merchantId: getCurrentInstance().router.params.merchantId || "",
      },
      lnt: Taro.getStorageSync("lnt"),
      lat: Taro.getStorageSync("lat"),
      kolGoodsInfo: {}, //商品详情
      visible: false,
      kolMomentsInfo: {},
      kolMomentsId: getCurrentInstance().router.params.kolMomentsId,
    };
  }
  componentDidShow() {
    this.getDetailsById();
    this.getGoodKolById();
  }
  getGoodKolById() {
    const {
      shopDetails: { getGoodsById },
    } = perimeter;
    const { httpDataById } = this.state;
    httpGet(
      {
        url: getGoodsById,
        data: httpDataById,
      },
      (res) => {
        const { kolMomentsInfo } = res;
        this.setState({
          kolMomentsInfo,
        });
      }
    );
  }
  getDetailsById() {
    const {
      shopDetails: { getGoodsDetail },
    } = perimeter;
    const { httpData } = this.state;
    httpGet(
      {
        url: getGoodsDetail,
        data: httpData,
      },
      (res) => {
        const { kolGoodsInfo } = res;
        this.setState({
          kolGoodsInfo,
        });
      }
    );
  }
  onReady() {
    // 生命周期函数--监听页面初次渲染完成
  }
  render() {
    const {
      kolGoodsInfo: {
        goodsImg,
        oriPrice,
        kolPrice,
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
        likeAmount,
        packageGoods,
        goodsIdString,
        merchantIdString,
        allImgs,
        goodsDescImg,
        kolActivityIdString,
        status,
      },
      kolGoodsInfo,
      kolMomentsInfo,
      visible,
      kolMomentsId,
    } = this.state;
    if (Object.keys(kolGoodsInfo).length > 0 && status !== "0") {
      return (
        <View className="page_shopBox">
          <View className="shopDetails_banner dakale_nullImage">
            <Banner
              autoplay={filterStrList(allImgs || []).length > 1 ? true : false}
              imgStyle
              data={filterStrList(allImgs || [])}
              style={{ width: "100%", height: "100%" }}
              boxStyle={{ width: "100%", height: "100%" }}
            ></Banner>
          </View>
          <View className="shopdetails_price">
            <View className="shopdetails_priceBox">
              <View className="shopdetails_top public_auto">
                <View className="shopdetails_setprice">
                  <Text className="shopdetails_bigFont">¥</Text>
                  {kolPrice || "--"}
                  <Text className="shopdetails_lineFont">
                    ¥ {oriPrice || "--"}
                  </Text>
                </View>
                <View className="shopdetails_priceIcon">哒卡乐专享价</View>
              </View>
              <View className="shopdetails_bottom public_auto">
                <View className="shopdetails_setbean">
                  ({Number(kolPrice) * 100}卡豆）
                </View>
                <View className="shopdetails_time">
                  活动截止日期：{activityEndTime || "--"}
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
            </View>
            <View className="shopdetails_getPrice">
              <View className="shopdetails_getPrice_tag">
                {goodsStock !== "0" ? "剩余数量" + goodsStock : "已售罄"}
              </View>
            </View>
          </View>
          {/*达人推荐*/}
          <View className="shopdetails_shop_details">
            <View className="shopdetails_shop_merchantDetails">使用商家</View>
            {shopCard(this, kolGoodsInfo)}

            {packageGoods && shopGoodsDetails(this, packageGoods)}
            {goodsDesc && (
              <>
                <View className="shopdetails_shop_merchantDetails">
                  商品描述
                </View>
                <View className="shopdetails_dec">{goodsDesc}</View>
              </>
            )}
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
            <View className="shopdetails_shop_merchantDetails">哒人推荐</View>
            <View style={{ marginTop: Taro.pxTransform(24) }}>
              {exploreShop(this, kolMomentsInfo)}
            </View>
          </View>
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
              本券不可拆分使用，不支持外卖点餐、电商订购等方式；不全不可转让、转售、转发、截图，也不能兑换现金，伪造无效；
            </View>
            <View className="shop_toastText shop_toastTextHeight">
              如对订单有疑问，请点击左下角客服进行咨询；一旦核销即为使用，卡券详情可查看存根信息；【因供应商明确要求，本电子券一经售出后均不退不换，请介意者慎拍】
              哒卡乐客服电话：400-800-5881，如有疑问也可以直接拨打咨询。
            </View>
            <View className="shop_toastText shop_toastTextHeight">
              最终解释权归哒卡乐所有
            </View>
          </View>
          <View className="shopdetails_shop_btn">
            <View onClick={() => this.setState({ visible: true })}>
              <View className="shopdetails_telephone"></View>
              <View className="shopdetails_telephone_text">客服</View>
            </View>
            <View
              className="shopdetails_shop_goshop"
              onClick={() =>
                loginBtn(() =>
                  navigateTo(
                    `/pages/goods/configOrder/index?kolActivityId=${kolActivityIdString}&merchantId=${merchantIdString}&kolMomentsId=${kolMomentsId}`
                  )
                )
              }
            >
              立即购买
            </View>
          </View>
          {visible && (
            <MakePhone
              onClose={() => this.setState({ visible: false })}
              onCancel={() => this.setState({ visible: false })}
              data={filterStrList(telephone)}
            ></MakePhone>
          )}
        </View>
      );
    } else
      return (
        <ActivityStatus></ActivityStatus>
      );
  }
}
export default MerchantDetails;
