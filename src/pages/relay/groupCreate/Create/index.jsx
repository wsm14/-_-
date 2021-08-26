import React, { useRef, useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { usePostBackData } from "@/relay/common/hooks";
import { toast } from "@/common/utils";
import { View } from "@tarojs/components";
import { Form } from "@/relay/components/FormCondition";
import { fetchGroupCreate } from "@/server/relay";
import Heard from "./components/Heard";
import Content from "./components/Content";
import Footer from "./components/Footer";

/**
 * 一键开团
 */
const GroupCreate = () => {
  const [treaty, setTreaty] = useState(true); // 同意协议按钮
  const [formData, setFormData] = useState({
    limitContent: 1,
    buyRule: "unlimited",
  }); // 额外信息储存

  const cRef = useRef();

  useEffect(() => {
    wx.enableAlertBeforeUnload({
      message: "已输入信息不保存，确认退出？",
    });
    return () => {
      wx.disableAlertBeforeUnload();
    };
  }, []);

  // 数据回传获取
  usePostBackData((data) => {
    const { desc, img, logisticsType } = data;
    // 商品描述配置
    if (desc || img) {
      savaFormData({ communityGoodsDescObject: data });
    }
    // 物流方式配置
    if (logisticsType) {
      savaFormData(data);
    }
  });

  // 信息储存
  const savaFormData = (val) => setFormData((old) => ({ ...old, ...val }));

  const checkArr = {
    title: "请输入团购标题",
    goodsName: "请输入商品名称",
    price: "请输入商品价格",
    logisticsType: "请选择物流方式",
  };

  // 确认提交
  const handleUpData = (value) => {
    const {
      buyRule,
      pushFlag = 0,
      liftingCabinets = [],
      customerWriteInfo = [],
      communityGoodsDescObject = [],
      ...other
    } = formData;
    const { title, ...oval } = value;
    if (!treaty) {
      toast("请确认《哒卡乐用户服务协议》");
      return;
    }
    if (
      Object.keys(checkArr).some((i) => {
        const data = { ...value, ...formData };
        if (!data[i]) toast(checkArr[i]);
        return !data[i];
      })
    )
      return;
    fetchGroupCreate({
      title,
      liftingCabinets: liftingCabinets.toString(),
      customerWriteInfo: customerWriteInfo.toString(),
      ...other,
      communityContentObjectList: cRef.current.getData(),
      communityOrganizationGoodsList: [
        { communityGoodsDescObject, ...oval, pushFlag },
      ],
    }).then((res) => {
      Taro.navigateBack({ delta: 1 });
    });
  };

  return (
    <View className="create_group">
      {/* 一件开团头部 用户信息展示区域 */}
      <Heard></Heard>
      <Form onSubmit={(e) => handleUpData(e.detail.value)} footer={false}>
        {/* 一件开团头部 用户信息操作区域 */}
        <Content
          cRef={cRef}
          treaty={treaty}
          setTreaty={setTreaty}
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
