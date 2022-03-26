import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import { backgroundObj } from "@/utils/utils";
import Tarking from "@/components/tracking";
import "./index.scss";
export default ({ data, onChange }) => {
  const [listObj, setListObj] = useState({});
  useEffect(() => {
    setListObj(
      data.reduce((item, val) => {
        if (val.moduleName === "sixPalaceLattice") {
          return val;
        } else return item;
      }),
      {}
    );
  }, [data]);
  const { configWindVaneList = [] } = listObj;
  return (
    <View className="sudoku_box">
      <View className="sudoku_img_box public_auto">
        {configWindVaneList.map((item) => {
          const { image } = item;
          return (
            <Tarking blockName="sixPalaceLattice" args={item} name={"sudoku"}>
              <View
                onClick={() => onChange(item)}
                style={backgroundObj(image)}
                className="sudoku_info_box"
              ></View>
            </Tarking>
          );
        })}
      </View>
    </View>
  );
};
