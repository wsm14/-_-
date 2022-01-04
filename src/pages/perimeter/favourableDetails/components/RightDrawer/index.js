import React from "react";
import Drawer from "@/components/Drawer";
import RightFlag from "@/components/public_ui/rightFlagView";
import "./index.scss";

export default (props) => {
  const { data, show, close } = props;
  const { paymentModeObject = {}, goodsImg, goodsName } = data;
  const { bean = 0, cash = 0, type = "defaultMode" } = paymentModeObject;
  if (show) {
    return (
      <Drawer show={show} close={close}>
        <RightFlag
          data={{
            img: goodsImg,
            name: goodsName,
            price: cash,
            bean: bean - userBean,
          }}
          close={close}
        ></RightFlag>
      </Drawer>
    );
  } else return null;
};
