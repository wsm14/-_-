import React from "react";
import Taro, { getCurrentPages } from "@tarojs/taro";
import { Button, Image, View } from "@tarojs/components";
import Tab1 from "./components/userTab";
import "./index.scss";
import { getMainPage } from "@/server/user";
import { getBanner } from "@/server/common";
import {
  backgroundObj,
  removeLogin,
  navigateTo,
  filterStrList,
} from "@/common/utils";
import MakePhone from "@/components/payTelephone";
import classNames from "classnames";
import Banner from "@/components/banner";
import { scanCode } from "@/common/authority";
class Index extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      bannerList: [],
      bannerHttp: {
        bannerType: "person",
      },
      list: [
        {
          style: "users_setting_icon1",
          font: "客服中心",
          fn: () =>
            this.setState({
              telephone: true,
            }),
        },
        {
          style: "users_setting_icon2",
          font: "意见反馈",
        },
        {
          style: "users_setting_icon3",
          font: "我要合作",
          fn: () =>
            navigateTo(
              `/pages/share/webView/index?link=${this.state.link1}&title=我要合作`
            ),
        },
      ],
      loginStatus: 0,
      userInfo: {},
      merchantMobile: "400-800-5881",
      telephone: false,
      link:
        "https://web-new.dakale.net/product/page/bannerShare/merchantPlaybill.html",
      link1:
        "https://web-new.dakale.net/product/page/policy/cooperation.html?shareUserId=1&shareUserType=2",
      link2: "https://web-new.dakale.net/product/page/policy/eQuity.html",
    };
  }

  getBannerList() {
    const { bannerHttp } = this.state;
    getBanner(bannerHttp, (res) => {
      const { bannerList } = res;
      this.setState({
        bannerList,
      });
    });
  }

  getUserDetails() {
    getMainPage({}, (res) => {
      if (!res) {
        removeLogin();
        return;
      } else {
        const { userInfo } = res;
        this.setState({
          loginStatus: 1,
          userInfo,
        });
      }
    });
  }
  componentDidMount() {
    // this.getBannerList();
  }

  componentDidShow() {
    this.getUserDetails();
  }

  render() {
    const {
      bannerList,
      list,
      loginStatus,
      userInfo: {
        username,
        profile,
        realNameStatus,
        bean,
        userLevelSign,
        level,
        monthEarn,
        earningToday,
        familyMerchantEarn,
        familyEarn,
      },
      link,
      telephone,
      merchantMobile,
      link2,
    } = this.state;
    return (
      <View className="page_userBox">
        <View className='page_userBox_rightLogo'></View>
        {loginStatus === 0 && (
          <View
            className="page_userTop"
            onClick={() => navigateTo("/pages/auth/index")}
          >
            <View className="user_profiles dakale_profile"></View>

            <View className="user_details">
              <View className="users_name color1 bold">登录后玩转哒卡乐</View>
              <View className="user_card_dec font24">打卡，记录美好生活</View>
            </View>
            <View className="users_codeBg user_Code"></View>
          </View>
        )}
        {loginStatus !== 0 && (
          <View
            className="page_userTop"
            onClick={() => navigateTo("/pages/newUser/userDetails/index")}
          >
            <View
              className="user_profiles dakale_profile"
              style={backgroundObj(profile)}
            ></View>
            <View className="user_details">
              <View className="users_name color1 bold">{username}</View>
              
              <View style={realNameStatus==='2'?{}:{visibility:'hidden'}} className="users_status">
                <View
                  className={classNames(
                    "users_tag_box",
                    realNameStatus === "2"
                      ? "user_tag_color2"
                      : "user_tag_color1"
                  )}
                >
                  <View
                    className={classNames(
                      "users_tag_iconBox",
                      realNameStatus === "2"
                        ? "users_tag_icon2"
                        : "users_tag_icon1"
                    )}
                  ></View>
                  <View className="users_tag_font font20 color6">
                    {realNameStatus === "2" ? "已认证" : "未认证"}
                  </View>
                </View>
                {userLevelSign && level != "0" && (
                  <View className="user_tag_lever">
                    <View className="users_tag_iconBox users_tag_icon3"></View>
                    <View className="users_tag_font font20 color6">
                      {userLevelSign}
                    </View>
                  </View>
                )}
              </View>
            </View>

            <View
              className="user_Code users_codeBg"
              onClick={(e) => {
                e.stopPropagation();
                scanCode();
              }}
            ></View>
          </View>
        )}
        <View
          className="user_surplus user_beanBg"
          onClick={() => navigateTo("/pages/newUser/wallet/index")}
        >
          <View className="user_surplus_title color6">
            <View className="user_surplus_biaoshi font32">卡豆余额</View>
            <View className="user_surplus_beanNum font36 bold">
              {bean || "0"}
            </View>
            <View className="user_surplus_icon user_beanGo"></View>
            <View
              className="user_surplus_beanDec user_beanQuestion"
              onClick={(e) => {
                e.stopPropagation();
                navigateTo(
                  `/pages/share/webView/index?link=${this.state.link2}&title=常见问题`
                );
              }}
            ></View>
          </View>
          <View className="user_surplus_center">
            <View
              className="user_surplus_wallet"
              onClick={(e) => {
                e.stopPropagation(),
                  navigateTo("/pages/newUser/rewardDetails/index");
              }}
            >
              <View className="color7 font24">明细</View>
              <View className="user_wallet_box user_decIcon"></View>
            </View>
            <View className="user_surplus_box">
              <View className="user_surplus_dayStyle font24 color2">
                今日收益
              </View>
              <View className="user_surplus_num color1 font36 bold">
                {earningToday || "0"}
              </View>
            </View>
            <View className="user_surplus_liner"></View>
            <View className="user_surplus_box">
              <View className="user_surplus_dayStyle font24 color2">
                本月收益
              </View>
              <View className="user_surplus_num color1 font36 bold">
                {monthEarn || "0"}
              </View>
            </View>
          </View>
        </View>
        <Tab1></Tab1>
        <View className="user_forMe">
          <View className="color1 font40 bold">我的家族</View>
          <View className="user_forMeBox public_auto">
            <View
              onClick={() => {
                navigateTo("/pages/newUser/userFamily/index");
              }}
              className="user_forImg user_familyImg"
            >
              <View className="user_forMytitle">我的家人今日贡献</View>
              <View className="user_forBeans">
                <View className="font40 bold"> {familyEarn || 0}</View>
                <View className="font28">卡豆</View>
              </View>
            </View>
            <View
              className="user_forImg user_shopImg"
              onClick={() => {
                navigateTo("/pages/newUser/shopFamily/index");
              }}
            >
              <View className="user_forMytitle">我的家店今日贡献</View>
              <View className="user_forBeans">
                <View className="font40 bold"> {familyMerchantEarn || 0} </View>
                <View className="font28">卡豆</View>
              </View>
            </View>
          </View>
        </View>
        {telephone && (
          <MakePhone
            data={filterStrList(merchantMobile)}
            onClose={() => this.setState({ telephone: false })}
            onCancel={() => this.setState({ telephone: false })}
          ></MakePhone>
        )}
        <View className="users_actives">
          {/* <Banner
            showNear={true}
            autoplay={bannerList.length > 1 ? true : false}
            imgStyle
            data={bannerList}
            imgName={"coverImg"}
            style={{ width: "100%", height: "100%" }}
            boxStyle={{ width: "100%", height: "100%" }}
          ></Banner> */}
          <Image
            onClick={() =>
              navigateTo(
                `/pages/share/webView/index?link=${link}&title=哒卡乐诚邀商家入驻`
              )
            }
            src={
              "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/icon427.png"
            }
            lazyLoad
            className="users_Images"
          ></Image>
        </View>
        <View className="users_ourSetting">
          <View className="users_ourSetting_title font40 color1 bold">
            更多功能
          </View>
          <View className="users_ourSetting_bg">
            <View className="users_setting_bg public_auto">
              {list.map((item) => {
                return (
                  <View
                    className="users_set_box"
                    onClick={() => item.fn && item.fn()}
                  >
                    <View
                      className={`users_setting_icons ${item.style}`}
                    ></View>
                    <View className="users_setting_font font24 color1">
                      {item.font}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
