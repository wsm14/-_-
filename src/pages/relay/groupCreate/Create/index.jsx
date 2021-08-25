import React, { useRef, useState, useEffect } from "react";
import { usePostBackData } from "@/relay/common/hooks";
import { View } from "@tarojs/components";
import { Form } from "@/relay/components/FormCondition";
import Heard from "./components/Heard";
import Content from "./components/Content";
import Footer from "./components/Footer";
import "./index.scss";

/**
 * 一键开团
 */
const GroupCreate = () => {
  const [formData, setFormData] = useState({}); // 额外信息储存

  const cRef = useRef();

  usePostBackData((data) => {
    console.log("回传的参数对象", data);
  });

  useEffect(() => {
    wx.enableAlertBeforeUnload({
      message: "已输入信息不保存，确认退出？",
    });
    return () => {
      wx.disableAlertBeforeUnload();
    };
  }, []);

  // 信息储存
  const savaFormData = (val) => {
    setFormData((old) => {
      return { ...old, ...val };
    });
  };

  return (
    <View className="create_group">
      {/* 一件开团头部 用户信息展示区域 */}
      <Heard></Heard>
      <Form
        onSubmit={(e) => {
          console.log(e.detail.value, cRef.current.getData());
        }}
        footer={false}
      >
        {/* 一件开团头部 用户信息操作区域 */}
        <Content
          cRef={cRef}
          formData={formData}
          savaFormData={savaFormData}
        ></Content>
        {/* 一件开团底部按钮 确认区域*/}
        <Footer></Footer>
      </Form>
    </View>
  );
};

export default GroupCreate;
