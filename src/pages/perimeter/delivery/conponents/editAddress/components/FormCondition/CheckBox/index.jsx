import React from "react";
import { Checkbox, CheckboxGroup, Label } from "@tarojs/components";
import "../index.scss";

/** []
 *  {
      value: "11",
      text: "美国",
    },
    {
      value: "22",
      text: "中国",
    },
 */
export default ({
  name,
  list = [],
  disabled,
  fieldNames = {},
  value = [],
  onChange,
}) => {
  const { label = "label", key = "value" } = fieldNames;

  // 遍历对象
  const arrObject = (obj) => {
    return Object.keys(obj).map((item) => ({
      label: obj[item],
      value: `${item}`,
      checked: value.includes(item),
    }));
  };

  let selectList = [];
  if (Array.isArray(list)) {
    if (fieldNames.label) {
      selectList = list.map((item) => ({
        label: item[label],
        value: `${item[key]}`,
        checked: value.includes(item[key]),
      }));
    } else
      selectList = list.map((item, index) => ({
        label: item,
        value: `${index}`,
        checked: value.includes(index),
      }));
  } else {
    // 若为对象则将遍历成数组赋值
    selectList = arrObject(list);
  }

  return (
    <CheckboxGroup
      name={name}
      onChange={(e) => onChange && onChange(e.detail.value)}
    >
      {selectList.map((item, i) => {
        return (
          <Label for={i} key={i} className="radio_item">
            <Checkbox
              disabled={disabled}
              value={item.value}
              checked={item.checked}
              className={`dakale_radio`}
              color="#ffffff"
            >
              {item.label}
            </Checkbox>
          </Label>
        );
      })}
    </CheckboxGroup>
  );
};
