import React, { useState, useEffect, Fragment } from "react";
import Taro from "@tarojs/taro";
import { View, Text, ScrollView, Input } from "@tarojs/components";
import classNames from "classnames";
import Router from "@/common/router";
import "./index.scss";

export default ({ confirm, onChange, type }) => {
  let instance = null;
  const [keyword, setKeyWord] = useState("");
  const onConfirm = (e) => {
    if (instance) {
      const { value } = e.detail;
      clearTimeout(instance);
      setKeyWord(value);
      confirm(value);
    }
  };
  const onInput = (e) => {
    const { value } = e.detail;
    if (instance) {
      clearTimeout(instance);
      instance = setTimeout(() => {
        if (value === keyword) {
          console.log(instance, value);
          clearTimeout(instance);
          instance = null;
          return;
        } else {
          instance = setTimeout(() => {
            setKeyWord(value);
            onChange(value);
            clearTimeout(instance);
            instance = null;
          }, 300);
        }
      }, 300);
    } else {
      if (value === keyword) {
        console.log(instance, value);
        clearTimeout(instance);
        instance = null;
        return;
      } else {
        instance = setTimeout(() => {
          setKeyWord(value);
          onChange(value);
          clearTimeout(instance);
          instance = null;
        }, 300);
      }
    }
  };
  if (type === "link") {
    return (
      <View className="sub-search-box">
        <View
          onClick={() =>
            Router({
              routerName: "search_shop",
            })
          }
          className="sub-search-searchView color2"
        >
          搜索附近吃喝玩乐～
        </View>
      </View>
    );
  } else {
    return (
      <View className="sub-search-box">
        <Input
          type={"text"}
          confirmType={"search"}
          onConfirm={onConfirm}
          value={keyword}
          onInput={onInput}
          className="sub-search-searchView color1"
          placeholder={"搜索附近吃喝玩乐～"}
        ></Input>
      </View>
    );
  }
};
