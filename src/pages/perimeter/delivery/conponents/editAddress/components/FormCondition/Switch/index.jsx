import React from "react";
import { Switch } from "@tarojs/components";
import "../index.scss";

export default ({ name, value, onChange }) => {
  return (
    <Switch
      name={name}
      checked={Number(value)}
      color={"#07C0C2"}
      onChange={(e) => onChange(Number(e.detail.value))}
    />
  );
};
