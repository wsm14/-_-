import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View, Image, RichText } from "@tarojs/components";
import Coupon from "./components/couponTop";
import { getOwnerCouponDetail } from "@/server/perimeter";
import { getShareParamInfo, getShareInfo } from "@/server/common";
import { fetchUserShareCommission } from "@/server/index";
import ButtonView from "@/components/Button";
import { payNeed } from "@/components/componentView/NeedPay";
import { knowPay } from "@/components/componentView/KnowPay";
import {
  format,
  loginStatus,
  computedPrice,
  saveCollection,
  deleteCollection,
  toast,
  filterPath,
} from "@/common/utils";
import Router from "@/common/router";
import { loginBtn } from "@/common/authority";
import NullStatus from "./components/nullStatus";
import { inject, observer } from "mobx-react";
import TaroShareDrawer from "./components/TaroShareDrawer";
import { rssConfigData } from "./components/data";
import Toast from "@/components/dakale_toast";
import Card from "@/components/shopView/represent";
import Merchant from "@/components/shopView/merchant";
import Rule from "@/components/shopView/rule";
import VideoBean from "./components/getVideoBean";
import Recommend from "@/components/couponActive";
import Wares from "@/components/componentView/wares";
import { filterStrList } from "@/common/utils";
import Drawer from "@/components/Drawer";
import RightFlag from "@/components/componentView/rightFlagView";
import "./index.scss";
@inject("store")
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        ...getCurrentInstance().router.params,
      },
      couponDetail: {},
      index: 0,
      configUserLevelInfo: {},
      cavansObj: {
        data: null,
        start: false,
      },
      visible: false,
      mxVisible: false,
      drawerVisible: false,
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
              this.fetchCouponDetail();
            }
          );
        }
      });
    } else {
      this.fetchCouponDetail();
    }
  }
  fetchCouponDetail() {
    const { httpData, index } = this.state;
    getOwnerCouponDetail(httpData, (res) => {
      const { couponDetail } = res;
      const { reduceObject = {}, ownerCouponStatus = "2" } = couponDetail;
      this.setState({
        couponDetail: {
          ...couponDetail,
          ...reduceObject,
          ownerCouponStatus,
        },
        index: index + 1,
      });
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
  filterCoupon() {
    const { couponDetail } = this.state;
    const { activeDate, endDate, delayDays, activeDays } = couponDetail;
    if (activeDate && endDate) {
      return activeDate + "至" + endDate;
    } else {
      return `领取后${delayDays}天生效 | 有效期：${activeDays}天`;
    }
  }
  getShareInfo() {
    const {
      couponDetail: {
        ownerCouponIdString,
        merchantName,
        activityEndTime = "",
        address,
        couponName,
        cityName,
        districtName,
        merchantLogo,
        rightFlag = "0",
        paymentModeObject = {},
      },
      couponDetail,
    } = this.state;
    const { profile, username } = Taro.getStorageSync("userInfo");
    getShareInfo(
      {
        shareType: "reduceCoupon",
        shareId: ownerCouponIdString,
      },
      (res) => {
        const {
          oriPrice,
          realPrice,
          qcodeUrl,
          image,
          saveMoney = "",
          buyPrice,
        } = res;
        this.setState({
          cavansObj: {
            start: true,
            data: rssConfigData({
              merchantName,
              time: this.filterCoupon(),
              oldPrice: oriPrice,
              buyPrice: buyPrice,
              wxCode: qcodeUrl,
              username,
              userProfile: profile,
              name: couponName,
              address,
              city: cityName + districtName + address,
              merchantLogo: image,
              saveMoney,
              rightFlag,
              paymentModeObject,
            }),
          },
          couponDetail: {
            ...couponDetail,
            weChatImg: res.frontImage,
            weChatTitle: res.title,
          },
        });
      }
    );
  }
  filterBeanPrice() {
    const { configUserLevelInfo, couponDetail } = this.state;
    const { payBeanCommission = 50 } = configUserLevelInfo;
    const { userBean, buyPrice } = couponDetail;
    if (userBean >= computedPrice(buyPrice, payBeanCommission) * 100) {
      return parseInt(computedPrice(buyPrice, payBeanCommission) * 100);
    } else {
      return userBean;
    }
  }
  onShareAppMessage(res) {
    const {
      couponDetail: {
        couponName,
        merchantLogo,
        weChatImg = "",
        weChatTitle = "",
      },
      httpData: { merchantId, ownerId, ownerCouponId },
    } = this.state;
    let userInfo = loginStatus() || {};
    const { userIdString } = userInfo;
    if (res.from === "button") {
      return {
        title: weChatTitle || couponName,
        imageUrl: weChatImg || merchantLogo,
        path: `/pages/perimeter/payCouponDetails/index?shareUserId=${userIdString}&shareUserType=user&merchantId=${merchantId}&ownerId=${ownerId}&ownerCouponId=${ownerCouponId}`,
      };
    }
    if (loginStatus()) {
      return {
        title: couponName,
        imageUrl: merchantLogo,
        path: `/pages/perimeter/payCouponDetails/index?shareUserId=${userIdString}&shareUserType=user&merchantId=${merchantId}&ownerId=${ownerId}&ownerCouponId=${ownerCouponId}`,
      };
    } else {
      return {
        title: couponName,
        imageUrl: merchantLogo,
      };
    }
  }
  saveCouponOrder() {
    const {
      couponDetail: {
        merchantIdString,
        ownerIdString,
        ownerCouponIdString,
        personLimit,
        dayMaxBuyAmount,
        boughtCouponNum,
        buyRule,
        rightFlag,
        paymentModeObject = {},
        userBean,
      },
    } = this.state;
    if (buyRule === "dayLimit" && dayMaxBuyAmount === boughtCouponNum) {
      this.setState({
        visible: true,
      });
      return;
    } else if (buyRule === "personLimit" && personLimit === boughtCouponNum) {
      this.setState({
        visible: true,
      });
      return;
    } else if (rightFlag === "1") {
      const { bean, cash } = paymentModeObject;
      if (userBean < bean) {
        this.setState({
          drawerVisible: true,
        });
        return;
      }
    }
    Router({
      routerName: "couponOrder",
      args: {
        merchantId: merchantIdString,
        ownerId: ownerIdString,
        ownerCouponId: ownerCouponIdString,
      },
    });
  }

  setCollection() {
    const {
      couponDetail: {
        userCollectionStatus = "0",
        ownerCouponIdString,
        ownerIdString,
      },
      couponDetail,
    } = this.state;
    if (userCollectionStatus === "0") {
      saveCollection(
        {
          collectionType: "reduce",
          ownerId: ownerIdString,
          collectionId: ownerCouponIdString,
        },
        (res) => {
          this.setState(
            {
              couponDetail: {
                ...couponDetail,
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
          collectionType: "reduce",
          ownerId: ownerIdString,
          collectionId: ownerCouponIdString,
        },
        (res) => {
          this.setState(
            {
              couponDetail: {
                ...couponDetail,
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

  componentDidShow() {
    const { index } = this.state;
    if (index !== 0) {
      this.fetchCouponDetail();
    }
    this.fetchUserShareCommission();
  }
  componentDidMount() {}
  render() {
    const {
      couponDetail,
      configUserLevelInfo,
      configUserLevelInfo: { shareCommission = 0, payBeanCommission = 50 },
      cavansObj,
      couponDetail: {
        couponPrice,
        buyPrice,
        merchantPrice,
        ownerCouponStatus = "1",
        remain,
        buyRule,
        dayMaxBuyAmount,
        personLimit,
        userCollectionStatus,
        anytimeRefund,
        expireRefund,
        ownerCouponIdString,
        userBean,
        couponDetailImg = "",
        paymentModeObject = {},
        couponName,
        rightFlag = "0",
        richText,
      },
      visible,
      httpData,
      mxVisible,
      drawerVisible,
    } = this.state;
    const { bean = "", cash = "" } = paymentModeObject;
    const { login } = this.props.store.authStore;
    const { beanLimitStatus } = this.props.store.homeStore;
    const { beanLimit } = this.props.store.commonStore;
    const shareInfoBtn = () => {
      if (shareCommission > 0 && rightFlag !== "1") {
        return (
          <ButtonView>
            <View
              onClick={() => loginBtn(() => this.getShareInfo())}
              className="shopdetails_shop_btnBox2 shopdetails_shop_btnColor2"
            >
              <View className="shop_price_font">
                <View>分享赚</View>
                <View>
                  ¥{computedPrice(buyPrice - merchantPrice, shareCommission)}
                </View>
              </View>
            </View>
          </ButtonView>
        );
      } else {
        return (
          <ButtonView>
            <View
              onClick={() => loginBtn(() => this.getShareInfo())}
              className="shopdetails_shop_btnBox2 shopdetails_shop_btnColor2"
            >
              分享给好友
            </View>
          </ButtonView>
        );
      }
    };
    const payBtn = () => {
      if (remain === 0) {
        return (
          <View className="shopdetails_shop_btnBox">
            <ButtonView>
              <View className="shopdetails_shop_btnBox1 shopdetails_shop_btnColor1 shopdetails_shop_option">
                已售罄
              </View>
            </ButtonView>
            {shareInfoBtn()}
          </View>
        );
      } else if (shareCommission && rightFlag !== "1") {
        return (
          <View className="shopdetails_shop_btnBox">
            <ButtonView>
              {" "}
              <View
                className="shopdetails_shop_btnBox1 shopdetails_shop_btnColor1"
                onClick={() => loginBtn(() => this.saveCouponOrder())}
              >
                <View className="shop_price_font">
                  <View>自购返</View>
                  <View>
                    ¥{computedPrice(buyPrice - merchantPrice, shareCommission)}
                  </View>
                </View>
              </View>
            </ButtonView>
            {shareInfoBtn()}
          </View>
        );
      } else {
        return (
          <View className="shopdetails_shop_btnBox">
            <ButtonView>
              {" "}
              <View
                className="shopdetails_shop_btnBox1 shopdetails_shop_btnColor1"
                onClick={() => loginBtn(() => this.saveCouponOrder())}
              >
                立即抢购
              </View>
            </ButtonView>
            {shareInfoBtn()}
          </View>
        );
      }
    };
    if (ownerCouponStatus === "1") {
      return (
        <View className="payCoupon_box">
          <TaroShareDrawer
            {...cavansObj}
            onSave={() => console.log("点击保存")}
            onClose={() =>
              this.setState({ cavansObj: { start: false, data: null } })
            }
          ></TaroShareDrawer>
          <Coupon
            configUserLevelInfo={configUserLevelInfo}
            data={couponDetail}
            setCollection={this.setCollection.bind(this)}
            getShareInfo={this.getShareInfo.bind(this)}
            onChange={() =>
              this.setState({
                mxVisible: true,
              })
            }
          ></Coupon>
          <Card
            configUserLevelInfo={configUserLevelInfo}
            data={{
              ...couponDetail,
              allowRefund: anytimeRefund,
              allowExpireRefund: expireRefund,
            }}
          ></Card>

          <Merchant
            serviceType={"coupon"}
            ownerServiceId={ownerCouponIdString}
            data={couponDetail}
          ></Merchant>
          {(couponDetail.couponDetail || couponDetailImg) && (
            <View className="shopdetails_shop_details">
              <View className="shopdetails_shop_merchantDetails">商品描述</View>
              {couponDetail.couponDetail && (
                <View className="shopdetails_dec">
                  <Text>{couponDetail.couponDetail.replace(/\\n/g, "\n")}</Text>
                </View>
              )}
              <View className="shopdetails_Image">
                {couponDetailImg &&
                  filterStrList(couponDetailImg).map((item) => {
                    return (
                      <Image
                        mode="widthFix"
                        src={item}
                        onClick={() => {
                          Taro.previewImage({
                            urls: [item],
                          });
                        }}
                        style={{ width: "100%" }}
                      ></Image>
                    );
                  })}
              </View>
            </View>
          )}
          {richText && (
            <View className="shopdetails_shop_details">
              <View className="shopdetails_shop_merchantDetails">商品描述</View>
              <RichText
                nodes={richText}
                className="temPlateComment_desc"
              ></RichText>
            </View>
          )}
          {/*使用须知*/}
          {knowPay(couponDetail, "coupon")}
          {/*使用方法*/}
          <Rule></Rule>
          {/*使用规则*/}
          <Recommend
            defaultData={couponDetail}
            current={true}
            userInfo={configUserLevelInfo}
          ></Recommend>

          <VideoBean
            price={(buyPrice * (payBeanCommission / 100))
              .toFixed(3)
              .substring(
                0,
                (buyPrice * (payBeanCommission / 100)).toFixed(3).length - 1
              )}
            beanLimit={beanLimit}
            visible={beanLimitStatus === "1"}
            data={couponDetail}
          ></VideoBean>

          <View className="shopdetails_shop_btn">
            {rightFlag === "1" ? (
              <View className="shopdetails_shop_btn">
                <View className="shopdetails_shop_price">
                  <View className="shopdetails_shop_priceTop">
                    <Text className="font20">¥</Text>
                    {cash.toFixed(2)}
                  </View>
                  <View className="shopdetails_shop_real">
                    <Text className="shopdetails_shop_realStatus2">
                      已用{bean}卡豆抵扣
                      {(bean / 100).toFixed(2)}元
                    </Text>
                  </View>
                </View>
                {payBtn()}
              </View>
            ) : (
              <View className="shopdetails_shop_btn">
                <View className="shopdetails_shop_price">
                  <View className="shopdetails_shop_priceTop">
                    <Text className="font20">¥</Text>
                    {(
                      buyPrice - (this.filterBeanPrice() / 100).toFixed(2)
                    ).toFixed(2)}
                  </View>
                  <View className="shopdetails_shop_real">
                    <Text className="shopdetails_shop_realStatus2">
                      已用{this.filterBeanPrice()}卡豆抵扣
                      {(this.filterBeanPrice() / 100).toFixed(2)}元
                    </Text>
                  </View>
                </View>
                {payBtn()}
              </View>
            )}

            {payBtn()}
          </View>
          <Wares
            close={(fn) =>
              this.setState({ mxVisible: false }, (res) => {
                fn && fn();
              })
            }
            visible={mxVisible}
            configUserLevelInfo={configUserLevelInfo}
            data={couponDetail}
            status={beanLimitStatus}
          ></Wares>
          {drawerVisible && (
            <Drawer
              show={drawerVisible}
              close={() => {
                this.setState({
                  drawerVisible: false,
                });
              }}
            >
              <RightFlag
                data={{
                  img: couponDetailImg,
                  name: couponName,
                  price: cash,
                  bean: bean - userBean,
                }}
                close={(e) => {
                  this.setState({ drawerVisible: false }, (res) => {
                    e && e();
                  });
                }}
              ></RightFlag>
            </Drawer>
          )}
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
      return <NullStatus userInfo={configUserLevelInfo}></NullStatus>;
    }
  }
}
export default Index;
