import React from "react";
import Router from "@/common/router";
import { View, Text } from "@tarojs/components";
import { GOODS_BUY_NUMBER, GOODS_BY_TYPE } from "@/relay/common/constant";
import {
  Form,
  Input,
  Radio,
  Switch,
  Text as TextEra,
  TimeRange,
} from "@/relay/components/FormCondition";
import GroupDetailEdit from "@/relay/components/GroupDetailEdit";
import "./index.scss";

const FormItem = Form.Item;
const FormItemGroup = Form.Group;

/**
 * 一键开团 操作区域
 */
export default ({ cRef, formData, savaFormData, treaty, setTreaty }) => {
  const importGoods = (
    <View className="group_ce_importGoods" onClick={() => goGoodsManage()}>
      从商品库导入
    </View>
  );

  // 跳转商品库
  const goGoodsManage = () => {
    const { communityGoodsDescObject = {} } = formData;
    Router({
      routerName: "goodsManageList",
      args: {
        mode: "select",
        data: JSON.stringify(communityGoodsDescObject),
      },
    });
  };

  // 跳转商品描述
  const goGoodsDepict = () => {
    const { communityGoodsDescObject = {} } = formData;
    Router({
      routerName: "goodsDepict",
      args: {
        data: JSON.stringify(communityGoodsDescObject),
      },
    });
  };

  // 跳转物流方式配置
  const goLogisticsWay = () => {
    const {
      logisticsType = "",
      customerWriteInfo = "",
      liftingCabinets = "",
    } = formData;
    const args = {
      logisticsType,
      customerWriteInfo,
      liftingCabinets,
    };
    for (var key in args) {
      if (args[key] === "") {
        delete args[key];
      }
    }
    Router({
      routerName: "logisticsWay",
      args: {
        data: JSON.stringify(args),
      },
    });
  };

  return (
    <View className="group_ce_form">
      <FormItemGroup title={"团购介绍"}>
        <FormItem showLabel={false}>
          <Input
            value={formData["title"]}
            name={"title"}
            className={"group_ce_name"}
            placeholder={"请输入团购活动标题"}
          ></Input>
        </FormItem>
        <FormItem showLabel={false}>
          <GroupDetailEdit
            cRef={cRef}
            value={formData?.communityContentObjectList}
          ></GroupDetailEdit>
        </FormItem>
      </FormItemGroup>
      <FormItemGroup title={"团购商品"} extra={importGoods}>
        <FormItem label={"名称"}>
          <Input
            value={formData["goodsName"]}
            name={"goodsName"}
            placeholder={"请输入商品名称"}
            maxLength={30}
          ></Input>
        </FormItem>
        <FormItem label={"商品描述"}>
          <TextEra
            value={formData?.communityGoodsDescObject?.desc}
            placeholder={"添加图片及描述"}
            onClick={goGoodsDepict}
          ></TextEra>
        </FormItem>
        <FormItem label={"价格(¥)"}>
          <Input
            name={"price"}
            value={formData["price"]}
            type="digit"
            className={"price"}
            placeholder={"0"}
            maxLength={30}
          ></Input>
        </FormItem>
        <FormItem label={"库存"}>
          <Input
            name={"remain"}
            value={formData["remain"]}
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
        {formData.buyRule && formData.buyRule == "personLimit" && (
          <FormItem label={`每人最高购买份数`}>
            <Input
              name={"limitContent"}
              value={formData["limitContent"]}
              type="number"
              suffix="份"
              placeholder="请输入"
            ></Input>
          </FormItem>
        )}
        <FormItem label={"划线价(¥)"}>
          <Input
            name={"costPrice"}
            value={formData["costPrice"]}
            type="digit"
            placeholder={"划线价建议高于商品价格"}
            maxLength={30}
          ></Input>
        </FormItem>
        <FormItem label={"成本价(¥)"}>
          <Input
            name={"oriPrice"}
            value={formData["oriPrice"]}
            type="digit"
            placeholder={"用于利润核算，仅团长可见"}
            maxLength={30}
          ></Input>
        </FormItem>
      </FormItemGroup>
      <FormItemGroup title={"团购设置"}>
        <FormItem label={"物流方式"}>
          <TextEra
            value={GOODS_BY_TYPE[formData.logisticsType]}
            placeholder={"未设置"}
            onClick={goLogisticsWay}
          ></TextEra>
        </FormItem>
        <FormItem label={"团购时间"}>
          <TimeRange
            value={formData}
            onClick={goLogisticsWay}
            onChange={(val) => savaFormData(val)}
          ></TimeRange>
        </FormItem>
        <FormItem label={"开团通知推送"}>
          <Switch
            name={"pushFlag"}
            value={formData.pushFlag}
            onChange={(pushFlag) => savaFormData({ pushFlag })}
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
