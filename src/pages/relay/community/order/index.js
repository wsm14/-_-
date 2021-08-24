import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import SelectCard from "./components/selectAddressCard";
import UserCard from "./components/userAddressCard";
import ShopCard from "./components/shopCard";
import SelectBean from "@/components/componentView/selectBean";
import BottomCard from "./components/bottomPay";
import { Form, Input } from "@/relay/components/formCondition";
import { toast } from "@/common/utils";
import "./index.scss";
const FormItem = Form.Item;
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      count: 1,
    };
  }
  componentWillUnmount() {}
  componentDidMount() {}
  onChange(type = "add") {
    const { count } = this.state;
    if (type === "add") {
      if (count === 99) {
        return toast("选择数量已到最大值");
      }
      this.setState({
        count: count + 1,
      });
    } else {
      if (count === 1) {
        return toast("选择数量不能为0");
      }
      this.setState({
        count: count - 1,
      });
    }
  }
  render() {
    const { count } = this.state;
    return (
      <View className="order_info_box">
        <SelectCard></SelectCard>
        <UserCard></UserCard>
        <ShopCard></ShopCard>
        <SelectBean
          fn={() => {}}
          useBeanType={"reward"}
          data={{}}
          configUserLevelInfo={{}}
          useBeanStatus={"1"}
        ></SelectBean>
        <View className="order_shopCard_bz">
          <Form onSubmit={(e) => console.log(e.detail.value)} footer={false}>
            <FormItem label={"名称"}>
              <Input
                name={"goodsName"}
                placeholder={"请输入您想要备注的内容"}
                maxLength={30}
                style={{ textAligh: "left" }}
              ></Input>
            </FormItem>
          </Form>
        </View>

        <BottomCard></BottomCard>
      </View>
    );
  }
}

export default Index;
