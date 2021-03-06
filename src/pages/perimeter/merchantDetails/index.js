import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { fakeUserFollow, fakeRemoveFollow } from "@/server/index";
import MarkPhone from "@/components/payTelephone";
import { scanCode } from "@/common/authority";
import Toast from "@/components/public_ui/beanToast";
import { fetchShareParamInfo, fetchShareInfo } from "@/server/common";
import {
  getUserCoupon,
  fetchAllPutShelfGoods,
  fetchMerchantDetail,
  listAllPut,
} from "@/server/perimeter";
import NullStatus from "./components/undercarriage";
import { toast, filterStrList, loginStatus } from "@/utils/utils";
import Header from "./components/header";
import Coupons from "@/components/public_ui/coupon";
import ConponInfo from "./components/coupon";
import Specal from "./components/specalGoods";
import Goods from "./components/goods";
import { getAvailableCoupon } from "@/server/coupon";
import { rssConfigData } from "./components/data";
import TaroShareDrawer from "./components/TaroShareDrawer";
import { inject, observer } from "mobx-react";
import "./merchantDetails.scss";
@inject("store")
@observer
class MerchantDetails extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      merchantHttpData: {
        ...getCurrentInstance().router.params,
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
      cavansObj: {
        data: null,
        start: false,
      },
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
      fetchShareParamInfo({ uniqueKey: scene }, (res) => {
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

  getUserCoupon() {
    const { merchantHttpData } = this.state;
    getUserCoupon({ ...merchantHttpData, page: 1, limit: 3 }).then((res) => {
      const { couponList } = res;
      this.setState({
        priceCoupon: couponList,
      });
    });
  }
  //?????????????????????
  saveFollow() {
    const { userMerchantInfo } = this.state;
    const { merchantId } = userMerchantInfo;
    fakeUserFollow({
      followType: "merchant",
      followUserId: merchantId,
    }).then((val) => {
      this.setState(
        {
          userMerchantInfo: {
            ...this.state.userMerchantInfo,
            merchantFollowStatus: "1",
          },
        },
        () => {
          toast("????????????");
        }
      );
    });
  }
  //??????
  deleteFollow() {
    const { userMerchantInfo } = this.state;
    const { merchantId } = userMerchantInfo;
    fakeRemoveFollow({ followUserId: merchantId, followType: "merchant" }).then(
      (val) => {
        this.setState(
          {
            userMerchantInfo: {
              ...this.state.userMerchantInfo,
              merchantFollowStatus: "0",
            },
          },
          () => {
            toast("????????????");
          }
        );
      }
    );
  }
  //????????????
  getGoodList() {
    const {
      merchantHttpData: { merchantId },
    } = this.state;
    fetchAllPutShelfGoods({ merchantId: merchantId }).then((res) => {
      const { goodsList = [] } = res;
      this.setState({
        goodsList,
      });
    });
  }
  //??????????????????
  getMerchantById() {
    const { merchantHttpData } = this.state;
    fetchMerchantDetail(merchantHttpData)
      .then((res) => {
        Taro.stopPullDownRefresh();
        const { userMerchant = {} } = res;
        this.setState(
          {
            userMerchantInfo: {
              ...userMerchant,
              merchantStatus: Object.keys(userMerchant).length > 0 ? "1" : "2",
            },
          },
          (res) => {
            this.getMerchantLove();
          }
        );
      })
      .catch((e) => {
        Taro.stopPullDownRefresh();
      });
  }
  //??????????????????
  fetchShareInfo() {
    const {
      userMerchantInfo: {
        merchantName,
        scenesNames,
        coverImg,
        address,
        businessTime,
        telephone,
        tag,
        merchantId,
      },
      userMerchantInfo,
    } = this.state;
    fetchShareInfo(
      {
        shareType: "merchant",
        shareId: merchantId,
      },
      (res) => {
        const { qcodeUrl, image } = res;
        const { profile, username } = Taro.getStorageSync("userInfo");
        this.setState({
          cavansObj: {
            start: true,
            data: rssConfigData({
              merchantName,
              scenesList: filterStrList(scenesNames),
              merchantLogo: image,
              address,
              businessTime,
              username,
              userProfile: profile,
              telephone,
              tag: filterStrList(tag).join(" | "),
              wxCode: qcodeUrl,
            }),
          },
          userMerchantInfo: {
            ...userMerchantInfo,
            weChatImg: res.frontImage,
            weChatTitle: res.title,
          },
        });
      }
    );
  }
  //?????????????????????
  onShareAppMessage(res) {
    const {
      userMerchantInfo: { merchantName, coverImg, weChatImg, weChatTitle },
      merchantHttpData: { merchantId },
    } = this.state;
    let userInfo = loginStatus() || {};
    const { userIdString } = userInfo;
    if (loginStatus()) {
      if (res.from === "button") {
        return {
          title: weChatTitle || merchantName,
          imageUrl: weChatImg || coverImg,
          path: `/pages/perimeter/merchantDetails/index?shareUserId=${userIdString}&shareUserType=user&merchantId=${merchantId}`,
          complete: function () {
            // ???????????????????????????????????????????????????????????????
            console.log("---????????????---");
          },
        };
      } else {
        return {
          title: merchantName,
          imageUrl: coverImg,
          path: `/pages/perimeter/merchantDetails/index?shareUserId=${userIdString}&shareUserType=user&merchantId=${merchantId}`,
        };
      }
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
    listAllPut({
      merchantId: merchantId,
      page: 1,
      limit: 6,
    }).then((res) => {
      const { specialGoodsList } = res;
      this.setState({
        specialGoodsList: specialGoodsList,
      });
    });
  }

  onPullDownRefresh() {
    Taro.stopPullDownRefresh();
    this.setState(
      {
        bannerList: [],
        userMerchantInfo: {},
        countStatus: true,
        visible: false,
        specialGoodsList: [],
        goodsList: [],
        conpouVisible: false,
        couponList: [],
        priceCoupon: [],
        cavansObj: {
          data: null,
          start: false,
        },
      },
      (res) => {
        this.getMerchantById();
        this.getGoodList();
        this.getUserCoupon();
      }
    );
  }
  //????????????
  render() {
    const {
      userMerchantInfo,
      userMerchantInfo: { telephone, merchantStatus = "1" },
      visible,
      specialGoodsList,
      goodsList,
      getBeanStatus,
      conpouVisible,
      couponList,
      priceCoupon = [],
      cavansObj,
    } = this.state;
    if (Object.keys(userMerchantInfo).length > 0 && merchantStatus === "1") {
      return (
        <View className="merchantBox">
          <TaroShareDrawer
            {...cavansObj}
            onSave={() => console.log("????????????")}
            onClose={() =>
              this.setState({ cavansObj: { start: false, data: null } })
            }
          ></TaroShareDrawer>
          <Header
            saveFollow={this.saveFollow.bind(this)}
            deleteFollow={this.deleteFollow.bind(this)}
            fetchShareInfo={this.fetchShareInfo.bind(this)}
            onOpen={() => {
              this.setState({
                visible: true,
              });
            }}
            data={userMerchantInfo}
          ></Header>
          {/* //?????????????????? */}
          <ConponInfo data={userMerchantInfo} list={priceCoupon}></ConponInfo>
          {/* //??????????????? */}
          <Specal data={userMerchantInfo} list={specialGoodsList}></Specal>
          {/* //???????????? */}
          <Goods data={userMerchantInfo} list={goodsList}></Goods>
          {/* //?????????????????? */}
          <View className="merchant_layer">
            <View className="merchant_layer_btn">
              <View className="merchant_layer_btn1" onClick={() => scanCode()}>
                <View className="merchant_layer_btnBox merchant_layer_btnIcon1"></View>
                <View>??????</View>
              </View>
              <View className="merchant_layer_btn2" onClick={() => scanCode()}>
                <View className="merchant_layer_btnBox merchant_layer_btnIcon3"></View>
                <View>????????????</View>
              </View>
            </View>
            <View
              className="merchant_shop"
              onClick={() => this.setState({ visible: true })}
            >
              ??????/??????
            </View>
          </View>
          {/* //?????????????????? */}
          {getBeanStatus && (
            <Toast
              data={{
                tippingBean:
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
              title={"?????????????????????"}
              visible={() => {
                this.setState({ conpouVisible: false });
              }}
              type={"mark"}
              data={couponList}
            ></Coupons>
          )}
        </View>
      );
    } else {
      return <NullStatus data={userMerchantInfo}></NullStatus>;
    }
  }
}

export default MerchantDetails;
