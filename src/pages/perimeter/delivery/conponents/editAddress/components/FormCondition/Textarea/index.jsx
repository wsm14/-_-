import React, { useState, useEffect } from "react";
import { View, Textarea } from "@tarojs/components";
import "../index.scss";

export default ({
  name,
  value,
  maxLength,
  disabled,
  onInput,
  onBlur,
  onConfirm,
  placeholder,
  TextareaClassName,
  TextExirt,
  className,
  placeholderClass,
  disableDefaultPadding,
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
      <View className={!className ? "form_cell_content_textarea" : className}>
        {maxLength && (
          <View className="form_cell_content_textarea_tip">{dataNum}</View>
        )}
        <Textarea
          name={name}
          autoHeight
          value={data}
          disabled={disabled}
          className={
            !TextareaClassName ? "form_cell_textarea" : TextareaClassName
          }
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
          onBlur={(e) => {
            onBlur && onBlur(e.detail.value);
          }}
          onConfirm={(e) => {
            onConfirm && onConfirm(e.detail.value);
          }}
        ></Textarea>
        {TextExirt && TextExirt()}
      </View>
    </View>
  );
};
