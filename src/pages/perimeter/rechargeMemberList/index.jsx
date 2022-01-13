import React, { useEffect, useState } from "react";
import { useDidShow, useShareAppMessage } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
// import Barrage from "@/components/componentView/active/barrage";
import Router from "@/utils/router";
import TaroShareDrawer from "./components/TaroShareDrawer";
import { fetchShareInfo, fetchRechargeMemberList } from "@/server/common";
import { rssConfigData } from "./components/data";
import "./index.scss";

const rechargeMember = () => {
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

  // useDidShow(() => {
  //   fetchGetList();
  // });

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
    fetchShareInfo(
      {
        shareType: "virtualProduct",
        subType: "telephone",
      },
      (res) => {
        setShareDeatils({
          cavansObj: {
            data: rssConfigData({
              wxCode: res.qcodeUrl,
              frontImage: res.backgroundImages,
            }),
          },
          shareData: res,
        });
      }
    );
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
    <View className="rechargeMember_box">
      <View className="rechargeMember_head">
        <View className="rechargeMember_i_share"></View>
      </View>
      <View className="rechargeMember_group">
        {listArr.map((item) => {
          const { key } = item;
          return (
            data[key] && (
              <View className="rechargeMember_cell" key={key}>
                <View className={`rechargeMember_cell_head ${key}`}>
                  <View className="rechargeMember_cell_rule">充值规则</View>
                </View>
                <View className="rechargeMember_cell_list">
                  {/* 会员列表 */}
                  {data[key]?.lsxdSubMemberItemList?.map((cell) => {
                    return (
                      <View
                        className="rechargeMember_list_cell"
                        key={cell.productNo}
                      >
                        <View
                          className="rechargeMember_cell_img"
                          style={{ backgroundImage: cell.image }}
                        ></View>
                        <View className="rechargeMember_cell_name">
                          {item.name}
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
      <View className="rechargeMember_footer">
        <Image
          src={
            "https://wechat-config.dakale.net/miniprogram/image/dkl_slogan.png"
          }
          className="rechargeMember_dkl_slogan"
        ></Image>
      </View>
      <TaroShareDrawer
        {...cavansObj}
        start={cavansShow}
        onSave={() => console.log("点击保存")}
        onClose={() => setCavansShow(false)}
      ></TaroShareDrawer>
    </View>
  );
};

export default rechargeMember;
