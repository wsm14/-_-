import React, { useState, useEffect } from "react";
import GrabHome from "./../grabHome";
import GrabInit from "./../grabInit";

export default ({
  data = {},
  list = [],
  onChange,
  animate,
  configUserLevelInfo,
}) => {
  const { userRedEnvelopesReceive, status } = data;
  if (!userRedEnvelopesReceive && status === "0") {
    return (
      <GrabHome data={data} animate={animate} onChange={onChange}></GrabHome>
    );
  } else
    return (
      <GrabInit
        configUserLevelInfo={configUserLevelInfo}
        data={data}
        list={list}
      ></GrabInit>
    );
};
