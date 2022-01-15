import React from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Confirm from "../Confirm";
import ClockInButton from "../ClockInButton";
import GetPrizeTip from "../GetPrizeTip";
import "./index.scss";

export default (props) => {
  const { visible = false, onClose } = props;

  return (
    <Confirm visible={visible} onClose={onClose}>
      <View className="quit_video">
        <View className="quit_video_tip">
          马上就要获得充值折扣机会了{"\n"}是否要确认离开？
        </View>
        <GetPrizeTip></GetPrizeTip>
        <View className="close_footer">
          <ClockInButton
            type="yellow"
            className="close_footer_btn"
            onClick={() => Taro.navigateBack()}
          >
            转身离开
          </ClockInButton>
          <ClockInButton
            type="yellow"
            className="close_footer_btn"
            onClick={onClose}
          >
            继续观看
          </ClockInButton>
        </View>
      </View>
    </Confirm>
  );
};
