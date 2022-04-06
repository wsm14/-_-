import React, { useEffect, useState } from "react";
import { View, Text, Button } from "@tarojs/components";
import {
  backgroundObj,
  GetDistance,
  getLat,
  getLnt,
  computedBeanPrice,
} from "@/utils/utils";
import Taro from "@tarojs/taro";
import DrawerList from "./../buyDrawer";
import PayToast from "./../payToast";
import Router from "@/utils/router";
import "./index.scss";
export default ({
  data,
  list,
  startGroupUser,
  type,
  userJoinStatus,
  joinGroupUserDetail = {},
  onChange,
}) => {
  const {
    status,
    togetherEarnGoodsObject = {},
    joinUserNum,
    togetherGroupConfigId,
    groupId,
  } = data;
  const { rewardType } = joinGroupUserDetail;
  const [templateList, setlist] = useState([]);
  const [visiblePay, setVisiblePay] = useState(false);
  const [visible, setVisible] = useState(false);
  const {
    costPrice,
    goodsDesc,
    goodsDescImg,
    goodsIdString,
    goodsImg,
    goodsName,
    goodsType,
    oriPrice,
    ownerIdString,
    togetherPrice,
  } = togetherEarnGoodsObject;
  const { profile } = startGroupUser;
  useEffect(() => {
    setlist([...list].concat(new Array(10 - list.length).fill(null)));
  }, [list]);
  const template = () => {
    return (
      <View className="clooageTime_template_box">
        <View
          style={backgroundObj(goodsImg)}
          className="clooageTime_shop_profile"
        ></View>
        <View className="clooageTime_shop_content font_hide">
          <View className="clooageTime_shop_username font_noHide">
            {goodsName}
          </View>
          <View className="clooageTime_shop_count public_auto">
            <View className="clooageTime_shop_liner">
              <View
                style={{ width: `${joinUserNum * 10}%` }}
                className="clooageTime_shop_linerColor"
              ></View>
            </View>
            <View className="clooageTime_shop_inCount">
              {joinUserNum}
              <Text className="color2">/10</Text>
            </View>
          </View>
          <View className="clooageTime_shop_price">
            <View className="font20 color1">拼团价:</View>
            <View className="price_margin4 font40 color3 bold">
              ¥{togetherPrice}
            </View>
            <View className="clooageTime_shop_throuer">原价:</View>
            <View className="font20 text_through clooageTime_margin color2">
              {oriPrice}
            </View>
          </View>
        </View>
      </View>
    );
  };
  const templateContent = {
    0: (
      <View className="collageDetail_templateContent_box">
        <View className="collageDetail_templateContent_liner"></View>
        <View className="collageDetail_templateContent_people">
          - 还差
          <Text className="collageDetail_templateContent_peopleCount">
            {10 - joinUserNum}位
          </Text>
          即可成团 -
        </View>
      </View>
    ),
    1: (
      <View className="collageDetail_templateContent_box">
        <View className="collageDetail_templateContent_liner"></View>
        <View className="collageDetail_templateContent_people">-开团成功-</View>
      </View>
    ),
    2: (
      <View className="collageDetail_templateContent_box">
        <View className="collageDetail_templateContent_liner"></View>
        <View className="collageDetail_templateContent_people">-开团失败-</View>
      </View>
    ),
  }[status];
  const templateProfile = (item, index) => {
    if (item) {
      const { profile } = item;
      return (
        <View
          style={backgroundObj(profile)}
          className="collageTime_userProfile_box"
        ></View>
      );
    } else {
      if (status === "0") {
        return (
          <View className="collageTime_userProfile_box collageTime_userProfile_icon2">
            <Button
              style={{
                width: "100%",
                height: "100%",
                background: "none",
                position: "absolute",
              }}
              openType={"share"}
            ></Button>
          </View>
        );
      } else {
        return (
          <View className="collageTime_userProfile_box collageTime_userProfile_icon3"></View>
        );
      }
    }
  };
  const renderBtn = () => {
    if (type === "1") {
      return {
        0: (
          <View className="collageTime_btn public_center">
            <Button
              style={{
                width: "100%",
                height: "100%",
                background: "none",
                position: "absolute",
              }}
              openType={"share"}
            ></Button>
            邀请亲友参与拼团
          </View>
        ),
        1: <View className="collageTime_btn public_center">开团成功</View>,
        2: <View className="collageTime_btn public_center">开团失败</View>,
      }[status];
    } else {
      if (status == 0 && userJoinStatus === "0") {
        return (
          <View
            onClick={() => {
              setVisiblePay(true);
            }}
            className="collageTime_btn public_center"
          >
            参与拼团并预支付
          </View>
        );
      } else if (status == 0 && userJoinStatus === "1") {
        return (
          <View className="collageTime_btn public_center">
            支付成功，等待成团
          </View>
        );
      } else if (status == 1 && userJoinStatus === "1") {
        return (
          <View className="collageTime_btn public_center" onClick={onChange}>
            拼团成功，恭喜您拼中
            {rewardType === "winGoods" ? "拼中商品" : "拼中红包"}
          </View>
        );
      } else {
        return (
          <View className="collageTime_btn public_center">
            活动结束，拼团失败
          </View>
        );
      }
    }
  };

  return (
    <>
      <View className="collageTime_shopCard_box">
        {template()}
        {templateContent}
        <View className="collageTime_userProfile_content">
          <View className="collageTime_userProfile_box">
            <View className="collageTime_userProfile_icon1"></View>
            <View
              style={backgroundObj(profile)}
              className="collageTime_userProfile_img"
            ></View>
          </View>
          {templateList.map((item) => {
            return templateProfile(item);
          })}
          <View
            className="collageTime_userProfile_box collageTime_userProfile_icon4"
            onClick={() => setVisible(true)}
          ></View>
        </View>
        {renderBtn()}
      </View>
      <DrawerList
        list={list}
        visible={visible}
        close={() => {
          setVisible(false);
        }}
      ></DrawerList>
      <PayToast
        visible={visiblePay}
        close={() => this.setState({ visible: false })}
        cancel={() => setVisiblePay(false)}
        canfirm={() => {
          setVisiblePay(false);
          Router({
            routerName: "favourableOrder",
            args: {
              specialActivityId: goodsIdString,
              merchantId: ownerIdString,
              togetherGroupConfigId: groupId,
            },
          });
        }}
        cancelText={"再想想"}
        canfirmText={"确认支付"}
        content={
          "拼团商品为限时底价产品，拼团商品经拼团成功后不支持退款，若有质量问题则可提供换货服务"
        }
      ></PayToast>
    </>
  );
};
