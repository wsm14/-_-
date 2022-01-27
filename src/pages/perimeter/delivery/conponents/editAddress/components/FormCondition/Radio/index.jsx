import React from "react";
import { Radio, RadioGroup, Label } from "@tarojs/components";
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
  value,
  onChange,
}) => {
  const { label = "label", key = "value" } = fieldNames;

  // 遍历对象
  const arrObject = (obj) => {
    return Object.keys(obj).map((item) => ({
      label: obj[item],
      value: `${item}`,
      checked: item == value,
    }));
  };

  let selectList = [];
  if (Array.isArray(list)) {
    if (fieldNames.label) {
      selectList = list.map((item) => ({
        label: item[label],
        value: `${item[key]}`,
        checked: item[key] == value,
      }));
    } else
      selectList = list.map((item, index) => ({
        label: item,
        value: `${index}`,
        checked: index == value,
      }));
  } else {
    // 若为对象则将遍历成数组赋值
    selectList = arrObject(list);
  }

  return (
    <RadioGroup
      name={name}
      onChange={(e) => onChange && onChange(e.detail.value)}
    >
      {selectList.map((item, i) => {
        return (
          <Label for={i} key={i} className="radio_item">
            <Radio
              disabled={disabled}
              value={item.value}
              checked={item.checked}
              className={`dakale_radio`}
            >
              {item.label}
            </Radio>
          </Label>
        );
      })}
    </RadioGroup>
  );
};
