import React, { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { useRouter } from "@tarojs/taro";
import evens from "@/common/evens";
import { getAuthStatus } from "@/common/authority";
import { View, Button } from "@tarojs/components";
import {
  Form,
  Input,
  Text,
  Upload,
  Textarea,
} from "@/relay/components/FormCondition";
import { mapSelect, toast } from "@/common/utils";
import { upload } from "@/api/upload";
import FooterFixed from "@/relay/components/FooterFixed";
import {
  fetchCommonGoods,
  fetchUpdateCommunityGoods,
  fetchCommonGoodsDetail,
} from "@/server/relay";
import "./index.scss";

const FormItem = Form.Item;
const FormItemGroup = Form.Group;

/**
 * 编辑商品
 */
export default () => {
  // 路由获取参数
  const routeParams = useRouter().params;
  const { type, ownerId, communityGoodsId } = routeParams;

  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (type === "edit") {
      fetchGetDetail();
    }
  }, []);

  // 获取详情
  const fetchGetDetail = () => {
    fetchCommonGoodsDetail({ ownerId, communityGoodsId }).then((res) => {
      setFormData(res.communityCommonGoods);
    });
  };

  // 信息储存
  const savaFormData = (val) => setFormData((old) => ({ ...old, ...val }));

  // 提交保存
  const handleSaveData = (value) => {
    const { goodsName, costPrice, desc } = value;
    const { img = [] } = formData;
    if (!goodsName) {
      toast("请填写商品名称");
      return;
    } else if (!costPrice) {
      toast("请填写售价");
      return;
    }

    const imgs = img ? (Array.isArray(img) ? img : img.split(",")) : [];
    upload(imgs, { img: imgs }).then((res) => {
      const fetch = {
        add: fetchCommonGoods, // 新增
        edit: fetchUpdateCommunityGoods, // 修改
      }[type];
      fetch({
        ...formData,
        ...value,
        communityGoodsDescObject: { img: img.toString(), desc },
      }).then(() => {
        toast("编辑成功");
        Taro.navigateBack({ delta: 1 });
      });
    });
  };

  return (
    <View className="GoodsManage_box">
      <Form
        borderRadius={false}
        onSubmit={(e) => handleSaveData(e.detail.value)}
        footer={false}
      >
        <View className="GoodsManage_box_group">
          <FormItemGroup>
            <FormItem label={"名称"} required>
              <Input
                value={formData.goodsName}
                name="goodsName"
                placeholder="请输入商品名称"
              ></Input>
            </FormItem>
            <FormItem label={"商品描述"} vertical>
              <Textarea
                value={
                  formData.communityGoodsDescObject &&
                  JSON.parse(formData.communityGoodsDescObject).desc
                }
                name={"desc"}
                placeholder="请输入商品描述"
                className="bodyClassName"
                TextareaClassName="txtarea_className"
                placeholderClass="placeholderClass"
                disableDefaultPadding
                maxLength={2000}
              ></Textarea>
            </FormItem>
          </FormItemGroup>
        </View>
        <View className="GoodsManage_box_group">
          <FormItemGroup>
            <FormItem label={"商品图片"} titleTip={"最多9张"} vertical>
              <Upload
                count={9}
                value={
                  formData.communityGoodsDescObject &&
                  JSON.parse(formData.communityGoodsDescObject).img
                }
                onChange={(file) => savaFormData({ img: file })}
              ></Upload>
            </FormItem>
          </FormItemGroup>
        </View>
        <View className="GoodsManage_box_group">
          <FormItemGroup>
            <FormItem label={"价格(¥) "} required>
              <Input
                value={formData.costPrice}
                style={{ color: "#EF476F" }}
                name="costPrice"
                placeholder="请输入商品价格 "
              ></Input>
            </FormItem>
            <FormItem label={"库存"}>
              <Input
                value={formData.total}
                name="total"
                placeholder="不限"
              ></Input>
            </FormItem>
            <FormItem label={"划线价(¥)"}>
              <Input
                value={formData.oriPrice}
                name="oriPrice"
                placeholder="划线价建议高于商品价格 "
              ></Input>
            </FormItem>

            <FormItem label={"成本价(¥)"}>
              <Input
                value={formData.price}
                name="price"
                placeholder="用于利润核算，仅团长可见"
              ></Input>
            </FormItem>
          </FormItemGroup>
        </View>
        <FooterFixed>
          <Button formType="submit" className="submit">
            确认{{ edit: "修改", add: "添加" }[type]}
          </Button>
        </FooterFixed>
      </Form>
    </View>
  );
};
