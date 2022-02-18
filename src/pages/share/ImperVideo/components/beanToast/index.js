/*到店打卡领豆视频领豆组件
 * show 显示或隐藏组件
 * data 外部导入数据
 * visible 外部关闭方法
 */
import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
export default (props) => {
  const { bean, visible, show = false } = props;
  const [animate, setAnimated] = useState(null);

  /* guideMomentFlag  为1时显示另外一套特殊携带商品样式，默认为0不管 */
  const animated = () => {
    let animateTem = Taro.createAnimation({
      duration: 10,
      timingFunction: "linear",
      delay: 0,
      transformOrigin: "50% 50%",
    });
    let animateTem1 = Taro.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0,
      transformOrigin: "50% 50%",
    });
    animateTem.scale(0, 0).step();
    setAnimated(animateTem.export());
    setTimeout(() => {
      animateTem1.scale(1, 1).step();
      setAnimated(animateTem1);
    }, 300);
  };

  /* 显示隐藏动画  */
  const onClose = () => {
    let animateTem2 = Taro.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0,
      transformOrigin: "50% 50%",
    });
    animateTem2.scale(0, 0).step();
    setAnimated(animateTem2);
    setTimeout(() => {
      visible();
    }, 300);
  };

  /* 关闭弹框  */

  useEffect(() => {
    if (show) {
      animated();
    }
  }, [show]);

  return (
    <View
      style={show ? { display: "flex" } : { display: "none" }}
      className="imper_bean public_center"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <View
        className="imper_bean_box"
        catchMove
        animation={animate}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <View className="imper_details_padding">
          <View className="color1 bold font32">恭喜您获得</View>
          <View className="font40 bold color3 bean_padding">{bean}卡豆</View>
          {/* className='getBean_btn' 这里有用做数据统计上报监听 不能删改 */}
          <View className="getBean_btn font32 color6" onClick={() => onClose()}>
            立即领取
          </View>
        </View>
      </View>
    </View>
  );
};
