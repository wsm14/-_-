import React from "react";
import { filterStrList } from "@/utils/utils";
import Title from "./../../ui/orderTop";
import EditPrice from "./../../ui/editPrce";
import VerificationContent from "./../../ui/verificationContent";
import SpecalCard from "./../../ui/specalCard";
import Btn from "./../../ui/collectBtn";
import Telephone from "@/components/public_ui/payTelephone";
export default (props) => {
  const { closeTelPhone, show = false, data } = props;
  const { merchantMobile } = data;
  return (
    <>
      <Title {...props}></Title>
      <EditPrice {...props}></EditPrice>
      <VerificationContent {...props}></VerificationContent>
      <SpecalCard {...props}></SpecalCard>
      <Btn {...props}></Btn>
      {show && (
        <Telephone
          data={filterStrList(merchantMobile)}
          onClose={() => closeTelPhone()}
          onCancel={() => closeTelPhone()}
        ></Telephone>
      )}
    </>
  );
};
