import React, { useState } from "react";
import { useRouter } from "@tarojs/taro";
import { navigatePostBack } from "@/relay/common/hooks";
import { upload } from "@/api/upload";
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
  // 路由获取参数
  const routeParams = useRouter().params;
  const { data } = routeParams;

  const [fileList, setFileList] = useState([]);

  // 保存事件
  const handleSaveData = (value) => {
    upload(fileList, { img: fileList }).then((res) => {
      navigatePostBack({ ...value, img: res.img.toString() });
    });
  };

  return (
    <View className="GoodsDepict_Form">
      <Form onSubmit={(e) => handleSaveData(e.detail.value)} footer={false}>
        <FormItemGroup>
          <FormItem label={"商品描述"} vertical>
            <Textarea
              value={JSON.parse(data).desc}
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
        <FormItemGroup>
          <FormItem label={"商品图片"} titleTip={"最多9张"} vertical>
            <Upload
              value={JSON.parse(data).img}
              onChange={(files) => setFileList(files)}
            ></Upload>
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
