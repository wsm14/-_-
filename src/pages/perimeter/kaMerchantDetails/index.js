import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View } from "@tarojs/components";
import {
  getUserCoupon,
  listAllPut,
  fetchGroupDetail,
} from "@/server/perimeter";
import Top from "./components/top";
import Goods from "./components/goods";
import Coupons from "./components/coupon";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      specialGoodsList: [],
      merchantGroupInfo: {},
      userMerchantInfo: {},
      merchantGroupId: getCurrentInstance().router.params.merchantGroupId,
      couponList: [],
    };
  }
  componentWillMount() {}

  onReady() {
    // 生命周期函数--监听页面初次渲染完成
  }
  getSpecalList() {
    const { merchantGroupId } = this.state;
    listAllPut(
      {
        page: 1,
        limit: 6,
        merchantGroupId,
      },
      (res) => {
        const { specialGoodsList = [] } = res;
        this.setState({
          specialGoodsList,
        });
      }
    );
  }
  getUserCoupon() {
    const { merchantGroupId } = this.state;
    getUserCoupon(
      {
        page: 1,
        limit: 3,
        merchantGroupId,
      },
      (res) => {
        const { couponList = [] } = res;
        this.setState({
          couponList,
        });
      }
    );
  }
  fetchDetail() {
    const { merchantGroupId } = this.state;
    fetchGroupDetail(
      {
        merchantGroupId,
      },
      (res) => {
        const { merchantGroupInfo = {}, userMerchantInfo = {} } = res;
        const { brandName } = merchantGroupInfo;
        Taro.setNavigationBarTitle({
          title: brandName,
        });
        this.setState({
          merchantGroupInfo,
          userMerchantInfo,
        });
      }
    );
  }
  // 获取周边特价
  componentDidMount() {
    this.getSpecalList();
    this.getUserCoupon();
    this.fetchDetail();
  }
  render() {
    const {
      specialGoodsList,
      merchantGroupInfo,
      userMerchantInfo,
      merchantGroupId,
      couponList,
    } = this.state;
    return (
      <View className="kaMerchantDetails_box">
        <Top data={{ ...userMerchantInfo, ...merchantGroupInfo }}></Top>
        <View className="brand_details_liner"></View>
        <Goods
          list={specialGoodsList}
          merchantGroupId={merchantGroupId}
        ></Goods>
        <Coupons merchantGroupId={merchantGroupId} list={couponList}></Coupons>
        {[...specialGoodsList, ...couponList].length === 0 ? (
          <View>
            <View className="kaMerchantDetails_null"></View>
            <View className="kaMerchantDetails_null_toast">暂无商品</View>
          </View>
        ) : null}
      </View>
    );
  }
}

export default Index;
