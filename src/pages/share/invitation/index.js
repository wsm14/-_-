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
              this.fetchActivity()
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
        type = "",
        path = "",
        address = "",
        merchantName = "",
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
    const { type = "switchTab", path = "/pages/index/home/index" } = this.state;
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
        title: "邀请函",
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
      configUserLevelInfo: { payBeanCommission = 50, shareCommission = 0 },
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
          <View className="invitation_shop_title font_noHide">{goodsName}</View>
          <View className="invitation_bean_title">卡豆抵扣到手价</View>
          <View className="invitation_bean_font">
            <Text className="font24">¥</Text>
            <Text className="font28">
              {" " + (realPrice * (payBeanCommission / 100)).toFixed(2)}
            </Text>
          </View>
          <View className="invitation_oldPrice_font font_hide">
            原价¥{oriPrice}
          </View>
          <View className="invitation_go_buy"></View>
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
          <Image
            className="invitation_img_title1"
            lazyLoad
            src={"https://wechat-config.dakale.net/miniprogram/image/5_1_2.png"}
          />
          <ButtonView>
            <View
              className="goMap_btn"
              onClick={() =>
                mapGo({
                  lat,
                  lnt,
                  address: address,
                  merchantName: merchantName,
                })
              }
            ></View>
          </ButtonView>
        </View>
        <View className="invitation_img2">
          <View className="invitation_shop_image">
            <Image
              className="invitation_img_title2"
              lazyLoad
              src={
                "https://wechat-config.dakale.net/miniprogram/image/5_1_3.png"
              }
            />
          </View>
          <View className="invitation_shop_specail_title"></View>
          <View className="invitation_shop_box">
            <Waterfall
              list={specialGoodsDTOList}
              createDom={shopView}
              noMargin={{ margin: "0" }}
              style={{ width: Taro.pxTransform(300) }}
            ></Waterfall>
          </View>
          <View className="invitation_shop_card">
            <Image
              className="invitation_img_style"
              lazyLoad
              src={
                "https://wechat-config.dakale.net/miniprogram/image/5_1_8.png"
              }
            />
          </View>
        </View>
        <View className="invitation_img3">
          <Image
            className="invitation_img_style"
            lazyLoad
            src={"https://wechat-config.dakale.net/miniprogram/image/5_1_5.png"}
          />
        </View>
        <View
          onClick={() => this.getShareInfo()}
          className="invitation_img4"
        ></View>
        <View className="invitation_btn" onClick={() => this.getSelectType()}>
          <Image
            className="invitation_img_btn"
            lazyLoad
            src={"https://wechat-config.dakale.net/miniprogram/image/5_1_6.png"}
          />
        </View>
      </View>
    );
  }
}

export default Index;
