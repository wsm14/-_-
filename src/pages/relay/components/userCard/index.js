import React, { useMemo } from "react";
import { View, Text, Image } from "@tarojs/components";
import { filterStrList } from "@/common/utils";
import Router from "@/common/router";
import "./index.scss";
export default (props) => {
  const templateTitle = {
    notStarted: <View className="user_card_gloupStatus">一群人正赶来跟团</View>,
    start: <View className="user_card_gloupStatus">正在跟团中</View>,
    end: <View className="user_card_gloupStatus">已结束</View>,
  };

  const { list = [] } = props;
  const memo = useMemo(() => {
    return (
      <View>
        {list.map((item) => {
          const {
            communityOrganizationId,
            ownerId,
            ownerProfile,
            ownerName,
            createTime,
            viewCount,
            buyCount,
            title,
            price,
            communityImages,
            consumerRecordList = [],
            communityStatus,
          } = item;
          return (
            <View
              onClick={(e) => {
                e.stopPropagation();
                Router({
                  routerName: "communityGoods",
                  args: {
                    ownerId,
                    communityOrganizationId,
                  },
                });
              }}
              className="user_card"
            >
              <View className="user_card_user">
                <View className="user_card_userProfile">
                  <Image
                    className="user_card_image user_card_radius"
                    lazyLoad
                    mode={"aspectFill"}
                    src={ownerProfile}
                  ></Image>
                </View>
                <View className="user_card_userTitle">
                  <View className="user_card_username">{ownerName}</View>
                  <View className="user_card_userTime">
                    {createTime} {viewCount !== 0 && `| ${viewCount}人查看`}
                    {buyCount !== 0 && `｜${buyCount}次跟团`}
                  </View>
                </View>
              </View>
              <View className="user_card_liner"></View>
              <View className="user_card_shopBox">
                <View className="user_card_shopTitleInfo font_noHide">
                  {title}
                </View>
                <View className="user_card_shopPrice font32">
                  <Text className="font20">¥ </Text>
                  {price}
                </View>
              </View>
              {communityImages.length !== 0 && (
                <View className="user_card_showImg">
                  {filterStrList(communityImages).map((val) => {
                    return (
                      <View className="user_card_showImgBox">
                        <Image
                          className="user_card_image"
                          lazyLoad
                          mode={"aspectFill"}
                          src={val}
                        ></Image>
                      </View>
                    );
                  })}
                </View>
              )}
              {consumerRecordList.length > 0 &&
                consumerRecordList.map((val = {}, index) => {
                  const { profile, userName, payTime, goodsInfo, goodsCount } =
                    val;
                  return (
                    <View className="user_card_rankBox">
                      <View className="user_card_rankleft font_hide">
                        <View className="user_card_ranknum">{index}</View>
                        <View className="user_card_rankProfile user_card_radius">
                          <Image
                            className="user_card_image"
                            lazyLoad
                            mode={"aspectFill"}
                            src={profile}
                          ></Image>
                        </View>
                        <View className="user_card_rankName font_hide">
                          {userName}
                        </View>

                        <View className="user_card_rankTime">{payTime}</View>
                      </View>
                      <View className="user_card_rankright font_hide">
                        <View className="user_card_buyName  font_hide">
                          {goodsInfo}
                        </View>
                        <View className="user_card_buyPrice">{goodsCount}</View>
                      </View>
                    </View>
                  );
                })}

              <View className="user_card_gloupInfo">
                {templateTitle[communityStatus]}
                <View className="user_card_gloupbtn"></View>
              </View>
              <View className="user_card_btn"></View>
            </View>
          );
        })}
      </View>
    );
  }, [list]);
  return memo;
};
