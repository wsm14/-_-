import React, { useState, useEffect } from "react";
import { CoverView, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { toast } from "@/common/utils";
import Skeleton from "taro-skeleton";
export default (props) => {
  const { children, loading } = props;
  if (loading) {
   return <Skeleton {...props}></Skeleton>;
  } else {

    return children || null;
  }
};
