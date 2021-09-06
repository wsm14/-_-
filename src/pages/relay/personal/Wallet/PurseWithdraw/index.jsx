import React, { useState } from "react";
import { useRouter } from "@tarojs/taro";
import Taro, { useDidShow } from "@tarojs/taro";
import { View, Text, Form, Button, Input } from "@tarojs/components";
import { fetchBankInfo, fakeUserWithdraw } from "@/server/relay";
import { backgroundObj, toast } from "@/common/utils";
import "./index.scss";
/**
 * 我的钱包 - 提现
 */
export default () => {
  // 路由获取参数

  const [data, setData] = useState({});
  const [price, setPrice] = useState(0);
  const [priceError, setPriceError] = useState(false); // 提现金额检查

  useDidShow(() => {
    getUserInfo();
  });
  const {
    incomeCash = 0,
    bankName,
    bankIcon,
    bankImg,
    bankHideNumber = "",
  } = data;
  // 检查金额是否超出
  const checkPrice = (val) => {
    setPrice(val);
    if (val > Number(incomeCash)) {
      setPriceError(true);
    } else setPriceError(false);
  };
  const getUserInfo = () => {
    fetchBankInfo().then((res) => {
      const { incomeCash, bankBindingInfo, bankStatus } = res;
      setData({ incomeCash, ...bankBindingInfo, bankStatus });
    });
  };

  // 提交数据
  const handleOnSumbit = (val) => {
    if (!priceError && price != 0) {
      fakeUserWithdraw({ withdrawalFee: price }).then((val) => {
        Taro.showModal({
          title: "提示",
          confirmText: "确认",
          showCancel: false,
          content: "提现成功",
          success: function (res) {
            if (res.confirm) {
              Taro.navigateBack({ delta: 1 });
            }
          },
        });
      });
    } else {
      toast("请输入正确的金额");
    }
  };

  return (
    <View className="PurseWithdraw_content">
      <View className="PurseWithdraw_card">
        <View
          className="PurseWithdraw_bankIcon"
          style={backgroundObj(bankIcon)}
        ></View>
        <View className="PurseWithdraw_text">
          <View className="PurseWithdraw_bankName">{bankName}</View>
          <View className="PurseWithdraw_address">
            尾号{" "}
            {bankHideNumber.slice(
              bankHideNumber.length - 4,
              bankHideNumber.length
            )}{" "}
            储蓄卡
          </View>
        </View>
      </View>
      <View className="purseWithdraw_handle">
        <View className="purseWithdraw_title">提现金额</View>
        <View className="purseWithdraw_form">
          <Form onSubmit={(e) => handleOnSumbit(e.detail.value)}>
            <View className="purseWithdraw_form_input">
              <Text>¥</Text>{" "}
              <Input
                name="aaa"
                value={price}
                type="number"
                className="pw_form_input"
                onInput={(e) => checkPrice(e.target.value)}
              ></Input>
            </View>
            <View className="purseWithdraw_form_tip">
              <Text className={priceError ? `error` : ""}>
                {priceError
                  ? "输入金额超过可提现金额"
                  : `可最高提现 ¥${incomeCash}（${incomeCash * 100}卡豆）`}
              </Text>
              <Text
                className="purseWithdraw_all_price"
                onClick={() => setPrice(Number(incomeCash))}
              >
                全部提现
              </Text>
            </View>
            <Button formType="submit" className="purseWithdraw_form_sumbit">
              确认提现
            </Button>
          </Form>
        </View>
      </View>
      <View className="purseWithdraw_toast">
        <View className="font28 color8">提现说明</View>
        <View className="purseWithdraw_info_content">
          <View> 1.单笔提现金额最低为20元人民币（2000卡豆）</View>
          <View> 2.提现申请将在7个工作日内审核到账，请耐心等待）</View>
          <View> 3.每日可申请提现一次，若当日次数已满，请次日申请）</View>
          <View>
            4.提现金额不满2000元人民币（200000卡豆），每次提现手续费为2元人民币，超过或包含2000元人民（200000卡豆）免提现手续费。）
          </View>
        </View>
      </View>
    </View>
  );
};
