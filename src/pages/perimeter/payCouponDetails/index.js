import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View, Image, RichText } from "@tarojs/components";
import Coupon from "./components/couponTop";
import { fetchOwnerCouponDetail } from "@/server/coupon";
import { fakeSaveCollection, fakeDeleteCollection } from "@/server/perimeter";
import {
  fetchShareParamInfo,
  fetchShareInfo,
  fetchUserShareCommission,
} from "@/server/common";
import {
  loginStatus,
  computedPrice,
  toast,
  filterStrList,
  objStatus,
} from "@/utils/utils";
import Router from "@/utils/router";
import NullStatus from "./components/nullStatus";
import TaroShareDrawer from "./components/TaroShareDrawer";
import { rssConfigData } from "./components/data";
import Toast from "@/components/toast";
import Card from "@/components/public_ui/represent";
import Merchant from "@/components/public_ui/merchant";
import Rule from "@/components/public_ui/rule";
import Recommend from "@/components/public_ui/couponActive";
import Wares from "@/components/public_ui/wares";
import Drawer from "@/components/Drawer";
import KnowPay from "@/components/public_ui/KnowPay";
import RightFlag from "@/components/public_ui/rightFlagView";
import FixedBtn from "./components/fixedBtn";
import { inject, observer } from "mobx-react";
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
      //券受限的弹窗
      mxVisible: false,
      //分享海报
      drawerVisible: false,
      //权益商品分享弹窗
      showDownload: false,
    };
  }
  componentWillMount() {
    let { scene } = getCurrentInstance().router.params;
    let { httpData } = this.state;
    if (scene) {
      fetchShareParamInfo({ uniqueKey: scene }, (res) => {
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
  //如果通过分享路径进入的话走这里
  fetchCouponDetail() {
    const { httpData, index } = this.state;
    fetchOwnerCouponDetail(httpData, (res) => {
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
  //获取有价券详情
  fetchUserShareCommission() {
    fetchUserShareCommission({}, (res) => {
      const { configUserLevelInfo = {} } = res;
      this.setState({
        configUserLevelInfo,
      });
    });
  }
  //获取哒人身份
  filterCoupon() {
    const { couponDetail } = this.state;
    const { activeDate, endDate, delayDays, activeDays } = couponDetail;
    if (activeDate && endDate) {
      return activeDate + "至" + endDate;
    } else {
      return `领取后${delayDays}天生效 | 有效期：${activeDays}天`;
    }
  }
  //券使用规则
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
    fetchShareInfo(
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
            weChatUrl: res.miniProgramUrl,
          },
        });
      }
    );
  }
  //分享券
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
  //计算价格
  onShareAppMessage(res) {
    const {
      couponDetail: {
        couponName,
        merchantLogo,
        weChatImg = "",
        weChatTitle = "",
        weChatUrl = "",
      },
      httpData: { merchantId, ownerId, ownerCouponId },
    } = this.state;
    let userInfo = loginStatus() || {};
    const { userIdString } = userInfo;
    if (res.from === "button") {
      return {
        title: weChatTitle || couponName,
        imageUrl: weChatImg || merchantLogo,
        path:
          weChatUrl ||
          `/pages/perimeter/payCouponDetails/index?shareUserId=${userIdString}&shareUserType=user&merchantId=${merchantId}&ownerId=${ownerId}&ownerCouponId=${ownerCouponId}`,
      };
    }
    if (loginStatus()) {
      return {
        title: couponName,
        imageUrl: merchantLogo,
        path:
          weChatUrl ||
          `/pages/perimeter/payCouponDetails/index?shareUserId=${userIdString}&shareUserType=user&merchantId=${merchantId}&ownerId=${ownerId}&ownerCouponId=${ownerCouponId}`,
      };
    } else {
      return {
        title: couponName,
        imageUrl: merchantLogo,
      };
    }
  }
  //微信分享
  saveCouponOrder() {
    if (!loginStatus()) {
      Router({
        routerName: "login",
      });
    } else {
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
  }
  //进入有价券订单页

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
      fakeSaveCollection({
        collectionType: "reduce",
        ownerId: ownerIdString,
        collectionId: ownerCouponIdString,
      }).then((res) => {
        this.setState(
          {
            couponDetail: {
              ...couponDetail,
              userCollectionStatus: "1",
            },
            showDownload: true,
          },
          (res) => {
            toast("收藏成功");
          }
        );
      });
    } else {
      fakeDeleteCollection({
        collectionType: "reduce",
        ownerId: ownerIdString,
        collectionId: ownerCouponIdString,
      }).then((res) => {
        this.setState(
          {
            couponDetail: {
              ...couponDetail,
              userCollectionStatus: "0",
            },
            showDownload: false,
          },
          (res) => {
            toast("取消成功");
          }
        );
      });
    }
  }
  //收藏
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
      cavansObj,
      couponDetail: {
        ownerCouponStatus = "1",
        buyRule,
        dayMaxBuyAmount,
        personLimit,
        anytimeRefund,
        expireRefund,
        ownerCouponIdString,
        userBean,
        couponDetailImg = "",
        paymentModeObject = {},
        couponName,
        richText,
      },
      visible,
      mxVisible,
      drawerVisible,
      showDownload,
      httpData,
    } = this.state;
    const { bean = "", cash = "" } = paymentModeObject;
    const { beanLimitStatus } = this.props.store.homeStore;
    const { beanLimit } = this.props.store.commonStore;
    if (objStatus(couponDetail)) {
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
              close={() =>
                this.setState({
                  showDownload: false,
                })
              }
              show={showDownload}
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
                <View className="shopdetails_shop_merchantDetails">
                  商品描述
                </View>
                {couponDetail.couponDetail && (
                  <View className="shopdetails_dec">
                    <Text>
                      {couponDetail.couponDetail.replace(/\\n/g, "\n")}
                    </Text>
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
                <View className="shopdetails_shop_merchantDetails">
                  商品描述
                </View>
                <RichText
                  nodes={richText}
                  className="temPlateComment_desc"
                ></RichText>
              </View>
            )}
            {/*使用须知*/}
            <KnowPay data={couponDetail} type="coupon"></KnowPay>
            {/*使用方法*/}
            <Rule></Rule>
            {/*使用规则*/}
            <Recommend
              defaultData={couponDetail}
              current={true}
              userInfo={configUserLevelInfo}
            ></Recommend>
            {/*商品底部 按钮以及优惠提示栏*/}
            <FixedBtn
              configUserLevelInfo={configUserLevelInfo}
              shareInfo={this.getShareInfo.bind(this)}
              saveInfo={this.saveCouponOrder.bind(this)}
              beanLimit={beanLimit}
              data={couponDetail}
              httpData={httpData}
            ></FixedBtn>
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
    } else {
      return null;
    }
  }
}
export default Index;
