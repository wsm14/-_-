import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import {
  fetchFissionDetail,
  fakeReceiveReward,
  fetchFissionReward,
} from "@/server/share";
import { getShareParamInfo } from "@/server/common";
import { fetchUserShareCommission } from "@/server/index";
import { backgroundObj, loginStatus, toast } from "@/common/utils";
import { getShareInfo } from "@/server/common";
import { goodsView } from "./components/shop";
import { rssConfigData } from "./components/shareView/components/data";
import ShareActive from "./components/shareView";
import Drawer from "@/components/Drawer";
import Router from "@/common/router";
import BestView from "./components/sucessToast";
import ErrorView from "./components/errorToast";
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
      cavansObj: { data: null, start: false },
      fissionRewardInfo: {},
      shareData: null,
      visible: false,
      bestVisible: false,
      errorVisible: false,
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
    const { ownerId, activityGoodsId } = item;
    Router({
      routerName: "favourableDetails",
      args: {
        merchantId: ownerId,
        specialActivityId: activityGoodsId,
      },
    });
  }
  fetchFissionDetail() {
    const { httpData } = this.state;
    fetchFissionDetail(httpData).then((val) => {
      const {
        specialGoods,
        rightGoods,
        userFissionHelps = [],
        configFissionTemplate,
      } = val;
      const { inviteNum, hasReceived } = configFissionTemplate;
      this.setState({
        specialGoods,
        rightGoods,
        userFissionHelps,
        configFissionTemplate: {
          ...configFissionTemplate,
          btnStatus:
            hasReceived === "1"
              ? "2"
              : userFissionHelps.length >= inviteNum
              ? "1"
              : "0",
        },
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
  fetchShareInfo() {
    const { shareData } = this.state;
    if (shareData) {
      const { backgroundImages, qcodeUrl } = shareData;
      const { profile, username } = loginStatus() || {};
      this.setState({
        cavansObj: {
          start: true,
          data: rssConfigData({
            background: backgroundImages,
            qcodeUrl,
            username,
          }),
        },
      });
    } else {
      if (!loginStatus()) {
        Router({
          routerName: "login",
        });
      } else {
        const { profile, username } = loginStatus() || {};
        const { httpData } = this.state;
        const { fissionId } = httpData;
        getShareInfo(
          {
            shareType: "helpFission",
            shareId: fissionId,
          },
          (res) => {
            const { backgroundImages, qcodeUrl } = res;
            this.setState({
              shareData: { ...res },
              cavansObj: {
                start: true,
                data: rssConfigData({
                  background: backgroundImages,
                  qcodeUrl,
                  username,
                }),
              },
            });
          }
        );
      }
    }
  }
  fakeGoods() {
    const { httpData } = this.state;
    const { fissionId } = httpData;
    fakeReceiveReward({ fissionId })
      .then((val) => {
        this.setState({
          bestVisible: true,
        });
        this.fetchFissionDetail();
      })
      .catch((e) => {
        const { resultCode } = e;
        if (resultCode === "5241") {
          this.setState({
            errorVisible: true,
          });
        }
      });
  }
  fetchbest() {
    const { httpData } = this.state;
    const { fissionId } = httpData;
    fetchFissionReward({ fissionId }).then((val) => {
      const { fissionRewardInfo } = val;
      this.setState(
        {
          fissionRewardInfo,
        },
        (res) => {
          this.setState({
            visible: true,
          });
        }
      );
    });
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
  onShareAppMessage(res) {
    const { shareData } = this.state;
    if (res.from === "button") {
      if (shareData) {
        const { miniProgramUrl, title, frontImage } = shareData;
        return {
          title: title,
          imageUrl: frontImage,
          path: miniProgramUrl,
        };
      }
    }
  }
  render() {
    const {
      configFissionTemplate,
      userFissionHelps,
      configUserLevelInfo,
      specialGoods,
      rightGoods,
      cavansObj,
      visible,
      fissionRewardInfo,
      bestVisible,
      errorVisible,
    } = this.state;
    const {
      backgroundColor,
      mainImg,
      prizeImg,
      inviteNum,
      introductionImg,
      specialGoodsTitleImg,
      rightGoodsTitleImg,
      activityBeginTime = "",
      activityEndTime = "",
      btnStatus,
      activityRuleUrl,
    } = configFissionTemplate;
    const { prizeType, prizeReward, createTime } = fissionRewardInfo;
    const templateBtn = {
      0: (
        <View
          className="shareActive_btnInfo public_center"
          onClick={() => this.fetchShareInfo()}
        >
          立即邀请
        </View>
      ),
      1: (
        <View
          className="shareActive_btnInfo public_center"
          onClick={() => this.fakeGoods()}
        >
          立即领取
        </View>
      ),
      2: (
        <View
          className="shareActive_btnInfo public_center"
          onClick={() => this.fetchbest()}
        >
          查看我的奖品
        </View>
      ),
    }[btnStatus];
    return (
      <View style={{ background: backgroundColor }} className="shareActive_box">
        <View className="shareActive_fixed">
          <View
            className="shareActive_fixed_rule"
            onClick={() => {
              Router({
                routerName: "webView",
                args: { link: activityRuleUrl },
              });
            }}
          ></View>
          <View
            className="shareActive_fixed_share"
            onClick={() => this.fetchShareInfo()}
          ></View>
        </View>
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
              活动时间:{activityBeginTime.split(" ")[0]}至
              {activityEndTime.split(" ")[0]}
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
              即可获得奖励
            </View>
            {/*拉新名额*/}
            <View className="shareActive_userProfile_box">
              {this.filterList(inviteNum, userFissionHelps).map((item) => {
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
        {/*权益商品标题*/}
        <View className="shareActive_shop_lineBox">
          {rightGoods.map((item) => {
            return goodsView(item, configUserLevelInfo, (e) => {
              this.routerLink(e);
            });
          })}
        </View>
        {/*权益商品列表*/}
        <View className="shareActive_shopTitle">
          <Image
            className="share_img"
            lazyLoad
            mode={"aspectFill"}
            src={specialGoodsTitleImg}
          ></Image>
        </View>
        {/*特惠商品标题*/}
        <View className="shareActive_shop_lineBox">
          {specialGoods.map((item) => {
            return goodsView(item, configUserLevelInfo, (e) => {
              this.routerLink(e);
            });
          })}
        </View>
        {/*特惠商品列表*/}
        <View className="shareActive_logo_box">
          <View className="shareActive_logo"></View>
        </View>
        {visible && (
          <Drawer
            show={visible}
            close={() => {
              this.setState({
                visible: false,
              });
            }}
          >
            <View className="shareActive_layer_info">
              <View className="shareActive_layer_content">
                <View className="shareActive_layer_title">我的奖品</View>
                <View className="shareActive_layer_body">
                  <View className="shareActive_body_name font_noHide">
                    {prizeReward}
                  </View>
                  <View className="shareActive_body_status public_auto">
                    <View>已发放</View>
                    <View>{createTime}</View>
                  </View>
                </View>
              </View>
            </View>
          </Drawer>
        )}
        {/*奖品浮层*/}
        {bestVisible && (
          <Drawer
            show={bestVisible}
            close={() => {
              this.setState({
                bestVisible: false,
              });
            }}
          >
            <BestView
              data={configFissionTemplate}
              close={(e) => {
                this.setState(
                  {
                    bestVisible: false,
                  },
                  (res) => {
                    e && e();
                  }
                );
              }}
            ></BestView>
          </Drawer>
        )}
        {/*获奖浮层*/}
        {errorVisible && (
          <Drawer
            show={errorVisible}
            close={() => {
              this.setState({
                errorVisible: false,
              });
            }}
          >
            <ErrorView
              data={configFissionTemplate}
              close={(e) => {
                this.setState(
                  {
                    errorVisible: false,
                  },
                  (res) => {
                    e && e();
                  }
                );
              }}
            ></ErrorView>
          </Drawer>
        )}
        {/*失败浮层*/}
        <ShareActive
          cavansObj={cavansObj}
          close={() =>
            this.setState({
              cavansObj: { data: null, start: false },
            })
          }
        ></ShareActive>
      </View>
    );
  }
}
export default Index;
