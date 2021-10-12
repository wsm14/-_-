import React, { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { useRouter } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import { GOODS_REMAIN_NUMBER } from "@/relay/common/constant";
import {
  Form,
  Radio,
  Input,
  Upload,
  Textarea,
} from "@/relay/components/FormCondition";
import { toast } from "@/common/utils";
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
  const { type = "add", ownerId, communityGoodsId } = routeParams;

  const [formData, setFormData] = useState({ unlimitFlag: 0 });

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
    const { goodsName, price, desc, unlimitFlag, total } = value;
    const { img = [] } = formData;
    if (!goodsName) {
      toast("请填写商品名称");
      return;
    } else if (!price) {
      toast("请填写售价");
      return;
    } else if (unlimitFlag == 1 && !total) {
      toast("请填写库存数量");
      return;
    }

    const imgs = img ? (Array.isArray(img) ? img : img.split(",")) : [];
    upload(imgs, { img: imgs }).then((res = {}) => {
      const fetch = {
        add: fetchCommonGoods, // 新增
        edit: fetchUpdateCommunityGoods, // 修改
      }[type];
      fetch({
        ...formData,
        ...value,
        communityGoodsDescObject: { img: res.img.toString(), desc },
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
                value={formData?.communityGoodsDescObject?.desc}
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
                value={formData?.communityGoodsDescObject?.img}
                onChange={(file) => savaFormData({ img: file })}
              ></Upload>
            </FormItem>
          </FormItemGroup>
        </View>
        <View className="GoodsManage_box_group">
          <FormItemGroup>
            <FormItem label={"价格(¥) "} required>
              <Input
                value={formData.price}
                style={{ color: "#EF476F" }}
                type="digit"
                name="price"
                placeholder="请输入商品价格 "
                maxLength={6}
              ></Input>
            </FormItem>
            <FormItem label={"库存"}>
              <Radio
                name="unlimitFlag"
                value={formData["unlimitFlag"]}
                list={GOODS_REMAIN_NUMBER}
                onChange={(unlimitFlag) => savaFormData({ unlimitFlag })}
              ></Radio>
            </FormItem>
            {formData.unlimitFlag == "1" && (
              <FormItem label={"库存数量"} required>
                <Input
                  name={"total"}
                  value={formData["total"]}
                  type="number"
                  placeholder={"请输入数量"}
                  maxLength={6}
                ></Input>
              </FormItem>
            )}
            <FormItem label={"划线价(¥)"}>
              <Input
                value={formData.costPrice}
                type="digit"
                name="costPrice"
                placeholder="划线价建议高于商品价格 "
                maxLength={6}
              ></Input>
            </FormItem>
            <FormItem label={"成本价(¥)"}>
              <Input
                value={formData.oriPrice}
                type="digit"
                name="oriPrice"
                placeholder="用于利润核算，仅团长可见"
                maxLength={6}
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