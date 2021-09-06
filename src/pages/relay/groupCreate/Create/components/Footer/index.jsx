import React from "react";
import { View, Button } from "@tarojs/components";
import FooterFixed from "@/relay/components/FooterFixed";
import "./index.scss";

/**
 * 底部悬浮按钮容器
 */
export default ({}) => {
  return (
    <View className="dakale_footer_block" onClick={(e) => e.stopPropagation()}>
      <FooterFixed>
        <Button formType="submit" className="submit">
          发布团购
        </Button>
      </FooterFixed>
    </View>
  );
};
