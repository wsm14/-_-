import React, { useEffect, useState } from "react";
import { useDidShow } from "@tarojs/taro";
import { View, Form, Input, Text, Button } from "@tarojs/components";
import router from "@/utils/router";
import { usePostBackData } from "@/utils/utils";
import { fetchRechargeMemberList } from "@/server/common";
import "./index.scss";

const rechargeMember = () => {
  const [list, setList] = useState([]); // 数据
  const [selectItem, setSelectItem] = useState(""); // 选择的充值项目
  const [videoEnd, setVideoEnd] = useState(false); // 视频是否看完
  const [account, setAccount] = useState(""); // 帐号

  useEffect(() => {}, []);

  usePostBackData((data) => {
    const { type } = data;
    if (type === "videoEnd") {
      setVideoEnd(true);
    }
  });

  const fetchGetList = () => {
    fetchRechargeMemberList().then((res) => {
      setList(res);
    });
  };

  // 提交充值
  const handleUpRecharge = (val) => {
    // 还没有看视频 前往看广告
    if (!videoEnd) {
      router({
        routerName: "advertisingVideo",
      });
      return;
    }
    // 提交
    console.log({ ...val, selectItem });
  };

  // 充值项目点击
  const handleSelectItem = (val) => {
    setSelectItem((old) => (old === val ? "" : val));
  };

  return (
    <Form onSubmit={(e) => handleUpRecharge(e.detail.value)}>
      <View className="rechargeMember_box">
        <View className="rechargeMember_head">
          <View className="rechargeMember_logo"></View>
          <View className="rechargeMember_info">
            <View className="rechargeMember_info_name">
              爱奇艺黄金会员（周卡）
            </View>
            <View>
              <View className="rechargeMember_info_price">
                原价：<Text>¥15.00</Text>
              </View>
              <View className="rechargeMember_info_bean">
                ¥12.00+300<Text className="bean">卡豆</Text>
              </View>
              <View className="rechargeMember_info_beanTip">
                最高可用300卡豆抵扣3元
              </View>
            </View>
          </View>
        </View>
        <View className="rechargeMember_cell">
          <View className="rechargeMember_title">选择规格</View>
          <View className="rechargeMember_sku_group">
            {list.map((item) => (
              <View
                key={item}
                className={`sku_cell ${selectItem === item && "select"}`}
                onClick={() => handleSelectItem(item)}
              >
                {item}
              </View>
            ))}
          </View>
        </View>
        <View className="rechargeMember_cell">
          <View className="rechargeMember_title">充值账号</View>
          <View>
            <Input
              name="key"
              placeholder={"请输入手机号/QQ号/其他"}
              className="recharge_content_input"
              onInput={(e) => setAccount(e.detail.value)}
            />
            <View className="recharge_content_liner"></View>
          </View>
        </View>
        <View className="recharge_footer">
          <Button
            disabled={!selectItem || !account}
            formType="submit"
            className="recharge_button"
          >
            {videoEnd ? "立即充值" : "看视频享受卡豆折扣充值"}
          </Button>
        </View>
      </View>
    </Form>
  );
};

export default rechargeMember;
