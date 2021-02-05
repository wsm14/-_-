import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Image, ScrollView, Text, View } from "@tarojs/components";
import Banner from "@/components/banner";
import classNames from "classnames";
import {
  filterStrList,
  filterWeek,
  mapGo,
  onShareFriend,
  onTimeline,
} from "@/common/utils";
import { shopCard, shopGoodsDetails } from "@/components/publicShopStyle";
import MakePhone from "@/components/payTelephone";
import "./index.scss";
import { loginBtn } from "@/common/authority";
import { navigateTo } from "@/common/utils";
import { getListGoodsDetail } from "@/server/perimeter";
class MerchantDetails extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        goodsId: getCurrentInstance().router.params.goodsId || "",
        merchantId: getCurrentInstance().router.params.merchantId || "",
      },
      lnt: Taro.getStorageSync("lnt"),
      lat: Taro.getStorageSync("lat"),
      goods: {}, //商品详情
      visible: false,
    };
  }
  componentDidShow() {
    this.getDetailsById();
  }
  getDetailsById() {
    const { httpData } = this.state;
    getListGoodsDetail(httpData, (res) => {
      const { goods } = res;
      this.setState({
        goods,
      });
    });
  }

  onReady() {
    // 生命周期函数--监听页面初次渲染完成
  }
  render() {
    const {
      goods: {
        oriPrice,
        realPrice,
        activityEndTime,
        goodsName,
        allowExpireRefund,
        allowRefund,
        needOrder,
        goodsStock,
        useStartTime,
        useEndTime,
        useWeek,
        useTime,
        goodsDesc,
        telephone,
        packageGoods,
        specialActivityIdString,
        merchantIdString,
        allImgs,
        goodsDescImg,
        status,
        price,
        lat,
        lnt
      },
      goods,
      visible,
    } = this.state;
    if (Object.keys(goods).length > 0) {
      if (status !== "0") {
        return (
          <View className="favourable_Details">
            <View className="shopDetails_banner dakale_nullImage">
              <Banner
                autoplay={
                  filterStrList(allImgs || []).length > 1 ? true : false
                }
                imgStyle
                data={filterStrList(allImgs || [])}
                style={{ width: "100%", height: "100%" }}
                boxStyle={{ width: "100%", height: "100%" }}
              ></Banner>
            </View>
            <View className="shopdetails_price">
              <View className="shopdetails_priceBox">
                <View className="shopdetails_top public_auto">
                  <View className="shopdetails_setprice">
                    <Text className="shopdetails_bigFont">¥</Text>
                    {price || "--"}
                  </View>
                  <View className="shopdetails_priceIcon">门店抢购中</View>
                </View>
              </View>
            </View>
            {/*使用商家*/}
            <View className="shopdetails_getShop">
              <View className="shopdetails_title font_noHide">
                {goodsName || "--"}
              </View>
              <View className="shopDetails_tab">
                <>
                  <View className="shopDetails_tab_icon"></View>
                  <View className="shopDetails_tab_font">哒卡乐专享推荐</View>
                </>
                <>
                  <View className="shopDetails_tab_icon"></View>
                  <View className="shopDetails_tab_font">权益保障</View>
                </>
                <>
                  <View className="shopDetails_tab_icon"></View>
                  <View className="shopDetails_tab_font">精选好物</View>
                </>
              </View>
            </View>
            {/*达人推荐*/}
            <View className="shopdetails_shop_details">
              {packageGoods && shopGoodsDetails(this, packageGoods)}
              {goodsDesc && (
                <>
                  <View className="shopdetails_shop_merchantDetails">
                    商品描述
                  </View>
                  <View className="shopdetails_dec">{goodsDesc}</View>
                </>
              )}
              <View className="shopdetails_Image">
                {goodsDescImg &&
                  filterStrList(goodsDescImg).map((item) => {
                    return (
                      <Image
                        mode="widthFix"
                        src={item}
                        style={{ width: "100%" }}
                      ></Image>
                    );
                  })}
              </View>
            </View>
            <View className="shopdetails_shop_btn">
              <View onClick={() => this.setState({ visible: true })}>
                <View className="shopdetails_telephone"></View>
                <View className="shopdetails_telephone_text">客服</View>
              </View>
              <View
                className="shopdetails_shop_goshop"
                onClick={() =>
                  loginBtn(() =>
                   mapGo({
                    lat,
                    lnt,
                   })
                  )
                }
              >
               到店购买
              </View>
            </View>
            {visible && (
              <MakePhone
                onClose={() => this.setState({ visible: false })}
                onCancel={() => this.setState({ visible: false })}
                data={filterStrList(telephone)}
              ></MakePhone>
            )}
          </View>
        );
      } else {
        return <ActivityStatus></ActivityStatus>;
      }
    } else return null;
  }
}
export default MerchantDetails;
