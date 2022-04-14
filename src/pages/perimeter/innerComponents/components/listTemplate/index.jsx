import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import { backgroundObj } from "@/utils/utils";
import Taro from "@tarojs/taro";
import Waterfall from "@/components/waterfall";
import Banner from "@/components/banner";
import { templateNewShop } from "@/components/public_ui/newGoodsObj";
import { fetchBanner } from "@/server/common";
import "./index.scss";
export default ({ data, identification, configUserLevelInfo, list }) => {
  const { contentInfo } = data;
  const { topImg, image } = contentInfo;
  const [bannerList, setBannerList] = useState([]);
  useEffect(() => {
    fetchBanner({ bannerType: "listTemplates" }).then((res) => {
      const { bannerList } = res;
      setBannerList(bannerList);
    });
  }, []);
  return (
    <View className="listTemplate_box">
      <View
        className="listTemplate_banner"
        style={backgroundObj(topImg)}
      ></View>
      <View className="listTemplate_body">
        {bannerList.length > 0 && (
          <View className="brandImg_box">
            <Banner
              boxStyle={{ width: "100%", height: "100%" }}
              imgName="coverImg"
              data={bannerList}
              showNear
            ></Banner>
          </View>
        )}

        <Waterfall
          noMargin={{ margin: 0 }}
          list={list}
          createDom={(item) =>
            templateNewShop(item, configUserLevelInfo, identification)
          }
          setWidth={335}
          style={{ width: Taro.pxTransform(335) }}
        ></Waterfall>
      </View>
      <View className="dakale_logo">
        <View className="dakale_logo_image"></View>
      </View>
    </View>
  );
};
