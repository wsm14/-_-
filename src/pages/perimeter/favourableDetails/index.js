import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Image, ScrollView, Text, View } from "@tarojs/components";
import Banner from "@/components/banner";
import { perimeter } from "@/api/api";
import { httpGet } from "@/api/newRequest";
import {
  filterStrList,
  loginStatus,
  format,
  setBuyRule,
  computedPrice,
} from "@/common/utils";
import "./index.scss";
import { loginBtn } from "@/common/authority";
import { navigateTo } from "../../../common/utils";
import ActivityStatus from "./components/index";
import { getShareParamInfo, getShareInfo } from "@/server/common";
import { fetchUserShareCommission } from "@/server/index";
import Router from "@/common/router";
import TaroShareDrawer from "./components/TaroShareDrawer";
import { rssConfigData } from "./components/data";
import ButtonView from "@/components/Button";
import { payNeed } from "@/components/componentView/NeedPay";
import { knowPay } from "@/components/componentView/KnowPay";
import {
  Instruction,
  merchantSet,
} from "@/components/componentView/Instruction";
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
      configUserLevelInfo: {},
      cavansObj: {
        data: null,
        start: false,
      },
    };
  }
  componentWillMount() {
    let { scene } = getCurrentInstance().router.params;
    let { httpData } = this.state;
    if (scene) {
      getShareParamInfo({ uniqueKey: scene }, (res) => {
        let {
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
    this.fetchUserShareCommission();
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
  fetchUserShareCommission() {
    fetchUserShareCommission({}, (res) => {
      const { configUserLevelInfo = {} } = res;
      this.setState({
        configUserLevelInfo,
      });
    });
  }
  getShareInfo() {
    const {
      specialGoodsInfo: {
        specialActivityIdString,
        merchantName,
        activityEndTime,
        address,
        goodsName,
        cityName,
        merchantLogo,
      },
    } = this.state;
    const { profile, username } = Taro.getStorageSync("userInfo");
    getShareInfo(
      {
        shareType: "specialActivity",
        shareId: specialActivityIdString,
      },
      (res) => {
        const { body, oriPrice, title, realPrice, qcodeUrl } = res;
        this.setState({
          cavansObj: {
            start: true,
            data: rssConfigData({
              merchantName,
              time: activityEndTime || "长期有效",
              oldPrice: oriPrice,
              price: realPrice,
              wxCode: qcodeUrl,
              username,
              userProfile: profile,
              name: goodsName,
              address,
              city: cityName,
              merchantLogo: merchantLogo,
            }),
          },
        });
      }
    );
  }
  onShareAppMessage(res) {
    const {
      specialGoodsInfo: { goodsName },
      specialGoodsInfo,
      httpData: { merchantId, specialActivityId },
    } = this.state;
    let userInfo = loginStatus() || {};
    let img = specialGoodsInfo.activityGoodsImg.split(",")[0];
    const { userIdString } = userInfo;
    console.log(goodsName);
    if (res.from === "button") {
      return {
        title: goodsName,
        imageUrl: img,
        path: `/pages/perimeter/favourableDetails/index?shareUserId=${userIdString}&shareUserType=user&merchantId=${merchantId}&specialActivityId=${specialActivityId}`,
      };
    }
    if (loginStatus()) {
      return {
        title: goodsName,
        imageUrl: img,
        path: `/pages/perimeter/favourableDetails/index?shareUserId=${userIdString}&shareUserType=user&merchantId=${merchantId}&specialActivityId=${specialActivityId}`,
      };
    } else {
      return {
        title: goodsName,
        imageUrl: img,
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
        goodsDesc,
        specialActivityIdString,
        merchantIdString,
        goodsDescImg,
        status,
        ownerType = "merchant",
        activityStartTime,
        buyRule = "unlimited",
        dayMaxBuyAmount = 0,
        maxBuyAmount = 0,
        goodsType = "single",
        activityTimeRule,
        activityGoodsImg,
        packageGroupObjects = [],
        merchantCount,
        merchantPrice,
      },
      configUserLevelInfo: { payBeanCommission = 50, shareCommission = 0 },
      specialGoodsInfo,
      cavansObj,
      // https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/icon469.png
    } = this.state;
    const payBtn = () => {
      if (!format(activityStartTime) && activityTimeRule === "fixed") {
        return (
          <ButtonView>
            <View className="shopdetails_shop_goshop shopdetails_shop_option">
              即将开抢
            </View>
          </ButtonView>
        );
      } else if (shareCommission !== 0) {
        return (
          <View className="shopdetails_kol_goshop">
            <ButtonView>
              <View className="shopdetails_kol_btnBox shopdetails_kol_btnColor1">
                <View
                  className="shopdetails_kol_font1"
                  onClick={() =>
                    loginBtn(() =>
                      navigateTo(
                        `/pages/goods/favourOrder/index?specialActivityId=${specialActivityIdString}&merchantId=${merchantIdString}`
                      )
                    )
                  }
                >
                  自购返
                </View>
                <View className="shopdetails_kol_font2">
                  {" "}
                  省¥
                  {computedPrice(realPrice - merchantPrice, shareCommission)}
                </View>
              </View>
            </ButtonView>
            <ButtonView>
              <View
                className="shopdetails_kol_btnBox shopdetails_kol_btnColor2"
                onClick={() => loginBtn(() => this.getShareInfo())}
              >
                <View className="shopdetails_kol_font1">分享赚</View>
                <View className="shopdetails_kol_font2">
                  {" "}
                  赚¥
                  {computedPrice(realPrice - merchantPrice, shareCommission)}
                </View>
              </View>
            </ButtonView>
          </View>
        );
      } else {
        return (
          <ButtonView>
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
              立即抢购
            </View>
          </ButtonView>
        );
      }
    };
    if (Object.keys(specialGoodsInfo).length > 0) {
      if (status !== "0") {
        {
          console.log(cavansObj);
        }
        return (
          <View className="favourable_Details">
            <TaroShareDrawer
              {...cavansObj}
              onSave={() => console.log("点击保存")}
              onClose={() =>
                this.setState({ cavansObj: { start: false, data: null } })
              }
            ></TaroShareDrawer>
            <View className="shopDetails_banner dakale_nullImage">
              <Banner
                autoplay={
                  filterStrList(activityGoodsImg).length > 1 ? true : false
                }
                imgStyle
                data={filterStrList(activityGoodsImg) || []}
                style={{ width: "100%", height: "100%" }}
                boxStyle={{ width: "100%", height: "100%" }}
              ></Banner>
            </View>
            <View className="shopdetails_price">
              <View className="shopdetails_priceBox">
                <View className="shopdetails_top public_auto">
                  <View className="shopdetails_priceIcon">哒卡乐专享价</View>
                  <View className="shopdetails_time">
                    活动截止日期：
                    {activityTimeRule === "fixed"
                      ? activityEndTime
                      : "长期有效"}
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
                    {format(activityStartTime) || activityTimeRule !== "fixed"
                      ? "门店抢购中"
                      : "即将开抢"}
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
                  onClick={() => Router({ routerName: "interests" })}
                  className="shop_question question_icon"
                ></View>
              </View>
              <View className="shopdetails_getPrice">
                <View className="shopdetails_getPrice_tag">
                  卡豆可抵¥
                  {(realPrice * (payBeanCommission / 100))
                    .toFixed(3)
                    .substring(
                      0,
                      (realPrice * (payBeanCommission / 100)).toFixed(3)
                        .length - 1
                    )}
                </View>

                {setBuyRule(buyRule, dayMaxBuyAmount, maxBuyAmount) && (
                  <View className="shopdetails_getPrice_tag">
                    {setBuyRule(buyRule, dayMaxBuyAmount, maxBuyAmount)}
                  </View>
                )}
              </View>
            </View>

            {merchantSet(specialGoodsInfo)}
            {/* 商品详情 */}
            {goodsType === "package" && (
              <View className="shopdetails_shop_packageGroup">
                <View className="shopdetails_shop_groupTitle">套餐详情</View>
                {packageGroupObjects.map((item) => {
                  const { packageGoodsObjects = [], groupName } = item;
                  return (
                    <View className="shopdetails_shop_package">
                      <View className="shopdetails_package_title font_hide">
                        ·{groupName}（{packageGoodsObjects.length}）
                      </View>
                      {packageGoodsObjects.map((val) => {
                        const { goodsName, goodsNum, goodsPrice } = val;
                        return (
                          <View className="shopdetails_package_goods public_auto">
                            <View>
                              <Text className="shopdetails_package_width font_hide">
                                {goodsName}
                              </Text>
                              <Text>（{goodsNum}份）</Text>
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

            {(goodsDesc || goodsDescImg) && (
              <View className="shopdetails_shop_details">
                <View className="shopdetails_shop_merchantDetails">
                  商品描述
                </View>
                {goodsDesc && (
                  <View className="shopdetails_dec">
                    <Text>{goodsDesc.replace(/\\n/g, "\n")}</Text>
                  </View>
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
              </View>
            )}

            {/*使用须知*/}
            {knowPay(specialGoodsInfo)}
            {/*使用方法*/}
            {Instruction()}
            {/*使用规则*/}
            {payNeed()}
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
                    {((Number(realPrice) / Number(oriPrice)) * 10).toFixed(1)}折
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
