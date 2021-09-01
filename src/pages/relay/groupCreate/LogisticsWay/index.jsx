import React, { useState, useEffect } from "react";
import Router from "@/common/router";
import Taro, { useRouter } from "@tarojs/taro";
import { toast } from "@/common/utils";
import { LOGISTICS_USER_INFO } from "@/relay/common/constant";
import { usePostBackData, navigatePostBack } from "@/relay/common/hooks";
import { View, Button } from "@tarojs/components";
import { Form, Checkbox, Text } from "@/relay/components/FormCondition";
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

  const [logisticsType, setLogisticsType] = useState(""); // 物流方式
  const [formData, setFormData] = useState({}); // 表单信息保存

  const {
    liftingCabinets: lcList = [],
    customerWriteInfo: cInfo = [
      "writeContentPerson",
      "writeMobile",
      "writeAddress",
    ],
  } = formData;

  useEffect(() => {
    console.log(data);
    setFormData(JSON.parse(data));
    setLogisticsType(JSON.parse(data).logisticsType);
  }, []);

  usePostBackData((data) => {
    savaFormData(data);
  });

  // 信息储存
  const savaFormData = (val) => {
    setFormData((old) => {
      return { ...old, ...val };
    });
  };

  // 保存回传数据
  const handleSaveData = (value) => {
    if (!logisticsType) {
      toast("请选择物流方式");
      return;
    }
    if (logisticsType === "self" && !lcList.length) {
      toast("请设置自提点");
      return;
    }
    const { customerWriteInfo } = value;
    // 只有自提有额外参数
    const selfPrams =
      logisticsType === "self"
        ? { ...formData, customerWriteInfo }
        : { customerWriteInfo, liftingCabinets: "" };
    // 储存本次自提点信息
    Taro.setStorageSync("logisticsType", { ...selfPrams, logisticsType });
    navigatePostBack({ ...selfPrams, logisticsType });
  };

  // 跳转自提点佣金设置
  const goSelfLiftingPointCommissionSet = () => {
    Router({
      routerName: "selfLiftingPointList",
      args: {
        liftingCabinets: lcList.toString(),
      },
    });
  };

  // 切换选项
  const changeSelect = (e) => {
    savaFormData({
      customerWriteInfo: ["writeContentPerson", "writeMobile", "writeAddress"],
    });
    setLogisticsType(e[0]);
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
                  value={logisticsType}
                  list={{ self: "" }}
                  onChange={changeSelect}
                ></Checkbox>
              }
            >
              {logisticsType === "self" && (
                <>
                  <FormItem label={"设置自提点"}>
                    <Text
                      value={lcList.length ? `已设置${lcList.length}个` : null}
                      placeholder={"未设置"}
                      onClick={goSelfLiftingPointCommissionSet}
                    ></Text>
                  </FormItem>
                  <FormItem label={"需要用户填写信息"}>
                    <Text
                      value={cInfo.length ? `已设置${cInfo.length}项` : null}
                      placeholder={"未设置"}
                    ></Text>
                  </FormItem>
                  <FormItem label={""}>
                    <Checkbox
                      name="customerWriteInfo"
                      value={cInfo}
                      list={LOGISTICS_USER_INFO}
                      onChange={(e) => savaFormData({ customerWriteInfo: e })}
                    ></Checkbox>
                  </FormItem>
                  {/* <FormItem label={"设置默认物流"} titleTip="(下单页优先展示)">
                    <Switch
                      name={"pushFlag"}
                      value={formData.pushFlag}
                      onChange={(pushFlag) => savaFormData({ pushFlag })}
                    ></Switch>
                  </FormItem> */}
                </>
              )}
            </FormItem>
            <FormItem
              label={"无需物流"}
              vertical
              verticalForm={
                <Checkbox
                  value={logisticsType}
                  list={{ noLogistics: "" }}
                  onChange={changeSelect}
                ></Checkbox>
              }
            >
              {logisticsType === "noLogistics" && (
                <>
                  <FormItem label={"需要用户填写信息"}>
                    <Text
                      value={cInfo.length ? `已设置${cInfo.length}项` : null}
                      placeholder={"未设置"}
                    ></Text>
                  </FormItem>
                  <FormItem label={""}>
                    <Checkbox
                      name="customerWriteInfo"
                      value={cInfo}
                      list={LOGISTICS_USER_INFO}
                      onChange={(e) => savaFormData({ customerWriteInfo: e })}
                    ></Checkbox>
                  </FormItem>
                </>
              )}
            </FormItem>
            <FormItem
              label={"送货上门"}
              vertical
              verticalForm={
                <Checkbox
                  value={logisticsType}
                  list={{ send: "" }}
                  onChange={changeSelect}
                ></Checkbox>
              }
            >
              {logisticsType === "send" && (
                <>
                  <FormItem label={"需要用户填写信息"}>
                    <Text
                      value={cInfo.length ? `已设置${cInfo.length}项` : null}
                      placeholder={"未设置"}
                    ></Text>
                  </FormItem>
                  <FormItem label={""}>
                    <Checkbox
                      name="customerWriteInfo"
                      value={cInfo}
                      list={LOGISTICS_USER_INFO}
                      onChange={(e) => savaFormData({ customerWriteInfo: e })}
                    ></Checkbox>
                  </FormItem>
                </>
              )}
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
