import React, { useState, useEffect } from "react";
import { View, Image, Picker } from "@tarojs/components";
import right from "@/assets/image/form/right.png";
import "../index.scss";

export default ({
  name,
  value,
  list,
  listKey,
  disabled,
  placeholder,
  onChange,
}) => {
  const [selectValue, setSelectValue] = useState();

  useEffect(() => {
    setSelectValue(value);
  }, [value]);

  return (
    <>
      <View className={"form_cell_select_show"}>
        <Picker
          name={name}
          mode={"selector"}
          value={selectValue}
          range={list}
          rangeKey={listKey}
          className={`form_cell_input ${disabled ? "disabled" : ""}`}
          placeholderClass="form_cell_placeholder"
          disabled={disabled}
          onChange={(e) => setSelectValue(e.detail.value)}
        >
          <View class={list[selectValue] ? "" : "form_cell_placeholder"}>
            {list[selectValue] ? list[selectValue][listKey] : placeholder}
          </View>
        </Picker>
      </View>
      <Image src={right} className="form_i_right">
        {" "}
      </Image>
    </>
  );
};
