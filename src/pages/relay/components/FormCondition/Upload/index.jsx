import React, { useState, useEffect } from "react";
import ImagePicker from "./Upload";
import { View } from "@tarojs/components";
import "../index.scss";

export default ({ value = [], disabled, count, onChange }) => {
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (value && value.length) {
      const newArr = Array.isArray(value) ? value : value.split(",");
      setFileList(newArr || []);
      onChange && onChange(newArr || []);
    }
  }, [value]);

  return (
    <View className={`form_cell_upload ${disabled ? "noRemoveFile" : ""}`}>
      <ImagePicker
        data={fileList}
        count={count}
        onChange={(file) => {
          return setTimeout(() => {
            onChange(file.slice(0, count || 9));
            setFileList(file.slice(0, count || 9));
          }, 1);
        }}
      />
    </View>
  );
};
