import React, { useState, useEffect } from "react";
import { View, Textarea } from "@tarojs/components";
import "../index.scss";

export default ({
  name,
  value,
  maxLength,
  disabled,
  onInput,
  className,
  bodyClassName,
  placeholderClass,
  disableDefaultPadding,
  placeholder,
}) => {
  // 字数计算
  const [totalNum, setTotalNum] = useState(null);
  const [data, setData] = useState(data);

  useEffect(() => {
    setData(value);
  }, [value]);

  const dataNum =
    maxLength &&
    `${totalNum || (value && `${value}`.length) || 0}/${maxLength}`;

  return (
    <View className="form_cell_textarea_block">
      <View className={`form_cell_content_textarea ${bodyClassName}`}>
        {maxLength && (
          <View className="form_cell_content_textarea_tip">{dataNum}</View>
        )}
        <Textarea
          name={name}
          autoHeight
          value={data}
          disabled={disabled}
          className={`form_cell_textarea ${className}`}
          placeholderClass={`form_cell_textarea_placeholder ${placeholderClass}`}
          adjustPosition
          disableDefaultPadding={disableDefaultPadding}
          maxlength={maxLength}
          placeholder={placeholder}
          onInput={(e) => {
            setData(e.detail.value);
            setTotalNum(e.detail.value.length);
            onInput && onInput(e.detail.value);
          }}
        ></Textarea>
      </View>
    </View>
  );
};
