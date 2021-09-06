import React, { useRef, useState, useEffect } from "react";
import Taro, { useRouter } from "@tarojs/taro";
import { usePostBackData } from "@/relay/common/hooks";
import { toast } from "@/common/utils";
import { View } from "@tarojs/components";
import { Form } from "@/relay/components/FormCondition";
import {
  fetchGroupEdit,
  fetchGroupCreate,
  fetchGroupDetail,
} from "@/server/relay";
import Heard from "./components/Heard";
import Content from "./components/Content";
import Footer from "./components/Footer";

/**
 * 一键开团
 */
const GroupCreate = () => {
  // 路由获取参数 mode add 新增 edit 修改
  const routeParams = useRouter().params;
  const { mode = "add", ownerId, communityOrganizationId } = routeParams;

  const [formData, setFormData] = useState({
    limitContent: 1,
    unlimitFlag: 0,
    buyRule: "unlimited",
  }); // 额外信息储存

  const cRef = useRef();

  useEffect(() => {
    if (mode == "add") {
      // 获取上一次自提点信息
      const logisticsType = Taro.getStorageSync("logisticsType") || {};
      savaFormData(logisticsType);
    }
    if (mode === "edit") {
      fetchGroupDetail({ ownerId, communityOrganizationId }).then((res) => {
        const { communityOrganizationGoodsList: obj = [], ...other } =
          res.communityOrganizationDetail;
        setFormData({ ...other, ...(obj[0] || {}) });
      });
    }
  }, []);

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
    const { desc, img, logisticsType, goodsData } = data;
    // 商品描述配置
    if (desc || img) {
      savaFormData({ communityGoodsDescObject: data });
    }
    // 物流方式配置
    if (logisticsType) {
      savaFormData(data);
    }
    // 商品详情
    if (goodsData) {
      savaFormData(goodsData);
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
      // pushFlag = 0,
      liftingCabinets = [],
      customerWriteInfo = [],
      communityGoodsDescObject = [],
      communityCommonGoodsId,
      communityOrganizationGoodsId,
      ...other
    } = formData;
    const { title, unlimitFlag, remain, ...oval } = value;
    if (
      Object.keys(checkArr).some((i) => {
        const data = { ...value, ...formData };
        if (!data[i]) toast(checkArr[i]);
        return !data[i];
      })
    ) {
      return;
    } else if (unlimitFlag == 1 && !remain) {
      toast("请输入库存数量");
      return;
    }
    const fetch = { edit: fetchGroupEdit, add: fetchGroupCreate }[mode];
    fetch({
      ...other,
      title,
      liftingCabinets: liftingCabinets.toString(),
      customerWriteInfo: customerWriteInfo.toString(),
      communityContentObjectList: cRef.current.getData(),
      communityOrganizationGoodsList: [
        {
          communityGoodsDescObject,
          commonGoodsId: communityCommonGoodsId,
          communityOrganizationGoodsId,
          unlimitFlag,
          remain,
          ...oval,
          // pushFlag,
        },
      ],
    }).then((res) => {
      wx.disableAlertBeforeUnload();
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
