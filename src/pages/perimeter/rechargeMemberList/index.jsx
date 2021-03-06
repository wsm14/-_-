import React, { useEffect, useState } from "react";
import router from "@/utils/router";
import { useRouter, useDidShow, useShareAppMessage } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { fetchShareInfo, fetchRechargeMemberList } from "@/server/common";
import { rssConfigData } from "./components/data";
import TaroShareDrawer from "../recharge/components/TaroShareDrawer";
import "./index.scss";

/**
 * identification - 风向标配置标识
 */
const rechargeMemberList = () => {
  const routeParams = useRouter().params;
  const { identification } = routeParams;

  const [shareDeatils, setShareDeatils] = useState({
    cavansObj: {},
    shareData: {},
  }); // 分享数据
  const [cavansShow, setCavansShow] = useState(false); // 分享绘图显示
  const [data, setData] = useState({}); // 数据

  const { cavansObj = {}, shareData = {} } = shareDeatils;

  useEffect(() => {
    fetchGetShareData(); // 获取分享图数据
  }, []);

  useDidShow(() => {
    fetchGetList();
  });

  useShareAppMessage((res) => {
    const { miniProgramUrl, backgroundImages, title } = shareData;
    const data = {
      title: title,
      imageUrl: backgroundImages,
      path: `/${miniProgramUrl}`,
    };
    if (res.from === "button") {
      return data;
    } else {
      return data;
    }
  });

  const fetchGetList = () => {
    fetchRechargeMemberList().then((res) => {
      setData(res);
    });
  };

  // 获取分享参数
  const fetchGetShareData = () => {
    fetchShareInfo({
      shareType: "virtualProduct",
      subType: "member",
      needHyaline: 1,
    }).then((res) => {
      setShareDeatils({
        cavansObj: {
          data: rssConfigData({
            wxCode: res.qcodeUrl,
            frontImage: res.backgroundImages,
          }),
        },
        shareData: res,
      });
    });
  };

  const shareImageInfo = () => {
    const { backgroundImages, miniProgramUrl, qcodeUrl } = shareData;
    if (backgroundImages && miniProgramUrl && qcodeUrl) {
      setCavansShow(true);
    }
  };

  // 列表渲染
  const listArr = [
    {
      rule: "",
      key: "video",
    },
    {
      rule: "",
      key: "music",
    },
    {
      rule: "",
      key: "choice",
    },
  ];

  return (
    <View className="rechargeMemberList_box">
      <View className="rechargeMemberList_head">
        {/* 分享按钮 */}
        <View
          className="rechargeMemberList_i_share"
          onClick={shareImageInfo}
        ></View>
      </View>
      <View className="rechargeMemberList_group">
        {listArr.map((item) => {
          const { key } = item;
          return (
            data[key] && (
              <View className="rechargeMemberList_cell" key={key}>
                <View className={`rechargeMemberList_cell_head ${key}`}>
                  <View
                    className="rechargeMemberList_cell_rule"
                    onClick={() => {
                      router({
                        routerName: "webView",
                        args: {
                          link: "https://resource-new.dakale.net/product/html/rule/ab5c5286-b9a4-459a-9682-29969c129668.html?newPage=true&shareKey=1481501671906394114&showTitle=true",
                        },
                      });
                    }}
                  >
                    充值规则
                  </View>
                </View>
                <View className="rechargeMemberList_cell_list">
                  {/* 会员列表 */}
                  {data[key].map((cell, index) => {
                    return (
                      <View
                        key={`${cell.image}${index}`}
                        className="rechargeMemberList_list_cell"
                        onClick={() => {
                          router({
                            routerName: "rechargeMember",
                            args: {
                              type: cell.type,
                              identification,
                            },
                          });
                        }}
                      >
                        <Image
                          src={cell.image}
                          className="rechargeMemberList_cell_img"
                        ></Image>
                        <View className="rechargeMemberList_cell_name">
                          {cell.name}
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )
          );
        })}
      </View>
      <View className="rechargeMemberList_footer dkl_slogan"></View>
      <TaroShareDrawer
        {...cavansObj}
        start={cavansShow}
        onSave={() => console.log("点击保存")}
        onClose={() => setCavansShow(false)}
      ></TaroShareDrawer>
    </View>
  );
};

export default rechargeMemberList;
