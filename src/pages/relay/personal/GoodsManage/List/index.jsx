import React, { useState } from "react";
import { useRouter, useDidShow, useReachBottom } from "@tarojs/taro";
import Router from "@/common/router";
import { navigatePostBack } from "@/relay/common/hooks";
import { View } from "@tarojs/components";
import { fetchGoodsManageList } from "@/server/relay";
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
  const { mode = "list", liftingCabinets } = routeParams;

  // 请求参数
  const [pages, setPages] = useState({
    page: 1,
    limit: 100,
  });
  const [list, setList] = useState([]); // 列表数据
  const [selectId, setSelectId] = useState([]);

  useDidShow(() => {
    fetchGetList();
    setSelectId(liftingCabinets ? liftingCabinets.split(",") : []);
  });

  // 上拉加载
  useReachBottom(() => {
    setPages({ ...pages, page: pages.page + 1 });
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
    navigatePostBack({ liftingCabinets: selectId });
  };

  // 点击选中取消选中事件
  const handleOnSelect = (id) => {
    if (selectId.includes(id)) setSelectId(selectId.filter((i) => i !== id));
    else setSelectId([...selectId, id]);
  };

  return (
    <View className="GoodsManageList_content">
      <Head></Head>
      {list.length ? (
        <View className="gm_group">
          {list.map((item) => {
            const { ownerId, communityCommonGoodsId: communityGoodsId } = item;
            return (
              <View
                className="gm_goods_cell"
                onClick={() => handleOnSelect(item.communityGoodsId)}
              >
                <ImageShow
                  className="gm_goods_img dakale_nullImage"
                  width={120}
                  src={
                    item?.communityGoodsDescObject?.img?.split(",")[0] || [""]
                  }
                ></ImageShow>
                <View className="gm_goods_info">
                  <View className="gm_goods_head">
                    <View className="gm_goods_name">{item.goodsName}</View>
                    <View
                      className={`gm_goods_select ${
                        selectId.includes(communityGoodsId) ? "select" : ""
                      }`}
                    ></View>
                  </View>
                  <View className="gm_goods_num">库存 {item.remain || 0}</View>
                  <View className="gm_goods_footer">
                    <View className="gm_goods_price">{item.costPrice}</View>
                    <View className="gm_goods_btn">
                      <View
                        className={`gm_goods_tools`}
                        onClick={() =>
                          Router({
                            routerName: "goodsManageEdit",
                            args: { type: "edit", ownerId, communityGoodsId },
                          })
                        }
                      >
                        编辑
                      </View>
                      <View className={`gm_goods_tools`} onClick={() => {}}>
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
    </View>
  );
};
