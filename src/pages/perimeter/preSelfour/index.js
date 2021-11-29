import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { fetchSpecialGoods, fetchUserShareCommission } from "@/server/index";
import { fetchSelfTourGoods } from "@/server/perimeter";
import SelectView from "@/components/searchView";
import {
  computedPrice,
  getLat,
  getLnt,
  GetDistance,
  backgroundObj,
} from "@/common/utils";
import Empty from "@/components/Empty";
import Router from "@/common/router";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      selfList: [],
      selectHttp: {
        page: 1,
        limit: 10,
        specialFilterType:
          getCurrentInstance().router.params.specialFilterType || "selfTour",
      },
      configUserLevelInfo: {},
    };
  }
  componentDidMount() {
    const { selectHttp } = this.state;
    const { specialFilterType } = selectHttp;
    if (specialFilterType === "selfTour") {
      Taro.setNavigationBarTitle({
        title: "周边游玩",
      });
    } else {
      Taro.setNavigationBarTitle({
        title: "新品推荐",
      });
    }
    this.fetchSelfList();
    this.fetchUserShare();
  }
  onPullDownRefresh() {
    this.fetchSelfList();
  }
  fetchUserShare() {
    fetchUserShareCommission({}, (res) => {
      const { configUserLevelInfo = {} } = res;
      this.setState({
        configUserLevelInfo,
      });
    });
  }
  onReachBottom() {
    const { selectHttp } = this.state;
    const { specialFilterType } = selectHttp;
    if (specialFilterType !== "selfTour") {
      this.setState(
        {
          selectHttp: {
            ...selectHttp,
            page: selectHttp.page + 1,
          },
        },
        (res) => {
          this.fetchSelfList();
        }
      );
    }
  } //上拉加载
  fetchSelfList() {
    const { selectHttp } = this.state;
    const { specialFilterType } = selectHttp;
    if (specialFilterType === "selfTour") {
      fetchSelfTourGoods({}).then((val) => {
        const { selfTourGoodList = [] } = val;
        this.setState({
          selfList: selfTourGoodList,
        });
      });
    } else {
      fetchSpecialGoods(selectHttp)
        .then((val) => {
          Taro.stopPullDownRefresh();
          const { specialGoodsList } = val;
          this.setState({
            selfList: [...this.state.selfList, ...specialGoodsList],
          });
        })
        .catch((e) => {
          Taro.stopPullDownRefresh();
        });
    }
  }
  render() {
    const { selfList, configUserLevelInfo, selectHttp } = this.state;
    const { specialFilterType } = selectHttp;
    const { payBeanCommission, shareCommission } = configUserLevelInfo;
    const template = (item) => {
      const {
        goodsImg,
        goodsName,
        oriPrice,
        realPrice,
        commission,
        ownerIdString,
        merchantIdString,
        merchantName,
        specialActivityIdString,
        merchantLogo,
        lat,
        lnt,
      } = item;
      return (
        <View
          className="preSelfour_card_box"
          onClick={() =>
            Router({
              routerName: "favourableDetails",
              args: {
                merchantId: ownerIdString,
                specialActivityId: specialActivityIdString,
              },
            })
          }
        >
          <View className="preSelfour_card_img">
            <Image
              className="preSelfour_img"
              lazyLoad
              mode={"aspectFill"}
              src={goodsImg}
            ></Image>
          </View>
          <View className="preSelfour_card_desc">
            <View className="preSelfour_card_name font_noHide">
              {goodsName}
            </View>
            {specialFilterType !== "selfTour" && (
              <View className="preSelfour_card_profileBox font_hide">
                <View
                  className="preSelfour_card_profile merchant_dakale_logo"
                  style={backgroundObj(merchantLogo)}
                ></View>
                <View className="preSelfour_card_profileNames font_hide">
                  {merchantName}
                </View>
                <View className="preSelfour_card_limit">
                  {" | " + GetDistance(getLat(), getLnt(), lat, lnt)}
                </View>
              </View>
            )}
            <View className="preSelfour_card_price">
              <Text className="font24 color1">优惠价:</Text>
              <Text className="font32 color1 price_margin4 bold">
                ¥{realPrice}
              </Text>
              <Text className="font24 color2 price_margin8">原价:</Text>
              <Text className="font26 color2 price_margin4 bold text_through">
                ¥{oriPrice}
              </Text>
            </View>
            <View className="preSelfour_new_bean">
              <View className="bean_getBigInfo preSelfour_new_img"></View>
              <View className="preSelfour_new_pay font_hide">
                ¥{computedPrice(realPrice, payBeanCommission)}
              </View>
            </View>
            <View className="preSelfour_btn public_center">
              {shareCommission > 0
                ? `分享赚¥${computedPrice(commission, shareCommission)}`
                : "立即抢购"}
            </View>
          </View>
        </View>
      );
    };
    return (
      <View className="preSelfour_box">
        <SelectView
          fn={(e) => {
            console.log(e);
          }}
          align={"left"}
          change={() => {
            Router({
              routerName: "search_shop",
            });
          }}
          title={"搜索附近吃喝玩乐～"}
        ></SelectView>
        <View className="preSelfour_selectList">
          <Empty
            show={selfList.length === 0}
            toast={
              specialFilterType === "selfTour"
                ? "暂无周边游数据"
                : "暂无推荐数据"
            }
            type={"home"}
          ></Empty>
          {selfList.map((item) => {
            return template(item);
          })}
        </View>
      </View>
    );
  }
}
export default Index;
