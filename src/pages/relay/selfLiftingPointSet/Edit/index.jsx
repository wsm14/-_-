import React, { useState } from "react";
import { useRouter } from "@tarojs/taro";
import { navigateTo } from "@/common/utils";
import { navigatePostBack } from "@/relay/common/hooks";
import { View, Button, Text } from "@tarojs/components";
import ImageShow from "@/relay/components/ImageShow";
import FooterFixed from "@/relay/components/FooterFixed";
import "./index.scss";

/**
 * 设置自提点
 */
export default () => {
  // 路由获取参数
  const routeParams = useRouter().params;
  const { data = "{}" } = routeParams;

  const [list, setList] = useState([]);
  const [selectId, setSelectId] = useState([]);

  // 保存事件
  const handleSaveData = (value) => {
    navigatePostBack({ ...value });
  };

  // 点击修改
  const handleOnEdit = (e) => {
    e.stopPropagation();
    navigateTo(
      `/pages/relay/selfLiftingPointSet/List/index?data=${JSON.stringify({})}`
    );
  };

  // 点击选中取消选中事件
  const handleOnSelect = (id) => {
    if (selectId.includes(id)) setSelectId(selectId.filter((i) => i !== id));
    else setSelectId([...selectId, id]);
  };

  return (
    <View className="SelfLiftingPointSet_Form">
      {!list.length ? (
        <>
          <View className="slp_heard">
            <View className="slp_heard_title">可用自提点</View>
            <Button className="slp_heard_btn">添加自提点</Button>
          </View>
          <View className="slp_group">
            <View
              className={`slp_cell ${selectId.includes(1) ? "select" : ""}`}
              onClick={() => handleOnSelect(1)}
            >
              <View className="slp_select"></View>
              <View className="slp_content">
                <View className="slp_content_top">
                  <View className="slp_content_left">
                    <View className="slp_content_title">国泰科技大厦</View>
                    <View className="slp_content_address">
                      浙江省杭州市萧山区宁卫街道萧山区宁卫街道萧山区宁卫街道萧山区宁卫街道78号
                    </View>
                    <View className="slp_content_cont">
                      联系人：刘 18734566767
                    </View>
                  </View>
                  <View className="slp_content_right">
                    <View
                      className="slp_content_edit"
                      onClick={handleOnEdit}
                    ></View>
                  </View>
                </View>
                <View className="slp_content_footer">
                  <ImageShow width={178} src={""}></ImageShow>
                </View>
              </View>
            </View>
          </View>
          <FooterFixed>
            <View className="slp_footer">
              <View className="slp_footer_left">全选</View>
              <View className="slp_footer_right">
                <View className="slp_submit_total">
                  已选<Text>2</Text>项
                </View>
                <Button className="slp_submit_btn">确定</Button>
              </View>
            </View>
          </FooterFixed>
        </>
      ) : (
        <View className="slp_null">
          <View className="slp_tip">没有可用自提点</View>
          <View className="slp_go_add">
            <Button className="add">添加自提点</Button>
          </View>
        </View>
      )}
    </View>
  );
};
