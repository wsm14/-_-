import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View, Swiper, ScrollView, SwiperItem } from "@tarojs/components";
import Waterfall from "@/components/waterfall";
import { fetchRightGoods, fetchSpecialGoods } from "@/server/index";
import { fetchCommerceGoods, fetchSelfTourGoods } from "@/server/perimeter";
import { fetchUserShareCommission } from "@/server/common";
import {
  templateActive,
  template,
  templateRight,
  templateGame,
} from "@/components/public_ui/newGoodsObj";
import Empty from "@/components/Empty";
import classNames from "classnames";
import Task from "@/components/task";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      index: 0,
      seleList: [
        {
          key: 0,
          value: "精选好物",
        },
        {
          key: 1,
          value: "吃喝玩乐",
        },
        {
          key: 2,
          value: "卡豆专区",
        },
        {
          key: 3,
          value: "周边游玩",
        },
      ],
      httpData1: {
        page: 1,
        limit: 10,
      },
      httpData2: {
        page: 1,
        limit: 10,
        specialFilterType: "aroundSpecial",
      },
      httpData3: {
        page: 1,
        limit: 10,
      },
      httpData4: {
        page: 1,
        limit: 10,
      },
      specialGoodsList1: [],
      specialGoodsList2: [],
      specialGoodsList3: [],
      specialGoodsList4: [],
      configUserLevelInfo: {},
    };
  }
  fetchUserShare() {
    fetchUserShareCommission({}, (res) => {
      const { configUserLevelInfo = {} } = res;
      this.setState({
        configUserLevelInfo,
      });
    });
  }

  onPullDownRefresh() {
    const { httpData } = this.state;
    this.setState(
      {
        httpData: { ...httpData, page: 1, limit: 10 },
        configUserLevelInfo: {},
        specialGoodsList: [],
      },
      (res) => {
        let time = setTimeout(() => {
          Taro.stopPullDownRefresh();
          clearTimeout(time);
        }, 500);
        this.fetchUserShare();
        this.getshopList();
      }
    );
  }
  fetchCommerceGoods() {
    const { httpData1, specialGoodsList1 } = this.state;
    fetchCommerceGoods(httpData1).then((val) => {
      const { specialGoodsList } = val;
      this.setState({
        specialGoodsList1: [...specialGoodsList1, ...specialGoodsList],
      });
    });
  }
  fetchSpecialGoods() {
    const { httpData2, specialGoodsList2 } = this.state;
    fetchSpecialGoods(httpData2).then((val) => {
      const { specialGoodsList } = val;
      this.setState({
        specialGoodsList2: [...specialGoodsList2, ...specialGoodsList],
      });
    });
  }
  fetchRightGoods() {
    const { httpData3, specialGoodsList3 } = this.state;
    fetchRightGoods(httpData3).then((val) => {
      const { specialGoodsList } = val;
      this.setState({
        specialGoodsList3: [...specialGoodsList3, ...specialGoodsList],
      });
    });
  }
  fetchSelfTourGoods() {
    const { httpData4, specialGoodsList4 } = this.state;
    fetchSelfTourGoods(httpData4).then((val) => {
      const { selfTourGoodList } = val;
      this.setState({
        specialGoodsList4: [...specialGoodsList4, ...selfTourGoodList],
      });
    });
  }

  componentDidMount() {
    this.fetchCommerceGoods();
    this.fetchSpecialGoods();
    this.fetchRightGoods();
    this.fetchSelfTourGoods();
  }
  componentDidShow() {
    this.fetchUserShare();
  }

  onReachBottom() {}
  onPageUp() {
    const { index, httpData1, httpData2, httpData3, httpData4 } = this.state;
    if (index === 0) {
      this.setState(
        {
          httpData1: {
            ...httpData1,
            page: httpData1.page + 1,
          },
        },
        (res) => {
          this.fetchCommerceGoods();
        }
      );
    } else if (index === 1) {
      this.setState(
        {
          httpData2: {
            ...httpData2,
            page: httpData2.page + 1,
          },
        },
        (res) => {
          this.fetchSpecialGoods();
        }
      );
    } else if (index === 2) {
      this.setState(
        {
          httpData3: {
            ...httpData3,
            page: httpData3.page + 1,
          },
        },
        (res) => {
          this.fetchRightGoods();
        }
      );
    } else {
      return;
    }
  }
  render() {
    const {
      index,
      seleList,
      configUserLevelInfo,
      specialGoodsList1,
      specialGoodsList2,
      specialGoodsList3,
      specialGoodsList4,
    } = this.state;
    const { payBeanCommission = 50, shareCommission = 0 } = configUserLevelInfo;

    const templateList = {
      0: (
        <Waterfall
          list={specialGoodsList1}
          createDom={(item) => templateActive(item, configUserLevelInfo)}
          setWidth={335}
          style={{ width: Taro.pxTransform(335) }}
        ></Waterfall>
      ),
      1: (
        <Waterfall
          list={specialGoodsList2}
          createDom={(item) => template(item, configUserLevelInfo)}
          setWidth={335}
          style={{ width: Taro.pxTransform(335) }}
        ></Waterfall>
      ),
      2: (
        <Waterfall
          list={specialGoodsList3}
          createDom={(item) => templateRight(item, configUserLevelInfo)}
          setWidth={335}
          style={{ width: Taro.pxTransform(335) }}
        ></Waterfall>
      ),
      3: (
        <Waterfall
          list={specialGoodsList4}
          createDom={(item) => templateGame(item, configUserLevelInfo)}
          setWidth={335}
          style={{ width: Taro.pxTransform(335) }}
        ></Waterfall>
      ),
    };
    const falgList = [
      specialGoodsList1,
      specialGoodsList2,
      specialGoodsList3,
      specialGoodsList4,
    ];
    return (
      <View className="goodThings_box">
        <View className="goodThings_select_title">
          {seleList.map((item, indexs) => {
            return (
              <View
                className="goodThings_select_right"
                onClick={() => {
                  if (indexs !== index) {
                    this.setState({
                      index: indexs,
                    });
                  }
                }}
              >
                <View
                  className={
                    index === item.key
                      ? "goodThings_select_font"
                      : "goodThings_select_noFont"
                  }
                >
                  {item.value}
                </View>
                <View
                  className={classNames(
                    "goodThings_select_liner",
                    index === item.key && "goodThings_select_bg"
                  )}
                ></View>
              </View>
            );
          })}
        </View>
        <Swiper
          current={index}
          onChange={(e) => {
            this.setState({
              index: e.detail.current,
            });
          }}
          circular={true}
          className="goodThings_swiper_box"
        >
          {seleList.map((item, count) => {
            return (
              <SwiperItem className="goodThings_swiper_info">
                <ScrollView
                  onScrollToLower={this.onPageUp.bind(this)}
                  scrollY
                  className="goodThings_swiper_scrollView"
                >
                  <Empty
                    toast={"暂无商品"}
                    type="shop"
                    show={falgList[count].length === 0}
                  ></Empty>
                  {templateList[item.key]}
                </ScrollView>
              </SwiperItem>
            );
          })}
        </Swiper>
        <Task useRef={{}} createType={true}></Task>
      </View>
    );
  }
}

export default Index;
