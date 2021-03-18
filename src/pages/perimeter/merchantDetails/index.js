import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { ScrollView, Text, View } from "@tarojs/components";
import Banner from "@/components/banner";
import { coupons, billboard, shopDetails } from "@/components/publicShopStyle";
import MarkPhone from "@/components/payTelephone";
import { wxapiGet, perimeter } from "@/api/api";
import { httpGet } from "@/api/newRequest";
import APPShare from "@/components/shareApp";
import { scanCode } from "@/common/authority";
import Toast from "@/components/beanToast";
import Waterfall from "@/components/waterfall";
import classNames from "classnames";
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
import evens from "@/common/evens";
import Coupons from "@/components/coupon";
import { getAvailableCoupon } from "@/server/coupon";

class MerchantDetails extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      merchantHttpData: {
        merchantId: getCurrentInstance().router.params.merchantId,
      },
      banner: {
        bannerType: "merchant",
        merchantId: getCurrentInstance().router.params.merchantId,
      },
      userMerchant: {},
      bannerList: [],
      userMerchantInfo: {},
      userInfo: {
        userId: getCurrentInstance().router.params.shareUserId,
      },
      shareStatus: getCurrentInstance().router.params.type,
      countStatus: true,
      visible: false,
      specialGoodsList: [],
      goodsList: [],
      getBeanStatus: false,
      conpouVisible: false,
      couponList: [],
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
    const { scene } = getCurrentInstance().router.params;
    const { merchantHttpData, banner,userInfo } = this.state;
    if (scene) {
      getShareParamInfo({ uniqueKey: scene }, (res) => {
        const {
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
              banner: { ...banner, ...param },
              userInfo: {
                userId: param.shareUserId,
              },
            },
            (res) => {
              this.getBannerList();
              this.getListRecommend();
              this.getMerchantById();
              this.getGoodList();
            }
          );
        }
      });
    } else {
      this.getBannerList();
      this.getListRecommend();
      this.getMerchantById();
      this.getGoodList();
    }
  }

  componentDidShow() {}

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

  getBannerList() {
    const { banner } = this.state;
    httpGet(
      {
        data: banner,
        url: wxapiGet.wechatUserBanner,
      },
      (res) => {
        const { bannerList } = res;
        this.setState({
          bannerList,
        });
      }
    );
  }

  //获取商家轮播图
  getListRecommend() {
    const { merchantHttpData } = this.state;
    return httpGet(
      {
        data: merchantHttpData,
        url: wxapiGet.wechatListRecommend,
      },
      (res) => {
        this.setState({
          userMerchant: res,
        });
      }
    );
  }
  onShareAppMessage() {
    const {
      userMerchant: { merchantName, merchantCoverImg },
      merchantHttpData: { merchantId },
    } = this.state;
    let userInfo = loginStatus() || {};
    const { userIdString } = userInfo;
    if (loginStatus()) {
      return {
        title: merchantName,
        imageUrl: merchantCoverImg,
        path: `/pages/perimeter/merchantDetails/index?shareUserId=${userIdString}&shareUserType=user&merchantId=${merchantId}`,
      };
    } else {
      return {
        title: merchantName,
        imageUrl: merchantCoverImg,
      };
    }
  }

  onShareTimeline() {
    const {
      userMerchant: { merchantName, merchantCoverImg },
      merchantHttpData: { merchantId },
    } = this.state;
    let userInfo = loginStatus() || {};
    const { userIdString } = userInfo;
    if (loginStatus()) {
      return {
        title: merchantName,
        imageUrl: merchantCoverImg,
        path: `/pages/perimeter/merchantDetails/index?shareUserId=${userIdString}&shareUserType=user&merchantId=${merchantId}`,
      };
    } else {
      return {
        title: merchantName,
        imageUrl: merchantCoverImg,
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
      userMerchant,
      shareStatus,
      userMerchant: { merchantCoverImg, merchantName, topCategoryValue },
      bannerList,
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
      },
      visible,
      specialGoodsList,
      goodsList,
      getBeanStatus,
      conpouVisible,
      couponList,
      userInfo: { userId },
    } = this.state;
    if (Object.keys(userMerchantInfo).length > 0) {
      return (
        <View className="merchantBox">
          {shareStatus == "share" ||
            (userId && (
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
            ))}
          <Banner
            autoplay={bannerList.length > 1 ? true : false}
            imgStyle
            data={bannerList}
            imgName={"coverImg"}
            style={{ width: "100%", height: Taro.pxTransform(440) }}
            boxStyle={{ width: "100%", height: Taro.pxTransform(440) }}
          ></Banner>
          <View className="merchantDetails_shop">
            <View className="merchant_name font_noHide">{merchantName}</View>
            <View className="merchant_desc">
              「{businessHub && businessHub + "·"}
              {categoryName}{" "}
              {perCapitaConsumption && "人均" + perCapitaConsumption + "元"}」
            </View>
            <View className="merchant_tag">
              {filterStrList(tag).map((item) => {
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
            <View
              className="share_btn public_center"
              onClick={() =>
                navigateTo(
                  `/pages/newUser/merchantDetails/index?userId=${userIdString}`
                )
              }
            >
              <View className="share_icon"></View>
              <View>看商家分享捡豆</View>
            </View>
            <View className="merchant_shop_details">
              <View
                className="merchat_time"
                onClick={() =>
                  navigateTo(
                    `/pages/perimeter/businessSell/index?services=${services}&businessStatus=${businessStatus}&businessTime=${businessTime}`
                  )
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
                    {services &&
                      services.map((item, index) => {
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
          {/*<View className='merchant_active'>*/}
          {/*  <View className='merchant_active_title'>*/}
          {/*    <View className='merchant_active_iconBox active_icon1'>*/}

          {/*    </View>*/}
          {/*    <View className='merchant_active_biaoti'>*/}
          {/*      到店优惠*/}
          {/*    </View>*/}

          {/*  </View>*/}
          {/*  <View className='merchant_active_dec'>*/}
          {/*    店铺超级优惠权益 到店消费直接抵扣*/}
          {/*  </View>*/}
          {/*  <View className='active_go'></View>*/}
          {/*</View>*/}
          {/*{coupons()}*/}
          {/*{coupons()}*/}
          {/*{coupons()}*/}
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
                <Waterfall
                  list={specialGoodsList}
                  createDom={shopDetails}
                  setWidth={335}
                  style={{ width: Taro.pxTransform(335) }}
                ></Waterfall>
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
              <View className="merchant_layer_limit"></View>
              <View className="merchant_layer_btn2" onClick={() => scanCode()}>
                <View className="merchant_layer_btnBox merchant_layer_btnIcon3"></View>
                <View>到店打卡</View>
              </View>
              <View className="merchant_layer_limit"></View>
              {merchantFollowStatus === "0" ? (
                <View
                  className="merchant_layer_btn2"
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
                  <View className="merchant_layer_btnBox merchant_layer_btnIcon2"></View>
                  <View>关注</View>
                </View>
              ) : (
                <View
                  className="merchant_layer_btn2"
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
                  <View className="merchant_layer_btnBox merchant_layer_btnIcon4"></View>
                  <View>已关注</View>
                </View>
              )}
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
