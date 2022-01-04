import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View, Swiper, ScrollView, SwiperItem } from "@tarojs/components";
import Waterfall from "@/components/waterfall";
import { fetchRightGoods, fetchSpecialGoods } from "@/server/index";
import { fetchCommerceGoods, fetchSelfTourGoods } from "@/server/perimeter";
import { fetchUserShareCommission } from "@/server/common";
import {
  backgroundObj,
  computedPrice,
  getLnt,
  getLat,
  GetDistance,
} from "@/utils/utils";
import Empty from "@/components/Empty";
import classNames from "classnames";
import Router from "@/utils/router";
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
    const templateActive = (item) => {
      const {
        commission,
        goodsImg,
        goodsName,
        merchantName,
        lat,
        lnt,
        merchantLogo,
        oriPrice,
        realPrice,
        ownerIdString,
        specialActivityIdString,
        paymentModeObject,
      } = item;
      const { bean, cash, type = "defaultMode" } = paymentModeObject;
      return (
        <View
          className="bottom_shop_box"
          onClick={() => {
            Router({
              routerName: "favourableDetails",
              args: {
                merchantId: ownerIdString,
                specialActivityId: specialActivityIdString,
              },
            });
          }}
          key={specialActivityIdString}
        >
          <View
            className="bottom_shop_img"
            style={backgroundObj(goodsImg)}
          ></View>
          <View className="bottom_shop_content">
            <View className="bottom_shop_goodsName font_noHide">
              {goodsName}
            </View>
            {type !== "defaultMode" ? (
              <>
                <View className="bottom_shop_oldPrice1">
                  <View className="bottom_shop_oldLabel">原价:</View>
                  <View className="bottom_shop_oldcout">¥{oriPrice}</View>
                </View>
                <View className="bottom_qy_price font_hide">
                  <View className="bottom_qy_label">卡豆价:</View>
                  <View className="bottom_qy_bean">
                    ¥{cash}+{bean}卡豆
                  </View>
                </View>
              </>
            ) : (
              <>
                {" "}
                <View className="bottom_shop_realPrice">
                  <View className="bottom_shop_realLabel">优惠价:</View>
                  <View className="bottom_shop_price">¥{realPrice}</View>
                </View>
                <View className="bottom_shop_oldPrice">
                  <View className="bottom_shop_oldLabel">原价:</View>
                  <View className="bottom_shop_oldcout">¥{oriPrice}</View>
                </View>
                <View className="bottom_kol_info">
                  <View className="bottom_kol_s">
                    <View className="bottom_kol_bean">
                      ¥{computedPrice(realPrice, payBeanCommission)}
                    </View>
                  </View>
                  {shareCommission > 0 && commission > 0 && (
                    <View className="bottom_kol_z font_hide">
                      <View className="bottom_kol_money font_hide">
                        ¥{computedPrice(commission, shareCommission)}
                      </View>
                    </View>
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      );
    };
    const template = (item) => {
      const {
        commission,
        goodsImg,
        goodsName,
        merchantName,
        lat,
        lnt,
        merchantLogo,
        oriPrice,
        realPrice,
        ownerIdString,
        specialActivityIdString,
      } = item;
      return (
        <View
          onClick={() => {
            Router({
              routerName: "favourableDetails",
              args: {
                merchantId: ownerIdString,
                specialActivityId: specialActivityIdString,
              },
            });
          }}
          className="bottom_shop_box"
          key={specialActivityIdString}
        >
          <View
            className="bottom_shop_img"
            style={backgroundObj(goodsImg)}
          ></View>
          <View className="bottom_shop_content">
            <View className="bottom_shop_goodsName font_noHide">
              {goodsName}
            </View>
            <View className="bottom_shop_user font_hide">
              <View
                className="bottom_shop_profile merchant_dakale_logo"
                style={backgroundObj(merchantLogo)}
              ></View>
              <View className="bottom_shop_name font_hide">{merchantName}</View>
              <View className="bottom_shop_limit">
                ｜{GetDistance(lat, lnt, getLat(), getLnt())}
              </View>
            </View>
            <View className="bottom_shop_realPrice">
              <View className="bottom_shop_realLabel">优惠价:</View>
              <View className="bottom_shop_price">¥{realPrice}</View>
            </View>
            <View className="bottom_shop_oldPrice">
              <View className="bottom_shop_oldLabel">原价:</View>
              <View className="bottom_shop_oldcout">¥{oriPrice}</View>
            </View>
            <View className="bottom_kol_info">
              <View className="bottom_kol_s">
                <View className="bottom_kol_bean">
                  ¥{computedPrice(realPrice, payBeanCommission)}
                </View>
              </View>
              {shareCommission > 0 && commission > 0 && (
                <View className="bottom_kol_z font_hide">
                  <View className="bottom_kol_money font_hide">
                    ¥{computedPrice(commission, shareCommission)}
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      );
    };
    const templateRight = (item) => {
      const {
     
        goodsImg,
        ownerIdString,
        goodsName,
        merchantName,
        lat,
        lnt,
        merchantLogo,
        oriPrice,
      
        specialActivityIdString,
        paymentModeObject = {},
      } = item;
      const { bean, cash } = paymentModeObject;
      return (
        <View
          onClick={() => {
            Router({
              routerName: "favourableDetails",
              args: {
                merchantId: ownerIdString,
                specialActivityId: specialActivityIdString,
              },
            });
          }}
          className="bottom_shop_box"
          key={specialActivityIdString}
        >
          <View
            className="bottom_shop_img"
            style={backgroundObj(goodsImg)}
          ></View>
          <View className="bottom_shop_content">
            <View className="bottom_shop_goodsName font_noHide">
              {goodsName}
            </View>
            <View className="bottom_shop_user font_hide">
              <View
                className="bottom_shop_profile merchant_dakale_logo"
                style={backgroundObj(merchantLogo)}
              ></View>
              <View className="bottom_shop_name font_hide">{merchantName}</View>
              <View className="bottom_shop_limit">
                ｜{GetDistance(lat, lnt, getLat(), getLnt())}
              </View>
            </View>

            <View className="bottom_shop_oldPrice1">
              <View className="bottom_shop_oldLabel">原价:</View>
              <View className="bottom_shop_oldcout">¥{oriPrice}</View>
            </View>
            <View className="bottom_qy_price font_hide">
              <View className="bottom_qy_label">卡豆价:</View>
              <View className="bottom_qy_bean">
                ¥{cash}+{bean}卡豆
              </View>
            </View>
          </View>
        </View>
      );
    };
    const templateGame = (item) => {
      const {
        commission,
        goodsImg,
        ownerIdString,
        goodsName,
      
        oriPrice,
        realPrice,
       
        specialActivityIdString,
      } = item;
      return (
        <View
          onClick={() => {
            Router({
              routerName: "favourableDetails",
              args: {
                merchantId: ownerIdString,
                specialActivityId: specialActivityIdString,
              },
            });
          }}
          key={specialActivityIdString}
          className="bottom_shop_box"
        >
          <View
            className="bottom_shop_img"
            style={backgroundObj(goodsImg)}
          ></View>
          <View className="bottom_shop_content">
            <View className="bottom_shop_goodsName font_noHide">
              {goodsName}
            </View>
            <View className="bottom_shop_realPrice">
              <View className="bottom_shop_realLabel">优惠价:</View>
              <View className="bottom_shop_price">¥{realPrice}</View>
            </View>
            <View className="bottom_shop_oldPrice">
              <View className="bottom_shop_oldLabel">原价:</View>
              <View className="bottom_shop_oldcout">¥{oriPrice}</View>
            </View>
            <View className="bottom_kol_info">
              <View className="bottom_kol_s">
                <View className="bottom_kol_bean">
                  ¥{computedPrice(realPrice, payBeanCommission)}
                </View>
              </View>
              {shareCommission > 0 && commission > 0 && (
                <View className="bottom_kol_z font_hide">
                  <View className="bottom_kol_money font_hide">
                    ¥{computedPrice(commission, shareCommission)}
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      );
    };
    const templateList = {
      0: (
        <Waterfall
          list={specialGoodsList1}
          createDom={templateActive}
          setWidth={335}
          style={{ width: Taro.pxTransform(335) }}
        ></Waterfall>
      ),
      1: (
        <Waterfall
          list={specialGoodsList2}
          createDom={template}
          setWidth={335}
          style={{ width: Taro.pxTransform(335) }}
        ></Waterfall>
      ),
      2: (
        <Waterfall
          list={specialGoodsList3}
          createDom={templateRight}
          setWidth={335}
          style={{ width: Taro.pxTransform(335) }}
        ></Waterfall>
      ),
      3: (
        <Waterfall
          list={specialGoodsList4}
          createDom={templateGame}
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
