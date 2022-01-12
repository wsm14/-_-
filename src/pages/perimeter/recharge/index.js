import React, { useEffect, useState } from "react";
import { useDidShow, useShareAppMessage } from "@tarojs/taro";
import { View, Input, Button } from "@tarojs/components";
// import Barrage from "@/components/componentView/active/barrage";
import FooterFixed from "@/components/FooterFixed";
import Router from "@/utils/router";
import TaroShareDrawer from "./components/TaroShareDrawer";
import { fetchPhoneBill, fetchShareInfo } from "@/server/common";
import { rssConfigData } from "./components/data";
import "./index.scss";

const mobileNumber = "^[1][3-8][0-9]{9}$"; // 手机号
const yd =
  "^1(3[4-9]|47|5[0-27-9]|65|78|8[2-478]|98)\\d{8}$|(^170[356]\\d{7}$)"; // 中国移动
const dx = "^1(33|49|53|62|7[37]|8[019]|9[19])\\d{8}$|(^170[012]\\d{7})$"; // 中国电信
const lt =
  "^1(3[0-2]|4[05]|5[56]|6[67]|7[156]|8[56])\\d{8}$|(^170[7-9]\\d{7}$)"; // 中国联通

const rechargePage = () => {
  const [checkMobile, setCheckMobile] = useState({
    teleForm: "",
    teleMsg: false,
  }); // 话费校验
  const [shareDeatils, setShareDeatils] = useState({
    cavansObj: {},
    shareData: {},
  }); // 分享数据
  const [selectList, setSelectList] = useState([]); // 选择的话费列表
  const [phoneMoney, setPhoneMoney] = useState(""); // 选择的充值项目
  const [cavansShow, setCavansShow] = useState(false); // 分享绘图显示

  const { teleForm, teleMsg } = checkMobile;
  const { cavansObj = {}, shareData = {} } = shareDeatils;

  useEffect(() => {
    fetchGetShareData(); // 获取分享图数据
  }, []);

  useDidShow(() => {
    fetchPhoneBill().then((val) => {
      const { phoneBillItemList = [] } = val;
      setSelectList(phoneBillItemList);
    });
  });

  useShareAppMessage((res) => {
    const { miniProgramUrl, backgroundImages, title } = shareData;
    const data = {
      title: title,
      imageUrl: backgroundImages,
      path: `/${miniProgramUrl}`,
    };
    if (res.from === "button") {
      return data;
    } else {
      return data;
    }
  });

  // 校验手机号
  const regExpMobile = (val) => {
    // 手机号校验不通过
    if (!new RegExp(mobileNumber).test(val)) {
      setCheckMobile({
        teleForm: "",
        teleMsg: "充值号码有误",
      });
      return;
    } else {
      let teleForm = "";
      // 手机号校验通过 校验运营商
      if (new RegExp(yd).test(val)) {
        teleForm = "(中国移动)";
      } else if (new RegExp(lt).test(val)) {
        teleForm = "(中国联通)";
      } else if (new RegExp(dx).test(val)) {
        teleForm = "(中国电信)";
      } else {
        teleForm = "";
      }
      setCheckMobile({
        teleForm,
        teleMsg: "",
      });
    }
  };

  // 充值项目点击
  const handlePhoneMoney = (val) => {
    setPhoneMoney((old) => (old === val ? "" : val));
  };

  // 立即充值
  const handleGoRecharge = () => {
    if (teleForm && phoneMoney && !teleMsg) {
      Router({
        routerName: "rechargeOrder",
        args: {
          telephone,
          phoneMoney,
        },
      });
    }
  };

  // 获取分享参数
  const fetchGetShareData = () => {
    fetchShareInfo(
      {
        shareType: "virtualProduct",
        subType: "telephone",
      },
      (res) => {
        setShareDeatils({
          cavansObj: {
            data: rssConfigData({
              wxCode: res.qcodeUrl,
              frontImage: res.backgroundImages,
            }),
          },
          shareData: res,
        });
      }
    );
  };

  const shareImageInfo = () => {
    const { backgroundImages, miniProgramUrl, qcodeUrl } = shareData;
    if (backgroundImages && miniProgramUrl && qcodeUrl) {
      setCavansShow(true);
    }
  };

  return (
    <View className="recharge_box">
      <View className="recharge_content_box">
        <View className="recharge_content_label">默认号码{teleForm}</View>
        <Input
          type={"number"}
          maxlength={11}
          placeholder={"请输入手机号码"}
          className="recharge_content_input"
          onConfirm={(e) => regExpMobile(parseInt(e.detail.value))}
          onBlur={(e) => regExpMobile(parseInt(e.detail.value))}
        />
        <View className="recharge_content_liner"></View>
        {teleMsg && <View className="recharge_wrong">{teleMsg}</View>}
        <View className="recharge_title">充值金额</View>
        {/* <Barrage></Barrage> */}
        <View className="recharge_select_info">
          {selectList.map((item) => {
            return (
              <View
                onClick={() => handlePhoneMoney(item.totalFee)}
                className={`recharge_select_cell ${
                  phoneMoney === item.totalFee && "select"
                } app`}
              >
                <View className="recharge_select_price">{item.totalFee}元</View>
                <View className="recharge_select_title">
                  {`卡豆抵扣\n最高可享受88折`}
                </View>
              </View>
            );
          })}
        </View>
        <View className="recharge_select_toast">
          打开「哒卡乐」APP，享受更多充值福利
        </View>
        <View className="recharge_select_toast1">
          充值问题联系客服 400-800-5881
        </View>
      </View>
      <FooterFixed>
        <View className="recharge_footer">
          <View className="recharge_bottom_share" onClick={shareImageInfo}>
            分享
          </View>
          <Button
            onClick={handleGoRecharge}
            className={`recharge_select_btn ${
              phoneMoney && teleMsg && telephone ? "" : "disabled"
            }`}
          >
            立即充值
          </Button>
        </View>
      </FooterFixed>
      <TaroShareDrawer
        {...cavansObj}
        start={cavansShow}
        onSave={() => console.log("点击保存")}
        onClose={() => setCavansShow(false)}
      ></TaroShareDrawer>
    </View>
  );
};

export default rechargePage;
