import React from "react";
import { View, Text, Image } from "@tarojs/components";
import right from "@/assets/image/form/right.png";
import "../index.scss";

export default ({ value, placeholder, disabled, onClick, extra, style }) => {
  return (
    <View
      className="form_cell_Text"
      onClick={(e) => !disabled && onClick && onClick(e)}
    >
      <View style={style} className={"form_cell_select_show"}>
        <Text
          className={`form_cell_input ${
            value && !disabled ? "" : "form_cell_placeholder"
          }`}
        >
          {value || placeholder}
        </Text>
      </View>
      {!disabled && onClick && (
        <Image src={right} className="form_i_right"></Image>
      )}
    </View>
  );
};
