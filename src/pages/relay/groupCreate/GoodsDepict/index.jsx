import React from "react";
import { View, Button } from "@tarojs/components";
import { Form, Upload, Textarea } from "@/relay/components/FormCondition";
import FooterFixed from "@/relay/components/FooterFixed";
import "./index.scss";

const FormItem = Form.Item;
const FormItemGroup = Form.Group;

/**
 * 编辑图片和描述
 */
export default () => {
  return (
    <View className="GoodsDepict_Form">
      <Form
        onSubmit={(e) => {
          console.log(e.detail.value);
        }}
        footer={false}
      >
        <FormItemGroup>
          <FormItem label={"商品描述"} vertical>
            <Textarea
              name={"goodsName"}
              placeholder="请输入商品描述"
              bodyClassName="bodyClassName"
              className="txtarea_className"
              placeholderClass="placeholderClass"
              disableDefaultPadding
              maxLength={2000}
            ></Textarea>
          </FormItem>
        </FormItemGroup>
        <FormItemGroup>
          <FormItem label={"商品图片"} titleTip={"最多9张"} vertical>
            <Upload name={"goodsNasme"}></Upload>
          </FormItem>
        </FormItemGroup>
        <FooterFixed>
          <Button formType="submit" className="submit">
            保存
          </Button>
        </FooterFixed>
      </Form>
    </View>
  );
};
