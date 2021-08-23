import React, { useState, useEffect } from "react";
import { View, Input } from "@tarojs/components";
import "../index.scss";

export default ({
  name,
  value,
  maxLength,
  type,
  placeholder,
  disabled,
  style,
  onInput,
  onBlur,
  suffix,
  className = "",
}) => {
  const [placeholderShow, setPlaceholderShow] = useState(true); // placeholder是否显示问题
  const [data, setData] = useState("");

  useEffect(() => {
    setData(value);
    setPlaceholderShow(!value);
  }, [value]);

  return (
    <>
      <Input
        name={name}
        value={data}
        maxlength={maxLength}
        type={type == "number" || type == "digit" ? type : "text"}
        placeholder={placeholderShow ? placeholder : ""}
        className={`form_cell_input ${disabled ? "disabled" : ""} ${className}`}
        placeholderClass="form_cell_placeholder"
        disabled={disabled}
        style={style}
        onBlur={(e) => {
          setData(e.detail.value);
          setPlaceholderShow(!e.detail.value);
          onBlur && onBlur(e);
        }}
        onInput={(e) => {
          if (onInput) {
            setData(e.detail.value);
            onInput(e.detail.value);
          }
        }}
        onFocus={() => setPlaceholderShow(false)}
      ></Input>
      {suffix && <View className={`input_suffix`}>{suffix}</View>}
    </>
  );
};
