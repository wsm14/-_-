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
  backgroundObj,
  saveCollection,
  deleteCollection,
  toast,
} from "@/common/utils";
import "./index.scss";
import { loginBtn } from "@/common/authority";
import ActivityStatus from "./components/index";
import { getShareParamInfo, getShareInfo } from "@/server/common";
import { fetchUserShareCommission } from "@/server/index";
import TaroShareDrawer from "./components/TaroShareDrawer";
import { rssConfigData } from "./components/data";
import ButtonView from "@/components/Button";
import { payNeed } from "@/components/componentView/NeedPay";
import { knowPay } from "@/components/componentView/KnowPay";
import Card from "./components/wechant_card";
import VideoBean from "./components/getVideoBean";
import Router from "@/common/router";
import Date from "@/components/dateTime";
import {
  Instruction,
  merchantSet,
} from "@/components/componentView/Instruction";
import Toast from "@/components/dakale_toast";
import classNames from "classnames";
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
        const {
          specialGoodsInfo,
          specialGoodsInfo: { status },
        } = res;
        Taro.stopPullDownRefresh();
        if (status) {
          this.setState({
            specialGoodsInfo,
            index: index + 1,
          });
        } else {
          this.setState({
            specialGoodsInfo: {
              status: "0",
            },
            index: index + 1,
          });
        }
      }
    ).catch((e) => {
      Taro.stopPullDownRefresh();
    });
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
        path: `/pages/perimeter/favourableDetails/index?sh  areUserId=${userIdString}&shareUserType=user&merchantId=${merchantId}&specialActivityId=${specialActivityId}`,
      };
    } else {
      return {
        title: goodsName,
        imageUrl: img,
      };
    }
  }

  setCollection() {
    const {
      specialGoodsInfo: { userCollectionStatus = "0", specialActivityIdString },
      specialGoodsInfo,
    } = this.state;
    if (userCollectionStatus === "0") {
      saveCollection(
        {
          collectionType: "special",
          collectionId: specialActivityIdString,
        },
        (res) => {
          this.setState(
            {
              specialGoodsInfo: {
                ...specialGoodsInfo,
                userCollectionStatus: "1",
              },
            },
            (res) => {
              toast("收藏成功");
            }
          );
        }
      );
    } else {
      deleteCollection(
        {
          collectionType: "special",
          collectionId: specialActivityIdString,
        },
        (res) => {
          this.setState(
            {
              specialGoodsInfo: {
                ...specialGoodsInfo,
                userCollectionStatus: "0",
              },
            },
            (res) => {
              toast("取消成功");
            }
          );
        }
      );
    }
  }

  onShareTimeline() {
    const {
      specialGoodsInfo: { goodsName },
      httpData: { merchantId, specialActivityId },
    } = this.state;
    let userInfo = loginStatus() || {};
    let img = specialGoodsInfo.activityGoodsImg.split(",")[0];
    const { userIdString } = userInfo;
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

  saveGoodsOrder() {
    const {
      specialGoodsInfo: {
        merchantIdString,
        personLimit,
        dayMaxBuyAmount,
        boughtActivityGoodsNum,
        buyRule,
        specialActivityIdString,
      },
    } = this.state;
    if (buyRule === "dayLimit" && dayMaxBuyAmount === boughtActivityGoodsNum) {
      this.setState({
        visible: true,
      });
      return;
    } else if (
      buyRule === "personLimit" &&
      personLimit === boughtActivityGoodsNum
    ) {
      console.log(222);
      this.setState({
        visible: true,
      });
      return;
    }
    Router({
      routerName: "favourableOrder",
      args: {
        merchantId: merchantIdString,
        specialActivityId: specialActivityIdString,
      },
    });
  }
  onPullDownRefresh() {
    Taro.stopPullDownRefresh();
    this.getDetailsById();
    this.fetchUserShareCommission();
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
        remain,
        userCollectionStatus,
        personLimit,
        buyUserImageList,
      },
      visible,
      configUserLevelInfo: { payBeanCommission = 50, shareCommission = 0 },
      specialGoodsInfo,
      cavansObj,
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
      } else if (remain === 0) {
        return (
          <ButtonView>
            <View className="shopdetails_shop_goshop shopdetails_shop_option">
              已售罄
            </View>
          </ButtonView>
        );
      } else if (shareCommission !== 0) {
        return (
          <View className="shopdetails_kol_goshop">
            <ButtonView>
              <View
                className="shopdetails_kol_btnBox shopdetails_kol_btnColor1"
                onClick={() => loginBtn(() => this.saveGoodsOrder())}
              >
                <View className="shopdetails_kol_font1">自购返</View>
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
              onClick={() => loginBtn(() => this.saveGoodsOrder())}
            >
              立即抢购
            </View>
          </ButtonView>
        );
      }
    };
    const template = () => {
      if (!format(activityStartTime) && activityTimeRule === "fixed") {
        return (
          <View className="shopdetails_null_status public_center">
            即将开始
          </View>
        );
      } else {
        return (
          <View className="shopdetails_pay_status">
            {activityTimeRule !== "infinite" ? (
              <Date type={true} times={activityEndTime} fn={() => {}}></Date>
            ) : (
              <View className="font28">长期有效</View>
            )}
            <View className="shopdetails_pay_logo">
              {buyUserImageList.map((item, index) => {
                if (index === 0) {
                  return (
                    <View
                      className="shopdetail_profile_box dakale_profile"
                      style={backgroundObj(item)}
                    ></View>
                  );
                } else {
                  return (
                    <View
                      className="shopdetail_profile_box dakale_profile shopdetail_profile_left"
                      style={backgroundObj(item)}
                    ></View>
                  );
                }
              })}
              <View className="shopdetail_left_pay">抢购中</View>
            </View>
          </View>
        );
      }
    };
    if (Object.keys(specialGoodsInfo).length > 0) {
      if (status !== "0") {
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
              <View className="shopdetails_priceBox public_auto">
                <View className="shopdetails_left">
                  <View className="shopdetails_priceIcon">哒卡乐专享价</View>
                  <View className="shopdetails_setprice">
                    <Text className="shopdetails_bigFont">¥</Text>
                    {realPrice || "--"}
                    <Text className="shopdetails_lineFont">
                      ¥ {oriPrice || "--"}
                    </Text>
                  </View>
                </View>
                <View className="shopdetails_right">{template()}</View>
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
                  <View className="shopDetails_tab_questionRight">
                    卡豆抵扣
                    <Text className="color11">{payBeanCommission + "%"}</Text>
                  </View>
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
                {remain === 0 && (
                  <View className="shopdetails_getPrice_tag">已售罄</View>
                )}
              </View>
              <View className="shopdetails_setting public_auto">
                <ButtonView>
                  <View
                    onClick={() => this.setCollection()}
                    className={classNames(
                      userCollectionStatus === "1"
                        ? "shopdetails_isCollect"
                        : "shopdetails_collect"
                    )}
                  >
                    { userCollectionStatus === "1"?'已收藏':'收藏'}
                  </View>
                </ButtonView>
                <ButtonView>
                  <View
                    onClick={() => this.getShareInfo()}
                    className="shopdetails_share"
                  >
                    分享
                  </View>
                </ButtonView>
              </View>
            </View>
            <View
              className="shopdetails_share_info public_auto color11"
              onClick={() =>
                Router({
                  routerName: "download",
                })
              }
            >
              <View>{"升级哒人，立享好友消费佣金 & 更高卡豆抵扣比例"}</View>
              <View>{">"}</View>
            </View>
            <Card></Card>
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
              <VideoBean
                price={(realPrice * (payBeanCommission / 100))
                  .toFixed(3)
                  .substring(
                    0,
                    (realPrice * (payBeanCommission / 100)).toFixed(3).length -
                      1
                  )}
                data={specialGoodsInfo}
              ></VideoBean>
              {payBtn()}
            </View>
            {visible && (
              <Toast
                title={"哒卡乐温馨提示"}
                close={() => this.setState({ visible: false })}
              >
                <View className="shop_dakale_content">
                  {buyRule === "dayLimit" ? (
                    <>
                      <View>
                        每人每天限购{dayMaxBuyAmount}
                        份，您今天已享受本次优惠，请明天再来
                      </View>
                    </>
                  ) : (
                    <View>每人限购{personLimit}份，您已享受本次优惠</View>
                  )}
                </View>
              </Toast>
            )}
          </View>
        );
      } else {
        return <ActivityStatus></ActivityStatus>;
      }
    } else return null;
  }
}
export default MerchantDetails;
