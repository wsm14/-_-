import React, { Component, useState } from "react";
import { getCurrentInstance } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import Rule from "./../collageDetails/components/payToast";
import Router from "@/utils/router";
import { fetchListUserStart } from "@/server/user";
import { backgroundObj } from "@/utils/utils";
import Empty from "@/components/Empty";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        page: 1,
        limit: 10,
      },
      userStartGroupList: [],
      visible: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const { httpData } = this.state;
    fetchListUserStart(httpData).then((val) => {
      const { userStartGroupList } = val;
      this.setState({
        userStartGroupList: [
          ...this.state.userStartGroupList,
          ...userStartGroupList,
        ],
      });
    });
  }
  onReachBottom() {
    const { httpData } = this.state;
    this.setState(
      {
        httpData: {
          ...httpData,
          page: httpData.page + 1,
        },
      },
      (res) => {
        this.fetchData();
      }
    );
  } //上拉加载
  render() {
    const { visible, userStartGroupList } = this.state;
    const Template = ({ data }) => {
      const {
        groupId,
        joinUserNum,
        togetherGroupRuleObject = {},
        togetherEarnGoodsObject = {},
        togetherRebateParamObject = {},
      } = data;
      const { totalUserNum } = togetherGroupRuleObject;
      const { goodsImg, goodsName, togetherPrice } = togetherEarnGoodsObject;
      const { teamLeaderFee, notWinFee } = togetherRebateParamObject;
      return (
        <View
          onClick={() =>
            Router({
              routerName: "collageDetails",
              args: {
                groupId: groupId,
                type: 2,
              },
            })
          }
          className="collageList_shop_box"
        >
          <View
            className="collageList_shop_image merchant_dakale_logo"
            style={backgroundObj(goodsImg)}
          ></View>
          <View className="collageList_shop_content font_hide">
            <View className="collageList_shop_name font_hide">{goodsName}</View>
            <View className="collageList_shop_price font_hide">
              <View className="collageList_price_info font_hide">
                ¥{togetherPrice}
              </View>
              <View className="collageList_price_zq public_center">
                参与返{notWinFee}元
              </View>
            </View>
            <View className="collageList_shop_bottom public_auto">
              <View className="collageList_liner">
                <View
                  className="collageList_liner_color"
                  style={{ width: (joinUserNum / totalUserNum) * 100 + "%" }}
                ></View>
                <View className="collageList_liner_font public_center">
                  {joinUserNum}/{totalUserNum}
                </View>
              </View>
              <View className="collageList_shop_btn font_hide public_center">
                去拼团
              </View>
            </View>
          </View>
        </View>
      );
    };
    return (
      <View className="collageList_box">
        <View className="collageList_banner">
          <View
            className="collageList_rule public_center"
            onClick={() => {
              this.setState({
                visible: true,
              });
            }}
          >
            拼赚规则
          </View>
        </View>
        <Rule
          visible={visible}
          close={() => this.setState({ visible: false })}
          hasBtn={false}
          content={
            "1.邀请用户参与商品拼团，满足成团需求后即可开奖。\n2.拼到商品，平台将提供包邮发货，发货时间为1-3个工作日内。\n3.未拼到商品，支付金额将原路退回，同时获得拼团红包。\n4.拼团商品为限时底价产品，拼团商品经拼团成功后不支持退款，若有质量问题则可提供换货服务。"
          }
          style={{ textAlign: "left" }}
        ></Rule>
        <View className="collageList_content">
          <View style={{ margin: "0 auto" }}>
            <Empty
              pt
              pylb={"当前专区商品已拼完"}
              show={userStartGroupList.length === 0}
              type={"shop"}
              toast={"新品正在紧急上架中，敬请期待…"}
            ></Empty>
          </View>

          {userStartGroupList.map((item) => {
            return <Template data={item}></Template>;
          })}
        </View>
      </View>
    );
  }
}

export default Index;
