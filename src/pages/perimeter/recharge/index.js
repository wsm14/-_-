import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image, Input } from "@tarojs/components";
import "./index.scss";
import { toast, computedBeanPrice } from "@/common/utils";
import { fetchUserShareCommission } from "@/server/index";
import { fetchPhoneBill } from "@/server/common";
import classNames from "classnames";
import Barrage from "@/components/componentView/active/barrage";
import Router from "@/common/router";
import TaroShareDrawer from "./components/TaroShareDrawer";
import { getShareInfo } from "@/server/common";
import { rssConfigData } from "./components/data";
const mobileNumber = "^[1][3-8][0-9]{9}$";
const yd =
  "^1(3[4-9]|47|5[0-27-9]|65|78|8[2-478]|98)\\d{8}$|(^170[356]\\d{7}$)";
const dx = "^1(33|49|53|62|7[37]|8[019]|9[19])\\d{8}$|(^170[012]\\d{7})$";
const lt =
  "^1(3[0-2]|4[05]|5[56]|6[67]|7[156]|8[56])\\d{8}$|(^170[7-9]\\d{7}$)";
class Index extends Component {
  defaultProps = {};
  constructor() {
    super(...arguments);
    this.state = {
      phoneBillItemList: [],
      configUserLevelInfo: {},
      teleForm: "",
      teleType: true,
      selectIndex: -1,
      telephone: null,
      cavansObj: {
        data: null,
        start: false,
      },
      shareDeatils: {},
    };
  }
  componentDidShow() {
    this.fetchUserShareCommission();
    fetchPhoneBill().then((val) => {
      const { phoneBillItemList } = val;
      this.setState({ phoneBillItemList });
    });
  }
  regExpMobile(val) {
    console.log(new RegExp(mobileNumber).test(val), val, mobileNumber);
    if (!new RegExp(mobileNumber).test(val)) {
      this.setState({
        teleForm: "",
        teleType: false,
        telephone: null,
      });
      return;
    } else {
      if (new RegExp(yd).test(val)) {
        this.setState({
          teleForm: "(中国移动)",
          teleType: true,
          telephone: val,
        });
      } else if (new RegExp(lt).test(val)) {
        this.setState({
          teleForm: "(中国联通)",
          teleType: true,
          telephone: val,
        });
      } else if (new RegExp(dx).test(val)) {
        this.setState({
          teleForm: "(中国电信)",
          teleType: true,
          telephone: val,
        });
      } else {
        this.setState({
          teleForm: "",
          teleType: true,
          telephone: val,
        });
      }
    }
  }

  //号码校验
  changeIndex(index) {
    const { selectIndex } = this.state;
    console.log(index);
    if (selectIndex === index) {
      this.setState({
        selectIndex: -1,
      });
    } else {
      this.setState({
        selectIndex: index,
      });
    }
  }
  fakeOrder() {
    const { telephone, selectIndex, teleType, phoneBillItemList } = this.state;
    if (telephone && selectIndex !== -1 && teleType) {
      Router({
        routerName: "rechargeOrder",
        args: {
          telephone,
          phoneMoney: phoneBillItemList[selectIndex].discountFee,
        },
      });
    } else {
      return;
    }
  }
  //选择话费金额
  fetchUserShareCommission() {
    fetchUserShareCommission({}, (res) => {
      const { configUserLevelInfo = {} } = res;
      this.setState({
        configUserLevelInfo,
      });
    });
  }
  shareImageInfo() {
    const { shareDeatils } = this.state;
    const { backgroundImages, miniProgramUrl, qcodeUrl } = shareDeatils;
    if (backgroundImages && miniProgramUrl && qcodeUrl) {
      this.setState({
        cavansObj: {
          start: true,
          data: rssConfigData({
            wxCode: qcodeUrl,
            frontImage: backgroundImages,
          }),
        },
      });
    } else {
      getShareInfo(
        {
          shareType: "virtualProduct",
          subType: "telephone",
        },
        (res) => {
          this.setState({
            cavansObj: {
              start: true,
              data: rssConfigData({
                wxCode: res.qcodeUrl,
                frontImage: res.backgroundImages,
              }),
            },
            shareDeatils: res,
          });
        }
      );
    }
  }
  onShareAppMessage(res) {
    const { shareDeatils } = this.state;
    const { miniProgramUrl, backgroundImages, title } = shareDeatils;
    if (res.from === "button") {
      return {
        title: title,
        imageUrl: backgroundImages,
        path: `/${miniProgramUrl}`,
        complete: function () {
          // 转发结束之后的回调（转发成不成功都会执行）
          console.log("---转发完成---");
        },
      };
    }
    return {};
  }
  render() {
    const {
      phoneBillItemList,
      selectIndex,
      configUserLevelInfo,
      teleForm,
      teleType,
      telephone,
      cavansObj,
    } = this.state;
    const { payBeanCommission = 50 } = configUserLevelInfo;
    return (
      <View className="recharge_box">
        <View className="recharge_content_box">
          <View className="recharge_content_label">默认号码{teleForm}</View>
          <Input
            className="recharge_content_input"
            maxlength={11}
            placeholder={"请输入手机号码"}
            onConfirm={(e) => this.regExpMobile(parseInt(e.detail.value))}
            onBlur={(e) => this.regExpMobile(parseInt(e.detail.value))}
            type={"number"}
          />
          <View className="recharge_content_liner"></View>
          {!teleType && <View className="recharge_wrong">充值号码有误</View>}
          <View className="recharge_title">充值金额</View>
          <Barrage></Barrage>
          <View className="recharge_select_info">
            {phoneBillItemList.map((item, index) => {
              return (
                <View
                  onClick={() => this.changeIndex(index)}
                  className={classNames(
                    "recharge_select_box",
                    selectIndex === index
                      ? "recharge_select_boxStyle1"
                      : "recharge_select_boxStyle2",
                    (index + 1) % 3 !== 0 ? "recharge_select_right" : ""
                  )}
                >
                  <View className="recharge_select_price">
                    {item.totalFee}元
                  </View>
                  <View className="recharge_select_pay">
                    售价:{item.discountFee}元
                  </View>
                  <View className="recharge_select_title">卡豆最高可减</View>
                  <View className="recharge_select_font">
                    {computedBeanPrice(item.totalFee, 100 - payBeanCommission)}
                    元
                  </View>
                </View>
              );
            })}
          </View>
          <View className="recharge_select_toast">每人每月仅支持充值一次</View>
          <View className="recharge_select_toast1">咨询客服 400-800-5881</View>
          <View
            className="recharge_video_box"
            onClick={() =>
              Router({
                routerName: "nearVideo",
                args: {
                  type: "goods",
                },
              })
            }
          >
            <View className="recharge_icon"></View>
            <View className="videoBean_desc">使用卡豆抵扣更多</View>
            <View className="bold recharge_left">立即看视频捡豆{" >"}</View>
          </View>
        </View>
        <View className="recharge_bottom_layer public_auto">
          <View
            className="recharge_bottom_share"
            onClick={() => this.shareImageInfo()}
          >
            分享
          </View>
          <View
            onClick={() => this.fakeOrder()}
            className={classNames(
              "recharge_select_btn public_center",
              selectIndex !== -1 && teleType && telephone
                ? "recharge_select_color1"
                : "recharge_select_color2"
            )}
          >
            立即充值
          </View>
        </View>
        <TaroShareDrawer
          {...cavansObj}
          onSave={() => console.log("点击保存")}
          onClose={() =>
            this.setState({ cavansObj: { start: false, data: null } })
          }
        ></TaroShareDrawer>
      </View>
    );
  }
}
export default Index;
