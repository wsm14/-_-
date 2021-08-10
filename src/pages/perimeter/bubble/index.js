import React from "react";
import { View, Image } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import Banner from "@/components/banner";
import {
  filterStrList,
  computedWinHeight,
  computedSize,
  setNavTitle,
  getDom,
} from "@/common/utils";
import { getCategory, getBusinessHub } from "@/server/common";
import {
  fetchSpecialGoods,
  fetchListCouponByFilterType,
  fetchRecommendMerchantList,
  fetchUserShareCommission,
} from "@/server/index";
import Goods from "./components/goods";
import Coupon from "./components/coupon";
import Shop from "./components/shop";
import FilterDropdown from "@/components/componentView/filterDropdown";
import classNames from "classnames";
import "./index.scss";
import Router from "@/common/router";
class Index extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      bannerImage:
        getCurrentInstance().router.params.bannerImage ||
        "https://wechat-config.dakale.net/miniprogram/image/icon714.png",
      categoryName: getCurrentInstance().router.params.categoryName,
      categoryIds: getCurrentInstance().router.params.categoryId,
      httpData: {
        categoryIds: getCurrentInstance().router.params.categoryId,
        page: 1,
        limit: 10,
        distance: "",
        businessHubId: "",
        keyword: "",
        goodsTags: "",
      },
      specialGoodsList: [],
      couponList: [],
      userMerchantList: [],
      configUserLevelInfo: {},
      selectList: [],
      height: 0,
      size: 0,
      isFixedTop: false,
    };
  }
  componentWillMount() {
    this.setState({
      height: computedSize(computedWinHeight()),
    });
    setNavTitle(getCurrentInstance().router.params.categoryName);
  }
  setNavTop() {
    this.setState({}, (res) => {
      Taro.nextTick(() =>
        Taro.createSelectorQuery()
          .select(".bubble_merchant_box")
          .boundingClientRect((rect) => {
            if (rect && rect.top > 0) {
              let size = parseInt(rect.top);

              this.setState({
                size: size,
              });
            }
          })
          .exec()
      );
    });
  }

  computedPageScroll(e) {
    const { size, isFixedTop } = this.state;
    const scrollTop = parseInt(e.scrollTop); //滚动条距离顶部高度
    //判断'滚动条'滚动的距离 和 '元素在初始时'距顶部的距离进行判断
    const isSatisfy = scrollTop >= size ? true : false;
    // 只有处于吸顶的临界值才会不相等
    if (isFixedTop === isSatisfy) {
      return false;
    }
    this.setState({
      isFixedTop: isSatisfy,
    });
  }

  componentDidMount() {
    this.fetchMerchantList();
    this.initSelect();
  }
  initSelect() {
    Promise.all([
      getCategory({ parentId: "0" }, () => {}),
      getBusinessHub({}),
      fetchSpecialGoods({
        page: 1,
        limit: 6,
        categoryIds: this.state.categoryIds,
      }),
      fetchListCouponByFilterType({
        page: 1,
        limit: 6,
        categoryIds: this.state.categoryIds,
      }),
    ]).then((val = []) => {
      const { businessHubList = [] } = val[1];
      const { categoryList = [] } = val[0];
      const { specialGoodsList } = val[2];
      const { couponList } = val[3];
      this.setState(
        {
          selectList: [
            {
              name: "附近",
              type: "near",
              list: [
                {
                  name: "附近",
                  type: "near",
                  list: [
                    { value: "", description: "附近" },
                    { value: "500", description: "500m" },
                    { value: "1000", description: "1km" },
                    { value: "2000", description: "2km" },
                    { value: "5000", description: "5km" },
                    { value: "10000", description: "10km" },
                    { value: "20000", description: "20km" },
                  ],
                },
              ],
              hubList: businessHubList.map((item) => {
                const { businessHubList, districtCode } = item;
                return {
                  ...item,
                  businessHubList: [
                    {
                      districtCode,
                      businessHubName: "全部",
                      type: "all",
                    },
                    ...businessHubList,
                  ],
                };
              }),
            },
            {
              name: "品类",
              type: "category",
              list: [
                {
                  categoryIdString: "",
                  categoryName: "全部",
                  categoryDTOList: [],
                  type: "father",
                },
                ...categoryList.map((item) => {
                  const {
                    categoryName,
                    categoryIdString,
                    categoryDTOList = [],
                  } = item;
                  return {
                    ...item,
                    categoryDTOList: [
                      {
                        categoryDTOList: [],
                        fatherId: categoryIdString,
                        categoryName: "全部",
                        type: "all",
                      },
                      ...categoryDTOList,
                    ],
                  };
                }),
              ],
            },
          ],
          specialGoodsList: specialGoodsList,
          couponList: couponList,
        },
        (res) => {
          Taro.nextTick(() => this.setNavTop());
        }
      );
    });
  }
  onPageScroll(res) {
    this.computedPageScroll(res);
  }
  changeSelect(val) {
    const { httpData } = this.state;
    this.setState(
      {
        httpData: {
          ...httpData,
          ...val,
          page: 1,
        },
        userMerchantList: [],
      },
      (res) => {
        this.fetchMerchantList();
      }
    );
  }
  fetchUserShare() {
    fetchUserShareCommission({}, (res) => {
      const { configUserLevelInfo = {} } = res;
      this.setState({
        configUserLevelInfo,
      });
    }).catch((e) => {});
  }
  componentDidShow() {
    this.fetchUserShare();
  }

  fetchMerchantList() {
    const { httpData } = this.state;
    fetchRecommendMerchantList({ ...httpData }, (res) => {
      const { userMerchantList = [] } = res;
      this.setState({
        userMerchantList: [...this.state.userMerchantList, ...userMerchantList],
      });
    });
  }
  onReachBottom() {
    this.onPageUp();
  }
  onPageUp() {
    const { httpData } = this.state;
    this.setState(
      {
        httpData: {
          ...httpData,
          page: httpData.page + 1,
        },
      },
      (res) => {
        this.fetchMerchantList();
      }
    );
  } //上拉加载
  //获取商家轮播图
  render() {
    const {
      bannerImage = "",
      categoryName = "搜吃喝玩乐",
      categoryIds = "",
      specialGoodsList,
      couponList,
      userMerchantList,
      configUserLevelInfo,
      selectList,
      height,
      isFixedTop,
      httpData: { goodsTags },
      size,
    } = this.state;
    return (
      <View className="bubble_box">
        <View className="bubble_top">
          <Image
            mode={"aspectFill"}
            src={
              "https://wechat-config.dakale.net/miniprogram/image/icon712.png"
            }
            lazyLoad
            className="bubble_top_image"
          ></Image>
          <View
            className="bubble_top_search"
            onClick={() => Router({ routerName: "search_shop" })}
          >
            搜吃喝玩乐~
          </View>
          <View className="bubble_banner_card">
            <Banner
              autoplay={filterStrList(bannerImage).length > 1 ? true : false}
              imgStyle
              data={filterStrList(bannerImage) || []}
              style={{ width: "100%", height: "100%" }}
              boxStyle={{ width: "100%", height: "100%" }}
            ></Banner>
          </View>
        </View>
        {specialGoodsList.length > 0 && (
          <Goods
            name={categoryName}
            categoryIds={categoryIds}
            userInfo={configUserLevelInfo}
            list={specialGoodsList}
          ></Goods>
        )}
        {couponList.length > 0 && (
          <Coupon
            name={categoryName}
            categoryIds={categoryIds}
            userInfo={configUserLevelInfo}
            list={couponList}
          ></Coupon>
        )}
        <View className="bubble_tab_box">
          <View
            catchMove
            className={classNames(
              isFixedTop ? "bubble_merchant_box1" : "bubble_merchant_box"
            )}
          >
            <View className="bubble_merchant_title">
              <View className="bubble_merchant_titleFont">附近商家</View>
            </View>
            <FilterDropdown
              filterData={selectList}
              confirm={(e) => {
                this.changeSelect(e);
              }}
              top={!isFixedTop}
              configUserLevelInfo={configUserLevelInfo}
              dataFormat="Object"
              defaultData={categoryIds}
              scrollName=".bubble_merchant_box"
              callback={(e) =>
                this.setState(
                  ({},
                  (res) => {
                    e && e();
                  })
                )
              }
              setTop={{
                falgNav: true,
                setNav: 0,
              }}
            ></FilterDropdown>
          </View>
        </View>

        <View className="bubble_merchant_liner"></View>
        <Shop
          flag={isFixedTop}
          height={height}
          userInfo={configUserLevelInfo}
          list={userMerchantList}
        ></Shop>
      </View>
    );
  }
}
export default Index;