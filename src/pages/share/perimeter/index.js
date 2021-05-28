import React, { PureComponent } from "react";
import Taro, { getCurrentInstance, pxTransform } from "@tarojs/taro";
import { ScrollView, View, Image, Text } from "@tarojs/components";
import Banner from "@/components/banner";
import { wxapiGet, index, perimeter } from "@/api/api";
import { httpGet } from "@/api/newRequest";
import NallStatus from "@/components/nullStatus";
import Favourable from "./components/favourable";
import Waterfall from "@/components/waterfall";
import { createdShareKol } from "@/components/publicShopStyle";
import { login, scanCode, mapTx } from "@/common/authority";
import {
  filterLogin,
  navigateTo,
  backgroundObj,
  setPeople,
  NavHeight,
  toast,
  goDown,
  getLat,
  getLnt,
  getDom,
} from "@/common/utils";
import classNames from "classnames";
import "./perimeter.scss";
import { inject, observer } from "mobx-react";
import evens from "@/common/evens";
import { getAddress, getDictionary } from "@/server/common";
import Toast from "@/components/dakale_toast";
import Router from "@/common/router";
import TabCity from "./components/tabCity";
import ToastCity from "./components/toastCity";
@inject("store")
@observer
class Index extends PureComponent {
  constructor() {
    super(...arguments);
    this.state = {
      bannerHttp: {
        bannerType: "main",
      },
      surroundingSpecial: [],
      bannerList: [],
      userDetails: {},
      domainList: [],
      selectIndex: 0,
      topicList: [],
      scroll_left: 0,
      kolHttp: {
        domainId: "",
        topicId: "",
        page: 1,
        limit: 10,
      },
      kolMomentsList: [],
      navHeight: { paddingTop: Taro.pxTransform(64) },
      setBackGround: {},
      iconStatus: false,
      countStatus: true,
      subKeyValueList: [],
      specialGoods: {
        page: 1,
        limit: 10,
      },
      visible: false,
      result: {},
      login: false,
      addWx: true,
    };
    this.interceptors = null;
  }

  //获取个人足迹
  onPageScroll(e) {
    if (this.interceptors) {
      clearTimeout(this.interceptors);
      this.interceptors = setTimeout(this.setSearch.bind(this, e), 1);
    } else {
      this.interceptors = setTimeout(this.setSearch.bind(this, e), 1);
    }
  }

  setSearch(e) {
    const { setBackGround } = this.state;
    let scale = 0;
    if (e.scrollTop >= 125) {
      this.setState({
        setBackGround: {
          color: "rgba(51, 51, 51, 1)",
          background: "rgba(255, 255, 255, 1)",
        },
        iconStatus: true,
      });
    } else {
      scale = e.scrollTop / 125;
      this.setState({
        setBackGround: {
          background: `rgba(255, 255, 255, ${scale})`,
        },
        iconStatus: false,
      });
    }
  }

  getBanner(data, val) {
    const { wechatBanner } = wxapiGet;
    httpGet(
      {
        data: data,
        url: wechatBanner,
      },
      (res) => {
        const { bannerList } = res;
        this.setState({
          [val]: bannerList,
        });
      }
    );
  }

  getUserSimpleInfo() {
    const {
      perimeter: { getUserSimpleInfo },
    } = index;
    httpGet(
      {
        data: {},
        url: getUserSimpleInfo,
      },
      (res) => {
        this.setState({
          userDetails: {
            ...res,
          },
        });
      }
    );
  }

  getDomain() {
    const {
      perimeter: { getDomain },
    } = index;
    httpGet(
      {
        data: {},
        url: getDomain,
      },
      (res) => {
        const { domainList } = res;
        this.setState({
          domainList,
          topicList: domainList[0].topicList || [],
        });
      }
    );
  }

  setTicName(item, index) {
    const str = "topicId";
    const { topicList } = item;
    this.setState(
      {
        topicList: topicList || [],
        selectIndex: index,
        countStatus: true,
        checkedList: [],
        kolMomentsList: [],
        kolHttp: {
          domainId: item.domainId || "",
          topicId: "",
          page: 1,
          limit: 10,
        },
      },
      (res) => {
        const { selectIndex } = this.state;
        if (selectIndex > 2) {
          getDom(".permerter_kol_domain", (res) => {
            let width = 0;
            for (let i = 0; i < index - 2; i++) {
              width = width + Number(res[i].width) + 24;
            }
            this.setState({
              scroll_left: width,
            });
          });
        }
        this.getKolList();
      }
    );
  }

