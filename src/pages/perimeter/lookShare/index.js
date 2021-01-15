import React from "react";
import Taro, { getCurrentPages } from "@tarojs/taro";
import { Image, View } from "@tarojs/components";
import classNames from "classnames";
import Selects from "./components/select/index";
import { createFall, createFull } from "./components/content";
import { getListMomentByType } from "@/server/perimeter";
import "./index.scss";
import { toast, getDom } from "@/common/utils";
import Waterfall from "@/components/waterfall";
import { Animates3 } from "@/common/animates";
class Index extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        page: 1,
        limit: 10,
        categoryId: "",
        distance: "",
      },
      countStatus: true,
      userMomentsList: [],
      mode: 0,
      // animates: "1",
    };
  }

  componentDidMount() {
    this.getListMoments();
  }
  // componentDidShow() {
  //   let that = this;
  //   that.setState({
  //     animates: Animates3({ duration: 2000 }).export(),
  //   });
  // }
  updateSelect(obj) {
    const { httpData } = this.state;
    this.setState(
      {
        userMomentsList: [],
        httpData: {
          ...httpData,
          page: 1,
          ...obj,
        },
        countStatus: true,
      },
      (res) => {
        this.getListMoments();
      }
    );
  }

  setView(index) {
    const { mode } = this.state;
    if (mode === index) {
      return;
    }

    this.setState(
      {
        mode: index,
      },
      (res) => {
        Taro.pageScrollTo({
          selector: ".page_look_center",
          scrollTop: 0,
        });
      }
    );
  }
  getListMoments() {
    const { httpData } = this.state;
    getListMomentByType(httpData, (res) => {
      console.log(res);
      const { userMomentsList } = res;
      if (userMomentsList && userMomentsList.length > 0) {
        this.setState({
          userMomentsList: [...this.state.userMomentsList, ...userMomentsList],
        });
      } else {
        this.setState({
          countStatus: false,
        });
      }
    });
  }
  onReachBottom() {
    const { httpData, countStatus } = this.state;
    if (countStatus) {
      this.setState(
        {
          httpData: { ...httpData, page: httpData.page + 1 },
        },
        (res) => {
          this.getListMoments();
        }
      );
    } else toast("暂无更多");
  }

  render() {
    const { userMomentsList, mode } = this.state;
    const viewObj = {
      0: (
        <Waterfall
          list={userMomentsList}
          createDom={createFall}
          imgHight={"frontImageHeight"}
          imgWidth={"frontImageWidth"}
          setWidth={335}
          maxHeight={420}
          style={{ width: Taro.pxTransform(335) }}
        ></Waterfall>
      ),
      1: userMomentsList.map((item) => {
        return createFull(item);
      }),
    }[mode];
    return (
      <View className="page_lookShare">
        <Selects
          modeFn={this.setView.bind(this)}
          selects={this.updateSelect.bind(this)}
        ></Selects>
        <View className="page_look_center">
          {userMomentsList.length === 0 && (
            <>
              <View className="null_list"></View>
              <View className="null_font">还没有内容哦～</View>
            </>
          )}
          {viewObj}
        </View>
      </View>
    );
  }
}

export default Index;
