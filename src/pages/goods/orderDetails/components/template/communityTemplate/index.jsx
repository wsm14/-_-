import React from "react";
import Title from "./../../ui/orderTop";
import CommunityContent from "./../../ui/communityContent";
import CommunityCard from "./../../ui/communityCard";
import CommunityAddress from "./../../ui/communityAddress";
import Btn from "./../../ui/collectBtn";
export default (props) => {
  return (
    <>
      <Title {...props}></Title>
      <CommunityContent {...props}></CommunityContent>
      <CommunityAddress {...props}></CommunityAddress>
      <CommunityCard {...props}></CommunityCard>
      <Btn type={"telephone"} {...props}></Btn>
    </>
  );
};
