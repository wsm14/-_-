import React, { Component, useEffect } from "react";
export default (props) => {
  const { initFn, auth } = props;
  useEffect(() => {
    if (auth !== 0) {
      initFn && initFn();
    }
  }, [auth]);
  return null;
};
