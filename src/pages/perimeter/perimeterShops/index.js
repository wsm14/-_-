import React, { Component, PureComponent } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { ScrollView, View, Text } from "@tarojs/components";
import {
  getLat,
  getLnt,
  GetDistance,
  backgroundObj,
  toast,
  filterStrList,
} from "@/utils/utils";
import { scanCode } from "@/common/authority";
import { getMerchantLat } from "@/server/index";
import { fetchCategory, fetchConfigWindVaneBySize } from "@/server/common";
import ShopView from "./components/shopView";
import SelectList from "./components/selectView";
import Router from "@/utils/router";
import classNames from "classnames";
import "./index.scss";
const filterSelectData = (obj) => {
  const {
    limit,
    smartSiftType,
    childType,
    consumptionScope,
    configWindVaneId,
    categoryIds,
  } = obj;
  let length = 0;
  if (Object.keys(limit).length > 0) {
    length += 1;
  }
  if (Object.keys(childType).length > 0) {
    length += 1;
  }
  if (Object.keys(consumptionScope).length > 0) {
    length += 1;
  }
  if (Object.keys(categoryIds).length > 0) {
    length += 1;
  }
  if (smartSiftType.length > 0) {
    length += smartSiftType.length;
  }
  if (configWindVaneId.length > 0) {
    length += configWindVaneId.length;
  }
  return {
    length: length,
    data: {
      distance: limit.value,
      categoryIds:
        Object.keys(childType).length > 0
          ? childType.categoryIdString
          : categoryIds.categoryIdString,
      consumptionScope: consumptionScope.value,
      scenesId: configWindVaneId
        .map((item) => {
          return item.scenesId;
        })
        .join(","),
      configWindVaneId: configWindVaneId
        .map((item) => {
          return item.configWindVaneId;
        })
        .join(","),
      smartSiftType: smartSiftType
        .map((item) => {
          return item.value;
        })
        .join(","),
    },
  };
};
class index extends PureComponent {
  constructor() {
    super(...arguments);
    this.instance = null;
    this.state = {
      httpData: {
        page: 1,
        limit: 10,
      },
      countStatus: true,
      userMerchantList: [],
      visible: false,
      bannerList: [],
      configUserLevelInfo: {},
      keyword: "",
      status: 0,
      selectList: [],
      selectData: {
        limit: {},
        smartSiftType: [],
        categoryIds: {},
        configWindVaneId: [],
        consumptionScope: {},
        childType: {},
      },
      initRes: false,
    };
    this.timeOuts = null;
  }

  componentDidMount() {
    this.fetchList();
    // this.getBanner();
    this.initSelect();
  }
  componentDidShow() {}

  initSelect() {
    Promise.all([
      fetchCategory({ parentId: "0" }, () => {}),
      fetchConfigWindVaneBySize({ size: 10 }, () => {}),
    ])
      .then((val = []) => {
        this.setState({
          initRes: true,
          selectList: [
            {
              type: "limit",
              title: "????????????",
              only: true,
              children: null,
              key: "description",
              value: "value",
              list: [
                { value: "500", description: "500m" },
                { value: "1000", description: "1km" },
                { value: "2000", description: "2km" },
                { value: "5000", description: "5km" },
                { value: "10000", description: "10km" },
                { value: "20000", description: "20km" },
              ],
            },
            {
              type: "smartSiftType",
              title: "???????????? ",
              only: false,
              children: null,
              key: "description",
              value: "value",
              list: [
                { value: "markFlag", description: "????????????" },
                { value: "special", description: "????????????" },
                { value: "reduce", description: "?????????" },
              ],
            },
            {
              type: "categoryIds",
              title: "???????????? ",
              only: true,
              children: true,
              list: val[0].categoryList,
              key: "categoryName",
              value: "categoryIdString",
            },
            // {
            //   type: "configWindVaneId",
            //   title: "????????????",
            //   only: false,
            //   children: null,
            //   list: val[1].configWindVaneList,
            //   key: "name",
            //   value: "configWindVaneId",
            // },
            {
              type: "consumptionScope",
              title: "????????????",
              only: true,
              children: null,
              key: "description",
              value: "value",
              list: [
                { value: "0-50", description: "50??????" },
                { value: "50-100", description: "50-100" },
                { value: "100-200", description: "100-200" },
                { value: "200-500", description: "200-500" },
                { value: "500-1000", description: "500-1000" },
                { value: "1000-2000", description: "1000-2000" },
                { value: "2000", description: "2000??????" },
              ],
            },
          ],
        });
      })
      .catch((val) => {
        toast("??????????????????");
      });
  }
  searchDetails(e) {
    if (this.instance) {
      clearTimeout(this.instance);
      this.instance = setTimeout(this.search.bind(this, e), 300);
    } else {
      this.instance = setTimeout(this.search.bind(this, e), 300);
    }
  }

