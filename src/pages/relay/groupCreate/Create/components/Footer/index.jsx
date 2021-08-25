import React, { useState } from "react";
import { View, Button } from "@tarojs/components";
import FooterFixed from "@/relay/components/FooterFixed";
import "./index.scss";

/**
 * 底部悬浮按钮容器
 */
export default ({}) => {
  const [tipShow, setTipShow] = useState(true);

  return (
    <View className="dakale_footer_block" onClick={(e) => e.stopPropagation()}>
      {tipShow && (
        <View className="dakale_footer_tip">
          <View className="dakale_footer_tip_text">查看新手教程，包教包会</View>
          <View className="dakale_footer_tip_extra">
            立即查看
            <View
              className="dakale_footer_tip_close"
              onClick={(e) => {
                e.stopPropagation();
                setTipShow(false);
              }}
            ></View>
          </View>
        </View>
      )}
      <FooterFixed>
        <Button formType="submit" className="submit">
          发布团购
        </Button>
      </FooterFixed>
    </View>
  );
};
