import React, { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { useRouter } from "@tarojs/taro";
import evens from "@/common/evens";
import { getAuthStatus } from "@/common/authority";
import { View, Button } from "@tarojs/components";
import { Form, Input, Text, Upload } from "@/relay/components/FormCondition";
import { mapSelect, toast } from "@/common/utils";
import { upload } from "@/api/upload";
import FooterFixed from "@/relay/components/FooterFixed";
import {
  fetchLiftingCabinetEdit,
  fetchLiftingCabinetCreate,
  fetchLiftingCabinetDetail,
} from "@/server/relay";
import "./index.scss";

const FormItem = Form.Item;
const FormItemGroup = Form.Group;

/**
 * 编辑自提点
 */
export default () => {
  // 路由获取参数
  const routeParams = useRouter().params;
  const { type, ownerId, communityLiftingCabinetId } = routeParams;

  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (type === "edit") {
      fetchGetDetail();
    }
  }, []);

  // 获取详情
  const fetchGetDetail = () => {
    fetchLiftingCabinetDetail({ ownerId, communityLiftingCabinetId }).then(
      (res) => {
        setFormData(res.communityLiftingCabinetInfo);
      }
    );
  };

  // 信息储存
  const savaFormData = (val) => setFormData((old) => ({ ...old, ...val }));

  // 提交保存
  const handleSaveData = (value) => {
    const { liftingName } = value;
    const { lnt, lat, address, images = "" } = formData;
    if (!liftingName) {
      toast("请输入自提点名称");
      return;
    } else if (!lnt || !lat) {
      toast("请选择位置");
      return;
    } else if (!address) {
      toast("请选择地址");
      return;
    }
    const img = images
      ? Array.isArray(images)
        ? images
        : images.split(",")
      : [];
    upload(img, { img: img }).then((res) => {
      const fetch = {
        add: fetchLiftingCabinetCreate, // 新增
        edit: fetchLiftingCabinetEdit, // 修改
      }[type];
      fetch({
        ...formData,
        ...value,
        images: res.img.toString(),
      }).then(() => {
        toast("编辑成功");
        Taro.navigateBack({ delta: 1 });
      });
    });
  };

  return (
    <View className="SelfLiftingPointEdit_Form">
      <Form
        borderRadius={false}
        onSubmit={(e) => handleSaveData(e.detail.value)}
        footer={false}
      >
        <FormItemGroup>
          <FormItem label={"自提点名称"} required>
            <Input
              value={formData.liftingName}
              name="liftingName"
              placeholder="自提点简称"
            ></Input>
          </FormItem>
          <FormItem label={"位置"} required>
            <Text
              value={formData.location}
              placeholder="自提点位置"
              onClick={() => {
                getAuthStatus({
                  key: "location",
                  success: () => {
                    mapSelect((val) => {
                      const {
                        address: location,
                        location: address,
                        ...other
                      } = val;
                      savaFormData({ ...other, location, address });
                    });
                  },
                  fail: () => {
                    evens.$emit("setLocation");
                  },
                });
              }}
              rightIcon={false}
              extra={<View className="slp_edit_local"></View>}
            ></Text>
          </FormItem>
          <FormItem label={"详细地址"} required>
            <Input
              name={"address"}
              value={formData.address}
              placeholder="详细地址"
              suffix={
                <Button
                  className="slp_wx_local"
                  onClick={() =>
                    Taro.chooseAddress({
                      success({ detailInfo }) {
                        savaFormData({ address: detailInfo });
                      },
                    })
                  }
                >
                  从微信读取
                </Button>
              }
            ></Input>
          </FormItem>
        </FormItemGroup>
        <FormItemGroup>
          <FormItem label={"自提点联系人"}>
            <Input
              value={formData.contactPerson}
              name="contactPerson"
              placeholder="请输入自提点联系人"
            ></Input>
          </FormItem>
          <FormItem label={"自提点电话"}>
            <Input
              value={formData.mobile}
              name="mobile"
              type={"number"}
              placeholder="请输入自提点电话"
            ></Input>
          </FormItem>
          <FormItem label={"上传图片"} titleTip={"最多3张"} vertical>
            <Upload
              count={3}
              value={formData.images}
              onChange={(file) => savaFormData({ images: file })}
            ></Upload>
          </FormItem>
        </FormItemGroup>
        <FooterFixed>
          <Button formType="submit" className="submit">
            确认{{ edit: "修改", add: "添加" }[type]}
          </Button>
        </FooterFixed>
      </Form>
    </View>
  );
};
