import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Image, View, ScrollView } from "@tarojs/components";
import Nav from "@/components/nav";
import { user } from "@/api/api";
import { httpGet } from "@/api/newRequest";
import Toast from "./../components/modal";
import {
  navigateTo,
  setPeople,
  filterStrList,
  computedHeight,
  backgroundObj,
  filterTime,
  toast,
  saveFollow,
  deleteFollow,
  goBack,
} from "@/common/utils";
import classNames from "classnames";
import Waterfall from "@/components/waterfall";
import NullStatus from "@/components/nullStatus";
import "./index.scss";
import evens from "@/common/evens";
import Router from "@/common/router";
import { inject, observer } from "mobx-react";
@inject("store")
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      userInfo: {},
      httpData: {
        page: 1,
        limit: 10,
        userId: getCurrentInstance().router.params.userId || "1",
      },
      userMomentsList: [],
      imageHost: "",
      countStatus: true,
      styleStatus: false,
      visible: false,
    };
  }

  getFollow() {
    let that = this;
    const {
      userInfo,
      userInfo: { merchantIdString, userType },
    } = this.state;
    saveFollow(
      {
        followType: userType,
        followUserId: merchantIdString,
      },
      (res) => {
        that.setState(
          {
            userInfo: {
              ...userInfo,
              merchantFollowStatus: "1",
            },
          },
          (res) => {
            toast("关注成功");
          }
        );
      }
    );
  }

  deleteFollow() {
    let that = this;
    const {
      userInfo,
      userInfo: { merchantIdString },
    } = this.state;
    that.setState(
      {
        visible: false,
      },
      (res) => {
        deleteFollow(
          {
            followUserId: merchantIdString,
          },
          () => {
            that.setState(
              {
                userInfo: {
                  ...userInfo,
                  merchantFollowStatus: "0",
                },
              },
              (res) => {
                toast("取消成功");
              }
            );
          }
        );
      }
    );
  }

  getDetails() {
    const {
      merchantDetails: { getOtherMerchant },
    } = user;
    const {
      httpData: { userId },
    } = this.state;
    httpGet(
      {
        data: {
          userId: userId,
        },
        url: getOtherMerchant,
      },
      (res) => {
        const { userInfo } = res;
        this.setState({
          userInfo,
        });
      }
    );
  }

  getListOther() {
    const {
      merchantDetails: { getOtherMoment },
    } = user;
    const { httpData } = this.state;
    httpGet(
      {
        data: {
          ...httpData,
        },
        url: getOtherMoment,
      },
      (res) => {
        const { userMomentsList, imageHost } = res;
        if (userMomentsList && userMomentsList.length > 0) {
          this.setState({
            userMomentsList: [
              ...this.state.userMomentsList,
              ...userMomentsList,
            ],
            imageHost,
          });
        } else {
          this.setState(
            {
              countStatus: false,
            },
            (res) => {
              toast("暂无更多数据");
            }
          );
        }
      }
    );
  }

  linkToVideo(item) {
    const { momentIndex, userIdString } = item;
    const { userMomentsList } = this.state;
    const { store } = this.props;
    store.homeStore.setNavitory(userMomentsList, momentIndex);
    console.log(userMomentsList)
    Router({ routerName: "merchantVideo", args: { userId: userIdString } });
  }

  componentDidMount() {
    this.getDetails();
    this.getListOther();
  }

  createdShareMerchant = (item) => {
    const {
      frontImage,
      frontImageHeight,
      frontImageWidth,
      contentType,
      length,
      imageLength,
      merchantAddress,
      distanceRange,
      categoryName,
      title,
      beanFlag,
      watchStatus,
      beanAmount,
      couponTitlesJson,
      momentId,
      userIdString,
    } = item;
    return (
      <View
        onClick={() => this.linkToVideo(item)}
        className="merchant_falls_details"
      >
        <View
          className="merchant_falls_makebg"
          style={
            frontImage
              ? {
                  ...backgroundObj(frontImage),
                  height: Taro.pxTransform(
                    computedHeight(frontImageWidth, frontImageHeight, 335)
                  ),
                }
              : {}
          }
        >
          <View className="merchant_share_imgTag">{filterTime(length)}</View>
        </View>
        <View className="mechant_share_content">
          <View className="merchant_share_title font_noHide">
            {categoryName && (
              <View className="merchant_share_tags">{categoryName}</View>
            )}
            {title}
          </View>
          {couponTitlesJson && (
            <View className="merchant_coupon">
              {couponTitlesJson.map((item) => {
                if (item.couponType === "1")
                  return (
                    <View className="merchant_coupon_box merchant_coupon_color1">
                      {item.couponTitle}
                    </View>
                  );
                else {
                  return (
                    <View className="merchant_coupon_box merchant_coupon_color2">
                      {item.couponTitle}
                    </View>
                  );
                }
              })}
            </View>
          )}
          {beanFlag == "1" && (
            <View className="merchant_getBean">
              {watchStatus == "0" ? (
                <View className="merchantBean_style1 merchant_bean_icon">
                  观看可捡{beanAmount}
                </View>
              ) : (
                <View className="merchantBean_style2 merchant_bean_icon">
                  已捡{beanAmount}
                </View>
              )}
            </View>
          )}
          {merchantAddress && (
            <View>
              <View className="merchant_liner"></View>
              <View className="merchant_falls_accress">
                <View className="merchant_falls_city">
                  <View className="merchant_falls_cityIcon"></View>
                  <View className="merchant_falls_cityName">
                    {merchantAddress}
                  </View>
                </View>
                <View className="merchant_falls_limit">
                  距你{distanceRange || "-"}
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  onReachBottom() {
    this.onSollorBottom();
  }

  //获取个人足迹
  onSollorBottom() {
    const {
      httpData,
      httpData: { page },
      countStatus,
    } = this.state;
    if (countStatus) {
      this.setState(
        {
          httpData: {
            ...httpData,
            page: page + 1,
          },
        },
        (res) => {
          this.getListOther();
        }
      );
    } else toast("暂无更多数据");
  }

  //上拉加载
  // onPageScroll(Object){
  //   const {scrollTop} = Object
  //   console.log(scrollTop)
  //   if(scrollTop >=160){
  //     this.setState({
  //       styleStatus: true
  //     })
  //   }
  //   else {
  //     this.setState({
  //       styleStatus: false
  //     })
  //   }
  // }

  errorToast(e) {
    this.setState({
      Toast: {
        status: "error",
        text: e,
        isOpened: true,
      },
    });
  }

  render() {
    const {
      userInfo: {
        backgroundImg,
        profile,
        username,
        residentAddress,
        districtName,
        categoryName,
        brandName,
        tag,
        introduction,
        pushMomentNum,
        userFansNum,
        merchantFollowStatus,
      },
      userInfo,
      userMomentsList,
      styleStatus,
      visible,
    } = this.state;
    if (Object.keys(userInfo).length > 0) {
      return (
        <View className="merchant_box">
          <View className="merchant_box_bgs" style={{ position: "relative" }}>
            <View
              className="merchant_filter"
              style={backgroundImg ? { ...backgroundObj(backgroundImg) } : {}}
            ></View>
            <View className="merchant_topBg">
              <View className="merchant_top">
                <View className="merchant_topBg"> </View>
                <View style={styleStatus && { visibility: "hidden" }}>
                  <View className="merchant_bigPro">
                    <View
                      style={profile ? { ...backgroundObj(profile) } : {}}
                      className="merchant_bigfile"
                    ></View>
                    <View className="merchant_bigdec">
                      <View className="merchant_title_box">
                        <View className="merchant_name font_hide">
                          {username}
                        </View>
                        <View className="merchant_tag">商家</View>
                      </View>
                      <View className="merchant_details">
                        {residentAddress}｜{districtName}·{categoryName}
                      </View>
                      <View className="merchant_make">
                        {brandName && (
                          <View className="make_tags_box make_color_yellow">
                            {brandName}
                          </View>
                        )}
                        {filterStrList(tag).map((item, index) => {
                          return (
                            <View
                              key={index}
                              className="make_tags_box make_color_white"
                            >
                              {item}
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  </View>

                  <View className="merchant_dec">{introduction}</View>

                  <View className="merchant_code">
                    <View className="merchant_follow">
                      <View className="merchant_num">
                        {setPeople(userFansNum) || 0}
                      </View>
                      <View className="merchant_title">粉丝</View>
                    </View>
                    <View className="merchant_fans">
                      <View className="merchant_num">
                        {setPeople(pushMomentNum) || 0}
                      </View>
                      <View className="merchant_title">分享</View>
                    </View>
                    {merchantFollowStatus == "0" ? (
                      <View
                        className="merchant_edit_box merchant_edit_green"
                        onClick={() => this.getFollow()}
                      >
                        关注
                      </View>
                    ) : (
                      <View
                        className="merchant_edit_box merchant_edit_borderWhite"
                        onClick={() => this.setState({ visible: true })}
                      >
                        已关注
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View className="merchant_content">
            {userMomentsList.length == 0 && <NullStatus type={0}></NullStatus>}
            {userMomentsList.length > 0 && (
              <Waterfall
                list={userMomentsList}
                createDom={this.createdShareMerchant.bind(this)}
                imgHight={"frontImageHeight"}
                imgWidth={"frontImageWidth"}
                setWidth={335}
                style={{ width: Taro.pxTransform(335) }}
              ></Waterfall>
            )}
          </View>
          {visible && (
            <Toast
              visible={visible}
              onCancel={this.deleteFollow.bind(this)}
              onClose={() => {
                this.setState({ visible: false });
              }}
            ></Toast>
          )}
        </View>
      );
    } else {
      return null;
    }
  }
}

export default Index;
