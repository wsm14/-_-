import React, { useState, useEffect } from "react";
import { CoverView, View } from "@tarojs/components";
import Skeleton from "@/components/Skeleton";
import classNames from "classnames";
import { computedClient, goBack } from "@/common/utils";
export default (props) => {
  const { loading, children } = props;
  if (loading) {
    return (
      <View className="publicTypeGoods_box">
        <Skeleton loading={loading} row={1} rowHeight={180}></Skeleton>
        <Skeleton loading={loading} row={1} rowHeight={64}></Skeleton>
        <Skeleton
          className={"public_auto"}
          avatar
          loading={loading}
          row={5}
          avatarShape={"square"}
          avatarSize={190}
          rowWidth={450}
          rowHeight={20}
        ></Skeleton>
        <Skeleton
          className={"public_auto"}
          avatar
          loading={loading}
          avatarShape={"square"}
          row={5}
          avatarSize={190}
          rowWidth={450}
          rowHeight={20}
        ></Skeleton>
        <Skeleton
          className={"public_auto"}
          avatar
          loading={loading}
          avatarShape={"square"}
          row={5}
          avatarSize={190}
          rowWidth={450}
          rowHeight={20}
        ></Skeleton>
      </View>
    );
  } else {
    return children || null;
  }
};
