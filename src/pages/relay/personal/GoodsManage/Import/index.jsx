import React, { useState, useEffect } from "react";
import Taro, { useReachBottom } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import { toast } from "@/common/utils";
import {
  fetchGoodsManageNotList,
  fetchGoodsManageStoreImport,
} from "@/server/relay";
import ImageShow from "@/relay/components/ImageShow";
import FooterFixed from "@/relay/components/FooterFixed";
import "./index.scss";

/**
 * 商品库
 */
export default () => {
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
  const handleSaveData = (e) => {
    e.stopPropagation();
    fetchGoodsManageStoreImport({
      communityOrganizationGoodsId: selectId,
    }).then(() => {
      toast("导入成功！");
      setTimeout(() => {
        // 最后一个直接返回上一页
        if (list.length === 1) {
          Taro.navigateBack({ delta: 1 });
          return;
        }
        setPages(() => {
          setList([]);
          return { ...pages, page: 1 };
        });
      }, 1000); //延迟1秒
    });
  };

  return (
    <View className="GoodsManageList_content">
      {list.length ? (
        <View className="gm_group">
          {list.map((item) => (
            <View
              className="gm_goods_cell"
              onClick={() => setSelectId(item.communityOrganizationGoodsId)}
            >
              <ImageShow
                className="gm_goods_img dakale_nullImage"
                width={120}
                src={item?.communityGoodsDescObject?.img?.split(",")[0] || [""]}
              ></ImageShow>
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
      ) : (
        <View className="gm_goods_null">暂无商品，快去添加商品吧</View>
      )}
      <FooterFixed>
        <Button className="submit" onClick={handleSaveData}>
          确认导入
        </Button>
      </FooterFixed>
    </View>
  );
};
