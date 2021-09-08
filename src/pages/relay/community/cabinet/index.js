import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { fetchLiftingCabinet } from "@/server/relay";
import classNames from "classnames";
import ImageShow from "@/relay/components/ImageShow";
import { getLat, getLnt, GetDistance } from "@/common/utils";
import evens from "@/common/evens";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      communityOrganizationId:
        getCurrentInstance().router.params.communityOrganizationId,
      ownerId: getCurrentInstance().router.params.ownerId,
      communityLiftingCabinetId:
        getCurrentInstance().router.params.communityLiftingCabinetId,
      communityLiftingCabinetList: [],
    };
  }
  componentDidMount() {
    this.fetchList();
  }
  componentDidShow() {}
  fetchList() {
    const { communityOrganizationId, ownerId } = this.state;
    fetchLiftingCabinet({ communityOrganizationId, ownerId }).then((val) => {
      const { communityLiftingCabinetList } = val;
      this.setState({
        communityLiftingCabinetList,
      });
    });
  }
  componentWillUnmount() {
    evens.$emit("setCabinetId", this.state.communityLiftingCabinetId);
  }
  fetchLiftingCabinet;
  //获取地址列表
  render() {
    const { communityLiftingCabinetId, communityLiftingCabinetList } =
      this.state;
    return (
      <View className="cabinet_box">
        {communityLiftingCabinetList.map((item) => {
          const {
            address,
            lat,
            lnt,
            mobile,
            liftingName,
            contactPerson,
            images = "",
          } = item;
          return (
            <View
              onClick={() => {
                this.setState({
                  communityLiftingCabinetId: item.communityLiftingCabinetId,
                });
              }}
              className="cabinet_template_box"
            >
              <View className="cabinet_template_address">
                <Text className="font28 color1">{liftingName}</Text>
                <Text className="font24 color2">
                  ｜{GetDistance(getLat(), getLnt(), lat, lnt)}
                </Text>
              </View>
              <View className="cabinet_template_xxaddress color2 font24">
                {address}
              </View>
              <View className="cabinet_template_set font24 color1">
                联系人：{contactPerson} {mobile}
              </View>
              <View
                className={classNames(
                  "cabinet_template_checkBox",
                  communityLiftingCabinetId === item.communityLiftingCabinetId
                    ? "cabinet_template_check"
                    : "cabinet_template_noCheck"
                )}
              ></View>
              {images && images !== " " && (
                <ImageShow
                  className="cabinet_template_image"
                  width={160}
                  src={images}
                ></ImageShow>
              )}
            </View>
          );
        })}
      </View>
    );
  }
}

export default Index;
