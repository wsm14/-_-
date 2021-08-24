import React, { useState } from "react";
import { View, Text } from "@tarojs/components";
import { GOODS_BUY_NUMBER } from "@/relay/common/constant";
import { Form, Input, Radio, Switch } from "@/relay/components/FormCondition";
import GroupDetailEdit from "@/relay/components/GroupDetailEdit";
import "./index.scss";

const FormItem = Form.Item;
const FormItemGroup = Form.Group;

/**
 * 一键开团 操作区域
 */
export default ({ formData, savaFormData }) => {
  const [treaty, setTreaty] = useState(false); // 协议按钮

  const importGoods = (
    <View className="group_ce_importGoods">从商品库导入</View>
  );

  return (
    <View className="group_ce_form">
      <FormItemGroup title={"团购介绍"}>
        <FormItem showLabel={false}>
          <Input
            name={"goodsName"}
            className={"group_ce_name"}
            placeholder={"请输入团购活动标题"}
          ></Input>
        </FormItem>
        <FormItem showLabel={false}>
          <GroupDetailEdit></GroupDetailEdit>
        </FormItem>
      </FormItemGroup>
      <FormItemGroup title={"团购商品"} extra={importGoods}>
        <FormItem label={"名称"}>
          <Input
            name={"goodsName"}
            placeholder={"请输入商品名称"}
            maxLength={30}
          ></Input>
        </FormItem>
        <FormItem label={"价格(¥)"}>
          <Input
            name={"goodsName"}
            type="digit"
            className={"group_ce_goodsName"}
            placeholder={"0"}
            maxLength={30}
          ></Input>
        </FormItem>
        <FormItem label={"库存"}>
          <Input
            name={"goodsName"}
            type="number"
            placeholder={"不限"}
            maxLength={30}
          ></Input>
        </FormItem>
        <FormItem label={"可购数量"}>
          <Radio
            name="buyRule"
            value={formData.buyRule}
            list={GOODS_BUY_NUMBER}
            onChange={(buyRule) => savaFormData({ buyRule })}
          ></Radio>
        </FormItem>
        {formData.buyRule && formData.buyRule == "gain" && (
          <FormItem label={`每人最高购买份数`}>
            <Input
              name={"businessStatuss"}
              value={formData["businessStatuss"]}
              type="number"
              suffix="份"
              placeholder="请输入"
            ></Input>
          </FormItem>
        )}
        <FormItem label={"划线价(¥)"}>
          <Input
            name={"goodsName"}
            type="digit"
            placeholder={"划线价建议高于商品价格"}
            maxLength={30}
          ></Input>
        </FormItem>
        <FormItem label={"成本价(¥)"}>
          <Input
            name={"goodsName"}
            type="digit"
            placeholder={"用于利润核算，仅团长可见"}
            maxLength={30}
          ></Input>
        </FormItem>
      </FormItemGroup>
      <FormItemGroup title={"团购设置"}>
        <FormItem label={"物流方式"}></FormItem>
        <FormItem label={"开团通知推送"}>
          <Switch
            name={"needOrder"}
            value={formData.needOrder}
            onChange={(needOrder) => savaFormData({ needOrder })}
          ></Switch>
        </FormItem>
      </FormItemGroup>
      <View
        onClick={() => setTreaty(!treaty)}
        className={`group_ce_treaty_option ${treaty ? "select" : ""}`}
      >
        同意 <Text>《哒卡乐用户服务协议》</Text>
      </View>
    </View>
  );
};
