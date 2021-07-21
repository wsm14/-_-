import React, { useState, useEffect } from "react";
import { CoverView, View } from "@tarojs/components";
import Skeleton from "@/components/Skeleton";
import classNames from "classnames";
import { computedClient, goBack } from "@/common/utils";
export default (props) => {
  const { loading, children } = props;
  if (loading) {
    return (
      <View className="skeleton_boxInfo">
        <View className="skeleton_boxInfo_top"></View>
        <View className="skeleton_boxInfo_box">
          <Skeleton loading={loading} row={1} rowHeight={340}></Skeleton>
          <View className="public_center">
            <Skeleton
              loading={loading}
              row={1}
              rowWidth={480}
              rowHeight={48}
            ></Skeleton>
          </View>
          <View className="public_center">
            <Skeleton
              loading={loading}
              rowWidth={480}
              row={1}
              rowHeight={48}
            ></Skeleton>
          </View>
          <View className="public_center">
            <Skeleton
              loading={loading}
              rowWidth={480}
              row={1}
              rowHeight={48}
            ></Skeleton>
          </View>
        </View>
      </View>
    );
  } else {
    return children || null;
  }
};
