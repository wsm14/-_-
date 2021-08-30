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
      <View className="purseWithdraw_info">
        <View className="purseWithdraw_info_cell">
          <View style={{ flex: 1 }}>到账账户</View>
          <Text>微信零钱</Text>
        </View>
        <View className="purseWithdraw_info_cell">
          <View style={{ flex: 1 }}>账户实名</View>
          <Text>某某某</Text>
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
                  : `当前可提现金额 ¥${settlerPrice}`}
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
    </View>
  );
};
