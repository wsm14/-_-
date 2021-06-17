import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { rssConfigData } from "./components/data";
import TaroShareDrawer from "./components/TaroShareDrawer";
import { getShareParamInfo, getShareInfo } from "@/server/common";
import ButtonView from "@/components/Button";
import {
  loginStatus,
  mapGo,
  navigateTo,
  reLaunch,
  backgroundObj,
} from "@/common/utils";
import { getWechatActivityData } from "@/server/share";
import Waterfall from "@/components/waterfall";
import { fetchUserShareCommission } from "@/server/index";
import "./index.scss";
import Router from "@/common/router";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      cavansObj: {
        data: null,
        start: false,
      },
      visible: false,
      httpData: {
        activityType: getCurrentInstance().router.params.activityType || "",
      },
      lat: 0,
      lnt: 0,
      specialGoodsDTOList: [],
      configUserLevelInfo: {},
      address: "",
      merchantName: "",
      coverImg: "",
      type: "",
      path: "",
      index: 0,
      activeImg: "",
      mapImg: "",
      goodBill: "",
      activeRuleImg: "",
      btnImg: "",
      location: true,
    };
  }
  componentWillMount() {
    const { scene } = getCurrentInstance().router.params;
    if (scene) {
      getShareParamInfo({ uniqueKey: scene }, (res) => {
        let {
          shareParamInfo: { param },
        } = res;
        if (param && JSON.parse(param)) {
          param = JSON.parse(param);
          const { activityType } = param;
          this.setState(
            {
              httpData: { activityType: activityType },
            },
            (res) => {
              this.fetchActivity();
            }
          );
        }
      });
    } else {
      this.fetchActivity();
    }
  }
  componentDidShow() {
    const { index } = this.state;
    if (index !== 0) {
      this.fetchActivity();
    }
    this.fetchUserShare();
  }
  fetchUserShare() {
    fetchUserShareCommission({}, (res) => {
      const { configUserLevelInfo = {} } = res;
      this.setState({
        configUserLevelInfo,
      });
    });
  }
  fetchActivity() {
    const { httpData, index } = this.state;
    getWechatActivityData({ ...httpData }, (res) => {
      const {
        lat = 0,
        lnt = 0,
        specialGoodsDTOList = [],
        coverImg = "",
        type = "switchTab",
        path = "/pages/index/home/index",
        address = "",
        merchantName = "",
        activeImg = "https://wechat-config.dakale.net/miniprogram/image/share_active1.png",
        mapImg = "https://wechat-config.dakale.net/miniprogram/image/share_active2.png",
        goodBill = "https://wechat-config.dakale.net/miniprogram/image/share_active4.png",
        activeRuleImg = "https://wechat-config.dakale.net/miniprogram/image/share_active5.png",
        btnImg = "https://wechat-config.dakale.net/miniprogram/image/5_1_6.png",
        location = true,
      } = res;
      this.setState({
        specialGoodsDTOList,
        lnt,
        lat,
        address,
        merchantName,
        coverImg,
        type,
        path,
        index: index + 1,
        activeImg,
        mapImg,
        goodBill,
        activeRuleImg,
        btnImg,
        location,
      });
    });
  }
  getShareInfo() {
    const { profile, username } = Taro.getStorageSync("userInfo") || {};
    const {
      httpData: { activityType },
      coverImg = "",
    } = this.state;
    getShareInfo(
      {
        shareType: "activity",
        subType: activityType,
      },
      (res) => {
        const { qcodeUrl } = res;
        this.setState({
          cavansObj: {
            start: true,
            data: rssConfigData({
              wxCode: qcodeUrl,
              username,
              userProfile: profile,
              background: coverImg,
            }),
          },
        });
      }
    );
  }
  getSelectType() {
    const { type, path } = this.state;
    if (!loginStatus()) {
      Router({
        routerName: "login",
      });
    } else {
      if (type === "switchTab") {
        reLaunch(path);
      } else {
        navigateTo(path);
      }
    }
  }
  onShareAppMessage(res) {
    let userInfo = loginStatus() || {};
    const { userIdString } = userInfo;
    const {
      httpData: { activityType },
    } = this.state;
    if (res.from === "button") {
      return {
        title: "哒卡乐活动",
        path: `/pages/share/invitation/index?shareUserId=${userIdString}&shareUserType=user&activityType=${activityType}`,
      };
    }
  }

  render() {
    const {
      cavansObj,
      specialGoodsDTOList,
      lat,
      lnt,
      address,
      merchantName,
      activeImg = "",
      mapImg = "",
      goodBill = "",
      activeRuleImg = "",
      btnImg = "",
      configUserLevelInfo: { payBeanCommission = 50, shareCommission = 0 },
      location,
    } = this.state;
    const shopView = (item) => {
      const {
        goodsImg,
        goodsName,
        realPrice,
        oriPrice,
        merchantIdStr,
        specialGoodsId,
      } = item;
      return (
        <View
          className="invitation_shop_initBox"
          onClick={() =>
            Router({
              routerName: "favourableDetails",
              args: {
                merchantId: merchantIdStr,
                specialActivityId: specialGoodsId,
              },
            })
          }
        >
          <View
            style={backgroundObj(goodsImg)}
            className="invitation_shop_imageBox"
          ></View>
          <View className="invitation_shop_padding">
            <View className="invitation_shop_title font_noHide">
              {goodsName}
            </View>
            <View className="invitation_bean_title">卡豆抵扣后最低到手价:</View>
            <View className="invitation_bean_font bold">
              <Text className="font24">¥</Text>
              <Text className="font40">
                {" " + (realPrice * (1 - (payBeanCommission / 100))).toFixed(2)}
              </Text>
            </View>
            <View className="invitation_oldPrice_font font_hide">
              原价¥{oriPrice}
            </View>
            <View className="invitation_go_buy"></View>
          </View>
        </View>
      );
    };
    return (
      <View className="invitation_box">
        <TaroShareDrawer
          {...cavansObj}
          onSave={() => console.log("点击保存")}
          onClose={() =>
            this.setState({ cavansObj: { start: false, data: null } })
          }
        ></TaroShareDrawer>
        <View className="invitation_img1">
          <Image src={activeImg} lazyLoad className="invitation_image"></Image>
        </View>

        <View
          className="invitation_img2"
          onClick={() => {
            if (location) {
              mapGo({
                lat,
                lnt,
                address: address,
                merchantName: merchantName,
              });
            }
          }}
        >
          <Image className="invitation_image" src={mapImg} lazyLoad></Image>
        </View>

        {goodBill && (
          <View className="invitation_img6">
            <Image src={goodBill} lazyLoad className="invitation_image"></Image>
          </View>
        )}
        {specialGoodsDTOList.length > 0 && (
          <View className="invitation_img3">
            <View className="invitation_title">
              <Image
                className="invitation_image"
                src={
                  "https://wechat-config.dakale.net/miniprogram/image/share_active3.png"
                }
                lazyLoad
              ></Image>
            </View>
            <View className="invitation_waterfall_box">
              <Waterfall
                list={specialGoodsDTOList}
                createDom={shopView}
                noMargin={{ margin: "0" }}
                style={{ width: Taro.pxTransform(324) }}
              ></Waterfall>
            </View>
          </View>
        )}

        <View className="invitation_img5">
          <Image
            className="invitation_image"
            src={activeRuleImg}
            lazyLoad
          ></Image>
        </View>
        <View
          onClick={() => this.getShareInfo()}
          className="invitation_img4"
        ></View>
        <View className="invitation_btn" onClick={() => this.getSelectType()}>
          <Image className="invitation_img_btn" lazyLoad src={btnImg} />
        </View>
      </View>
    );
  }
}

export default Index;
