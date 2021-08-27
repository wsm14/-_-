import React, { useState } from "react";
import { useRouter, useDidShow } from "@tarojs/taro";
import Router from "@/common/router";
import { navigatePostBack } from "@/relay/common/hooks";
import { View, Button, Text } from "@tarojs/components";
import { fetchLiftingCabinetList } from "@/server/relay";
import ImageShow from "@/relay/components/ImageShow";
import FooterFixed from "@/relay/components/FooterFixed";
import "./index.scss";

/**
 * 设置自提点
 */
export default () => {
  // 路由获取参数
  const routeParams = useRouter().params;
  /**
   * mode select 选择模式 list 展示管理列表
   */
  const { mode = "select", liftingCabinets } = routeParams;

  const [list, setList] = useState([]);
  const [selectId, setSelectId] = useState([]);

  useDidShow(() => {
    fetchGetList();
    setSelectId(liftingCabinets ? liftingCabinets.split(",") : []);
  });

  // 保存事件
  const handleSaveData = () => {
    navigatePostBack({ liftingCabinets: selectId });
  };

  // 获取选择列表
  const fetchGetList = () => {
    fetchLiftingCabinetList().then((res) => {
      const { communityLiftingCabinetList: lists } = res;
      setList(lists);
    });
  };

  // 全选事件
  const handleAllSelect = () => {
    if (list.length === selectId.length) {
      setSelectId([]);
    } else {
      setSelectId(list.map((i) => i.communityLiftingCabinetId));
    }
  };

  // 点击新增/编辑
  const handleOnEdit = (e, type, data = {}) => {
    e.stopPropagation();
    const { ownerId, communityLiftingCabinetId } = data;
    Router({
      routerName: "selfLiftingPointEdit",
      args: {
        type,
        ownerId,
        communityLiftingCabinetId,
      },
    });
  };

  // 点击选中取消选中事件
  const handleOnSelect = (id) => {
    if (selectId.includes(id)) setSelectId(selectId.filter((i) => i !== id));
    else setSelectId([...selectId, id]);
  };

  return (
    <View className="SelfLiftingPointSet_Form">
      {list.length ? (
        <>
          {mode === "select" && (
            <View className="slp_heard">
              <View className="slp_heard_title">可用自提点</View>
              <Button
                className="slp_heard_btn"
                onClick={(e) => handleOnEdit(e, "add")}
              >
                添加自提点
              </Button>
            </View>
          )}
          <View className="slp_group">
            {list.map((item) => (
              <View
                className={`slp_cell ${
                  selectId.includes(item.communityLiftingCabinetId)
                    ? "select"
                    : ""
                }`}
                onClick={() => handleOnSelect(item.communityLiftingCabinetId)}
              >
                {mode === "select" && <View className="slp_select"></View>}
                <View className="slp_content">
                  <View className="slp_content_top">
                    <View className="slp_content_left">
                      <View className="slp_content_title">
                        {item.liftingName}
                      </View>
                      <View className="slp_content_address">
                        {item.address}
                      </View>
                      <View className="slp_content_cont">
                        联系人：{item.contactPerson} {item.mobile}
                      </View>
                    </View>
                    <View className="slp_content_right">
                      <View
                        className="slp_content_edit"
                        onClick={(e) => handleOnEdit(e, "edit", item)}
                      ></View>
                    </View>
                  </View>
                  {item.images && (
                    <View className="slp_content_footer">
                      <ImageShow width={178} src={item.images}></ImageShow>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
          <FooterFixed>
            {mode === "select" ? (
              <View className="slp_footer">
                <View
                  className={`slp_footer_left ${
                    list.length === selectId.length ? "select" : ""
                  }`}
                  onClick={handleAllSelect}
                >
                  全选
                </View>
                <View className="slp_footer_right">
                  <View className="slp_submit_total">
                    已选<Text>{selectId.length}</Text>项
                  </View>
                  <Button className="slp_submit_btn" onClick={handleSaveData}>
                    确定
                  </Button>
                </View>
              </View>
            ) : (
              <Button
                className="submit"
                onClick={(e) => handleOnEdit(e, "add")}
              >
                添加自提点
              </Button>
            )}
          </FooterFixed>
        </>
      ) : (
        <View className="slp_null">
          <View className="slp_tip">没有可用自提点</View>
          <View className="slp_go_add">
            <Button className="add" onClick={(e) => handleOnEdit(e, "add")}>
              添加自提点
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};
