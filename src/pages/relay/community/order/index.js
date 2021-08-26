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
import {
  fetchAddressList,
  fetchGoodsOrderPrice,
  fakeOrganizationGoods,
  fetchTest,
} from "@/server/relay";
import { usePostBackData } from "@/relay/common/hooks";
import PayBean from "@/components/stopBean";
import { fetchUserShareCommission } from "@/server/index";
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
      configUserLevelInfo: {},
      fakeGoods: {
        communityOrganizationGoodsId:
          getCurrentInstance().router.params.communityOrganizationGoodsId,
        ownerId: getCurrentInstance().router.params.ownerId,
        communityLiftingCabinetId: "",
        writeContactPerson: "",
        writeMobile: "",
        writeAddress: "",
        goodsCount: parseInt(getCurrentInstance().router.params.count) || 1,
        useBeanType: "reward",
        useBeanStatus: "1",
        remark: "",
        visible: false,
      },
      selectIndex: null,
    };
  }
  fetchUserShare() {
    fetchUserShareCommission({}, (res) => {
      const { configUserLevelInfo = {} } = res;
      this.setState({
        configUserLevelInfo,
      });
    }).catch((e) => {
      this.setState({});
    });
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
    this.fetchUserShare();
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
  useBean(val) {
    const { fakeGoods } = this.state;
    this.setState({
      fakeGoods: { ...fakeGoods, ...val },
    });
  }
  setSelectIndex(val) {
    const { fakeGoods } = this.state;
    console.log(val);
    const { address, addressName, mobile } = val;
    this.setState({
      selectIndex: val,
      fakeGoods: {
        ...fakeGoods,
        writeContactPerson: addressName,
        writeMobile: mobile,
        writeAddress: address,
      },
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
        },
      });
    });
  }
  setOrganizationGoodsId(id) {
    const { fakeGoods } = this.state;
    console.log(id);
    if (id) {
      this.setState({
        fakeGoods: { ...fakeGoods, communityLiftingCabinetId: id },
      });
    } else {
      return;
    }
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
  saveSubmit() {
    const { fakeGoods } = this.state;
    fakeOrganizationGoods(fakeGoods)
      .then((val) => {
        this.setState(
          {
            visible: false,
          },
          (res) => {
            const { orderSn } = val;
            fetchTest({ orderSn }, (res) => {
              toast("支付成功");
            });
          }
        );
      })
      .catch((val) => {
        this.setState({ visible: false });
      });
  }
  computedRealPrice() {
    const { fakeGoods, communityOrderInfo } = this.state;
    const { useBeanStatus, useBeanType } = fakeGoods;
    const { realPrice, userBean, userIncomeBean } = communityOrderInfo;
    if (useBeanStatus === "0") {
      return { realPrice, zk: 0 };
    } else {
      if (useBeanType === "reward") {
        return {
          realPrice: (parseInt(realPrice) - userBean / 100).toFixed(2),
          zk: (userBean / 100).toFixed(2),
        };
      } else {
        return {
          realPrice: (parseInt(realPrice) - userIncomeBean / 100).toFixed(2),
          zk: (userIncomeBean / 100).toFixed(2),
        };
      }
    }
  }
  render() {
    const {
      fakeGoods = {},
      communityOrderInfo = {},
      userAddressList,
      selectIndex,
      configUserLevelInfo,
      visible,
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
          change={this.setOrganizationGoodsId.bind(this)}
        ></SelectCard>
        <UserCard
          setInfoAddress={(val) => this.setSelectIndex(val)}
          index={selectIndex}
          list={userAddressList}
        ></UserCard>
        <ShopCard
          count={goodsCount}
          onChange={this.onChange.bind(this)}
          data={communityOrderInfo}
        ></ShopCard>
        <SelectBean
          fn={this.useBean.bind(this)}
          useBeanType={useBeanType}
          data={communityOrderInfo}
          configUserLevelInfo={configUserLevelInfo}
          useBeanStatus={useBeanStatus}
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
        <BottomCard
          data={this.computedRealPrice.bind(this)}
          onSubmit={() =>
            this.setState({
              visible: true,
            })
          }
        ></BottomCard>
        {visible && (
          <PayBean
            cancel={() =>
              this.setState({
                visible: false,
              })
            }
            visible={visible}
            canfirm={() => this.saveSubmit()}
            content={`支付后资金将进入对方账户，请确定对方信息后支付`}
            canfirmText="取消"
            cancelText="去支付"
          ></PayBean>
        )}
      </View>
    );
  }
}

export default Index;
