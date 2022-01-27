import React, { useState } from "react";

import TaroShareDrawer from "./components/TaroShareDrawer";
import "./index.scss";
export default ({ close, cavansObj }) => {
  return (
    <TaroShareDrawer
      {...cavansObj}
      onSave={() => console.log("点击保存")}
      onClose={() => {
        close && close();
      }}
    ></TaroShareDrawer>
  );
};