  setTopic(item) {
    const { topicId } = item;
    const { kolHttp } = this.state;
    if (kolHttp.topicId === topicId) {
      this.setState(
        {
          kolHttp: {
            ...kolHttp,
            page: 1,
            limit: 10,
            topicId: "",
          },
          kolMomentsList: [],
        },
        (res) => {
          this.getKolList();
        }
      );
    } else {
      this.setState(
        {
          kolHttp: {
            ...kolHttp,
            page: 1,
            limit: 10,
            topicId: topicId,
          },
          kolMomentsList: [],
        },
        (res) => {
          this.getKolList();
        }
      );
    }
  }

  getSetting() {
    const {
      perimeter: { getSetting },
    } = index;
    httpGet(
      {
        url: getSetting,
        data: {
          parent: "mainFunction",
        },
      },
      (res) => {
        const { keyValueList } = res;
        let subKeyValueList = keyValueList["subKeyValueList"].map((item) => {
          return JSON.parse(item.extraParam);
        });
        this.setState({
          subKeyValueList,
        });
      }
    );
  }

  getKolList() {
    const { kolHttp } = this.state;
    const {
      perimeter: { getListKol },
    } = index;
    httpGet(
      {
        data: kolHttp,
        url: getListKol,
      },
      (res) => {
        const { kolMomentsList } = res;
        if (kolMomentsList && kolMomentsList.length > 0) {
          this.setState({
            kolMomentsList: [...this.state.kolMomentsList, ...kolMomentsList],
          });
        } else {
          this.setState(
            {
              countStatus: false,
            },
            (res) => {
              toast("暂无数据");
            }
          );
        }
      }
    );
  }

  updateList(obj) {
    const { kolMomentsList } = this.state;
    let list = kolMomentsList.map((item) => {
      if (item["kolMomentsId"] === obj["kolMomentId"]) {
        obj["kolMomentsId"] = item["kolMomentsId"];
        return { ...item, ...obj };
      }
      return item;
    });
    this.setState({
      kolMomentsList: list,
    });
  }

  setMap() {
    let times = setInterval(() => {
      const latitude = getLat();
      const longitude = getLnt();
      if (latitude && longitude)
        this.setState(
          {
            lnt: longitude,
            lat: latitude,
          },
          (res) => {
            getAddress(
              {
                location: `${latitude},${longitude}`,
                key: mapTx,
              },
              (res) => {
                clearInterval(times);
                const { message, result } = res;
                if (message === "query ok") {
                  const {
                    address_component: { city },
                  } = result;
                  if (city !== "杭州市") {
                    this.setState({
                      result,
                    });
                  } else {
                    this.setState({
                      result,
                    });
                  }
                } else {
                  toast(message);
                }
              }
            );
          }
        );
    }, 1000);
  }
  //获取具体位置信息 设置经纬度
  componentDidMount() {
    const that = this;
    Taro.setStorageSync("login", (Taro.getStorageSync("login") || 0) + 1);
    if (Taro.getStorageSync("login") === 1) {
      setTimeout(() => this.setState({ addWx: false }), 10000);
    }
    toast(Taro.getStorageSync("login").toString());
    const { bannerHttp, specialHttp } = this.state;
    this.getKolList();
    this.setState({
      navHeight: { paddingTop: Taro.pxTransform(parseInt(NavHeight())) },
    });
    this.getSetting();
    this.getBanner(bannerHttp, "bannerList");
    this.getDomain();
    getDictionary({ parent: "activity", child: "hideStatus" }, (res) => {
      const { keyValueInfo } = res;
      that.props.store.activeStore.setActiveStore(keyValueInfo);
    });
  }

  componentDidShow() {
    this.getUserSimpleInfo();
    this.setMap();
    evens.$on("updateList", this.updateList.bind(this));
  }

  onReachBottom() {
    this.pageDown();
  }

