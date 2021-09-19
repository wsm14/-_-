import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text, PickerView, PickerViewColumn } from "@tarojs/components";
import { getUserMarkTrack } from "@/server/user";
import "./index.scss";
import { toast } from "@/common/utils";
import NullStatus from '@/components/nullStatus'
class Record extends Component {
  constructor() {
    super(...arguments);
    const date = new Date();
    const years = [];
    const months = [];
    for (let i = 1; i <= 12; i++) {
      months.push(i);
    }
    for (let i = 2020; i <= date.getFullYear(); i++) {
      years.push(i);
    }
    this.state = {
      years: years,
      year: date.getFullYear(),
      months: months,
      month: date.getMonth() + 1,
      value: [9999, parseInt(date.getMonth())],
      visible: false,
      userMarkList: [],
      getHttpServer: {
        page: 1,
        limit: 10,
        markMonth: "",
      },
      countStatus: true,
    };
  }
  componentDidShow() {
    this.getlistCard();
  }
  getBean() {
    let bean = 0;
    if (this.state.userMarkList && this.state.userMarkList.length > 0) {
      this.state.userMarkList.forEach((item) => {
        bean += parseInt(item.beanAmount);
      });
    }
    return bean;
  }
  getlistCard() {
    const { getHttpServer, month, year } = this.state;
    this.setState(
      {
        getHttpServer: {
          ...getHttpServer,
          page: 1,
          limit: 10,
          markMonth: year + "-" + month,
        },
        countStatus: true,
        visible: false,
      },
      (res) => {
        this.getList();
      }
    );
  }
  getList() {
    const { getHttpServer } = this.state;
    getUserMarkTrack(getHttpServer, (res) => {
      const { userMarkList = [] } = res;
      if (userMarkList && userMarkList.length > 0) {
        this.setState({
          userMarkList: userMarkList,
        });
      } else {
        this.setState({
          countStatus: false,
        });
      }
    });
  }
  onChange = (e) => {
    const val = e.detail.value;
    this.setState({
      year: this.state.years[val[0]],
      month: this.state.months[val[1]],
      value: val,
    });
  };

  onReachBottom() {
    const { getHttpServer, countStatus } = this.state;
    if (countStatus) {
      this.setState(
        {
          getHttpServer: {
            ...getHttpServer,
            page: getHttpServer.page + 1,
          },
        },
        (res) => {
          this.getList();
        }
      );
    } else {
    }
  } //上拉加载

  render() {
    const {
      year,
      month,
      visible,
      userMarkList,
      getHttpServer: { markMonth },
    } = this.state;
    return (
      <View className="record_box">
        {visible ? (
          <View
            className="record_selected"
            onClick={() => this.setState({ visible: false })}
          >
            <View
              className="record_selectedBox"
              onClick={(e) => e.stopPropagation()}
            >
              <View className="record_selectTitle">
                <Text className="record_selectTitleIcon">
                {markMonth === new Date().getFullYear() + "-" + (new Date().getMonth() + 1)
                ? "本月"
                : markMonth}
                </Text>
              </View>
              <View className="record_date">
                {year}-{month >= 10 ? parseInt(month) : "0" + parseInt(month)}
              </View>
              <PickerView
                indicatorClass="record_PickerViewColumn"
                style={{
                  width: "100%",
                  height: Taro.pxTransform(400),
                  textAlign: "center",
                }}
                value={this.state.value}
                onChange={this.onChange}
              >
                <PickerViewColumn className="record_PickerViewColumn">
                  {this.state.years.map((item, index) => {
                    return (
                      <View
                        style={{
                          lineHeight: "34px",
                        }}
                        key={index}
                      >
                        {item}年
                      </View>
                    );
                  })}
                </PickerViewColumn>
                <PickerViewColumn className="record_PickerViewColumn">
                  {this.state.months.map((item, index) => {
                    return (
                      <View
                        style={{
                          lineHeight: "34px",
                        }}
                        key={index}
                      >
                        {item}月
                      </View>
                    );
                  })}
                </PickerViewColumn>
              </PickerView>
              <View className="record_buttonBox cleanfix">
                <View
                  className="record_button record_buttonReload"
                  onClick={() => this.setState({ visible: false })}
                >
                  取消
                </View>
                <View
                  className="record_button record_buttonSubmit"
                  onClick={() => this.getlistCard()}
                >
                  完成
                </View>
              </View>
            </View>
          </View>
        ) : null}
        <View
          className="record_timeSelect cleanfix"
          onClick={() => this.setState({ visible: true })}
        >
          <View>
            <Text>
              {markMonth === new Date().getFullYear() + "-" + (new Date().getMonth() + 1)
                ? "本月"
                : markMonth}
            </Text>
          </View>
          <View>
            <Text>得{this.getBean()}</Text>
          </View>
        </View>
        {userMarkList.length === 0 &&  <NullStatus  type={3}></NullStatus>}
       
        {userMarkList.map((item) => {
          return (
            <View key={item.merchantId} className="record_cardDetails">
              <View className="record_cardList">
                <View className="record_listTitle f">
                  <View>
                    <Text>{item.merchantName}</Text>
                  </View>
                  <View>打卡成功</View>
                </View>
                <View className="record_listline"></View>
                <View className="record_listDefnite f">
                  <View
                    className="record_listImg"
                    style={{
                      background: `url(${item.coverImg}) no-repeat center/cover`,
                    }}
                  ></View>
                  <View className="record_listCondition">
                    <View>打卡时间：{item.markTime}</View>
                    <View>
                      得<Text>{item.beanAmount}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  }
}

export default Record;
