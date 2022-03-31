import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { fetchUserShareCommission } from "@/server/common";
import { fetchCommerceGoods } from "@/server/perimeter";
import SelectView from "@/components/public_ui/searchView";
import { computedPrice } from "@/utils/utils";
import Empty from "@/components/Empty";
import Router from "@/utils/router";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      commerList: [],
      selectHttp: {
        page: 1,
        limit: 10,
      },
      configUserLevelInfo: {},
      payBeanCommission: getCurrentInstance().router.params.payBeanCommission,
      identification: getCurrentInstance().router.params.identification,
    };
  }
  fetchCommerceList() {
    fetchCommerceGoods(this.state.selectHttp)
      .then((val) => {
        Taro.stopPullDownRefresh();
        const { specialGoodsList } = val;
        this.setState({
          commerList: [...this.state.commerList, ...specialGoodsList],
        });
      })
      .catch((e) => {
        Taro.stopPullDownRefresh();
      });
  }
  componentDidMount() {
    this.fetchUserShare();
    this.fetchCommerceList();
  }
  onPullDownRefresh() {
    this.setState(
      {
        commerList: [],
        selectHttp: {
          page: 1,
          limit: 10,
        },
      },
      () => {
        this.fetchCommerceList();
      }
    );
  }
  fetchUserShare() {
    const { payBeanCommission } = this.state;
    if (payBeanCommission) {
      this.setState({
        configUserLevelInfo: {
          payBeanCommission,
        },
      });
    } else {
      fetchUserShareCommission({}, (res) => {
        const { configUserLevelInfo = {} } = res;
        this.setState({
          configUserLevelInfo,
        });
      });
    }
  }
  onReachBottom() {
    const { selectHttp } = this.state;
    this.setState(
      {
        selectHttp: {
          ...selectHttp,
          page: selectHttp.page + 1,
        },
      },
      (res) => {
        this.fetchCommerceList();
      }
    );
  } //上拉加载

  render() {
    const { commerList, configUserLevelInfo, selectHttp, identification } =
      this.state;
    const { payBeanCommission } = configUserLevelInfo;
    const templatePrice = (item) => {
      const { paymentModeObject = {}, realPrice, oriPrice } = item;
      const { type } = paymentModeObject;
      if (type === "defaultMode") {
        return (
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
        );
      } else {
        return (
          <View className="preSelfour_card_price">
            <Text className="font24 color2">原价:</Text>
            <Text className="font26 color2 price_margin4 bold text_through">
              ¥{oriPrice}
            </Text>
          </View>
        );
      }
    };
    const templatBtnStyle = (item) => {
      const { paymentModeObject = {}, realPrice, oriPrice } = item;
      const { type, cash = "", bean } = paymentModeObject;
      if (type === "defaultMode") {
        return (
          <View className="preSelfour_new_bean">
            <View className="bean_getBigInfo preSelfour_new_img"></View>
            <View className="preSelfour_new_pay font_hide">
              ¥{computedPrice(realPrice, payBeanCommission)}
            </View>
          </View>
        );
      } else {
        return (
          <View className="preSelfour_card_tag">
            <View className="commer_index_tag"></View>
            <Text className="font28 color3 price_margin4 bold">
              ¥{cash}+{bean}卡豆
            </Text>
          </View>
        );
      }
    };
    const template = (item) => {
      const {
        goodsImg,
        goodsName,
        commission,
        ownerIdString,
        specialActivityIdString,
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
                identification,
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
            {templatePrice(item)}
            {templatBtnStyle(item)}
            <View className="preSelfour_btn public_center">立即抢购</View>
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
            show={commerList.length === 0}
            toast={"暂无电商商品"}
            type={"home"}
          ></Empty>
          {commerList.map((item) => {
            return template(item);
          })}
        </View>
      </View>
    );
  }
}
export default Index;