  pageDown() {
    const { kolHttp, countStatus } = this.state;
    if (countStatus) {
      this.setState(
        {
          kolHttp: {
            ...kolHttp,
            page: kolHttp.page + 1,
          },
        },
        (res) => {
          this.getKolList();
        }
      );
    } else {
      toast("暂无数据");
    }
  }

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
      bannerList,
      userDetails: {
        profile,
        username,
        userRealNameStatus,
        userBeanAmount,
        userTodayEarn,
        userCouponNum,
        userLevelSign,
        level,
      },
      domainList,
      selectIndex,
      topicList,
      scroll_left,
      kolMomentsList,
      kolHttp: { topicId },
      navHeight,
      setBackGround,
      iconStatus,
      userDetails,
      subKeyValueList,
      result,
      result: { formatted_addresses = {}, address_component = {} },
      visible,
      addWx,
    } = this.state;
    const { userInfo } = this.props.store.authStore;
    const { cityName, cityCode } = this.props.store.locationStore;
    return (
      <View className="perimerter_box">
        <View style={setBackGround} className="perimerter_fixed">
          <View
            style={!iconStatus ? { paddingTop: pxTransform(60) } : {}}
            className="perimerter_fixed_title"
          >
            <View className="perimerter_title">
              <View className="perimerter_city">
                <Image
                  className="perimerter_city_box"
                  src={
                    iconStatus
                      ? "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/icon46.png"
                      : "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/icon40.png"
                  }
                ></Image>
                <View
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateTo("/pages/perimeter/city/index");
                  }}
                  className="perimerter_city_font"
                >
                  {cityName}
                </View>
                <Image
                  className="perimerter_city_select"
                  src={
                    iconStatus
                      ? "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/icon47.png"
                      : "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/icon41.png"
                  }
                ></Image>
              </View>
              <View className="perimerter_search">
                <View
                  onClick={() =>
                    navigateTo("/pages/perimeter/search_shop/index")
                  }
                  placeholderClass={classNames(
                    iconStatus ? "placeholder_style1" : "placeholder_style2"
                  )}
                  className={classNames(
                    iconStatus ? "perimerter_input2" : "perimerter_input1"
                  )}
                >
                  <Image
                    className="searchs_image"
                    src={
                      iconStatus
                        ? "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/icon44.png"
                        : "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/icon433.png"
                    }
                  ></Image>
                  搜一下附近玩乐
                </View>
              </View>
              <Image
                className="perimerter_codeBox"
                onClick={() => scanCode()}
                src={
                  iconStatus
                    ? "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/icon435.png"
                    : "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/icon434.png"
                }
              ></Image>
            </View>
          </View>
        </View>
        <View className="perimerter_top">
          <Banner
            showNear={true}
            autoplay={bannerList.length > 1 ? true : false}
            imgStyle
            data={bannerList}
            imgName={"coverImg"}
            style={{ width: "100%", height: "100%" }}
            boxStyle={{ width: "100%", height: "100%" }}
            bottom={{ bottom: Taro.pxTransform(104) }}
          ></Banner>
        </View>
        {login(userInfo) !== "0" || Object.keys(userDetails).length < 5 ? (
          <View
            className="perimerter_noUser"
            onClick={() => navigateTo("/pages/auth/index")}
          >
            <View className="perimerter_userProfile"></View>
            <View className="perimerter_userBox">
              <View className="perimerter_userName">登录哒卡乐星球</View>
              <View className="perimerter_details">我有亿点本事“豆”你开心</View>
            </View>
            <View className="perimerter_btn">
              {filterLogin(login(userInfo)) || "去授权"}
            </View>
          </View>
        ) : (
          <View className="perimerter_card">
            <View
              className="perimerter_userProfile"
              onClick={() => navigateTo("/pages/newUser/userDetails/index")}
              style={backgroundObj(profile)}
            ></View>
            <View className="perimerter_userBox">
              <View className="perimerter_userName">
                <View className="perimerter_userflow font_hide">
                  {username || "--"}
                </View>
                {userRealNameStatus === "2" && (
                  <View
                    className={classNames(
                      "user_user_iconBox",
                      userRealNameStatus === "1"
                        ? "perimerter_user_icon2"
                        : "perimerter_user_icon1"
                    )}
                  ></View>
                )}
              </View>
              <View
                style={level === "0" ? { visibility: "hidden" } : {}}
                className="perimerter_userKol"
              >
                <View
                  onClick={() => navigateTo("/pages/kol/legal/index")}
                  className="kol_icon2"
                >
                  <View className="kol_icon_bg"></View>
                  <View className="kol_icon_font">
                    {userLevelSign || "无哒人名称"}
                  </View>
                </View>
              </View>
            </View>
            <View className="perimerter_getBean">
              <View>卡豆余额{"  " + setPeople(userBeanAmount || 0)}</View>
              <View className="perimerter_bean_liner"></View>
              <View>今日收益{"  " + setPeople(userTodayEarn || 0)}</View>
            </View>
            <View
              className="perimerter_quan"
              onClick={() => navigateTo("/pages/coupon/wraparound/index")}
            >
              {userCouponNum | 0}张券可用
            </View>
          </View>
        )}
        {subKeyValueList.length > 0 && (
          <View className="perimerter_active">
            <View
              className="perimerter_beanActive"
              onClick={() => navigateTo("/pages/perimeter/lookShare/index")}
            >
              <View className="perimerter_dec">
                <View className="perimerter_title">
                  {subKeyValueList[1].title}
                </View>
                <View className="permerter_intertion permerter_interSize1">
                  {subKeyValueList[1].subtitle}
                </View>
              </View>
            </View>
            <View className="permerter_share">
              <View
                className="permerter_share_look"
                onClick={() => Router({ routerName: "perimeterIndex" })}
              >
                <View className="perimerter_dec">
                  <View className="perimerter_title">
                    {subKeyValueList[0].title}
                  </View>
                  <View className="permerter_active_accress">
                    <View className="permerter_active_tag">
                      <View className="permerter_active_cityIcon"></View>
                      <View className="permerter_active_cityFont font_hide">
                        {address_component.street || "国泰科技大厦 "}
                      </View>
                    </View>
                  </View>
                  {/* <View className="permerter_intertion permerter_interSize2">
                    {subKeyValueList[1].subtitle}
                  </View> */}
                </View>
              </View>
              <View className="permerter_share_game" onClick={() => goDown()}>
                <View className="perimerter_dec">
                  <View className="perimerter_title">
                    {subKeyValueList[2].title}
                  </View>
                  <View className="permerter_intertion permerter_interSize2">
                    {subKeyValueList[2].subtitle}
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
        <View className="permerter_tab">
          <View className="permerter_tab_box">
            <View
              className="permerter_tab_iconBox permerter_tab_icon1"
              onClick={() => navigateTo("/pages/newUser/record/index")}
            ></View>
            <View className="permerter_tab_font">打卡足迹</View>
          </View>
          <View
            className="permerter_tab_box"
            onClick={() => navigateTo("/pages/share/shareFriend/index")}
          >
            <View className="permerter_tab_iconBox permerter_tab_icon2"></View>
            <View className="permerter_tab_font">分享捡豆</View>
          </View>
          <View className="permerter_tab_box">
            <View
              className="permerter_tab_iconBox permerter_tab_icon3"
              onClick={() => navigateTo("/pages/share/shareShop/index")}
            ></View>
            <View className="permerter_tab_font">我要推店</View>
          </View>
        </View>
        {this.props.store.activeStore.activeStatusObj.specialGoods === "1" && (
          <Favourable></Favourable>
        )}
        <View className="permerter_tab_kol">
          <ScrollView
            
            scrollX={true}
            scrollWithAnimation={true}
            scrollLeft={selectIndex > 2 ? scroll_left : false}
            onScroll={this.setScroll}
            className="permerter_tab_tags"
          >
            {domainList.map((item, index) => {
              return (
                <View
                  onClick={() => this.setTicName(item, index)}
                  key={index}
                  className={classNames(
                    "permerter_kol_domain",
                    selectIndex == index && "checked"
                  )}
                >
                  {item.domainName}
                </View>
              );
            })}
          </ScrollView>
          <View
            className="permerter_tip_box"
            style={topicList.length == 0 && { height: Taro.pxTransform(30) }}
          >
            <ScrollView scrollX={true} className="permerter_tip_tag">
              {topicList.map((item, index) => {
                return item.topicId !== topicId ? (
                  <View
                    onClick={() => this.setTopic(item)}
                    className="tip_noCheck"
                  >
                    {item.topicName}
                  </View>
                ) : (
                  <View
                    key={index}
                    onClick={() => this.setTopic(item)}
                    className="tip_checked"
                  >
                    {item.topicName}
                    <View className="checked_icon"></View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
          <View className="permerter_userDetails_box">
            {kolMomentsList.length > 0 ? (
              <Waterfall
                list={kolMomentsList}
                createDom={createdShareKol}
                imgHight={"frontImageHeight"}
                imgWidth={"frontImageWidth"}
                setWidth={335}
                style={{ width: Taro.pxTransform(335) }}
              ></Waterfall>
            ) : (
              <NallStatus></NallStatus>
            )}
          </View>
        </View>
        {Taro.getStorageSync("login") === 1 &&
          !Taro.getStorageSync("userInfo") &&
          !this.state.login && (
            <View className="permerter_user_login">
              <View
                className="permerter_user_close"
                onClick={() => this.setState({ login: true })}
              ></View>
              <View className="permerter_user_loginFont">
                登录哒卡乐，捡豆不遗漏
              </View>
              <View
                className="permerter_user_loginbtn"
                onClick={() => navigateTo("/pages/auth/index")}
              >
                登录
              </View>
            </View>
          )}
        {Taro.getStorageSync("login") === 1 && addWx && (
          <View className="permerter_user_collcetion">
            <Image
              style={{ width: "100%", height: "100%" }}
              src={
                "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/icon423.png"
              }
            ></Image>
            <View className="permerter_user_position">
              <View
                className="permerter_user_closeTop"
                onClick={() => this.setState({ addWx: false })}
              ></View>
              <View>点击“</View>
              <View className="permerter_user_solid"></View>
              <View>”添加到我的小程序，卡豆捡不停</View>
            </View>
          </View>
        )}
        <TabCity store={this.props.store} data={result}></TabCity>
        <ToastCity store={this.props.store} data={result}></ToastCity>
      </View>
    );
  }
}
export default Index;
