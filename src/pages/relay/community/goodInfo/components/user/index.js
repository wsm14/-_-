import React, { useMemo, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import { fakeSubscribe } from "@/server/relay";
import { toast } from "@/common/utils";
export default (props) => {
  const { data, shareInfo, reload } = props;
  const {
    userName,
    userProfile,
    subscribeFlag,
    teamCount = 0,
    consumeCount = 0,
    ownerId,
  } = data;
  return (
    <View className="community_card">
      <View className="community_card_user">
        <View className="community_card_userProfile">
          <Image
            className="community_card_image community_card_radius"
            lazyLoad
            mode={"aspectFill"}
            src={userProfile}
          ></Image>
        </View>
        <View className="community_card_userTitle">
          <View className="community_card_usernameInfo">
            <View className="community_card_username font_hide">
              {userName}
            </View>
            {subscribeFlag && subscribeFlag === "0" && (
              <View
                className="community_card_btn public_center"
                onClick={(e) => {
                  e.stopPropagation();
                  fakeSubscribe({
                    teamUserId: ownerId,
                  }).then((val) => {
                    reload();
                  });
                }}
              >
                + 订阅
              </View>
            )}
            {subscribeFlag && subscribeFlag === "1" && (
              <View
                className="community_card_nobtn public_center"
                onClick={(e) => {
                  e.stopPropagation();
                  fakeSubscribe({
                    teamUserId: ownerId,
                  }).then((val) => {
                    reload();
                  });
                }}
              >
                已订阅{" "}
              </View>
            )}
          </View>
          <View className="community_card_userTime">
            成员{teamCount}
            {teamCount > 100 && "+"}｜跟团人次{consumeCount}
            {consumeCount > 100 && "+"}
          </View>
        </View>
        <View
          className="community_card_share"
          onClick={() => shareInfo()}
        ></View>
      </View>
    </View>
  );
};
