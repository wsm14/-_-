import React, { useState } from "react";
import { useRouter } from "@tarojs/taro";
import { View, Text, Form, Button, Input } from "@tarojs/components";
import "./index.scss";

/**
 * 我的钱包 - 提现
 */
export default () => {
  // 路由获取参数
  const routeParams = useRouter().params;
  const { settlerPrice = 0 } = routeParams;

  const [price, setPrice] = useState(); // 提现金额
  const [priceError, setPriceError] = useState(false); // 提现金额检查

  // 检查金额是否超出
  const checkPrice = (val) => {
    setPrice(val);
    if (val > Number(settlerPrice)) {
      setPriceError(true);
    } else setPriceError(false);
  };

  // 提交数据
  const handleOnSumbit = (val) => {
    console.log(val);
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
  };

  return (
    <View className="PurseWithdraw_content">
      <View className="PurseWithdraw_card">
        <View className="PurseWithdraw_bankIcon"></View>
        <View className="PurseWithdraw_text">
          <View className="PurseWithdraw_bankName">中国邮政储蓄银行</View>
          <View className="PurseWithdraw_address">尾号 8888 储蓄卡</View>
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
                  : `可最高提现 ¥${settlerPrice}（${settlerPrice * 100}卡豆）`}
              </Text>
              <Text
                className="purseWithdraw_all_price"
                onClick={() => setPrice(Number(settlerPrice))}
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
