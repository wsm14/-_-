import React, { useState } from "react";
import Taro, { useRouter, useDidShow } from "@tarojs/taro";
import Router from "@/common/router";
import { navigatePostBack } from "@/relay/common/hooks";
import { toast } from "@/common/utils";
import { View, Button } from "@tarojs/components";
import { fetchGoodsManageList, fetchGoodsManageStoreDel } from "@/server/relay";
import Head from "./components/Head";
import ImageShow from "@/relay/components/ImageShow";
import FooterFixed from "@/relay/components/FooterFixed";
import "./index.scss";

/**
 * 商品库
 */
export default () => {
  // 路由获取参数
  const routeParams = useRouter().params;
  /**
   * mode select 选择模式 list 展示管理列表
   */
  const { mode = "list" } = routeParams;

  // 请求参数
  const [pages] = useState({
    page: 1,
    limit: 100,
  });
  const [list, setList] = useState([]); // 列表数据
  const [selectId, setSelectId] = useState(false);
  const [data, setData] = useState({}); // 商品数据

  useDidShow(() => {
    fetchGetList();
  });

  // 获取选择列表
  const fetchGetList = () => {
    fetchGoodsManageList(pages).then((res) => {
      const { communityCommonGoodsList: lists } = res;
      setList(lists);
    });
  };

  // 保存事件
  const handleSaveData = () => {
    navigatePostBack({ goodsData: data });
  };

  // 点击选中取消选中事件
  const handleOnSelect = (id) => {
    if (selectId === id) setSelectId(false);
    else setSelectId(id);
  };

  // 删除商品
  const fetchGoodsDel = (params) => {
    Taro.showModal({
      confirmText: "确定",
      confirmColor: "#07c0c2",
      title: "确定从商品库删除此商品吗？",
      content: "已经发布此商品的团购不受影响",
      success: function (res) {
        if (res.confirm) {
          fetchGoodsManageStoreDel(params).then(() => {
            toast("删除成功！");
            fetchGetList();
          });
        }
      },
    });
  };

  return (
    <View className="GoodsManageList_content">
      <Head></Head>
      {list.length ? (
        <View className="gm_group">
          {list.map((item) => {
            const {
              ownerId,
              communityCommonGoodsId: communityGoodsId,
              communityGoodsDescObject = {},
            } = item;
            return (
              <View
                className="gm_goods_cell"
                onClick={() => {
                  handleOnSelect(communityGoodsId);
                  setData(item);
                }}
              >
                <ImageShow
                  className="gm_goods_img dakale_nullImage"
                  width={120}
                  src={communityGoodsDescObject?.img?.split(",")[0] || [""]}
                ></ImageShow>
                <View className="gm_goods_info">
                  <View className="gm_goods_head">
                    <View className="gm_goods_name">{item.goodsName}</View>
                    {mode == "select" && (
                      <View
                        className={`gm_goods_select ${
                          selectId === communityGoodsId ? "select" : ""
                        }`}
                      ></View>
                    )}
                  </View>
                  <View className="gm_goods_num">
                    库存 {item.unlimitFlag == 0 ? "不限" : item.remain}
                  </View>
                  <View className="gm_goods_footer">
                    <View className="gm_goods_price">{item.price}</View>
                    <View className="gm_goods_btn">
                      <View
                        className={`gm_goods_tools`}
                        onClick={(e) => {
                          e.stopPropagation();
                          Router({
                            routerName: "goodsManageEdit",
                            args: { type: "edit", ownerId, communityGoodsId },
                          });
                        }}
                      >
                        编辑
                      </View>
                      <View
                        className={`gm_goods_tools`}
                        onClick={(e) => {
                          e.stopPropagation();
                          fetchGoodsDel({
                            ownerId,
                            communityCommonGoodsId: communityGoodsId,
                          });
                        }}
                      >
                        删除
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <View className="gm_goods_null">暂无商品，快去添加商品吧</View>
      )}
      {mode === "select" && (
        <FooterFixed>
          <Button
            className="submit"
            disabled={!selectId}
            onClick={handleSaveData}
          >
            确认选择
          </Button>
        </FooterFixed>
      )}
    </View>
  );
};
