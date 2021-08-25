import React, { useMemo, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import {
  Form,
  Input,
  TextBlock,
  Textarea,
} from "@/relay/components/FormCondition";
import Drawer from "@/relay/components/layerlayout";
import CitySelect from "@/relay/components/FormCondition/MreCity/CitySelect";
import SelectAddress from "@/relay/components/SelectAddress";
import { computedSize } from "@/common/utils";

const FormItem = Form.Item;

export default (props) => {
  const { show = true, changeCity } = props;
  const [cityVisible, setCityVisible] = useState(false);
  const [addressVisible, setAddressVisible] = useState(false);
  const [data, setData] = useState({});
  const extra = () => {
    return (
      <View className="extra_address" onClick={() => setAddressVisible(true)}>
        <View className="extra_address_icon"></View>
        <View className="extra_address_text">定位</View>
      </View>
    );
  };
  return (
    <>
      <Drawer
        title={"添加收货地址"}
        show={show}
        height={586}
        overflow={true}
        onClose={() => onClose()}
      >
        <Form onSubmit={(e) => console.log(e.detail.value)} footer={false}>
          <FormItem label={"收货人"}>
            <Input
              name={"goodsName"}
              placeholder={"请输入收货人姓名"}
              style={{ textAlign: "left" }}
              maxLength={30}
            ></Input>
          </FormItem>
          <FormItem label={"联系电话"}>
            <Input
              name={"telephone"}
              placeholder={"请输入联系电话"}
              maxLength={13}
              style={{ textAlign: "left" }}
              type={"number"}
            ></Input>
          </FormItem>
          <FormItem label="位置" required>
            <TextBlock
              value={""}
              placeholder={"请选择地址"}
              disabled={false}
              style={{ textAlign: "left" }}
              onClick={(e) => {
                setCityVisible(true);
              }}
            ></TextBlock>
          </FormItem>
          <FormItem left={true} after={extra} label={"详细地址"}>
            <Input
              name={"telephone"}
              placeholder={"请输入详细地址"}
              style={{ textAlign: "left", maxWidth: 227 }}
            ></Input>
          </FormItem>
        </Form>
      </Drawer>
      <CitySelect
        show={cityVisible}
        onClose={() => {
          setCityVisible(false);
        }}
        onSubmit={(val) => {}}
      ></CitySelect>
      <SelectAddress show={addressVisible}></SelectAddress>
    </>
  );
};
