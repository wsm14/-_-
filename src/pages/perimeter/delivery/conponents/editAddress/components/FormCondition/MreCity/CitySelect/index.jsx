import React, { useState } from "react";
import CityPicker from "../CityPicker";
import Poplayout from "./../../../Poplayout";

const CitySelect = ({
  value = null,
  onSubmit,
  show = false,
  onClose,
  cityFlag = true,
}) => {
  // 暂存数据
  const [saveData, setSaveData] = useState({});

  const popProps = {
    show,
    title: "所在城市",
  };

  return (
    <Poplayout
      {...popProps}
      height={586}
      overflow={true}
      onClose={() => onClose()}
      onSubmit={() => {
        const dataText = saveData.text;
        console.log(dataText, saveData);
        onSubmit(saveData);
        onClose();
      }}
    >
      {show && (
        <CityPicker
          cityFlag={cityFlag}
          inValue={value}
          onSelect={setSaveData}
        ></CityPicker>
      )}
    </Poplayout>
  );
};

export default CitySelect;
