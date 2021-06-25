import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image, Text, Video } from "@tarojs/components";
import { getGuildMomentDetail } from "@/server/share";
import {
} from "@/common/utils";
import { getSpecialGoodsDetail, getOwnerCouponDetail, getMerchantDetail } from "@/server/perimeter";
import Router from "@/common/router";
import classNames from "classnames";
import { ShopView, CardView, newShopView, meShopView_box } from './components/view'
import './index.scss'
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      guildMomentDetail: {},
      player: true,
      scale: 0,
      walk: false,
      time: 0,
      httpData: {
        ...getCurrentInstance().router.params
      },
      infoData: {}
    }
  }
  componentWillMount() {

  }
  componentDidMount() {
    this.fetchMomentDetails()
    this.filterRelated()
  }
  componentDidShow() {

  }

  fetchGoodsById() {
    const { httpData } = this.state;
    getSpecialGoodsDetail(httpData, res => {
      const {
        specialGoodsInfo,
      } = res;
      this.setState({
        infoData: specialGoodsInfo,
      });
    })
  }
  fetchMomentDetails() {
    getGuildMomentDetail({}).then((val) => {
      const { guildMomentDetail } = val
      this.setState({
        guildMomentDetail
      })
    })
  }
  fetchCouponDetail() {
    const { httpData } = this.state;
    getOwnerCouponDetail(httpData, (res) => {
      const { couponDetail } = res;
      const { reduceObject = {} } = couponDetail;
      this.setState({
        infoData: { ...couponDetail, ...reduceObject },
      });
    });
  }
  fetchMerchantById() {
    const { httpData } = this.state;
    getMerchantDetail(httpData, res => {
      const { userMerchant } = res;
      this.setState(
        {
          infoData: { ...userMerchant },
        })
    })
  }
  filterRelated() {
    const { httpData: {
      type = 'default'
    } } = this.state
    switch (type) {
      case 'goods': this.fetchGoodsById(); break;
      case 'coupon': this.fetchCouponDetail(); break;
      case 'merchant': this.fetchMerchantById(); break;
      case 'video': return;
    }
  }
  onShareAppMessage(res) {

  }

  render() {
    const {
      guildMomentDetail,
      guildMomentDetail: {
        videoContent,
        length,
        watchStatus,
        message
      },
      player,
      scale,
      walk,
      time,
      httpData: {
        username = '',
        type
      }
    } = this.state;
    const filterObject = (str) => {
      if (str) {
        return JSON.parse(str)
      }
      else {
        return {}
      }
    }
    const template = {

    }[type]
    return (
      <View className="userNewArtist_box">
        <View className='userNewArtist_image'></View>
        <View className='userNewArtist_video'>
          <View
            onClick={() => {
              Router({
                routerName: "beanReward",
              });
            }}
            className={classNames(
              "video_animate",
              watchStatus === "1" ? "video_animate_bg2" : "video_animate_bg1"
            )}
          >
            <View
              className={classNames(
                watchStatus === "1" ? "video_animate_padding" : "video_animate_time"
              )}
            >
              {watchStatus === "1"
                ? "已领"
                : parseInt(length - time)}
            </View>
          </View>
          <Video
            className='userNewArtist_video_style'
            controls={false}
            src={filterObject(videoContent).url}
            enableProgressGesture={false}
            autoplay={true}
            loop={true}
            onWaiting={(e) => {
              this.setState({
                walk: true
              })
            }}
            onTimeUpdate={(e) => {
              const { currentTime, duration } = e.detail;
              this.setState({
                scale: ((currentTime / duration) * 100).toFixed(2),
                time: parseInt(currentTime),
                walk: false,
                player: true
              })
            }}
            objectFit={'cover'}
          ></Video>
          {player && <View className='userNewArtist_video_stop'></View>}
          <View className="video_liner">
            {walk ? (
              <View className="video_loadding"></View>
            ) : (
              <View
                style={{
                  height: "100%",
                  width: `${scale}%`,
                  background: "rgba(255, 235, 165, 1)",
                }}
              ></View>
            )}

          </View>
        </View>
        {message && <View className='userNewArtist_message font_noHide'>{message}</View>}
        <View className='userNewArtist_user'>来自<Text className='bold'>{'@' + username}</Text>的诚意推荐</View>
      </View>
    );
  }
}

export default Index;
