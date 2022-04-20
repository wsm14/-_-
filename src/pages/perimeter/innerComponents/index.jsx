import React, { Component } from "react";
import Taro, { getCurrentInstance, getCurrentPages } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import { fetchResourceTemplate } from "@/server/common";
import HotExchange from "./components/exchangeTemplate";
import Hotmetal from "./components/hotMetal";
import Rebate from "./components/rebate";
import Resource from "./components/resource";
import ListTemplate from "./components/listTemplate";
import Brand from "./components/Brand";
import Travel from "./components/travel";
import { setNavTitle, loginStatus } from "@/utils/utils";
import Router from "@/utils/router";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        ...getCurrentInstance().router.params,
      },
      data: {},
      title: {
        hotBlending: "限时热兑",
        coupon: "限时神券",
        deduction: "抵扣专区",
        flashSale: "今日秒杀",
        listTemplate: "发现好货",
        travel: "酷爱旅行",
        brand: "大牌连锁",
      },
      shareTitle: {
        hotBlending: "限量抢购，你的卡豆还不来用嘛？",
        deduction: "卡豆抵扣专区，超高抵扣比例，惊喜等你来！",
        flashSale: "手慢无，限量低价好货只在哒卡乐",
        listTemplate: "选择困难看过来，件件都是爆款",
        travel: "来自4700名旅行爱好者的推荐！",
        brand: "全国通用，放肆屯，安心买！",
        coupon: "限时！疯抢大额神券中，数量有限",
      },
      image: {
        deduction:
          "https://wechat-config.dakale.net/miniprogram/image/icon999.png",
        flashSale:
          "https://wechat-config.dakale.net/miniprogram/image/icon998.png",
        listTemplate:
          "https://wechat-config.dakale.net/miniprogram/image/icon996.png",
        travel:
          "https://wechat-config.dakale.net/miniprogram/image/icon997.png",
        brand: "https://wechat-config.dakale.net/miniprogram/image/icon995.png",
        coupon:
          "https://wechat-config.dakale.net/miniprogram/image/icon1000.png",
        hotBlending:
          "https://wechat-config.dakale.net/miniprogram/image/icon1001.png",
      },
    };
  }

  componentWillMount() {}
  linkToSpecal(item) {
    const { specialGoodsId, ownerIdString } = item;
    const { httpData } = this.state;
    const { identification } = httpData;
    Router({
      routerName: "favourableDetails",
      args: {
        merchantId: ownerIdString,
        specialActivityId: specialGoodsId,
        identification,
      },
    });
  }
  linkToCoupon = (item) => {
    const { httpData } = this.state;
    const { identification } = httpData;
    const { platformCouponId, useScenesType, classType } = item;
    if (useScenesType !== "virtual") {
      Router({
        routerName: "increase",
        args: {
          platformCouponId,
          useScenesType,
          classType,
          identification,
        },
      });
    }
  };
  onShareAppMessage(res) {
    let pages = getCurrentPages();
    let currPage = null;
    if (pages.length) {
      currPage = pages[pages.length - 1];
    }
    const { shareTitle, image, data, httpData } = this.state;
    const { identification, payBeanCommission, resourceTemplateContentId } =
      httpData;
    const { templateType } = data;
    let userInfo = loginStatus() || {};
    const { userIdString } = userInfo;
    if (res.from === "button") {
      return {
        title: shareTitle[templateType],
        imageUrl: image[templateType],
        path:
          "/" +
          currPage.route +
          `?identification=${identification}&payBeanCommission=${payBeanCommission}&resourceTemplateContentId=${resourceTemplateContentId}&shareUserId=${userIdString}&shareUserType=user`,
        complete: function () {
          // 转发结束之后的回调（转发成不成功都会执行）
          console.log("---转发完成---");
        },
      };
    } else {
      return {
        title: shareTitle[templateType],
        imageUrl: image[templateType],
        path:
          "/" +
          currPage.route +
          `?identification=${identification}&payBeanCommission=${payBeanCommission}&resourceTemplateContentId=${resourceTemplateContentId}&shareUserId=${userIdString}&shareUserType=user`,
        complete: function () {
          // 转发结束之后的回调（转发成不成功都会执行）
          console.log("---转发完成---");
        },
      };
    }
  }
  fetchResourceTemplate() {
    const { httpData, title } = this.state;
    fetchResourceTemplate(httpData).then((val) => {
      const { templateType } = val;
      this.setState({
        data: { ...val },
      });
      setNavTitle(title[templateType]);
    });
  }
  componentDidMount() {
    this.fetchResourceTemplate();
  }

  render() {
    const { data, httpData } = this.state;
    const { templateType, contentInfo = {} } = data;
    const { payBeanCommission, identification } = httpData;
    const {
      mixedList = [],
      selfTourGoods = [],
      brandSelfTravel = [],
    } = contentInfo;
    const template = {
      hotBlending: (
        <HotExchange
          payBeanCommission={payBeanCommission}
          onChange={this.linkToSpecal.bind(this)}
          reload={this.fetchResourceTemplate.bind(this)}
          data={data}
        ></HotExchange>
      ),
      coupon: (
        <Hotmetal
          reload={this.fetchResourceTemplate.bind(this)}
          onChange={this.linkToCoupon.bind(this)}
          data={data}
        ></Hotmetal>
      ),
      deduction: (
        <Rebate
          configUserLevelInfo={{ payBeanCommission }}
          identification={identification}
          reload={this.fetchResourceTemplate.bind(this)}
          onChange={this.linkToSpecal.bind(this)}
          data={data}
        ></Rebate>
      ),
      flashSale: (
        <Resource
          onChange={this.linkToSpecal.bind(this)}
          payBeanCommission={payBeanCommission}
          data={data}
        ></Resource>
      ),
      listTemplate: (
        <ListTemplate
          configUserLevelInfo={{ payBeanCommission }}
          identification={identification}
          payBeanCommission={payBeanCommission}
          list={mixedList}
          data={data}
        ></ListTemplate>
      ),
      travel: (
        <Travel
          configUserLevelInfo={{ payBeanCommission }}
          identification={identification}
          list={selfTourGoods}
          payBeanCommission={payBeanCommission}
          data={data}
        ></Travel>
      ),
      brand: (
        <Brand
          configUserLevelInfo={{ payBeanCommission }}
          identification={identification}
          list={brandSelfTravel}
          payBeanCommission={payBeanCommission}
          data={data}
        ></Brand>
      ),
    }[templateType];
    if (template) {
      return template;
    }
    return null;
  }
}

export default Index;

koMynGqM026Fypm1