  search(e) {
    const { keyword } = this.state;
    const { value } = e.detail;
    if (keyword === value) {
      return;
    } else {
      this.setState(
        {
          keyword: value,
        },
        (res) => {}
      );
    }
  }

  fetchList(init) {
    const {
      httpData,
      httpData: { distance },
    } = this.state;
    getMerchantLat(
      { ...httpData, distance: distance ? distance : 5000 },
      (res) => {
        const { userMerchantList = [] } = res;
        if (!init) {
          if (userMerchantList.length === 0) {
            this.setState({
              countStatus: false,
            });
          } else {
            this.setState({
              userMerchantList: [
                ...this.state.userMerchantList,
                ...userMerchantList,
              ],
            });
          }
        } else {
          this.setState({
            userMerchantList,
          });
        }
      }
    );
  }
  setActiveShop(data) {
    const { scenesId } = data;
    const {
      selectData: { configWindVaneId },
      selectData,
    } = this.state;
    let flag = configWindVaneId
      .map((item) => {
        return item.configWindVaneId;
      })
      .includes(data.configWindVaneId);
    if (flag) {
      this.setState(
        {
          selectData: {
            ...selectData,
            configWindVaneId: configWindVaneId.filter((item) => {
              return item.configWindVaneId !== data.configWindVaneId;
            }),
          },
        },
        (res) => {
          this.setState(
            {
              countStatus: true,
              httpData: {
                page: 1,
                limit: 10,
                ...filterSelectData(this.state.selectData).data,
              },
            },
            (res) => {
              this.fetchList(true);
            }
          );
        }
      );
    } else {
      this.setState(
        {
          selectData: {
            ...selectData,
            configWindVaneId: [...configWindVaneId, { ...data }],
          },
        },
        (res) => {
          this.setState(
            {
              countStatus: true,
              httpData: {
                page: 1,
                limit: 10,
                ...filterSelectData(this.state.selectData).data,
              },
            },
            (res) => {
              this.fetchList(true);
            }
          );
        }
      );
    }
  }
  setActiveCard(data) {
    const { value } = data;
    const {
      selectData: { smartSiftType },
      selectData,
    } = this.state;
    let flag = smartSiftType
      .map((item) => {
        return item.value;
      })
      .includes(value);
    if (flag) {
      this.setState(
        {
          selectData: {
            ...selectData,
            smartSiftType: smartSiftType.filter((item) => {
              return item.value !== data.value;
            }),
          },
        },
        (res) => {
          this.setState(
            {
              countStatus: true,
              httpData: {
                page: 1,
                limit: 10,
                ...filterSelectData(this.state.selectData).data,
              },
            },
            (res) => {
              this.fetchList(true);
            }
          );
        }
      );
    } else {
      this.setState(
        {
          selectData: {
            ...selectData,
            smartSiftType: [...smartSiftType, { ...data }],
          },
        },
        (res) => {
          this.setState(
            {
              countStatus: true,
              httpData: {
                page: 1,
                limit: 10,
                ...filterSelectData(this.state.selectData).data,
              },
            },
            (res) => {
              this.fetchList(true);
            }
          );
        }
      );
    }
  }
  onReachBottom() {
    const { httpData, countStatus } = this.state;
    if (countStatus) {
      this.setState(
        {
          httpData: {
            ...httpData,
            page: httpData.page + 1,
          },
        },
        (res) => {
          this.fetchList();
        }
      );
    } else {
    }
  } //????????????
  render() {
    const {
      userMerchantList,
      httpData,
      keyword,
      status,
      visible,
      selectList,
      selectData,
      selectList: {},
      initRes,
    } = this.state;

    const templateActivity = (item) => {
      const {
        specialGoodsFlag,
        markFlag,
        couponFlag,
        couponList = [],
        specialGoodsAmount,
        markBean,
      } = item;
      if (
        specialGoodsFlag !== "1" &&
        markFlag !== "1" &&
        couponList.length === 0
      ) {
        return null;
      } else {
        return (
          <View className="page_shop_active">
            {markFlag === "1" && (
              <View className="template_bean">????????????{markBean}</View>
            )}
            {specialGoodsFlag === "1" && specialGoodsAmount != 0 && (
              <View className="template_specal">
                <View className="template_icon1 public_center">
                  <View className="template_hui"></View>
                </View>
                <View className="template_text1">
                  {specialGoodsAmount}??????????????????
                </View>
              </View>
            )}
            {couponList.length > 0 && (
              <View className="template_coupon">
                <View className="template_icon2 public_center">
                  <View className="template_cou"></View>
                </View>
                <View
                  style={
                    specialGoodsFlag === "1"
                      ? {}
                      : { maxWidth: Taro.pxTransform(380) }
                  }
                  className="template_text2 font_hide"
                >
                  {couponList
                    .map(({ buyPrice, couponPrice }) => {
                      return `${buyPrice}??????${couponPrice}???`;
                    })
                    .join(",")}
                </View>
              </View>
            )}
          </View>
        );
      }
    };
    const template = (item) => {
      const {
        perCapitaConsumption,
        categoryName,
        districtName,
        businessHub,
        markFlag,
        markBean,
        coverImg,
        logoImg,
        specialGoodsFlag,
        specialGoodsAmount,
        brandFlag,
        couponList = [],
        lat,
        lnt,
        merchantName,
        address,
        merchantId,
        businessTime,
        businessStatus,
        tag,
      } = item;
      return (
        <View
          className="template_shop_box"
          onClick={() =>
            Router({
              routerName: "merchantDetails",
              args: {
                merchantId: merchantId,
              },
            })
          }
        >
          <View className="template_shop_detailsBox">
            <View
              className="template_shop_img"
              style={backgroundObj(
                logoImg ||
                  "https://wechat-config.dakale.net/miniprogram/image/merchant_dakale.png"
              )}
            ></View>
            <View className="template_shop_font">
              <View className="template_shop_merchantName font_hide">
                {merchantName}
              </View>
              <View className="template_shop_bussionTime font_hide">
                {businessTime && (
                  <View
                    className={classNames(
                      "bussionTime_tag",
                      businessStatus === "1"
                        ? "bussionTime_tag_color1"
                        : "bussionTime_tag_color2"
                    )}
                  >
                    <Text className="font22 bold">
                      {businessStatus === "1" ? "?????????" : "????????????"}
                    </Text>
                    <Text
                      className={classNames(
                        "bussionTime_liner bussionTime_margin",
                        businessStatus === "1"
                          ? "bussionTime_liner_color1"
                          : "bussionTime_liner_color2"
                      )}
                    ></Text>
                    <Text className="bussionTime_margin font22 bold">
                      {businessTime}
                    </Text>
                  </View>
                )}
              </View>
              <View className="template_shop_peoplePay">
                <View className="template_peopleLeft">
                  ?????????{perCapitaConsumption}
                </View>
                <View className="template_peopleRight public_center">
                  {filterStrList(tag).map((item, index) => {
                    if (index < 2) {
                      return (
                        <View className="template_tags font_hide">{item}</View>
                      );
                    }
                  })}
                </View>
              </View>
              <View className="template_shop_address">
                <View className="template_shop_addressFont font_hide">
                  {" "}
                  {categoryName + " " + address}
                </View>
                <View className="template_shop_limit">
                  {GetDistance(getLat(), getLnt(), lat, lnt)}
                </View>
              </View>
            </View>
          </View>
          {templateActivity(item)}
        </View>
      );
    };
    const {
      length,
      data,
      data: { smartSiftType = "", scenesId = "", configWindVaneId },
    } = filterSelectData(selectData);
    if (status === 0) {
      return (
        <View className="perimeter_shop_box">
          <View className="perimeter_shop_searchTitle public_auto">
            <View
              className="perimeter_shop_searchInput"
              onClick={() =>
                this.setState({
                  keyword: "",
                  status: 1,
                })
              }
            >
              {keyword || "???????????????????????????"}
            </View>
            <View
              className="perimeter_shop_scan"
              onClick={() => scanCode()}
            ></View>
          </View>
          <View className="perimeter_shop_select">
            <View
              className="perimeter_select_left"
              onClick={() => this.setState({ visible: true })}
            >
              <View className="perimeter_select_icon"></View>
              <View className="perimeter_select_font">??????</View>
              {length > 0 && (
                <View className="perimeter_select_count public_center">
                  {length}
                </View>
              )}
            </View>

            <View className="perimeter_select_right" scrollX>
              {initRes &&
                selectList[1].list.map((item) => {
                  const { description, value } = item;
                  return (
                    <View
                      onClick={() => this.setActiveCard(item)}
                      style={
                        smartSiftType.includes(value)
                          ? { border: "1px solid #07c0c2" }
                          : { border: "1px solid #999999" }
                      }
                      className={classNames(
                        "select_top_tagBox",
                        smartSiftType.includes(value)
                          ? "select_top_tagColor2"
                          : "select_top_tagColor1"
                      )}
                    >
                      {description}
                    </View>
                  );
                })}
              {/* {initRes &&
                  selectList[selectList.length - 2].list.map((item) => {
                    const { name } = item;
                    return (
                      <View
                        onClick={() => this.setActiveShop(item)}
                        className={classNames(
                          "select_top_tagBox",
                          configWindVaneId.includes(item.configWindVaneId)
                            ? "select_top_tagColor2"
                            : "select_top_tagColor1"
                        )}
                      >
                        {name}
                      </View>
                    );
                  })} */}
            </View>
          </View>
          <ScrollView
            className="perimeter_shop_scrollBox"
            onScrollToLower={() => {
              if (this.state.countStatus) {
                this.setState(
                  {
                    httpData: {
                      ...httpData,
                      page: this.state.httpData.page + 1,
                    },
                  },
                  (res) => {
                    this.fetchList();
                  }
                );
              }
            }}
            scrollY
          >
            <View className="perimeter_shop_scroll">
              {userMerchantList.length > 0 ? (
                userMerchantList.map((item) => {
                  return <View>{template(item)}</View>;
                })
              ) : (
                <View>
                  <View className="shop_init_nullStatus"></View>
                  <View className="shop_init_nullfont">??????????????????</View>
                </View>
              )}
            </View>
          </ScrollView>
          {visible && (
            <SelectList
              onClose={() =>
                this.setState({
                  visible: false,
                })
              }
              onConfirm={(e, list) => {
                this.setState(
                  {
                    selectData: e,
                    countStatus: true,
                    httpData: {
                      page: 1,
                      limit: 10,
                      ...filterSelectData(e).data,
                    },
                    selectList: list,
                  },
                  (res) => {
                    this.fetchList(true);
                  }
                );
              }}
              selectData={selectData}
              data={selectList}
              visible={visible}
            ></SelectList>
          )}
        </View>
      );
    } else
      return (
        <ShopView
          close={() =>
            this.setState({
              keyword: "",
              status: 0,
            })
          }
          keyword={keyword}
          onConfirm={keyword && this.searchDetails.bind(this)}
          onInput={this.searchDetails.bind(this)}
        ></ShopView>
      );
  }
}

export default index;
