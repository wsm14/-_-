import React, { useMemo, useState } from "react";
import { View, Text, Image, Button } from "@tarojs/components";
import {
  Form,
  Input,
  TextBlock,
  Textarea,
} from "@/relay/components/FormCondition";
import Drawer from "@/relay/components/layerlayout";
import CitySelect from "@/relay/components/FormCondition/MreCity/CitySelect";
import SelectAddress from "@/relay/components/SelectAddress";
import { computedSize, getLat, getLnt, toast, mapSelect } from "@/common/utils";
import FooterFixed from "@/relay/components/FooterFixed";
import { getAuthStatus } from "@/common/authority";
import evens from "@/common/evens";
const FormItem = Form.Item;

export default (props) => {
  const { show = false, onClose, type = "edit", onSubmit } = props;
  const [cityVisible, setCityVisible] = useState(false);
  const [addressVisible, setAddressVisible] = useState(false);
  const [data, setData] = useState({});
  const {
    address,
    addressName,
    mobile,
    districtCode,
    provinceCode,
    cityCode,
    cityName,
    districtName,
    provinceName,
  } = data;
  const insertAddress = (e) => {
    const { addressName = "", mobile = "", address = "" } = e.detail.value;
    if (
      addressName.length === 0 ||
      mobile.length === 0 ||
      address.length === 0 ||
      !cityCode
    ) {
      return toast("请把信息填写完整后提交");
    } else {
      onSubmit({ lat: getLat(), lnt: getLnt(), ...data, ...e.detail.value });
    }
  };
  const extra = () => {
    return (
      <View
        className="extra_address"
        onClick={() => {
          getAuthStatus({
            key: "location",
            success: (res) => {
              mapSelect((val) => {
                setData({ ...data, ...val });
              });
            },
            fail: (res) => {
              evens.$emit("setLocation");
            },
          });
        }}
      >
        <View className="extra_address_icon"></View>
        <View className="extra_address_text">定位</View>
      </View>
    );
  };
  const bottomBtn = {
    edit: (
      <FooterFixed>
        <Button formType="submit" className="delivery_submit public_center">
          保存并使用
        </Button>
      </FooterFixed>
    ),
    update: (
      <FooterFixed>
        <View className="public_auto"></View>
        <Button className="delivery_submit_twoStyle1 delivery_submit_twoBox public_center">
          删除
        </Button>
        <Button
          formType="submit"
          className="delivery_submit_twoStyle2  delivery_submit_twoBox public_center"
        >
          重新发布
        </Button>
      </FooterFixed>
    ),
  }[type];
  return (
    <>
      <Drawer
        title={type === "edit" ? "添加收货地址" : "编辑地址"}
        show={show}
        height={586}
        overflow={true}
        onClose={() => onClose()}
      >
        <Form onSubmit={(e) => insertAddress(e)} footer={false}>
          <FormItem linerFlag={false} label={"收货人"}>
            <Input
              name={"addressName"}
              placeholder={"请输入收货人姓名"}
              style={{ textAlign: "left" }}
              maxLength={30}
              value={addressName}
            ></Input>
          </FormItem>
          <FormItem linerFlag={false} label={"联系电话"}>
            <Input
              name={"mobile"}
              placeholder={"请输入联系电话"}
              maxLength={13}
              style={{ textAlign: "left" }}
              type={"number"}
              value={mobile}
            ></Input>
          </FormItem>
          <FormItem linerFlag={false} label="位置">
            <TextBlock
              value={provinceName + cityName + districtName}
              placeholder={"请选择地址"}
              disabled={false}
              style={{ textAlign: "left" }}
              onClick={(e) => {
                setCityVisible(true);
              }}
            ></TextBlock>
          </FormItem>
          <FormItem
            linerFlag={false}
            left={true}
            after={extra}
            label={"详细地址"}
          >
            <Input
              name={"address"}
              placeholder={"请输入详细地址"}
              style={{ textAlign: "left", maxWidth: 227 }}
              value={address}
            ></Input>
          </FormItem>
          <View className="extra_liners"></View>
          {bottomBtn}
        </Form>
      </Drawer>
      <CitySelect
        show={cityVisible}
        onClose={() => {
          setCityVisible(false);
        }}
        onSubmit={(val) => {
          setData({ ...data, ...val.data });
        }}
      ></CitySelect>
      <SelectAddress
        onClose={() => {
          setAddressVisible(false);
        }}
        onSubmit={(val) => {
          setData({ ...data, ...val });
          setAddressVisible(false);
        }}
        show={addressVisible}
      ></SelectAddress>
    </>
  );
};
