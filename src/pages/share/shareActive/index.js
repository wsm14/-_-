import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { fetchFissionDetail } from "@/server/share";
import { getShareParamInfo } from "@/server/common";
import { fetchUserShareCommission } from "@/server/index";
import { backgroundObj, toast } from "@/common/utils";
import { goodsView } from "./components/shop";
import Router from "@/common/router";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        fissionId: getCurrentInstance().router.params.fissionId,
      },
      specialGoods: [],
      rightGoods: [],
      userFissionHelps: [],
      configFissionTemplate: {},
      configUserLevelInfo: {},
    };
  }
  componentDidMount() {
    this.fetchShareType();
  }
  fetchUserShareCommission() {
    fetchUserShareCommission({}, (res) => {
      const { configUserLevelInfo = {} } = res;
      this.setState({
        configUserLevelInfo: configUserLevelInfo,
      });
    });
  }
  routerLink(item) {
    const { ownerId, specialActivityIdString } = item;
    Router({
      routerName: "favourableDetails",
      args: {
        merchantId: ownerId,
        specialActivityId: specialActivityIdString,
      },
    });
  }
  fetchFissionDetail() {
    const { httpData } = this.state;
    fetchFissionDetail(httpData).then((val) => {
      const {
        specialGoods,
        rightGoods,
        userFissionHelps,
        configFissionTemplate,
      } = val;
      this.setState({
        specialGoods,
        rightGoods,
        userFissionHelps,
        configFissionTemplate,
      });
    });
  }
  fetchShareType() {
    const { scene } = getCurrentInstance().router.params;
    if (scene) {
      getShareParamInfo({ uniqueKey: scene }, (res) => {
        const {
          shareParamInfo: { param },
        } = res;
        if (param && JSON.parse(param)) {
          this.setState(
            {
              httpData: {
                ...JSON.parse(param),
              },
            },
            (res) => {
              this.fetchFissionDetail();
            }
          );
        } else {
          toast("参数缺失");
        }
      });
    } else {
      this.fetchFissionDetail();
    }
  }
  filterList(num, list) {
    let newList = [];
    for (let i = 0; i < num; i++) {
      if (list[i]) {
        newList.push(list[i]);
      } else {
        newList.push({});
      }
    }
    return newList;
  }
  render() {
    const {
      configFissionTemplate,
      userFissionHelps,
      configUserLevelInfo,
      specialGoods,
      rightGoods,
    } = this.state;
    const {
      backgroundColor,
      mainImg,
      prizeImg,
      inviteNum,
      name,
      introductionImg,
      specialGoodsTitleImg,
      rightGoodsTitleImg,
      activityBeginTime,
      activityEndTime,
    } = configFissionTemplate;
    const templateBtn = {
      0: <View className="shareActive_btnInfo public_center">立即邀请</View>,
    }[0];
    return (
      <View style={{ background: backgroundColor }} className="shareActive_box">
        <View className="shareActive_Main">
          <Image
            className="share_img"
            lazyLoad
            mode={"aspectFill"}
            src={mainImg}
          ></Image>
        </View>
        {/* //活动主图 */}
        <View className="shareActive_content">
          <View className="shareActive_body_box">
            <View className="shareActive_time">
              活动时间:{activityBeginTime}-{activityEndTime}
            </View>
            {/*活动时间*/}
            <View className="shareActive_shop_card">
              <Image
                className="share_img"
                lazyLoad
                mode={"aspectFill"}
                src={prizeImg}
              ></Image>
            </View>
            {/*奖品图片*/}
            <View className="shareActive_user font_hide">
              邀请新用户<Text className="font40 color3">{inviteNum}</Text>{" "}
              即可获得
              {name}
            </View>
            {/*拉新名额*/}
            <View className="shareActive_userProfile_box">
              {this.filterList(7, userFissionHelps).map((item) => {
                const { profile } = item;
                return (
                  <View
                    className={`shareActive_userProfile ${
                      profile
                        ? "shareActive_userProfile_liner"
                        : "shareActive_userProfile_default"
                    }`}
                    style={profile ? backgroundObj(profile) : {}}
                  ></View>
                );
              })}
            </View>
            {/*已拉的名额样式 */}
            {templateBtn}
            {/*按钮*/}
            <View className="shareActive_mobile">
              如有疑问，请联系客服：
              <Text className="shareActive_text">400-800-5881</Text>
            </View>
          </View>
          {/*活动内容*/}
        </View>
        <View className="shareActive_introduction">
          <Image
            className="share_img"
            lazyLoad
            mode={"aspectFill"}
            src={introductionImg}
          ></Image>
        </View>
        {/*活动规则*/}
        <View className="shareActive_shopTitle">
          <Image
            className="share_img"
            lazyLoad
            mode={"aspectFill"}
            src={rightGoodsTitleImg}
          ></Image>
        </View>
        <View className="shareActive_shop_lineBox">
          {rightGoods.map((item) => {
            return goodsView(item, configUserLevelInfo, (e) => {
              this.routerLink(e);
            });
          })}
        </View>
        <View className="shareActive_shopTitle">
          <Image
            className="share_img"
            lazyLoad
            mode={"aspectFill"}
            src={specialGoodsTitleImg}
          ></Image>
        </View>
        <View className="shareActive_shop_lineBox">
          {specialGoods.map((item) => {
            return goodsView(item, configUserLevelInfo, (e) => {
              this.routerLink(e);
            });
          })}
        </View>
        <View className="shareActive_logo_box">
          <View className="shareActive_logo"></View>
        </View>
      </View>
    );
  }
}
export default Index;
