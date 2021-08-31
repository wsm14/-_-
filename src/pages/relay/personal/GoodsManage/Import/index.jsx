import React, { useState, useEffect } from "react";
import { useReachBottom } from "@tarojs/taro";
import { navigatePostBack } from "@/relay/common/hooks";
import { View, Button } from "@tarojs/components";
import { fetchGoodsManageNotList } from "@/server/relay";
import FooterFixed from "@/relay/components/FooterFixed";
import "./index.scss";

/**
 * 商品库
 */
export default () => {
  // 路由获取参数

  // 请求参数
  const [pages, setPages] = useState({
    page: 1,
    limit: 10,
  });
  const [list, setList] = useState([]); // 列表数据
  const [selectId, setSelectId] = useState("");

  useEffect(() => {
    fetchGetList();
  }, [pages]);

  // 上拉加载
  useReachBottom(() => {
    setPages({ ...pages, page: pages.page + 1 });
  });

  // 获取选择列表
  const fetchGetList = () => {
    fetchGoodsManageNotList(pages).then((res) => {
      const { communityOrganizationGoodsList: lists } = res;
      setList((old) => [...old, ...lists]);
    });
  };

  // 保存事件
  const handleSaveData = () => {
    navigatePostBack({ liftingCabinets: selectId });
  };

  return (
    <View className="GoodsManageList_content">
      <View className="gm_group">
        {list.map((item) => (
          <View
            className="gm_goods_cell"
            onClick={() => setSelectId(item.communityOrganizationGoodsId)}
          >
            <View className="gm_goods_img"></View>
            <View className="gm_goods_info">
              <View className="gm_goods_head">
                <View className="gm_goods_name">{item.goodsName}</View>
                <View
                  className={`gm_goods_select ${
                    selectId === item.communityOrganizationGoodsId
                      ? "select"
                      : ""
                  }`}
                ></View>
              </View>
              <View className="gm_goods_num">库存 {item.remain || 0}</View>
              <View className="gm_goods_footer">
                <View className="gm_goods_price">{item.price}</View>
              </View>
            </View>
          </View>
        ))}
      </View>
      <FooterFixed>
        <Button className="submit">确认导入</Button>
      </FooterFixed>
    </View>
  );
};
