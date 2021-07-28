import React, { useState, useEffect } from "react";
import { CoverView, View } from "@tarojs/components";
import Skeleton from "@/components/Skeleton";
import classNames from "classnames";
import { computedClient, goBack } from "@/common/utils";
export default (props) => {
  const { loading, children, title } = props;
  if (loading) {
    return (
      <View className="gradeGood_box">
        <View
          catchMove
          className={classNames("gradeGood_tabbar_box1")}
          style={{
            paddingTop:
              computedClient().top + (computedClient().height - 24) / 2,
          }}
        >
          <View
            onClick={() => goBack()}
            className={"gradeGood_tabbar_box_back1"}
          ></View>
          <View onClick={() => goBack()}> {title}</View>
        </View>
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
