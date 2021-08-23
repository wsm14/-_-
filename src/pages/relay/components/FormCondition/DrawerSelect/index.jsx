import React from "react";
import { View, Radio, RadioGroup } from "@tarojs/components";
import Drawer from "../../Drawer";
import "./index.scss";

const DrawerSelect = ({
  data = null,
  dataList,
  onSubmit,
  popShow = false,
  fieldNames = {},
  onClose,
}) => {
  const { label = "label", value = "value" } = fieldNames;

  // 点击选择框回调
  const handleClickCheck = (data) => {
    const dataObj = dataList.filter((i) => i[value] == data)[0];
    onClose(false);
    onSubmit(dataObj);
  };

  return (
    <Drawer show={popShow} width={450} onClose={() => onClose(false)}>
      <View className="tradeView_Block">
        <View className="tagCheck_item_check">
          <RadioGroup onChange={(e) => handleClickCheck(e.detail.value)}>
            {dataList.map((citem, i) => {
              return (
                <Radio
                  key={citem[value]}
                  value={citem[value]}
                  className={"tagCheck_check_edit_base"}
                  checked={data == citem[label]}
                >
                  {citem[label]}
                </Radio>
              );
            })}
          </RadioGroup>
        </View>
      </View>
    </Drawer>
  );
};

export default DrawerSelect;
