import React, { useMemo, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import { fakeSubscribe } from "@/server/relay";
export default (props) => {
  const { data, shareInfo, reload } = props;
  const {
    username,
    userProfile,
    subscribeFlag = "1",
    teamCount = 0,
    consumeCount = 0,
    organizationCount,
    profile,
    ownerId,
  } = data;
  return (
    <View className="groupUser_card">
      <View className="groupUser_card_user">
        <View className="groupUser_card_userProfile">
          <Image
            className="groupUser_card_image groupUser_card_radius"
            lazyLoad
            mode={"aspectFill"}
            src={profile}
          ></Image>
        </View>
        <View className="groupUser_card_userTitle">
          <View className="groupUser_card_usernameInfo">
            <View className="groupUser_card_username">{username}</View>
            {subscribeFlag === "0" ? (
              <View
                className="groupUser_card_btn public_center"
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
            ) : (
              <View
                className="groupUser_card_nobtn public_center"
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
          <View className="groupUser_card_userTime">
            成员{teamCount}
            {teamCount > 100 && "+"}｜跟团人次{organizationCount}
            {organizationCount > 100 && "+"}
          </View>
        </View>
      </View>
    </View>
  );
};
