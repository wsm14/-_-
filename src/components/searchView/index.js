import React, { useState, useMemo } from "react";
import { View, Input } from "@tarojs/components";
import "./index.scss";
export default (props) => {
  const { title, fn, change, align = "center" } = props;
  const [handler, setHandler] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [interval, setInterVal] = useState(null);

  const setInput = async (e) => {
    const { value } = e.detail;
    if (interval) {
      clearTimeout(interval);
      setTimeout(() => setSearch(e), 300);
    } else {
      let time = setTimeout(() => setSearch(e), 300);
      setInterVal(time);
    }
  };
  const setSearch = (e) => {
    const { value } = e.detail;
    setKeyword(value);
    fn && fn(value);
  };
  const SearchMemo = useMemo(() => {
    const template = {
      0: (
        <View
          className={
            align === "center" ? "searchView_noInput" : "searchView_left"
          }
          onClick={(e) => {
            e.stopPropagation();
            change ? change() : setHandler(1);
            console.log("1123123123");
          }}
        >
          <View className="searchView_icon"></View>
          <View className="searchView_font">{title}</View>
        </View>
      ),
      1: (
        <View className="searchView_input_box">
          <Input
            type={"text"}
            confirmType={"search"}
            // onConfirm={(e) => {
            //   keyword && setSearch(e);
            // }}
            value={keyword}
            onBlur={(e) => setInput(e)}
            placeholder={title}
            className="searchView_input"
          />
          <View
            className="searchView_close"
            onClick={(e) => {
              e.stopPropagation();
              if (interval) {
                clearTimeout(interval);
                setInterVal(null);
              }
              setHandler(0);
              setKeyword("");
              fn("");
            }}
          >
            取消
          </View>
        </View>
      ),
    }[handler];
    return <View className="searchView_box">{template}</View>;
  }, [handler, keyword]);
  return SearchMemo;
};
