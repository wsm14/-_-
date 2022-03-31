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
  //获取商家有价券
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
          toast("关注成功");
        }
      );
    });
  }
  //关注
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
            toast("取消成功");
          }
        );
      }
    );
  }
  //取消关注
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
  //获取商家信息
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
  //获取商家详情
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
  //分享商家海报图
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
            // 转发结束之后的回调（转发成不成功都会执行）
            console.log("---转发完成---");
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
  //猜你喜欢
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
            onSave={() => console.log("点击保存")}
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
          {/* //商家详情头部 */}
          <ConponInfo data={userMerchantInfo} list={priceCoupon}></ConponInfo>
          {/* //店铺抵扣券 */}
          <Specal data={userMerchantInfo} list={specialGoodsList}></Specal>
          {/* //店铺商品 */}
          <Goods data={userMerchantInfo} list={goodsList}></Goods>
          {/* //店铺商品橱窗 */}
          <View className="merchant_layer">
            <View className="merchant_layer_btn">
              <View className="merchant_layer_btn1" onClick={() => scanCode()}>
                <View className="merchant_layer_btnBox merchant_layer_btnIcon1"></View>
                <View>买单</View>
              </View>
              <View className="merchant_layer_btn2" onClick={() => scanCode()}>
                <View className="merchant_layer_btnBox merchant_layer_btnIcon3"></View>
                <View>打卡领豆</View>
              </View>
            </View>
            <View
              className="merchant_shop"
              onClick={() => this.setState({ visible: true })}
            >
              预约/预定
            </View>
          </View>
          {/* //店铺底部按钮 */}
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
    } else {
      return <NullStatus data={userMerchantInfo}></NullStatus>;
    }
  }
}

export default MerchantDetails;
