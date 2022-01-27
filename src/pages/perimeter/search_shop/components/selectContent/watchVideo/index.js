import React, { useEffect, useState } from "react";
import Waterfall from "@/components/waterfall";
import { View } from "@tarojs/components";
import Taro, { useReachBottom } from "@tarojs/taro";
import { searchList } from "@/components/public_ui/nearList";
import { getListUserMomentBySearch } from "@/server/perimeter";
const kolView = ({ keyword, current, store }) => {
  const [data, setData] = useState({
    page: 1,
    limit: 10,
  });
  const [list, setList] = useState([]);
  const [countStatus, setCountStatus] = useState(true);
  useEffect(() => {
    setData({
      page: 1,
      limit: 10,
      keyword: keyword,
    });
    setList([]);
  }, [keyword]);
  useEffect(() => {
    Kol();
  }, [data]);
  const Kol = () => {
    const { keyword } = data;
    if (keyword) {
      getListUserMomentBySearch(data, (res) => {
        const { userMomentsList } = res;
        if (userMomentsList && userMomentsList.length > 0) {
          setList([...list, ...userMomentsList]);
        } else {
          setCountStatus(false);
        }
      });
    }
  };
  useReachBottom(() => {
    if (countStatus && current == 2) {
      setData({
        ...data,
        page: data.page + 1,
      });
    }
  });
  return (
    <View style={current == 2 ? { display: "block" } : { display: "none" }}>
      <View className="flex_auto">
        {list.length > 0 ? (
          <View className="search_video">
            <Waterfall
              list={list.map((item) => ({ ...item, keyword }))}
              createDom={searchList}
              imgHight={"frontImageHeight"}
              imgWidth={"frontImageWidth"}
              setWidth={372}
              noMargin={{
                margin: "0",
              }}
              style={{ width: Taro.pxTransform(372) }}
              store={store}
            ></Waterfall>
          </View>
        ) : (
          <View className="search_shopNO">
            <View className="search_shopImg"></View>
            <View className="search_shopImgfont color2 font28">
              暂无找到想要的结果，换个关键词试试吧
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
export default kolView;
