import React, { useState } from "react";
import { useRouter } from "@tarojs/taro";
import { navigateTo } from "@/common/utils";
import Router from "@/common/router";
import { navigatePostBack } from "@/relay/common/hooks";
import { View, Button } from "@tarojs/components";
import { Form, Checkbox, Text } from "@/relay/components/FormCondition";
import FooterFixed from "@/relay/components/FooterFixed";
import "./index.scss";

const FormItem = Form.Item;
const FormItemGroup = Form.Group;

/**
 * 自提点佣金设置
 */
export default () => {
  // 路由获取参数
  const routeParams = useRouter().params;
  const { liftingCabinets } = routeParams;

  // 选择自提点页面回显跳转
  const handleGoPage = (value) => {
    Router({
      routerName: "selfLiftingPointList",
      args: {
        type: "select",
        liftingCabinets: liftingCabinets ? liftingCabinets.split(",") : [],
      },
    });
  };

  return (
    <View className="SelfCommission_Form">
      <Form
        borderRadius={false}
        onSubmit={(e) => console.log(e.detail.value)}
        footer={false}
      >
        <FormItem label={"选择自提点"}>
          <Text value={""} placeholder={"未选择"} onClick={handleGoPage}></Text>
        </FormItem>
        <View className="slps_group">
          <FormItemGroup title="选择自提点">
            <FormItem label={"自动发放"} titleTip="提货完成，佣金自动到账">
              <Checkbox
                list={{ send: "" }}
                value={""}
                onChange={(e) => console.log(e[0])}
              ></Checkbox>
            </FormItem>
          </FormItemGroup>
        </View>
        <FooterFixed>
          <Button formType="submit" className="submit">
            确定
          </Button>
        </FooterFixed>
      </Form>
    </View>
  );
};
