import React from "react";
import { View } from "@tarojs/components";
import Skeleton from "@/components/Skeleton";
export default (props) => {
  const { loading = true, children, title } = props;
  if (loading) {
    return (
      <View className="Skeleton_user">
        <Skeleton
          avatar
          loading={loading}
          row={2}
          rowProps={[
            { width: 320, height: 32 },
            { width: 270, height: 32 },
          ]}
        ></Skeleton>
        <View className="Skeleton_toast public_auto">
          <Skeleton
            loading={loading}
            row={1}
            rowProps={[{ width: 184, height: 40 }]}
          ></Skeleton>
          <Skeleton
            loading={loading}
            row={1}
            rowProps={[{ width: 124, height: 28 }]}
          ></Skeleton>
        </View>
        <View className="Skeleton_user_liner"></View>
        <Skeleton
          loading={loading}
          row={1}
          rowProps={[{ width: 686, height: 114 }]}
        ></Skeleton>
        <Skeleton
          avatar
          loading={loading}
          row={2}
          action
          rowProps={[
            { width: 144, height: 32 },
            { width: 346, height: 32 },
          ]}
        ></Skeleton>
        <Skeleton
          loading={loading}
          row={1}
          rowProps={[{ width: 686, height: 200 }]}
        ></Skeleton>
        <View className="Skeleton_user_liner"></View>
        <View className="Skeleton_auto public_auto">
          <Skeleton
            loading={loading}
            row={1}
            rowProps={[{ width: 144, height: 50 }]}
          ></Skeleton>
          <Skeleton
            loading={loading}
            row={1}
            rowProps={[{ width: 144, height: 50 }]}
          ></Skeleton>
        </View>
        <View className="Skeleton_auto public_auto">
          <Skeleton
            loading={loading}
            row={1}
            rowProps={[{ width: 280, height: 200 }]}
          ></Skeleton>
          <Skeleton
            loading={loading}
            row={1}
            rowProps={[{ width: 280, height: 200 }]}
          ></Skeleton>
        </View>
        <View className="Skeleton_auto public_auto">
          <Skeleton
            loading={loading}
            row={1}
            rowProps={[{ width: 144, height: 50 }]}
          ></Skeleton>
        </View>
        <View className="Skeleton_auto public_auto">
          <Skeleton
            loading={loading}
            row={1}
            rowProps={[{ width: 72, height: 72 }]}
          ></Skeleton>
          <Skeleton
            loading={loading}
            row={1}
            rowProps={[{ width: 72, height: 72 }]}
          ></Skeleton>
          <Skeleton
            loading={loading}
            row={1}
            rowProps={[{ width: 72, height: 72 }]}
          ></Skeleton>
        </View>
      </View>
    );
  } else {
    return children || null;
  }
};
