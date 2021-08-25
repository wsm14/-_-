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
import { fetchAddressList, fetchGoodsOrderPrice } from "@/server/relay";
import { usePostBackData } from "@/relay/common/hooks";
import "./index.scss";
const FormItem = Form.Item;
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      userAddressList: [],
      httpData: {
        ...getCurrentInstance().router.params,
      },
      communityOrderInfo: {},
      fakeGoods: {
        communityOrganizationGoodsId:
          getCurrentInstance().router.params.communityOrganizationGoodsId,
        ownerId: getCurrentInstance().router.params.ownerId,
        communityLiftingCabinetId: "",
        writeContactPerson: "",
        writeMobile: "",
        writeAddress: "",
        goodsCount: getCurrentInstance().router.params.count || 1,
        useBeanType: "",
        useBeanStatus: "",
        remark: "",
      },
      selectIndex: null,
    };
  }
  fetchAddress() {
    fetchAddressList({}).then((val) => {
      const { userAddressList = [] } = val;
      this.setState({
        userAddressList,
      });
    });
  }
  componentWillUnmount() {}
  componentDidMount() {
    this.fetchOrder();
  }
  componentDidShow() {
    this.fetchAddress();
    const pages = Taro.getCurrentPages(); // 获取页面堆栈
    const currPage = pages[pages.length - 1]; // 获取上一页栈
    const { data } = currPage.data; // 获取上一页回传数据
    if (data) {
      this.setSelectIndex(data);
    }
  }
  setSelectIndex(val) {
    this.setState({
      selectIndex: val,
    });
  }
  fetchOrder() {
    const { httpData } = this.state;
    fetchGoodsOrderPrice(httpData).then((res) => {
      const { communityOrderInfo = {} } = res;
      const { communityLiftingCabinetList = [] } = communityOrderInfo;
      const { fakeGoods } = this.state;
      this.setState({
        communityOrderInfo,
        fakeGoods: {
          ...fakeGoods,
          communityLiftingCabinetId:
            communityLiftingCabinetList[0].communityLiftingCabinetId,
        },
      });
    });
  }
  onChange(type = "add") {
    const { fakeGoods } = this.state;
    const { goodsCount } = fakeGoods;
    if (type === "add") {
      if (goodsCount === 99) {
        return toast("选择数量已到最大值");
      }
      this.setState({
        fakeGoods: { ...fakeGoods, goodsCount: goodsCount + 1 },
      });
    } else {
      if (goodsCount === 1) {
        return toast("选择数量不能为0");
      }
      this.setState({
        fakeGoods: { ...fakeGoods, goodsCount: goodsCount - 1 },
      });
    }
  }
  render() {
    const {
      fakeGoods = {},
      communityOrderInfo = {},
      userAddressList,
      selectIndex,
    } = this.state;
    const { communityLiftingCabinetList } = communityOrderInfo;
    const {
      communityOrganizationGoodsId = "",
      ownerId = "",
      communityLiftingCabinetId = "",
      writeContactPerson = "",
      writeMobile = "",
      writeAddress = "",
      goodsCount = 1,
      useBeanType = "",
      useBeanStatus = "",
    } = fakeGoods;
    return (
      <View className="order_info_box">
        <SelectCard
          index={communityLiftingCabinetId}
          list={communityLiftingCabinetList}
        ></SelectCard>
        <UserCard
          setInfoAddress={(val) => this.setState({ selectIndex: val })}
          index={selectIndex}
          list={userAddressList}
        ></UserCard>
        <ShopCard
          count={goodsCount}
          onChange={this.onChange.bind(this)}
          data={communityOrderInfo}
        ></ShopCard>
        <SelectBean
          fn={() => {}}
          useBeanType={"reward"}
          data={{}}
          configUserLevelInfo={{}}
          useBeanStatus={"1"}
        ></SelectBean>
        <View className="order_shopCard_bz">
          <Form onSubmit={(e) => console.log(e.detail.value)} footer={false}>
            <FormItem label={"备注"}>
              <Input
                name={"remark"}
                placeholder={"请输入您想要备注的内容"}
                maxLength={30}
                onInput={(e) => {
                  this.setState({
                    fakeGoods: {
                      ...fakeGoods,
                      remark: e,
                    },
                  });
                }}
                style={{ textAlign: "left" }}
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
