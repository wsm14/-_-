import React from "react";
import Skeleton from "taro-skeleton";
export default (props) => {
  const { children, loading } = props;
  if (loading) {
    return <Skeleton {...props}></Skeleton>;
  } else {
    return children || null;
  }
};
