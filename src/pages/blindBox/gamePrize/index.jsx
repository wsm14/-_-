import React, { useEffect, useState } from "react";
import Router from "@/utils/router";
import Taro, {
  useReachBottom,
  usePullDownRefresh,
  useRouter,
} from "@tarojs/taro";
import { View } from "@tarojs/components";
import { usePostBackData } from "@/utils/utils";
import {
  fetchGetMyPrizeRecord,
  fetchGetPackagePrize,
  fetchGetOnlinePackagePrize,
} from "@/server/blindBox";
import { toast } from "@/utils/utils";
import PrizeCell from "./components/PrizeCell";
import Empty from "@/components/Empty";
import "./index.scss";

/**
 * 我的奖品
 */
const MyPrize = () => {
  const [list, setList] = useState([]); // 数据
  const [page, setPages] = useState(1); // 请求参数
  const { channel = "gameSign" } = useRouter().params;
  useEffect(() => {
    fetchGetRecord();
  }, [page]);

  // 下拉刷新
  usePullDownRefresh(() => {
    if (page == 1) {
      fetchGetRecord();
      return;
    }
    getNewData();
  });

  // 上拉加载
  useReachBottom(() => {
    setPages(page + 1);
  });

  usePostBackData((data) => {
    const { userAddressId, userPackageId } = data;
    fetchGetOnlinePrize(userAddressId, userPackageId);
  });

  // 获取新数据
  const getNewData = () => {
    if (page == 1) {
      fetchGetRecord();
      return;
    }
    setPages(() => {
      setList([]);
      return 1;
    });
  };

  // 获取数据
  const fetchGetRecord = () => {
    if (page === 1) setList([]);
    fetchGetMyPrizeRecord({
      channel,
      limit: 10,
      page,
    })
      .then((res) => {
        const { packageList = [] } = res;
        setList((old) => [...old, ...packageList]);
      })
      .finally(() => {
        Taro.stopPullDownRefresh(); // 停止刷新
      });
  };

  // 领取电商品
  const fetchGetOnlinePrize = (userAddressId, userPackageId) => {
    if (!userAddressId) return;
    fetchGetOnlinePackagePrize({ userAddressId, userPackageId })
      .then(() => {
        toast("领取成功");
      })
      .then(() => {
        getNewData();
      });
  };

  // 领取实物商品
  const fetchGetPrize = (userPackageId) => {
    fetchGetPackagePrize({ userPackageId })
      .then(() => {
        toast("领取成功");
      })
      .then(() => {
        fetchGetRecord();
      });
  };

  /**
   * @param {String} status 0-等待用户操作 1-用户已填写地址 2-已完成
   * @param {String} packageType onlineGoods -电商品 actualGoods-实物商品
   * @param {String} logisticsInfo 物流信息 电商品独有
   */
  const btnProps = (item) => {
    const {
      status = 2,
      packageType = "onlineGoods",
      userPackageId,
      logisticsInfo,
    } = item;
    const props = {
      onlineGoods: {
        0: {
          tip: "填写地址包邮到家",
          text: "填写地址",
          onClick: () =>
            Router({
              routerName: "delivery",
              args: { mode: "select", userPackageId, selectIndex: -1 },
            }),
        }, // 0-等待用户操作
        1: { tip: "等待平台发货", text: "待发货" }, // 1-用户已填写地址
        2: { tip: logisticsInfo, text: "已完成" }, // 2-已完成
      }[status],
      actualGoods: {
        0: { text: "立即领取", onClick: () => fetchGetPrize(userPackageId) }, // 0-等待用户操作
        2: { text: "已领取" }, // 2-已完成
      }[status],
    }[packageType];

    const { tip = "", ...ohter } = props;

    return {
      tip,
      buttonProps: { disabled: status != 0, ...(ohter || {}) },
    };
  };

  return (
    <View className="MyPrize_content">
      <Empty show={!list.length} toast="暂无奖品记录"></Empty>
      {list.map((item) => (
        <PrizeCell
          name={item.packageName}
          img={item.packageImg}
          time={item.createTime}
          cellType={item.packageName}
          {...btnProps(item)}
        ></PrizeCell>
      ))}
    </View>
  );
};

export default MyPrize;
