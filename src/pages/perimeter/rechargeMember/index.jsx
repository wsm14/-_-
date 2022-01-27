import React, { useEffect, useState } from "react";
import router from "@/utils/router";
import Taro, { useRouter } from "@tarojs/taro";
import { View, Form, Input, Text, Image, Button } from "@tarojs/components";
import { usePostBackData } from "@/utils/utils";
import {
  fetchRechargeMemberLsxdList,
  fetchVirtualProductCheckBuyLimit,
} from "@/server/common";
import "./index.scss";

/**
 * type
 * identification - 风向标配置标识
 */
const rechargeMember = () => {
  const routeParams = useRouter().params;
  const { type: virtualProductSubType = "", identification } = routeParams;

  const [list, setList] = useState([]); // 数据
  const [selectItem, setSelectItem] = useState({}); // 选择的充值项目
  const [videoEnd, setVideoEnd] = useState(false); // 视频是否看完
  const [account, setAccount] = useState(""); // 帐号
  const [limit, setLimit] = useState(""); // 充值限制提示

  useEffect(() => {
    fetchCheckLimit(); // 充值限制查询
    if (virtualProductSubType) fetchGetList();
  }, []);

  usePostBackData((data) => {
    const { type } = data;
    if (type === "videoEnd") {
      setVideoEnd(true);
      // 直接前往充值
      handleUpRecharge(true);
    }
  });

  const fetchGetList = () => {
    fetchRechargeMemberLsxdList({ type: virtualProductSubType }).then((res) => {
      setList(res.productList);
      setSelectItem(res.productList[0] || {});
    });
  };

  // 检查充值限制
  const fetchCheckLimit = () => {
    fetchVirtualProductCheckBuyLimit({
      productType: "member",
      identification,
    }).then((res) => {
      if (res.limitFlag === "1") {
        const msg = res.msg ? res.msg : "您充值已达上限";
        Taro.showToast({ title: msg, icon: "none" });
        setLimit(msg);
      }
    });
  };

  // 提交充值
  const handleUpRecharge = (status = false) => {
    // 还没有看视频 前往看广告
    if (!videoEnd && !status) {
      router({
        routerName: "advertisingVideo",
      });
      return;
    }
    // 跳转下单页面
    router({
      routerName: "favourableOrder",
      args: {
        mode: "member",
        virtualProductAccount: account,
        identification,
        virtualProductSubType,
        productNo: selectItem.productNo,
      },
    });
  };

  // 充值项目点击
  const handleSelectItem = (val) => {
    setSelectItem(val);
  };

  return (
    <Form onSubmit={() => handleUpRecharge()}>
      <View className="rechargeMember_box">
        <View className="rechargeMember_head">
          <Image src={selectItem.image} className="rechargeMember_logo"></Image>
          <View className="rechargeMember_info">
            <View className="rechargeMember_info_name">{selectItem.name}</View>
            <View>
              <View className="rechargeMember_info_price">
                原价：<Text>¥{selectItem.oriPrice || 0}</Text>
              </View>
              <View className="rechargeMember_info_bean">
                ¥{selectItem.price || 0}+{selectItem.maxBeanAndCoupon || 0}
                <Text className="bean">卡豆</Text>
              </View>
              <View className="rechargeMember_info_beanTip">
                最高可用{selectItem.maxBeanAndCoupon || 0}卡豆抵扣
                {(selectItem.maxBeanAndCoupon || 0) / 100}元
              </View>
            </View>
          </View>
        </View>
        <View className="rechargeMember_cell">
          <View className="rechargeMember_title">选择规格</View>
          <View className="rechargeMember_sku_group">
            {list.map((item) => (
              <View
                key={item.productNo}
                className={`sku_cell ${
                  selectItem.productNo === item.productNo && "select"
                }`}
                onClick={() => handleSelectItem(item)}
              >
                {item.name}
              </View>
            ))}
          </View>
        </View>
        <View className="rechargeMember_cell">
          <View className="rechargeMember_title">充值账号</View>
          <View>
            <Input
              name="virtualProductAccount"
              placeholder={"请输入手机号/QQ号/其他"}
              className="recharge_content_input"
              onInput={(e) => setAccount(e.detail.value)}
            />
            <View className="recharge_content_liner"></View>
          </View>
        </View>
        <View className="recharge_footer">
          <Button
            disabled={limit || !selectItem || !account}
            formType="submit"
            className="recharge_button"
          >
            {limit || (videoEnd ? "立即充值" : "看视频享受卡豆折扣充值")}
          </Button>
        </View>
      </View>
    </Form>
  );
};

export default rechargeMember;
