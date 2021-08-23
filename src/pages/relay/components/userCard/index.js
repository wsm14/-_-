/*
 到点打卡,商户暂不支持到店打卡，请联系商户开通设置
*/
import React, { useMemo } from "react";
import { View, Text, Image } from "@tarojs/components";
import FormComponents from "../FormCondition";
import "./index.scss";
export default (props) => {
  const { list = [] } = props;
  const memo = useMemo(() => {
    return (
      <View>
        {list.map((item) => {
          return (
            <View className="user_card">
              <View className="user_card_user">
                <View className="user_card_userProfile">
                  <Image
                    className="user_card_image"
                    lazyLoad
                    mode={"aspectFill"}
                    src={
                      "https://wechat-config.dakale.net/miniprogram/relay/icon_1.png"
                    }
                  ></Image>
                </View>
                <View className="user_card_userTitle">
                  <View className="user_card_username">
                    西沙西沙西沙西沙西沙西西…
                  </View>
                  <View className="user_card_userTime">
                    7个月前 | 96人查看｜ 13次跟团{" "}
                  </View>
                </View>
              </View>
              <View className="user_card_liner"></View>
              <View className="user_card_shopBox">
                <View className="user_card_shopTitleInfo font_noHide">
                  优质生鲜搬运工，共享优质生鲜搬运工，共享优质原共享优质…
                </View>
                <View className="user_card_shopPrice font32">
                  <Text className="font20">¥ </Text>
                  892
                </View>
              </View>
              <View className="user_card_showImg">
                <View className="user_card_showImgBox"></View>
                <View className="user_card_showImgBox"></View>
                <View className="user_card_showImgBox"></View>
              </View>
              <View className="user_card_rankBox">
                <View className="user_card_rankleft font_hide">
                  <View className="user_card_ranknum">87</View>
                  <View className="user_card_rankProfile">
                    <Image
                      className="user_card_image"
                      lazyLoad
                      mode={"aspectFill"}
                      src={
                        "https://wechat-config.dakale.net/miniprogram/relay/icon_1.png"
                      }
                    ></Image>
                  </View>
                  <View className="user_card_rankName font_hide">
                    庄严庄严严…
                  </View>

                  <View className="user_card_rankTime">3个月前</View>
                </View>
                <View className="user_card_rankright font_hide">
                  <View className="user_card_buyName  font_hide">
                    现烤鱿鱼须鱼须须…
                  </View>
                  <View className="user_card_buyPrice">+4</View>
                </View>
              </View>
              <View className="user_card_gloupInfo">
                <View className="user_card_gloupStatus">正在跟团中</View>
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
