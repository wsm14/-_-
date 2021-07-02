import React, { useState, useEffect } from "react";
import { Button, View } from "@tarojs/components";
import "./index.scss";
import { getShareInfo } from "@/server/user";
import { goDown } from "@/common/utils";
export default (props) => {
  const { userId, content, jumpObj } = props;
  const [data, setData] = useState({});
  useEffect(() => {
    getShareInfo({ userId }, (res) => {
      const { userInfo } = res;
      if (userInfo) {
        setData(userInfo);
      }
    });
  }, [userId]);
  return (
    <View>
      <View className="page_share_download">
        <View className="page_share_downloadBox">
          <View className="page_share_userDetails">
            <View
              className="page_share_profile"
              style={{
                background: `url(${data.profile}) no-repeat center/cover`,
              }}
            ></View>
            <View className="page_share_userBox">
              <View className="page_share_userName font_hide">
                {data.username}
              </View>
              <View className="page_share_userTitle">{content}</View>
            </View>
          </View>

        </View>
      </View>
      {/*<View className='page_share_openApp'>*/}
      {/*   <Button*/}
      {/*     appParameter={JSON.stringify({...jumpObj})}*/}
      {/*     openType='launchApp' onError={(e) =>this.goAppError(e)} className='page_share_btnStyle1'>App内打开</Button>*/}
      {/* </View>*/}
    </View>
  );
};
