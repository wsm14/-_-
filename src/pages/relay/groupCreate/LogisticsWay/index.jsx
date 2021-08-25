import React, { useState } from "react";
import { useRouter } from "@tarojs/taro";
import { navigateTo } from "@/common/utils";
import { navigatePostBack } from "@/relay/common/hooks";
import { View, Button } from "@tarojs/components";
import { Form, Checkbox, Switch, Text } from "@/relay/components/FormCondition";
import FooterFixed from "@/relay/components/FooterFixed";
import "./index.scss";

const FormItem = Form.Item;
const FormItemGroup = Form.Group;

/**
 * 物流方式设置
 */
export default () => {
  // 路由获取参数
  const routeParams = useRouter().params;
  const { data = "{}" } = routeParams;

  const [logisticsType, setLogisticsType] = useState("");

  // 保存事件
  const handleSaveData = (value) => {
    console.log(value, logisticsType);
    return;
    navigatePostBack({ ...value });
  };

  // 跳转自提点佣金设置
  const goSelfLiftingPointCommissionSet = () => {
    navigateTo(
      `/pages/relay/groupCreate/SelfCommission/index?data=${JSON.stringify({})}`
    );
  };

  return (
    <View className="LogisticsWay_Contnet">
      <View className="lgWay_heard">
        <View className="lgWay_title">请选择物流方式</View>
        <View className="lgWay_tip">可同时选择快递/同城配送/顾客自提</View>
      </View>
      <View className="lgWay_form">
        <Form onSubmit={(e) => handleSaveData(e.detail.value)} footer={false}>
          <FormItemGroup>
            <FormItem
              label={"顾客自提"}
              vertical
              verticalForm={
                <Checkbox
                  list={{ self: "" }}
                  value={logisticsType}
                  onChange={(e) => setLogisticsType(e[0])}
                ></Checkbox>
              }
            >
              {logisticsType === "self" && (
                <>
                  <FormItem label={"设置自提点"}>
                    <Text
                      value={""}
                      placeholder={"未设置"}
                      onClick={goSelfLiftingPointCommissionSet}
                    ></Text>
                  </FormItem>
                  <FormItem label={"需要用户填写信息"}>
                    <Text
                      value={""}
                      placeholder={"默认3项"}
                      onClick={(needOrder) => console.log({ needOrder })}
                    ></Text>
                  </FormItem>
                  <FormItem label={"开团通知推送"} titleTip="(下单页优先展示)">
                    <Switch
                      value={1}
                      name={"needOrder"}
                      onChange={(needOrder) => console.log({ needOrder })}
                    ></Switch>
                  </FormItem>
                </>
              )}
            </FormItem>
            <FormItem label={"无需物流"}>
              <Checkbox
                value={logisticsType}
                list={{ noLogistics: "" }}
                onChange={(e) => setLogisticsType(e[0])}
              ></Checkbox>
            </FormItem>
            <FormItem label={"送货上门"}>
              <Checkbox
                list={{ send: "" }}
                value={logisticsType}
                onChange={(e) => setLogisticsType(e[0])}
              ></Checkbox>
            </FormItem>
          </FormItemGroup>
          <FooterFixed>
            <Button formType="submit" className="submit">
              确定
            </Button>
          </FooterFixed>
        </Form>
      </View>
    </View>
  );
};
