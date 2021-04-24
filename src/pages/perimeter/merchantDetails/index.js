import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { ScrollView, Text, View, Video } from "@tarojs/components";
import Banner from "@/components/banner";
import {
  goodsCard,
  billboard,
  shopDetails,
} from "@/components/publicShopStyle";
import MarkPhone from "@/components/payTelephone";
import { wxapiGet, perimeter } from "@/api/api";
import { httpGet } from "@/api/newRequest";
import APPShare from "@/components/shareApp";
import { scanCode } from "@/common/authority";
import Toast from "@/components/beanToast";
import Waterfall from "@/components/waterfall";
import ButtonView from "@/components/Button";
import { getShareParamInfo } from "@/server/common";
import { getUserCoupon } from "@/server/perimeter";
import {
  backgroundObj,
  saveFollow,
  deleteFollow,
  navigateTo,
  deleteFall,
  saveFall,
  toast,
  onShareFriend,
  onTimeline,
  GetDistance,
  filterSetting,
  filterStrList,
  getLat,
  getLnt,
  filterTime,
  mapGo,
  loginStatus,
} from "@/common/utils";
import "./merchantDetails.scss";
import Coupons from "@/components/coupon";
import { coupon } from "@/components/componentView/CouponView";
import { getAvailableCoupon } from "@/server/coupon";
import Router from "@/common/router";
import classNames from "classnames";
class MerchantDetails extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      merchantHttpData: {
        merchantId: getCurrentInstance().router.params.merchantId,
      },
      bannerList: [],
      userMerchantInfo: {},
      userInfo: {
        userId: getCurrentInstance().router.params.shareUserId,
      },
      countStatus: true,
      visible: false,
      specialGoodsList: [],
      goodsList: [],
      getBeanStatus: false,
      conpouVisible: false,
      couponList: [],
      priceCoupon: [],
    };
  }

  componentDidMount() {
    if (getCurrentInstance().router.params.beanAmount) {
      this.getAvailable();
    }
  }
  getAvailable() {
    getAvailableCoupon(
      {
        identifyId: getCurrentInstance().router.params.merchantId,
        channel: "mark",
        merchantId: getCurrentInstance().router.params.merchantId,
      },
      (res) => {
        const { couponList } = res;
        this.setState({
          couponList,
        });
      }
    );
  }
  componentWillMount() {
    if (getCurrentInstance().router.params.beanAmount) {
      this.setState({
        getBeanStatus: true,
      });
    }
    let { scene } = getCurrentInstance().router.params;
    let { merchantHttpData, banner, userInfo } = this.state;
    if (scene) {
      getShareParamInfo({ uniqueKey: scene }, (res) => {
        let {
          shareParamInfo: { param },
        } = res;
        if (param && JSON.parse(param)) {
          param = JSON.parse(param);
          this.setState(
            {
              merchantHttpData: {
                ...merchantHttpData,
                ...param,
              },
              userInfo: {
                userId: param.shareUserId,
              },
            },
            (res) => {
              this.getMerchantById();
              this.getGoodList();
              this.getUserCoupon();
            }
          );
        }
      });
    } else {
      this.getMerchantById();
      this.getGoodList();
      this.getUserCoupon();
    }
  }

  componentDidShow() {}

  getUserCoupon() {
    const { merchantHttpData } = this.state;
    getUserCoupon({ ...merchantHttpData, page: 1, limit: 3 }, (res) => {
      const { couponList } = res;
      this.setState({
        priceCoupon: couponList,
      });
    });
  }

  getGoodList() {
    const {
      merchantDetails: { getListMerchant },
    } = perimeter;
    const {
      merchantHttpData: { merchantId },
    } = this.state;
    return httpGet(
      {
        data: { merchantId: merchantId },
        url: getListMerchant,
      },
      (res) => {
        const { goodsList } = res;
        this.setState({
          goodsList,
        });
      }
    );
  }

  //获取商家信息
  getMerchantById() {
    const { merchantHttpData } = this.state;
    return httpGet(
      {
        data: merchantHttpData,
        url: wxapiGet.wechatGetUserMerchant,
      },
      (res) => {
        const { userMerchant } = res;
        this.setState(
          {
            userMerchantInfo: { ...userMerchant },
          },
          (res) => {
            this.getMerchantLove();
          }
        );
      }
    );
  }

  //获取商家轮播图

  onShareAppMessage() {
    const {
      userMerchantInfo: { merchantName, coverImg },
      merchantHttpData: { merchantId },
    } = this.state;
    let userInfo = loginStatus() || {};
    const { userIdString } = userInfo;
    if (loginStatus()) {
      return {
        title: merchantName,
        imageUrl: coverImg,
        path: `/pages/perimeter/merchantDetails/index?shareUserId=${userIdString}&shareUserType=user&merchantId=${merchantId}`,
      };
    } else {
      return {
        title: merchantName,
        imageUrl: coverImg,
      };
    }
  }

  onShareTimeline() {
    const {
      userMerchantInfo: { merchantName, coverImg },
      merchantHttpData: { merchantId },
    } = this.state;
    let userInfo = loginStatus() || {};
    const { userIdString } = userInfo;
    if (loginStatus()) {
      return {
        title: merchantName,
        imageUrl: coverImg,
        path: `/pages/perimeter/merchantDetails/index?shareUserId=${userIdString}&shareUserType=user&merchantId=${merchantId}`,
      };
    } else {
      return {
        title: merchantName,
        imageUrl: coverImg,
      };
    }
  }

  getMerchantLove() {
    const {
      userMerchantInfo: { merchantId },
    } = this.state;
    const { getMerchantSpecialGoods } = perimeter;
    httpGet(
      {
        url: getMerchantSpecialGoods,
        data: {
          merchantId: merchantId,
          page: 1,
          limit: 6,
        },
      },
      (res) => {
        const { specialGoodsList } = res;
        this.setState({
          specialGoodsList: specialGoodsList,
        });
      }
    );
  }
  //猜你喜欢
  render() {
    const {
      userMerchantInfo,
      userMerchantInfo: {
        businessHub,
        perCapitaConsumption,
        businessStatus,
        businessTime,
        allImgs,
        services,
        address,
        districtName,
        categoryName,
        lat,
        lnt,
        userIdString,
        telephone,
        merchantFollowStatus,
        tag,
        merchantId,
        merchantName,
        headerContentObject = {},
        scenesNames = "",
      },
      visible,
      specialGoodsList,
      goodsList,
      getBeanStatus,
      conpouVisible,
      couponList,
      priceCoupon = [],
      userInfo: { userId },
    } = this.state;
    const {
      headerType = "image",
      imageUrl = "",
      mp4Url = "",
    } = headerContentObject;
    const templateTitle = () => {
      if (headerType === "image") {
        return (
          <Banner
            autoplay={imageUrl.split(",").length > 1 ? true : false}
            imgStyle
            data={imageUrl ? imageUrl.split(",") : []}
            imgName={"coverImg"}
            style={{ width: "100%", height: Taro.pxTransform(440) }}
            boxStyle={{ width: "100%", height: Taro.pxTransform(440) }}
          ></Banner>
        );
      } else {
        return (
          <Video
            style={{ width: "100%", height: Taro.pxTransform(440) }}
            autoplay
            showMuteBtn
            src={mp4Url}
          ></Video>
        );
      }
    };
    if (Object.keys(userMerchantInfo).length > 0) {
      return (
        <View className="merchantBox">
          {userId && (
            <APPShare
              {...{
                content: "我在哒卡乐发现一家实惠的店铺",
                userId: userId,
                jumpObj: {
                  jumpUrl: "shopDetailPage",
                  id: merchantId,
                  type: "jumpToPage",
                  jumpType: "native",
                  path: "DKLShopDetailViewController",
                  params: {
                    shopId: merchantId,
                  },
                },
              }}
            ></APPShare>
          )}
          {templateTitle()}
          <View className="merchantDetails_shop">
            <View className="merchant_name font_noHide">{merchantName}</View>
            <View className="merchant_desc">
              「{businessHub && businessHub + "·"}
              {categoryName}{" "}
              {perCapitaConsumption && "人均" + perCapitaConsumption + "元"}」
            </View>
            <View className="merchant_tag">
              {filterStrList(scenesNames).map((item) => {
                return <View className="merchat_tag_box">{item}</View>;
              })}
            </View>
            <ScrollView scrollX className="merchant_shopImg">
              {filterStrList(allImgs).map((item) => {
                return (
                  <View
                    className="shopImgBox"
                    style={{ ...backgroundObj(item) }}
                  ></View>
                );
              })}
            </ScrollView>
            <View className="share_btn public_auto">
              <ButtonView>
                {" "}
                <View
                  className="share_goMerchant_btn"
                  onClick={() =>
                    navigateTo(
                      `/pages/newUser/merchantDetails/index?userId=${userIdString}`
                    )
                  }
                >
                  去主页
                </View>
              </ButtonView>
              <ButtonView>
                {" "}
                {merchantFollowStatus === "0" ? (
                  <View
                    className="share_saveColleton_btn"
                    onClick={() =>
                      saveFollow(
                        {
                          followType: "merchant",
                          followUserId: userIdString,
                        },
                        (res) => {
                          this.setState(
                            {
                              userMerchantInfo: {
                                ...this.state.userMerchantInfo,
                                merchantFollowStatus: "1",
                              },
                            },
                            () => {
                              toast("关注成功");
                            }
                          );
                        }
                      )
                    }
                  >
                    关注
                  </View>
                ) : (
                  <View
                    className="share_updateColleton_btn"
                    onClick={() =>
                      deleteFollow({ followUserId: userIdString }, (res) => {
                        this.setState(
                          {
                            userMerchantInfo: {
                              ...this.state.userMerchantInfo,
                              merchantFollowStatus: "0",
                            },
                          },
                          () => {
                            toast("取消成功");
                          }
                        );
                      })
                    }
                  >
                    已关注
                  </View>
                )}
              </ButtonView>
            </View>

            <View className="merchant_shop_details">
              <View
                className="merchat_time"
                onClick={() =>
                  Router({
                    routerName: "businessSell",
                    args: {
                      merchantId,
                    },
                  })
                }
              >
                <View className="merchant_time_go"></View>
                <View className="merchant_time_box">
                  <View className="merchant_bisinissStatus">
                    <Text>
                      {businessStatus === "0" ? "休息中 | " : "营业中 | "}
                    </Text>
                    <Text style={{ color: "rgba(153, 153, 153, 1)" }}>
                      {businessTime}
                    </Text>
                  </View>
                  <View className="merchant_time_tags">
                    {[filterStrList(tag), ...services].map((item, index) => {
                      if (index < 5) {
                        return (
                          <View className={"merchant_tag_shop"}>{item}</View>
                        );
                      }
                    })}
                  </View>
                </View>
              </View>
              <View className="merchat_city_accress">
                <View className="merchant_accBox">
                  <View
                    className="merchant_city_icon1"
                    onClick={() =>
                      mapGo({
                        lat,
                        lnt,
                        address,
                        merchantName: merchantName,
                      })
                    }
                  ></View>
                  <View className="merchant_city_icon2"></View>
                  <View
                    className="merchant_city_icon3"
                    onClick={() => this.setState({ visible: true })}
                  ></View>
                </View>
                <View className="merchat_city_details">
                  <View className="merchat_city_names font_hide">
                    {address}
                  </View>
                  <View className="merchat_city_limit">
                    距您{GetDistance(getLat(), getLnt(), lat, lnt) + " "}{" "}
                    {filterSetting(GetDistance(getLat(), getLnt(), lat, lnt))}
                  </View>
                </View>
              </View>
            </View>
          </View>
          {priceCoupon.length > 0 && (
            <React.Fragment>
              <View
                onClick={() =>
                  Router({
                    routerName: "payCouponList",
                    args: {
                      merchantId: merchantId,
                    },
                  })
                }
                className="merchant_active"
              >
                <View className="merchant_active_title">
                  <View className="merchant_active_iconBox active_icon1"></View>
                  <View className="merchant_active_biaoti">到店优惠</View>
                </View>
                <View className="merchant_active_dec">
                  店铺超级优惠权益 到店消费直接抵扣
                </View>
                <View className="active_go"></View>
              </View>

              {priceCoupon.map((item) => {
                return coupon(item);
              })}
            </React.Fragment>
          )}

          {specialGoodsList.length > 0 && (
            <>
              <View
                className="merchant_active"
                onClick={() =>
                  navigateTo(
                    `/pages/perimeter/special/index?merchantId=${merchantId}`
                  )
                }
              >
                <View className="merchant_active_title">
                  <View className="merchant_active_iconBox active_icon2"></View>
                  <View className="merchant_active_biaoti">特价活动</View>
                </View>
                <View className="merchant_active_dec">
                  店铺超限时特价活动 限时限量
                </View>
                <View className="active_go"></View>
              </View>
              <View className="merchant_newPrice">
                {specialGoodsList.length > 1 ? (
                  <Waterfall
                    list={specialGoodsList}
                    createDom={shopDetails}
                    setWidth={335}
                    style={{ width: Taro.pxTransform(335) }}
                  ></Waterfall>
                ) : (
                  goodsCard(specialGoodsList[0])
                )}
              </View>
            </>
          )}

          {goodsList && goodsList.length > 0 && (
            <>
              <View className="merchant_active">
                <View className="merchant_active_title">
                  <View className="merchant_active_iconBox active_icon3"></View>
                  <View className="merchant_active_biaoti">商品橱窗</View>
                </View>
                <View className="merchant_active_dec">本店商品展示</View>
              </View>
              <ScrollView scrollX className="merchant_billboard">
                {goodsList.map((item, index) => {
                  return billboard(this, item, userIdString);
                })}
              </ScrollView>
            </>
          )}
          <View className="merchant_layer">
            <View className="merchant_layer_btn">
              <View className="merchant_layer_btn1" onClick={() => scanCode()}>
                <View className="merchant_layer_btnBox merchant_layer_btnIcon1"></View>
                <View>买单</View>
              </View>
              <View className="merchant_layer_btn2" onClick={() => scanCode()}>
                <View className="merchant_layer_btnBox merchant_layer_btnIcon3"></View>
                <View>到店打卡</View>
              </View>
            </View>
            <View
              className="merchant_shop"
              onClick={() => this.setState({ visible: true })}
            >
              预约/预定
            </View>
          </View>
          {getBeanStatus && (
            <Toast
              data={{
                beanAmount:
                  getCurrentInstance().router.params.beanAmount || "0",
              }}
              show={getBeanStatus}
              visible={() => {
                if (couponList.length > 0) {
                  this.setState({
                    getBeanStatus: false,
                    conpouVisible: true,
                  });
                } else {
                  this.setState({
                    getBeanStatus: false,
                  });
                }
              }}
            ></Toast>
          )}
          {visible && (
            <MarkPhone
              onClose={() => this.setState({ visible: false })}
              onCancel={() => this.setState({ visible: false })}
              data={filterStrList(telephone)}
            ></MarkPhone>
          )}
          {conpouVisible && (
            <Coupons
              title={"到店打卡大礼包"}
              visible={() => {
                this.setState({ conpouVisible: false });
              }}
              type={"mark"}
              data={couponList}
            ></Coupons>
          )}
        </View>
      );
    }
    return null;
  }
}

export default MerchantDetails;
