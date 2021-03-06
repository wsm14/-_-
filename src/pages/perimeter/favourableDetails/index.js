import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Image, ScrollView, Text, View, RichText } from "@tarojs/components";
import {
  loginStatus,
  computedPrice,
  toast,
  objStatus,
  fakeStorage,
} from "@/utils/utils";
import {
  fetchShareParamInfo,
  fetchShareInfo,
  fetchShareConfig,
} from "@/server/common";
import {
  fetchSpecialGoods,
  fakeSaveCollection,
  fakeDeleteCollection,
} from "@/server/perimeter";
import BannerTop from "./components/bannerTop";
import GoodTemplate from "./components/goodTemplate";
import Card from "@/components/public_ui/represent";
import Merchant from "@/components/public_ui/merchant";
import KnowPay from "@/components/public_ui/KnowPay";
import ShareView from "./components/shareCmt";
import Rule from "@/components/public_ui/rule";
import Recommend from "@/components/public_ui/specalActive";
import TaroShareDrawer from "./components/TaroShareDrawer";
import GoodsOther from "./components/goodOther";
import { rssConfigData } from "./components/data";
import Toast from "@/components/toast";
import Wares from "@/components/public_ui/wares";
import RightDrawer from "./components/RightDrawer";
import ActivityStatus from "./components/errorStatus";
import Router from "@/utils/router";
import { inject, observer } from "mobx-react";
import FixedBtn from "./components/fixedBtn";
import { fetchStorage } from "@/utils/utils";
import NewUser from "@/components/public_ui/newUserToast";
import GlobalDrawer from "@/components/GlobalDrawer";
import "./index.scss";
@inject("store")
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        specialActivityId:
          getCurrentInstance().router.params.specialActivityId || "",
        merchantId: getCurrentInstance().router.params.merchantId || "",
        shareUserId: getCurrentInstance().router.params.shareUserId || "",
        identification:
          getCurrentInstance().router.params.identification || "otherDefault",
      },
      specialGoodsInfo: {}, //????????????
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
      showDownload: false,
      toastVisible: false,
    };
  }
  componentDidMount() {
    if (
      fetchStorage("toast_dakale") !== 1 &&
      (getCurrentInstance().router.params.shareUserId ||
        getCurrentInstance().router.params.scene)
    ) {
      this.setState(
        {
          toastVisible: true,
        },
        (res) => {
          setTimeout(() => {
            fakeStorage("toast_dakale", 1);
            this.setState({
              toastVisible: false,
            });
          }, 10000);
        }
      );
    }
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
    const { httpData, index } = this.state;
    fetchSpecialGoods(httpData)
      .then((res) => {
        const { specialGoodsInfo = {} } = res;
        const { status, payBeanCommission } = specialGoodsInfo;
        this.setState({
          configUserLevelInfo: { payBeanCommission },
        });
        Taro.stopPullDownRefresh();
        if (status) {
          this.setState(
            {
              specialGoodsInfo,
              index: index + 1,
            },
            (res) => {
              const { rightFlag, activityType } = specialGoodsInfo;
              if (!(rightFlag === "1" || activityType === "commerceGoods")) {
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
      })
      .catch((e) => {
        Taro.stopPullDownRefresh();
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
    fetchShareInfo(
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
                ? activityEndTime + "  24?????????"
                : "????????????",
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
            weChatUrl: res.miniProgramUrl,
          },
        });
      }
    );
  }
  onShareAppMessage(res) {
    const {
      specialGoodsInfo: { goodsName, weChatImg, weChatTitle, weChatUrl },
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
        path:
          weChatUrl ||
          `/pages/perimeter/favourableDetails/index?shareUserId=${userIdString}&shareUserType=user&merchantId=${merchantId}&specialActivityId=${specialActivityId}`,
      };
    }
    if (loginStatus()) {
      return {
        title: goodsName,
        imageUrl: img,
        path:
          weChatUrl ||
          `/pages/perimeter/favourableDetails/index?shareUserId=${userIdString}&shareUserType=user&merchantId=${merchantId}&specialActivityId=${specialActivityId}`,
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
      fakeSaveCollection({
        collectionType: "special",
        collectionId: specialActivityIdString,
      }).then((res) => {
        this.setState(
          {
            specialGoodsInfo: {
              ...specialGoodsInfo,
              userCollectionStatus: "1",
            },
            showDownload: true,
          },
          (res) => {
            setTimeout(() => {
              this.setState({
                showDownload: false,
              });
            }, 5000);
          }
        );
      });
    } else {
      fakeDeleteCollection({
        collectionType: "special",
        collectionId: specialActivityIdString,
      }).then((res) => {
        this.setState(
          {
            specialGoodsInfo: {
              ...specialGoodsInfo,
              userCollectionStatus: "0",
            },
            showDownload: false,
          },
          (res) => {
            toast("????????????");
          }
        );
      });
    }
  }
  //??????
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
      httpData: { identification },
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
    Router({
      routerName: "favourableOrder",
      args: {
        merchantId: merchantIdString,
        specialActivityId: specialActivityIdString,
        identification,
      },
    });
  }
  //????????????????????????
  onPullDownRefresh() {
    Taro.stopPullDownRefresh();
    this.getDetailsById();
  }
  onReady() {
    // ??????????????????--??????????????????????????????
  }
  render() {
    const {
      specialGoodsInfo: {
        specialActivityIdString,
        status,
        buyRule = "unlimited",
        dayMaxBuyAmount = 0,
        personLimit,
        rightFlag = "0",
        paymentModeObject = {},
        activityType,
      },
      visible,
      configUserLevelInfo: { payBeanCommission = 50, shareCommission = 0 },
      configUserLevelInfo,
      specialGoodsInfo,
      cavansObj,
      mxVisible,
      drawerVisible,
      resultInfo,
      urlLink,
      showDownload,
      toastVisible,
      httpData,
    } = this.state;
    const { type = "defaultMode" } = paymentModeObject;
    const { beanLimitStatus } = this.props.store.homeStore;
    const { beanLimit } = this.props.store.commonStore;
    if (objStatus(specialGoodsInfo)) {
      if (status !== "0") {
        return (
          <View className="favourable_Details">
            <NewUser></NewUser>
            {toastVisible && (
              <View className="favourable_toastInfo">
                <View
                  className="favourable_toastClose"
                  onClick={() => {
                    fakeStorage("toast_dakale", 1);
                    this.setState({
                      toastVisible: false,
                    });
                  }}
                ></View>
              </View>
            )}
            {/*????????????*/}
            <TaroShareDrawer
              {...cavansObj}
              onSave={() => console.log("????????????")}
              onClose={() =>
                this.setState({ cavansObj: { start: false, data: null } })
              }
            ></TaroShareDrawer>
            <BannerTop data={specialGoodsInfo}></BannerTop>
            <GoodTemplate
              show={showDownload}
              close={() =>
                this.setState({
                  showDownload: false,
                })
              }
              collect={this.setCollection.bind(this)}
              showToast={() => this.setState({ mxVisible: true })}
              userInfo={configUserLevelInfo}
              data={specialGoodsInfo}
            ></GoodTemplate>
            {/*??????*/}
            <Card
              data={specialGoodsInfo}
              configUserLevelInfo={configUserLevelInfo}
            ></Card>
            {/*????????????*/}
            {activityType !== "commerceGoods" && (
              <Merchant
                serviceType={"specialGoods"}
                data={specialGoodsInfo}
                ownerServiceId={specialActivityIdString}
              ></Merchant>
            )}

            {/*??????*/}
            {!(rightFlag === "1" || activityType === "commerceGoods") && (
              <ShareView urlLink={urlLink} data={resultInfo}></ShareView>
            )}
            {/*????????????*/}
            <GoodsOther data={specialGoodsInfo}></GoodsOther>
            {/*????????????*/}
            {activityType !== "commerceGoods" && (
              <KnowPay data={specialGoodsInfo}></KnowPay>
            )}
            {/*????????????*/}
            {activityType !== "commerceGoods" && <Rule></Rule>}
            {/*????????????*/}
            {activityType !== "commerceGoods" && (
              <Recommend
                current={true}
                defaultData={specialGoodsInfo}
                userInfo={configUserLevelInfo}
              ></Recommend>
            )}
            {/*?????????????????? */}
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
            {/*????????????????????????????????? */}
            <RightDrawer
              close={(fn) => {
                this.setState(
                  {
                    drawerVisible: false,
                  },
                  (res) => {
                    fn && fn();
                  }
                );
              }}
              data={specialGoodsInfo}
              show={drawerVisible}
            ></RightDrawer>
            {/*??????????????????????????????????????????????????????  */}
            {visible && (
              <Toast
                title={"?????????????????????"}
                close={() => this.setState({ visible: false })}
              >
                <View className="shop_dakale_content">
                  {buyRule === "dayLimit" ? (
                    <>
                      <View>
                        ??????????????????{dayMaxBuyAmount}
                        ??????????????????????????????????????????????????????
                      </View>
                    </>
                  ) : (
                    <View>????????????{personLimit}??????????????????????????????</View>
                  )}
                </View>
              </Toast>
            )}
            {/*???????????? ???????????????????????????*/}
            <FixedBtn
              httpData={httpData}
              configUserLevelInfo={configUserLevelInfo}
              shareInfo={this.getShareInfo.bind(this)}
              saveInfo={this.saveGoodsOrder.bind(this)}
              beanLimit={beanLimit}
              data={specialGoodsInfo}
            ></FixedBtn>
            <GlobalDrawer pageName="goodsDetail"></GlobalDrawer>
          </View>
        );
      } else {
        return <ActivityStatus userInfo={configUserLevelInfo}></ActivityStatus>;
      }
    } else return null;
  }
}
export default Index;
