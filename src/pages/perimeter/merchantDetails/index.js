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
      getMerchantDetails: {
        merchantId: getCurrentInstance().router.params.merchantId,
        page: 1,
        limit: 5,
      },
      shareStatus: getCurrentInstance().router.params.type,
      kolMomentsList: [],
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
    this.getBannerList();
    this.getListRecommend();
    this.getMerchantById();
    this.getMerchantDetails();
    this.getGoodList();
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
  }

  componentDidShow() {
    evens.$on("updateList", this.updateList.bind(this));
  }

  getGoodList() {
    const {
      merchantDetails: { getListMerchant },
    } = perimeter;
    return httpGet(
      {
        data: { merchantId: getCurrentInstance().router.params.merchantId },
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

  getMerchantDetails() {
    const {
      merchantDetails: { getMomentByMerchantId },
    } = perimeter;
    const { getMerchantDetails, countStatus } = this.state;
    return httpGet(
      {
        data: getMerchantDetails,
        url: getMomentByMerchantId,
      },
      (res) => {
        const { kolMomentsList } = res;
        if (kolMomentsList && kolMomentsList.length > 0) {
          return this.setState({
            kolMomentsList: [...this.state.kolMomentsList, ...kolMomentsList],
          });
        }
        return this.setState({
          countStatus: false,
        });
      }
    );
  }

  updateList(obj) {
    const { kolMomentsList } = this.state;
    let list = kolMomentsList.map((item) => {
      if (item["kolMomentsId"] === obj["kolMomentId"]) {
        obj["kolMomentsId"] = item["kolMomentsId"];
        return obj;
      }
      return item;
    });
    this.setState({
      kolMomentsList: list,
    });
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
    } = this.state;
    return onShareFriend({
      title: merchantName,
      img: merchantCoverImg,
    });
  }

  onShareTimeline() {
    const {
      userMerchant: { merchantName, merchantCoverImg },
    } = this.state;
    return onTimeline({
      title: merchantName,
      img: merchantCoverImg,
    });
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

  //获取商家猜你喜欢
  exploreShop(data, index) {
    const {
      kolMomentsId,
      contentType,
      userId,
      userIdString,
      likeAmount,
      topicName,
      frontImage,
      beanAmount,
      length,
      title,
      username,
      userProfile,
      imageNum,
      frontImageWidth,
      frontImageHeight,
      watchStatus,
      merchantLnt,
      merchantLat,
      merchantAddress,
      userLikeStatus,
      beanFlag,
      couponList,
      conpouVisible,
    } = data;
    return (
      <View className="explore_box">
        <View
          className="explore_img dakale_nullImage"
          style={{ ...backgroundObj(frontImage) }}
          onClick={() => {
            if (contentType === "video") {
              navigateTo(
                `/pages/kol/shareVideo/index?kolMomentId=${kolMomentsId}`
              );
            } else {
              navigateTo(
                `/pages/kol/shareImage/index?kolMomentId=${kolMomentsId}`
              );
            }
          }}
        >
          {contentType == "video" ? (
            <View className="explore_share_imgTag">
              {filterTime(length || "0")}
            </View>
          ) : (
            <View className="explore_share_videoTag">
              <View className="explore_share_imgIcon"></View>
              <View className="explore_share_imgfont">{imageNum}</View>
            </View>
          )}
          {contentType == "video" && <View className="explore_video"></View>}
          <View className="explore_share_accress">
            <View className="explore_share_limitIcon"></View>
            <View className="explore_share_limit">
              {""} {merchantAddress || ""}{" "}
            </View>
          </View>
        </View>
        <View className="explore_message font_noHide">
          {topicName && (
            <View className="tip_box">
              <View className="explore_tip font_hide">{"#" + topicName}</View>
            </View>
          )}
          {title}
        </View>
        {beanFlag === "1" && (
          <View
            className={classNames(
              "explore_bean",
              watchStatus === "1" && "getbeanColor2"
            )}
          >
            <View
              className={classNames(
                "explore_lookGet",
                watchStatus === "0" ? "explore_beanBg1" : "explore_beanBg2"
              )}
            ></View>
            {watchStatus === "1"
              ? `已捡${beanAmount}卡豆`
              : `观看可捡${beanAmount}卡豆`}
          </View>
        )}
        <View className="explore_user">
          <View
            className="explore_user_left"
            onClick={() =>
              navigateTo(
                `/pages/newUser/userDetails/index?userStingId=${userIdString}&type=share`
              )
            }
          >
            <View
              className="explore_user_profile"
              style={{ ...backgroundObj(userProfile) }}
            ></View>
            <View className="explore_user_name font_hide">{username}</View>
          </View>
          <View className="explore_user_right">
            <View
              className={classNames(
                "explore_user_zan ",
                userLikeStatus === "1"
                  ? "explore_user_zan_bg1"
                  : "explore_user_zan_bg2"
              )}
              onClick={(e) => {
                e.stopPropagation();
                const { kolMomentsList } = this.state;
                if (userLikeStatus === "1") {
                  deleteFall(
                    {
                      kolMomentsId: kolMomentsId,
                    },
                    () => {
                      const kolMomentsInfo = {
                        ...kolMomentsList[index],
                        userLikeStatus: "0",
                        likeAmount: kolMomentsList[index].likeAmount - 1,
                      };
                      const list = kolMomentsList.map((item, indexs) => {
                        if (index === indexs) {
                          return kolMomentsInfo;
                        } else return item;
                      });
                      this.setState({
                        kolMomentsList: list,
                      });
                    }
                  );
                } else {
                  saveFall(
                    {
                      kolMomentsId: kolMomentsId,
                    },
                    () => {
                      const kolMomentsInfo = {
                        ...kolMomentsList[index],
                        userLikeStatus: "1",
                        likeAmount: kolMomentsList[index].likeAmount + 1,
                      };
                      const list = kolMomentsList.map((item, indexs) => {
                        if (index === indexs) {
                          return kolMomentsInfo;
                        } else return item;
                      });
                      this.setState({
                        kolMomentsList: list,
                      });
                    }
                  );
                }
              }}
            ></View>
            <View className="explore_user_number">{likeAmount}</View>
          </View>
        </View>
      </View>
    );
  }

  onReachBottom() {
    const { getMerchantDetails, countStatus } = this.state;
    if (countStatus) {
      this.setState(
        {
          getMerchantDetails: {
            ...getMerchantDetails,
            page: getMerchantDetails.page + 1,
          },
        },
        (res) => {
          this.getMerchantDetails();
        }
      );
    } else {
      // return toast("暂无数据");
    }
  } //上拉加载
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
      kolMomentsList,
      visible,
      specialGoodsList,
      goodsList,
      getBeanStatus,
      conpouVisible,
      couponList,
    } = this.state;
    if (Object.keys(userMerchantInfo).length > 0) {
      return (
        <View className="merchantBox">
          {shareStatus == "share" && (
            <APPShare
              {...{
                content: "我在哒卡乐发了一篇有趣的图文",
                userId: getCurrentInstance().router.params.shareUserId,
                jumpObj: {
                  jumpUrl: "shopDetailPage",
                  id: getCurrentInstance().router.params.merchantId,
                  type: "jumpToPage",
                  jumpType: "native",
                  path: "DKLShopDetailViewController",
                  params: {
                    shopId: getCurrentInstance().router.params.merchantId,
                  },
                },
              }}
            ></APPShare>
          )}
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
              <ScrollView className="merchant_newPrice">
                {specialGoodsList.map((item) => {
                  return shopDetails(item);
                })}
              </ScrollView>
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
                  return billboard(this, item,userIdString);
                })}
              </ScrollView>
            </>
          )}
          {kolMomentsList && kolMomentsList.length > 0 && (
            <>
              <View className="merchant_active">
                <View className="merchant_active_title">
                  <View className="merchant_active_iconBox active_icon4"></View>
                  <View className="merchant_active_biaoti">探店分享</View>
                </View>
                <View className="merchant_active_dec">哒人分享 精彩推荐</View>
              </View>
              {kolMomentsList.map((item, index) => {
                return this.exploreShop(item, index);
              })}
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
              立即预约
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
