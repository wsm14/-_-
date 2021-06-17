import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import Coupon from "./components/couponTop";
import { getOwnerCouponDetail } from "@/server/perimeter";
import { getShareParamInfo, getShareInfo } from "@/server/common";
import { fetchUserShareCommission } from "@/server/index";
import ButtonView from "@/components/Button";
import { payNeed } from "@/components/componentView/NeedPay";
import { knowPay } from "@/components/componentView/KnowPay";
import {
  Instruction,
  merchantSet,
} from "@/components/componentView/Instruction";
import {
  format,
  loginStatus,
  computedPrice,
  saveCollection,
  deleteCollection,
  toast,
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
      const { reduceObject = {} } = couponDetail;
      this.setState({
        couponDetail: { ...couponDetail, ...reduceObject },
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
  getShareInfo() {
    const {
      couponDetail: {
        ownerCouponIdString,
        merchantName,
        activityEndTime = "",
        address,
        couponName,
        cityName,
        merchantLogo,
      },
    } = this.state;

    const { profile, username } = Taro.getStorageSync("userInfo");
    getShareInfo(
      {
        shareType: "reduceCoupon",
        shareId: ownerCouponIdString,
      },
      (res) => {
        console.log(res);
        const { oriPrice, realPrice, qcodeUrl, image } = res;
        this.setState(
          {
            cavansObj: {
              start: true,
              data: rssConfigData({
                merchantName,
                time:
                  (activityEndTime && activityEndTime + "结束") || "长期有效",
                oldPrice: oriPrice,
                price: realPrice,
                wxCode: qcodeUrl,
                username,
                userProfile: profile,
                name: couponName,
                address,
                city: cityName,
                merchantLogo: image,
              }),
            },
          },
          (res) => {
            console.log(this.state.cavansObj);
          }
        );
      }
    );
  }

  onShareAppMessage(res) {
    const {
      couponDetail: { couponName, merchantLogo },
      httpData: { merchantId, ownerId, ownerCouponId },
    } = this.state;
    let userInfo = loginStatus() || {};
    const { userIdString } = userInfo;
    if (res.from === "button") {
      return {
        title: couponName,
        imageUrl: merchantLogo,
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
      couponDetail: { userCollectionStatus = "0", ownerCouponIdString },
      couponDetail,
    } = this.state;
    if (userCollectionStatus === "0") {
      saveCollection(
        {
          collectionType: "reduce",
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
  componentDidMount() { }
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
        merchantCouponStatus = "1",
        remain,
        buyRule,
        dayMaxBuyAmount,
        personLimit,
        userCollectionStatus,
        anytimeRefund,
        expireRefund,
      },
      visible,
    } = this.state;
    const shareInfoBtn = () => {
      if (shareCommission > 0) {
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
      } else if (shareCommission) {
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
    if (merchantCouponStatus === "1") {
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
          ></Coupon>
          <Card
            configUserLevelInfo={configUserLevelInfo}
            data={{
              ...couponDetail,
              allowRefund: anytimeRefund,
              allowExpireRefund: expireRefund,
            }}
          ></Card>

          <Merchant data={couponDetail}></Merchant>
          {/*使用须知*/}
          {knowPay(couponDetail, "coupon")}
          {/*使用方法*/}
          <Rule></Rule>
          {/*使用规则*/}
          <Recommend current={true} userInfo={configUserLevelInfo}></Recommend>
          <VideoBean
            price={(buyPrice * (payBeanCommission / 100))
              .toFixed(3)
              .substring(
                0,
                (buyPrice * (payBeanCommission / 100)).toFixed(3).length - 1
              )}
            data={couponDetail}
          ></VideoBean>
          <View className="shopdetails_shop_btn">
            <View className="shopdetails_shop_price">
              <View className="shopdetails_shop_priceTop">
                <Text className="font20">¥</Text>
                {buyPrice}
              </View>
              <View className="shopdetails_shop_real">
                <Text className="shopdetails_shop_realStatus1">
                  ¥ {couponPrice}
                </Text>
                <Text className="shopdetails_shop_realStatus2">
                  {((Number(buyPrice) / Number(couponPrice)) * 10).toFixed(2)}折
                </Text>
              </View>
            </View>
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
      return <NullStatus userInfo={configUserLevelInfo}></NullStatus>;
    }
  }
}
export default Index;
