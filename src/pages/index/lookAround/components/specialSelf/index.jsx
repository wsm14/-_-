import React, { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import Taro, { render, useDidShow, useReachBottom } from "@tarojs/taro";
import Router from "@/utils/router";
import { fetchSpecialGoods } from "@/server/index";
import Waterfall from "@/components/waterfall";
import { fetchSelfTourGoods, fetchCommerceGoods } from "@/server/perimeter";
import {
  templateActive,
  template,
  templateGame,
} from "@/components/public_ui/newGoodsObj";
import "./index.scss";
export default ({ userInfo, type = "specalSelf" }) => {
  const renderObj = {
    specalSelf: [
      { key: "周边特惠", val: 0 },
      { key: "周边游玩", val: 1 },
      { key: "精选好物", val: 2 },
    ],
    commerceSelf: [
      { key: "周边游玩", val: 0 },
      { key: "精选好物", val: 1 },
    ],
  }[type];
  const [index, setIndex] = useState(0);
  const [list, setList] = useState([]);
  const [page, setPage] = useState({
    page: 1,
    limit: 10,
    specialFilterType: "aroundSpecial",
  });
  useEffect(() => {
    if (type === "specalSelf") {
      if (index === 0) {
        fetchSpecial();
      } else if (index === 1) {
        fetchSelfTour();
      } else if (index === 2) {
        fetchCommerce();
      }
    } else {
      if (index === 0) {
        fetchSelfTour();
      } else if (index === 1) {
        fetchCommerce();
      }
    }
  }, [page]);
  useReachBottom(() => {
    if (type === "specalSelf" && index === 0) {
      setPage({
        ...page,
        page: page.page + 1,
      });
    }
  });
  const fetchCommerce = () => {
    fetchCommerceGoods({ ...page }).then((val) => {
      const { specialGoodsList } = val;
      setList([...list, ...specialGoodsList]);
    });
  };
  const fetchSelfTour = () => {
    fetchSelfTourGoods({ ...page }).then((val) => {
      const { selfTourGoodList } = val;
      setList([...list, ...selfTourGoodList]);
    });
  };
  const fetchSpecial = () => {
    fetchSpecialGoods({ ...page, specialFilterType: "aroundSpecial" }).then(
      (val) => {
        const { specialGoodsList } = val;
        setList([...list, ...specialGoodsList]);
      }
    );
  };

  const selectIndex = (val) => {
    if (index === val) {
      return;
    } else {
      setIndex(() => {
        setPage(() => {
          setList([]);
          return {
            page: 1,
            limit: 10,
          };
        });
        return val;
      });
    }
  };
  const templateObj = {
    0: template,
    1: templateGame,
    2: templateActive,
  }[index];
  const templateObj1 = {
    0: templateGame,
    1: templateActive,
  }[index];
  return (
    <>
      <View className="specialSelf_liner"></View>
      <View className="specialSelf_box">
        <View
          className={
            type === "specalSelf"
              ? "specialSelf_perimeter"
              : "specialSelf_commer"
          }
        >
          {renderObj.map((val, current) => {
            return (
              <View
                onClick={() => {
                  selectIndex(val.val);
                }}
                className={
                  current === index
                    ? "specialSelf_select"
                    : "specialSelf_noSelect"
                }
              >
                {val.key}
              </View>
            );
          })}
        </View>
      </View>
      <View className="specialSelf_render">
        <Waterfall
          list={list}
          createDom={
            type === "specalSelf"
              ? (item) => templateObj(item, userInfo)
              : (item) => templateObj1(item, userInfo)
          }
          style={{ width: Taro.pxTransform(335) }}
        ></Waterfall>
      </View>
    </>
  );
};
// 头部卡豆显示区域
