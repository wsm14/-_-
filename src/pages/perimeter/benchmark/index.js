import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { ScrollView, View, Text, Button } from "@tarojs/components";
import SearchView from "@/components/public_ui/searchView";
import SelectView from "./components/select";
import {
  getLat,
  getLnt,
  GetDistance,
  backgroundObj,
  loginStatus,
  mapGo,
} from "@/utils/utils";
import { getSearchConditions } from "@/server/perimeter";
import { scanCode } from "@/common/authority";
import Empty from "@/components/Empty";
import "./index.scss";

class index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        page: 1,
        limit: 10,
        businessHubIds: "",
        keyword: "",
        consumptionScope: "",
        smartSiftType: "",
        ...getCurrentInstance().router.params,
      },
      countStatus: true,
      userMerchantList: [],
      //商家列表
      visible: false,
    };
  }

  componentDidMount() {
    const { name } = getCurrentInstance().router.params;
    Taro.setNavigationBarTitle({
      title: name,
    });
    this.getSearchConditionsList(true);
  }
  getSearchConditionsList(init) {
    getSearchConditions(this.state.httpData, (res) => {
      const { userMerchantList = [] } = res;
      if (!init) {
        if (userMerchantList.length === 0) {
          this.setState({
            countStatus: false,
          });
        } else {
          this.setState({
            userMerchantList: [
              ...this.state.userMerchantList,
              ...userMerchantList,
            ],
          });
        }
      } else {
        this.setState({
          userMerchantList,
        });
      }
    });
  }
  //获取风向标商家
  onSuccess(obj) {
    const { httpData } = this.state;
    this.setState(
      {
        httpData: { ...httpData, ...obj, page: 1 },
        visible: false,
      },
      (res) => {
        this.getSearchConditionsList(true);
      }
    );
  }
  onPage() {
    if (this.state.countStatus) {
      this.setState(
        {
          httpData: {
            ...this.state.httpData,
            page: this.state.httpData.page + 1,
          },
        },
        (res) => {
          this.getSearchConditionsList();
        }
      );
    }
  }

  onShareAppMessage(res) {
    const { userMerchantList } = this.state;
    let userInfo = loginStatus() || {};
    if (loginStatus()) {
      const { userIdString } = userInfo;
      if (res.from === "button") {
        const { index } = res.target.dataset;
        let data = userMerchantList[index];
        const { coverImg, userMerchantIdString, merchantName } = data;
        return {
          title: merchantName,
          imageUrl: coverImg,
          path: `/pages/perimeter/merchantDetails/index?merchantId=${userMerchantIdString}&shareUserType=user&shareUserId=${userIdString}`,
        };
      }
      return {
        title: merchantName,
        imageUrl: coverImg,
        path: `/pages/index/home/index?shareUserType=user&shareUserId=${userIdString}`,
      };
    }
  }

  render() {
    const { userMerchantList, visible, httpData } = this.state;
    const template = (item, index) => {
      const {
        perCapitaConsumption,
        categoryName,
        districtName,
        businessHub,
        markFlag,
        markBean,
        coverImg,
        logoImg,
        specialGoodsFlag,
        specialGoodsAmount,
        brandFlag,
        couponList = [],
        lat,
        lnt,
        merchantName,
        address,
        businessTime,
        userMerchantIdString,
      } = item;
      return (
        <View
          className="benchMark_template"
          onClick={() =>
            Router({
              routerName: "merchantDetails",
              args: {
                merchantId: userMerchantIdString,
              },
            })
          }
        >
          <View
            style={backgroundObj(coverImg)}
            className="template_filterImage dakale_nullImage"
          >
            <View
              style={backgroundObj(logoImg)}
              className="template_userprofile coupon_shop_icon"
            ></View>
            {brandFlag === "1" && <View className="template_pingpai"></View>}
          </View>
          <View className="template_content">
            <View className="template_title font_hide">{merchantName}</View>
            <View className="list_font_type  font_hide">
              {GetDistance(getLat(), getLnt(), lat, lnt)}｜{businessHub}｜
              {categoryName}｜人均￥{perCapitaConsumption}
            </View>
            {businessTime ? (
              <View className="template_time_box">
                <View className="template_time">
                  <Text style={{ display: "inline-block" }} className="bold">
                    营业时间
                  </Text>{" "}
                  <View className="liner"></View> {businessTime}
                </View>
              </View>
            ) : null}

            <View className="template_goods">
              {markFlag === "1" && (
                <View className="template_bean">打卡捡豆{markBean}</View>
              )}
              {specialGoodsFlag === "1" && specialGoodsAmount != 0 && (
                <View className="template_specal">
                  <View className="template_icon1 public_center">
                    <View className="template_hui"></View>
                  </View>
                  <View className="template_text1">
                    {specialGoodsAmount}款热卖中
                  </View>
                </View>
              )}
              {couponList.length > 0 && (
                <View className="template_coupon">
                  <View className="template_icon2 public_center">
                    <View className="template_cou"></View>
                  </View>
                  <View className="template_text2">
                    {couponList[0].buyPrice}代{couponList[0].couponPrice}元
                  </View>
                </View>
              )}
            </View>
          </View>
          <View
            className="template_share"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {loginStatus() ? (
              <Button
                style={{ width: "100%", height: "100%", background: "none" }}
                openType="share"
                data-index={index}
              >
                {" "}
              </Button>
            ) : (
              <View
                style={{ width: "100%", height: "100%", background: "none" }}
                onClick={(e) => {
                  Router({ routerName: "login" });
                }}
              >
                {" "}
              </View>
            )}
          </View>
          <View
            className="template_go"
            onClick={(e) => {
              e.stopPropagation();
              mapGo({
                lat: lat,
                lnt: lnt,
                address: address,
                merchantName: merchantName,
              });
            }}
          ></View>
          <View
            className="template_btn"
            onClick={(e) => {
              e.stopPropagation();
              scanCode();
            }}
          >
            {couponList.length > 0 ? "打卡领券" : "打卡"}
          </View>
        </View>
      );
    };
    return (
      <View className="benchMark_box">
        <SearchView
          fn={(val) => {
            if (val || val != httpData.keyword) {
              this.onSuccess({
                keyword: val,
              });
            }
          }}
          title={"搜索商家"}
        ></SearchView>
        {/* //顶部 搜索 组件 */}
        <SelectView
          onClose={() => this.setState({ visible: false })}
          onShow={() => this.setState({ visible: true })}
          onSuccess={this.onSuccess.bind(this)}
          httpData={httpData}
          visible={visible}
        ></SelectView>
        {/* //筛选组件 */}
        {userMerchantList.length > 0 ? (
          <ScrollView
            onScrollToLower={this.onPage.bind(this)}
            scrollY
            className="merchant_list"
          >
            {userMerchantList.map((item, index) => {
              return template(item, index);
            })}
          </ScrollView>
        ) : (
          <View className="merchant_list">
            <Empty
              show={userMerchantList.length === 0}
              type={"home"}
              toast={"暂无商家"}
            ></Empty>
          </View>
        )}
        {/* //筛选数据 */}
      </View>
    );
  }
}

export default index;
