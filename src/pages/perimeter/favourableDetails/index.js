import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Image, ScrollView, Text, View, RichText } from "@tarojs/components";
import Banner from "@/components/banner";
import { perimeter } from "@/api/api";
import { httpGet, httpPost } from "@/api/newRequest";
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
  computedBeanPrice,
  filterPath,
} from "@/common/utils";
import { loginBtn } from "@/common/authority";
import ActivityStatus from "./components/index";
import {
  getShareParamInfo,
  getShareInfo,
  fetchShareConfig,
} from "@/server/common";
import { fetchUserShareCommission } from "@/server/index";
import TaroShareDrawer from "./components/TaroShareDrawer";
import { rssConfigData } from "./components/data";
import ButtonView from "@/components/Button";
import { knowPay } from "@/components/componentView/KnowPay";
import VideoBean from "./components/getVideoBean";
import Router from "@/common/router";
import Date from "@/components/dateTime";
import Toast from "@/components/dakale_toast";
import Card from "@/components/shopView/represent";
import Merchant from "@/components/shopView/merchant";
import Rule from "@/components/shopView/rule";
import Recommend from "@/components/specalActive";
import Wares from "@/components/componentView/wares";
import Drawer from "@/components/Drawer";
import RightFlag from "@/components/componentView/rightFlagView";
import ShareView from "./components/shareCmt";
import { inject, observer } from "mobx-react";
import classNames from "classnames";
import "./index.scss";
@inject("store")
@observer
class MerchantDetails extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        specialActivityId:
          getCurrentInstance().router.params.specialActivityId || "",
        merchantId: getCurrentInstance().router.params.merchantId || "",
        shareUserId: getCurrentInstance().router.params.shareUserId || "",
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
      mxVisible: false,
      drawerVisible: false,
      resultInfo: {},
      urlLink: null,
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
              this.fetchUrlLink();
            }
          );
        }
      });
    } else {
      this.getDetailsById();
      this.fetchUrlLink();
    }
  }
  componentDidShow() {
    const { index } = this.state;
    if (index !== 0) {
      this.getDetailsById();
    }
    this.fetchUserShareCommission();
  }
  fetchConfig() {
    const { httpData } = this.state;
    const { specialActivityId, merchantId } = httpData;
    fetchShareConfig({
      goodId: specialActivityId,
      ownerId: merchantId,
    }).then((val) => {
      const { resultInfo } = val;
      this.setState({
        resultInfo,
      });
    });
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
          this.setState(
            {
              specialGoodsInfo,
              index: index + 1,
            },
            (res) => {
              const { rightFlag, paymentModeObject } = specialGoodsInfo;
              const { type } = paymentModeObject;
              if (!(rightFlag === "1" && type === "defaultMode")) {
                this.fetchConfig();
              }
            }
          );
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
  fetchUrlLink() {
    const { httpData } = this.state;
    const { userIdString } = loginStatus() || {};
    let obj = {
      ...httpData,
      shareUserId: userIdString,
      shareUserType: userIdString ? "user" : undefined,
    };
    let str = "";
    for (let item in obj) {
      if (obj[item]) {
        str = str + `${item}=${obj[item]}&`;
      }
    }
    str = str.slice(0, str.length - 1);
    if (str) {
      Taro.cloud
        .callFunction({
          name: "setUrl",
          action: "setWxUrl",
          data: {
            path: "pages/perimeter/favourableDetails/index",
            action: "setWxUrl",
            query: str,
          },
        })
        .then((val) => {
          const { result = {} } = val;
          const { urlLink, errMsg } = result;
          if (errMsg === "openapi.urllink.generate:ok") {
            this.setState({
              urlLink: urlLink,
            });
          }
        });
    }
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
        activityGoodsImg,
        districtName,
        rightFlag,
        paymentModeObject = {},
      },
      specialGoodsInfo,
    } = this.state;
    const { profile, username } = Taro.getStorageSync("userInfo");
    getShareInfo(
      {
        shareType: "specialActivity",
        shareId: specialActivityIdString,
      },
      (res) => {
        const {
          body,
          oriPrice,
          image = "",
          title,
          realPrice,
          qcodeUrl,
          buyPrice = 0,
          saveMoney = "",
          shareImg,
        } = res;
        this.setState({
          cavansObj: {
            start: true,
            data: rssConfigData({
              merchantName,
              time: activityEndTime
                ? activityEndTime + "  24点结束"
                : "长期有效",
              oldPrice: oriPrice,
              price: realPrice,
              wxCode: qcodeUrl,
              username,
              userProfile: profile,
              name: goodsName,
              city: cityName + districtName + address,
              merchantLogo: image,
              buyPrice,
              saveMoney,
              shareImg,
              rightFlag: rightFlag,
              paymentModeObject: paymentModeObject,
            }),
          },
          specialGoodsInfo: {
            ...specialGoodsInfo,
            weChatImg: res.frontImage,
            weChatTitle: res.title,
          },
        });
      }
    );
  }
  onShareAppMessage(res) {
    const {
      specialGoodsInfo: { goodsName, weChatImg, weChatTitle },
      specialGoodsInfo,
      httpData: { merchantId, specialActivityId },
    } = this.state;
    let userInfo = loginStatus() || {};
    let img = specialGoodsInfo.activityGoodsImg.split(",")[0];
    const { userIdString } = userInfo;
    if (res.from === "button") {
      return {
        title: weChatTitle || goodsName,
        imageUrl: weChatImg || img,
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
  filterBeanPrice() {
    const { configUserLevelInfo, specialGoodsInfo } = this.state;
    const { payBeanCommission = 50 } = configUserLevelInfo;
    const { userBean, realPrice } = specialGoodsInfo;
    if (userBean >= computedPrice(realPrice, payBeanCommission) * 100) {
      return parseInt(computedPrice(realPrice, payBeanCommission) * 100);
    } else {
      return userBean;
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
              toast("收藏成功,请打开「哒卡乐APP」查看收藏详情");
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
  saveGoodsOrder() {
    const {
      specialGoodsInfo: {
        merchantIdString,
        personLimit,
        dayMaxBuyAmount,
        boughtActivityGoodsNum,
        buyRule,
        specialActivityIdString,
        paymentModeObject,
        userBean,
        activityType,
      },
    } = this.state;
    const { bean, type } = paymentModeObject;
    if (buyRule === "dayLimit" && dayMaxBuyAmount === boughtActivityGoodsNum) {
      this.setState({
        visible: true,
      });
      return;
    } else if (
      buyRule === "personLimit" &&
      personLimit === boughtActivityGoodsNum
    ) {
      this.setState({
        visible: true,
      });
      return;
    } else if (type !== "defaultMode") {
      if (userBean < bean) {
        this.setState({
          drawerVisible: true,
        });
        return;
      }
    }
    if (activityType === "commerceGoods") {
      Router({
        routerName: "commerOrder",
        args: {
          merchantId: merchantIdString,
          specialActivityId: specialActivityIdString,
        },
      });
    } else {
      Router({
        routerName: "favourableOrder",
        args: {
          merchantId: merchantIdString,
          specialActivityId: specialActivityIdString,
        },
      });
    }
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
        userBean = 0,
        rightFlag = "0",
        paymentModeObject = {},
        goodsImg,
        richText,
        activityType,
      },
      visible,
      configUserLevelInfo: { payBeanCommission = 50, shareCommission = 0 },
      configUserLevelInfo,
      specialGoodsInfo,
      cavansObj,
      httpData,
      mxVisible,
      drawerVisible,
      resultInfo,
      urlLink,
    } = this.state;
    const { bean = 0, cash = 0, type = "defaultMode" } = paymentModeObject;
    const { login } = this.props.store.authStore;
    const { beanLimitStatus } = this.props.store.homeStore;
    const { beanLimit } = this.props.store.commonStore;
    const shareInfoBtn = () => {
      if (shareCommission > 0 && type === "defaultMode") {
        return (
          <ButtonView
            data={{
              path: "pages/perimeter/favourableDetails/index",
              type: "favourableDetails_share",
              name: "商品详情分享",
            }}
          >
            <View
              onClick={() => loginBtn(() => this.getShareInfo())}
              className="shopdetails_shop_btnBox2 shopdetails_shop_btnColor2"
            >
              <View className="shop_price_font">
                <View>分享赚</View>
                <View>
                  ¥{computedPrice(realPrice - merchantPrice, shareCommission)}
                </View>
              </View>
            </View>
          </ButtonView>
        );
      } else {
        return (
          <ButtonView
            data={{
              path: "pages/perimeter/favourableDetails/index",
              type: "favourableDetails_share",
              name: "商品详情分享",
            }}
          >
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
      if (!format(activityStartTime) && activityTimeRule === "fixed") {
        return (
          <View className="shopdetails_shop_btnBox">
            <ButtonView>
              <View className="shopdetails_shop_btnBox1 shopdetails_shop_btnColor1 shopdetails_shop_option">
                即将开始
              </View>
            </ButtonView>
            {shareInfoBtn()}
          </View>
        );
      } else if (remain === 0) {
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
      } else if (shareCommission !== 0 && rightFlag !== "1") {
        return (
          <View className="shopdetails_shop_btnBox">
            <ButtonView
              data={{
                path: "pages/perimeter/favourableDetails/index",
                type: "favourableDetails_share",
                name: "商品详情购买",
              }}
            >
              <View
                className="shopdetails_shop_btnBox1 shopdetails_shop_btnColor1"
                onClick={() => loginBtn(() => this.saveGoodsOrder())}
              >
                <View className="shop_price_font">
                  <View>自购返</View>
                  <View>
                    ¥{computedPrice(realPrice - merchantPrice, shareCommission)}
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
            <ButtonView
              data={{
                path: "pages/perimeter/favourableDetails/index",
                type: "favourableDetails_share",
                name: "商品详情购买",
              }}
            >
              {" "}
              <View
                className="shopdetails_shop_btnBox1 shopdetails_shop_btnColor1"
                onClick={() => loginBtn(() => this.saveGoodsOrder())}
              >
                立即抢购
              </View>
            </ButtonView>
            {shareInfoBtn()}
          </View>
        );
      }
    };
    const template = () => {
      if (!format(activityStartTime) && activityTimeRule === "fixed") {
        return <View className="shopDetails_avtiveTime_tag">即将开始</View>;
      } else {
        return (
          <View className="shopdetails_pay_status">
            {activityTimeRule !== "infinite" ? (
              <Date
                onlyTime
                type={true}
                times={activityEndTime}
                fn={() => {}}
              ></Date>
            ) : (
              <View className="shopDetails_avtiveTime_tag">长期有效</View>
            )}
          </View>
        );
      }
    };
    const templatePrice = () => {
      if (rightFlag === "1" && type === "defaultMode") {
        return (
          <View className="shopdetails_getShop">
            <View className="shopdetails_price_people">
              <Text className="font28 color1">优惠价: </Text>
              <Text className="font48 color1 font_hide bold price_margin4  shopdetails_price_info">
                ¥{cash}
              </Text>
              <Text className="shopdetails_price_style color2">原价:</Text>
              <Text className="font36 shopdetails_price_style1 font_hide price_margin4 color2 bold text_through">
                ¥{oriPrice}
              </Text>
            </View>
            <View className="shopdetails_beanTitleName public_auto">
              <View className="shopdetails_beanTitle_name font_fourHide">
                {" "}
                {goodsName}
              </View>
            </View>
          </View>
        );
      } else if (type !== "defaultMode") {
        return (
          <View className="shopdetails_getShop">
            <View className="favourInfo_box">
              <View className="favourInfo_box_left">卡豆价:</View>
              <View className="favourInfo_box_right">
                ¥{cash.toFixed(2)}+{bean}卡豆
              </View>
            </View>
            <View className="favourInfo_rel">
              <Text className="color2 font28"> 原价:</Text>
              <Text className="font36 font_hide price_margin4 color2 bold text_through">
                ¥{oriPrice}
              </Text>
            </View>
            <View className="shopdetails_beanTitleName public_auto">
              <View className="shopdetails_beanTitle_name font_fourHide">
                {goodsName}
              </View>
              <View
                onClick={() => this.setCollection()}
                className={classNames(
                  userCollectionStatus === "1"
                    ? "shopdetails_isCollect"
                    : "shopdetails_collect"
                )}
              ></View>
            </View>
            <View className="shopdetails_bean_handerRight">
              {setBuyRule(buyRule, dayMaxBuyAmount, maxBuyAmount) && (
                <View className="shopdetails_getPrice_tag">
                  {setBuyRule(buyRule, dayMaxBuyAmount, maxBuyAmount)}
                </View>
              )}
            </View>
          </View>
        );
      } else {
        return (
          <View className="shopdetails_getShop">
            <View className="shopdetails_price_people">
              <Text className="font28 color1">优惠价: </Text>
              <Text className="font48 color1 font_hide bold price_margin4  shopdetails_price_info">
                ¥{realPrice}
              </Text>
              <Text className="shopdetails_price_style color2">原价:</Text>
              <Text className="font36 shopdetails_price_style1 font_hide price_margin4 color2 bold text_through">
                ¥{oriPrice}
              </Text>
            </View>
            <View
              onClick={() => this.setState({ mxVisible: true })}
              className="shopdetails_bean_showPay"
            >
              <View className="color3 font24">卡豆再省</View>
              <View className="color3 font36 bold price_margin8">
                ¥{computedPrice(realPrice, payBeanCommission)}
              </View>
              <View className="shopdetails_bean_mx">
                {"卡豆抵扣明细" + " >"}
              </View>
            </View>
            <View className="shopdetails_beanTitleName public_auto">
              <View className="shopdetails_beanTitle_name font_fourHide">
                {" "}
                {goodsName}
              </View>
              <View
                onClick={() => this.setCollection()}
                className={classNames(
                  userCollectionStatus === "1"
                    ? "shopdetails_isCollect"
                    : "shopdetails_collect"
                )}
              ></View>
            </View>
            <View className="shopdetails_bean_handerRight">
              {setBuyRule(buyRule, dayMaxBuyAmount, maxBuyAmount) && (
                <View className="shopdetails_getPrice_tag">
                  {setBuyRule(buyRule, dayMaxBuyAmount, maxBuyAmount)}
                </View>
              )}
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
                showNear
                data={filterStrList(activityGoodsImg) || []}
                style={{ width: "100%", height: "100%" }}
                boxStyle={{ width: "100%", height: "100%" }}
              ></Banner>
            </View>
            {!(
              (rightFlag === "1" && type === "defaultMode") ||
              activityType === "commerceGoods"
            ) && (
              <View className="shopDetails_activeStatus">
                <View className="shopDetails_avtiveLogo"></View>
                <View className="shopDetails_avtiveTime">{template()}</View>
              </View>
            )}
            {/*使用商家*/}
            {templatePrice()}
            {/*抵扣价格 和状态*/}
            <Card
              configUserLevelInfo={configUserLevelInfo}
              data={specialGoodsInfo}
            ></Card>
            {/*保障*/}
            {activityType !== "commerceGoods" && (
              <Merchant
                serviceType={"specialGoods"}
                data={specialGoodsInfo}
                ownerServiceId={specialActivityIdString}
              ></Merchant>
            )}
            {!(
              (rightFlag === "1" && type === "defaultMode") ||
              activityType === "commerceGoods"
            ) && <ShareView urlLink={urlLink} data={resultInfo}></ShareView>}
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
            {/* 套餐 */}
            {/* 商品详情 */}
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
            {activityType !== "commerceGoods" && knowPay(specialGoodsInfo)}
            {/*使用方法*/}
            {activityType !== "commerceGoods" && <Rule></Rule>}
            <Recommend
              current={true}
              defaultData={specialGoodsInfo}
              userInfo={configUserLevelInfo}
            ></Recommend>
            <VideoBean
              visible={beanLimitStatus === "1"}
              beanLimit={beanLimit}
              price={(realPrice * (payBeanCommission / 100))
                .toFixed(3)
                .substring(
                  0,
                  (realPrice * (payBeanCommission / 100)).toFixed(3).length - 1
                )}
              data={specialGoodsInfo}
            ></VideoBean>
            {!(rightFlag === "1" && type === "defaultMode") && (
              <View className="shopdetails_shop_btn">
                {type !== "defaultMode" ? (
                  <View className="shopdetails_shop_price">
                    <View className="shopdetails_shop_priceTop bold">
                      <Text className="font20">¥</Text>
                      <Text className="price_margin8">{cash.toFixed(2)}</Text>
                    </View>
                    <View className="shopdetails_shop_real">
                      已用{bean}卡豆抵扣
                      {(bean / 100).toFixed(2)}元
                    </View>
                  </View>
                ) : (
                  <View className="shopdetails_shop_price">
                    <View className="shopdetails_shop_priceTop bold">
                      <Text className="font20">¥</Text>
                      <Text className="price_margin8">
                        {(
                          realPrice - (this.filterBeanPrice() / 100).toFixed(2)
                        ).toFixed(2)}
                      </Text>
                    </View>
                    <View className="shopdetails_shop_real">
                      已用{this.filterBeanPrice()}卡豆抵扣
                      {(this.filterBeanPrice() / 100).toFixed(2)}元
                    </View>
                  </View>
                )}
                {payBtn()}
              </View>
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
            <Wares
              close={(fn) =>
                this.setState({ mxVisible: false }, (res) => {
                  fn && fn();
                })
              }
              visible={mxVisible}
              configUserLevelInfo={configUserLevelInfo}
              data={specialGoodsInfo}
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
                    img: goodsImg,
                    name: goodsName,
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
          </View>
        );
      } else {
        return <ActivityStatus userInfo={configUserLevelInfo}></ActivityStatus>;
      }
    } else return null;
  }
}
export default MerchantDetails;
