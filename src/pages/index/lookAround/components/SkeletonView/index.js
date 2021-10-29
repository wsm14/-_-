import React, { useState, useEffect } from "react";
import { CoverView, View } from "@tarojs/components";
import Skeleton from "@/components/Skeleton";
import "./index.scss";
export default (props) => {
  const { loading, children } = props;
  if (loading) {
    return (
      <View className="lookAround_Skeleton_box">
        <Skeleton loading={loading} row={1} rowHeight={180}></Skeleton>
        <View className="public_auto">
          <Skeleton
            width={60}
            type={"column"}
            avatar
            loading={loading}
            title
          ></Skeleton>
          <Skeleton
            width={60}
            type={"column"}
            avatar
            loading={loading}
            title
          ></Skeleton>
          <Skeleton
            width={60}
            type={"column"}
            avatar
            loading={loading}
            title
          ></Skeleton>
          <Skeleton
            width={60}
            type={"column"}
            avatar
            loading={loading}
            title
          ></Skeleton>
        </View>
        <View className="public_auto">
          <Skeleton
            row={1}
            rowWidth={400}
            rowHeight={160}
            loading={loading}
          ></Skeleton>
          <Skeleton
            row={1}
            rowWidth={160}
            rowHeight={160}
            loading={loading}
          ></Skeleton>
        </View>
        <Skeleton loading={loading} row={1} rowHeight={180}></Skeleton>
      </View>
    );
  } else {
    return children || null;
  }
};
