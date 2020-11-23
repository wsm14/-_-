import React, {Component} from 'react'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {Input, ScrollView, Swiper, SwiperItem, View} from '@tarojs/components'
import Banner from '@/components/banner'
import {wxapiGet, index, perimeter} from '@/api/api'
import {httpGet} from '@/api/newRequest'
import NallStatus from '@/components/nullStatus'
import Favourable from './components/favourable'
import Waterfall from '@/components/waterfall'
import {
  login,
  authGeography
} from '@/common/authority'
import {
  filterLogin,
  navigateTo,
  backgroundObj,
  setPeople,
  computedHeight,
  filterTime,
  NavHeight,
  toast,
  GetDistance,
  goDown
} from '@/common/utils'
import classNames from 'classnames'
import './perimeter.scss'
import {inject, observer} from "mobx-react";

@inject('store')
@observer
class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      bannerHttp: {
        bannerType: 'main'
      },
      surroundingSpecial: [],
      bannerList: [],
      userDetails: {},
      domainList: [],
      selectIndex: 0,
      topicList: [],
      scroll_left: 0,
      kolHttp: {
        domainId: '',
        topicId: '',
        page: 1,
        limit: 10
      },
      kolMomentsList: [],
      navHeight: {paddingTop: Taro.pxTransform(64)},
      setBackGround: {},
      iconStatus: false,
      countStatus: true,
      subKeyValueList: [],
      specialGoods: {
        page: 1,
        limit: 10
      }
    }
  }
  //获取个人足迹
  onPageScroll(e) {
    const {setBackGround} = this.state
    let scale = 0
    if (e.scrollTop >= 125) {
      this.setState({
        setBackGround: {
          color: 'rgba(51, 51, 51, 1)',
          background: 'rgba(255, 255, 255, 1)'
        },
        iconStatus: true
      })
    } else {
      scale = e.scrollTop / 125
      this.setState({
        setBackGround: {
          background: `rgba(255, 255, 255, ${scale})`
        },
        iconStatus: false
      })
    }
  }

  getBanner(data, val) {
    const {wechatBanner} = wxapiGet
    httpGet({
      data: data,
      url: wechatBanner
    }, res => {
      const {bannerList} = res
      this.setState({
        [val]: bannerList
      })
    })
  }

  getUserSimpleInfo() {
    const {perimeter: {getUserSimpleInfo}} = index
    httpGet({
      data: {},
      url: getUserSimpleInfo
    }, res => {
      this.setState({
        userDetails: {
          ...res
        }
      })
    })
  }

  getDomain() {
    const {perimeter: {getDomain}} = index
    httpGet({
      data: {},
      url: getDomain
    }, res => {
      const {domainList} = res
      this.setState({
        domainList,
        topicList: domainList[0].topicList || []
      })
    })
  }

  setTicName(item, index) {
    const str = 'topicId'
    const {topicList} = item
    this.setState({
      topicList: topicList || [],
      selectIndex: index,
      countStatus: true,
      checkedList: [],
      kolMomentsList: [],
      kolHttp: {
        domainId: item.domainId || '',
        topicId: '',
        page: 1,
        limit: 10
      }
    }, res => {
      const {selectIndex} = this.state;
      if (selectIndex > 2) {
        this.setState({
          scroll_left: 70 * (selectIndex - 2)
        })
      }
      this.getKolList()
    })

  }

  setTopic(item) {
    const {topicId} = item
    const {kolHttp} = this.state
    if (kolHttp.topicId === topicId) {
      this.setState({
        kolHttp: {
          ...kolHttp,
          page: 1,
          limit: 10,
          topicId: ''
        },
        kolMomentsList: [],
      }, res => {
        this.getKolList()
      })
    } else {
      this.setState({
        kolHttp: {
          ...kolHttp,
          page: 1,
          limit: 10,
          topicId: topicId,
        },
        kolMomentsList: [],
      }, res => {
        this.getKolList()
      })
    }
  }

  getSetting() {
    const {perimeter: {getSetting}} = index
    httpGet({
      url: getSetting,
      data: {
        parent: 'mainFunction'
      }
    }, res => {
      const {keyValueList} = res
      let subKeyValueList = keyValueList['subKeyValueList'].map(item => {
        return JSON.parse(item.extraParam)
      })
      this.setState({
        subKeyValueList
      })
    })
  }

  getKolList() {
    const {kolHttp} = this.state
    const {perimeter: {getListKol}} = index
    httpGet({
      data: kolHttp,
      url: getListKol
    }, res => {
      const {kolMomentsList} = res
      if (kolMomentsList && kolMomentsList.length > 0) {
        this.setState({
          kolMomentsList: [...this.state.kolMomentsList, ...kolMomentsList]
        })
      } else {
        this.setState({
          countStatus: false
        }, res => {
          toast('暂无数据')
        })
      }
    })

  }


  createdShareMerchant = (item) => {
      const {lnt, lat} = this.state
      const {
        frontImage,
        frontImageHeight,
        frontImageWidth,
        merchantName,
        contentType,
        length,
        topicName,
        title,
        watchStatus,
        beanAmount,
        userProfile,
        username,
        likeAmount,
        imageNum,
        merchantAddress,
        userLikeStatus,
        beanFlag,
        kolMomentsId,
        merchantLat,
        merchantLnt
      } = item
      return (
        <View className='userDetails_falls_details' onClick={() => {
          if (contentType === 'video') {
            navigateTo(`/pages/kol/shareVideo/index?kolMomentId=${kolMomentsId}`)
          } else {
            navigateTo(`/pages/kol/shareImage/index?kolMomentId=${kolMomentsId}`)
          }
        }}>
          <View className='userDetails_falls_makebg'
                style={{
                  ...backgroundObj(frontImage),
                  height: Taro.pxTransform(computedHeight(frontImageWidth, frontImageHeight, 335))
                }}>
            {contentType == 'video' ?
              <View className='userDetails_share_imgTag'>
                {filterTime(length)}
              </View> :
              <View className='userDetails_share_videoTag'>
                <View className='userDetails_share_imgIcon'></View>
                <View className='userDetails_share_imgfont'>{imageNum}</View>
              </View>
            }
            <View className='userDetails_share_accress'>
              <View className='userDetails_share_limitIcon'></View>
              <View
                className='userDetails_share_limit'>{GetDistance(lat, lnt, merchantLat, merchantLnt) + ''} {merchantAddress || ''}  </View>
            </View>
          </View>
          <View className='userDetails_share_about'>
            {topicName && <View className='userDetails_share_tip'>{'#' + topicName}</View>}
            <View className='userDetails_share_title'>{title}</View>
            {beanFlag == '1' ?
              watchStatus == '1' ?
                <View className='userDetails_share_getBean getbeanColor2'>
                  已捡{beanAmount}豆
                </View>
                :
                <View className='userDetails_share_getBean getbeanColor1'>
                  观看可捡{beanAmount}豆
                </View>
              : null
            }

            <View className='userDetails_share_aboutUser'>
              <View className='userDetails_share_userbox'>
                <View style={{...backgroundObj(userProfile)}} className='userDetails_share_userProfile'>

                </View>
                <View className='userDetails_share_userName'>
                  {username}
                </View>
              </View>
              <View className='userDetails_share_status'>
                <View
                  className={classNames(userLikeStatus == '1' ? 'status_box userDetails_share_icon1' : 'status_box userDetails_share_icon2')}>
                </View>
                <View className='userDetails_share_nums'>{setPeople(likeAmount)}</View>
              </View>
            </View>
          </View>
        </View>
    )
  }
  setMap = (res) => {
    const {latitude, longitude} = res
    this.setState({
      lnt: longitude,
      lat: latitude
    })
  }

  componentDidMount() {
    const {bannerHttp, specialHttp} = this.state
    this.getKolList();
    NavHeight().then(res => {
      if (res) {
        this.setState({
          navHeight: {paddingTop: Taro.pxTransform(parseInt(res))}
        })
      }
    })
    authGeography((res) => this.setMap(res))
    this.getSetting()
    this.getBanner(bannerHttp, 'bannerList')
    // this.getUserSimpleInfo()
    this.getDomain()
  }
  componentDidShow() {
    this.getUserSimpleInfo()
  }

  // onPullDownRefresh() {
  //   const {bannerHttp, specialHttp} = this.state
  //   this.setState({
  //     userDetails: {},
  //     domainList: [],
  //     selectIndex: 0,
  //     topicList: [],
  //     scroll_left: 0,
  //     kolHttp: {
  //       domainId: '',
  //       topicId: '',
  //       page: 1,
  //       limit: 10
  //     },
  //     kolMomentsList: [],
  //     setBackGround: {},
  //     iconStatus: false,
  //     countStatus: true,
  //     surroundingSpecial: [],
  //     subKeyValueList: []
  //   }, res => {
  //     this.getKolList();
  //     this.getSetting()
  //     this.getBanner(bannerHttp, 'bannerList')
  //     this.getUserSimpleInfo()
  //     this.getDomain()
  //     authGeography((res) => this.setMap(res))
  //   })
  // }

  onReachBottom() {
    this.pageDown()
  }

  pageDown() {
    const {kolHttp, countStatus} = this.state
    if (countStatus) {
      this.setState({
        kolHttp: {
          ...kolHttp,
          page: kolHttp.page + 1
        }
      }, res => {
        this.getKolList()
      })
    } else {
      toast('暂无数据')
    }

  }

  errorToast(e) {
    this.setState({
      Toast: {
        status: 'error',
        text: e,
        isOpened: true
      }
    })
  }

  render() {
    const {
      bannerList,
      userDetails: {
        profile,
        username,
        userRealNameStatus,
        userBeanAmount,
        userTodayEarn,
        userCouponNum,
        userLevelSign,
        level
      },
      domainList,
      selectIndex,
      topicList,
      scroll_left,
      kolMomentsList,
      kolHttp: {topicId},
      navHeight,
      setBackGround,
      iconStatus,
      userDetails,
      subKeyValueList,
    } = this.state
    const {userInfo} = this.props.store.authStore
    return (
      <View className='perimerter_box'>
        {/*<View  style={setBackGround} className='perimerter_fixed'>*/}
        {/*  <View style={navHeight} className='perimerter_fixed_title'>*/}
        {/*    <View className='perimerter_title'>*/}
        {/*      <View className='perimerter_city'>*/}
        {/*        <View className={classNames('perimerter_city_box',iconStatus?'perimerter_city_icon2':'perimerter_city_icon1')}></View>*/}
        {/*        <View className='perimerter_city_font'>杭州</View>*/}
        {/*        <View className={classNames('perimerter_city_select',iconStatus?'perimerter_city_selectIcon2':'perimerter_city_selectIcon1')}></View>*/}
        {/*      </View>*/}
        {/*      周边*/}
        {/*    </View>*/}
        {/*    <View className='perimerter_search'>*/}
        {/*      <Input placeholderClass={classNames(iconStatus?'placeholder_style1':'placeholder_style2')} className={classNames(iconStatus?'perimerter_input2':'perimerter_input1')} placeholder={'搜一下附近玩乐'}></Input>*/}
        {/*      <View className={classNames('perimerter_codeBox',iconStatus?'perimerter_code2':'perimerter_code1')}></View>*/}
        {/*    </View>*/}
        {/*  </View>*/}
        {/*</View>*/}
        <View className='perimerter_top'>
          <Banner
            showNear={true}
            autoplay={bannerList.length > 1 ? true : false}
            imgStyle
            data={bannerList}
            imgName={'coverImg'}
            style={{width: '100%', height: '100%'}}
            boxStyle={{width: '100%', height: '100%'}}
          ></Banner>
        </View>
        {login(userInfo) !== '0' || Object.keys(userDetails).length < 5 ?
          <View className='perimerter_noUser' onClick={() => navigateTo('/pages/auth/index')}>
            <View className='perimerter_userProfile'></View>
            <View className='perimerter_userBox'>
              <View className='perimerter_userName'>登录哒卡乐星球</View>
              <View className='perimerter_details'>我有亿点本事“豆”你开心</View>
            </View>
            <View className='perimerter_btn'>
              {filterLogin(login(userInfo)) || '去授权'}
            </View>
          </View>
          :
          <View className='perimerter_card'>
            <View className='perimerter_userProfile' onClick={() => navigateTo('/pages/newUser/userDetails/index')}
                  style={backgroundObj(profile)}></View>
            <View className='perimerter_userBox'>
              <View className='perimerter_userName'>
                <View className='perimerter_userflow font_hide'>
                  {username || '--'}
                </View>
                <View
                  className={classNames('user_user_iconBox', userRealNameStatus === '1' ? 'perimerter_user_icon2' : 'perimerter_user_icon1')}>

                </View>
              </View>
              <View style={{visibility: 'hidden'}} className='perimerter_userKol'>
                {level === '0' ?
                  <View className='kol_icon1'>
                    <View className='kol_icon_bg'></View>
                    <View className='kol_icon_font'>
                      解锁哒人等级
                    </View>
                  </View> :
                  <View className='kol_icon2'>
                    <View className='kol_icon_bg'></View>
                    <View className='kol_icon_font'>
                      {userLevelSign || '无哒人名称'}
                    </View>
                  </View>
                }
              </View>
            </View>
            <View className='perimerter_getBean'>
              <View>
                卡豆余额{'  ' + setPeople(userBeanAmount || 0)}
              </View>
              <View className='perimerter_bean_liner'></View>
              <View>
                今日收益{'  ' + setPeople(userTodayEarn || 0)}
              </View>
            </View>
            <View className='perimerter_quan' onClick={() => goDown()}>{userCouponNum | 0}张券可用</View>
          </View>
        }
        {subKeyValueList.length > 0 &&
        <View className='perimerter_active'>
          <View className='perimerter_beanActive' onClick={() => goDown()}>
            <View className='perimerter_dec'>
              <View className='perimerter_title'>{subKeyValueList[0].title}</View>
              <View className='permerter_intertion permerter_interSize1'>{subKeyValueList[0].subtitle}</View>
              <View className='permerter_active_accress'>
                <View className='permerter_active_tag'>
                  <View className='permerter_active_cityIcon'></View>
                  <View className='permerter_active_cityFont'>
                    国泰科技大厦一楼
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View className='permerter_share'>
            <View className='permerter_share_look' onClick={() => navigateTo('/pages/index/lookShare/index')}>
              <View className='perimerter_dec'>
                <View className='perimerter_title'>{subKeyValueList[1].title}</View>
                <View className='permerter_intertion permerter_interSize2'>{subKeyValueList[1].subtitle}</View>
              </View>
            </View>
            <View className='permerter_share_game' onClick={() => goDown()}>
              <View className='perimerter_dec'>
                <View className='perimerter_title'>{subKeyValueList[2].title}</View>
                <View className='permerter_intertion permerter_interSize2'>{subKeyValueList[2].subtitle}</View>
              </View>
            </View>
          </View>
        </View>
        }
        <View className='permerter_tab'>
          <View className='permerter_tab_box'>
            <View className='permerter_tab_iconBox permerter_tab_icon1'
                  onClick={() => navigateTo('/pages/newUser/record/index')}></View>
            <View className='permerter_tab_font'>
              打卡足迹
            </View>
          </View>
          <View className='permerter_tab_box' onClick={() => navigateTo('/pages/share/shareFriend/index')}>
            <View className='permerter_tab_iconBox permerter_tab_icon2'></View>
            <View className='permerter_tab_font'>
              邀请好友
            </View>
          </View>
          <View className='permerter_tab_box'>
            <View className='permerter_tab_iconBox permerter_tab_icon3'
                  onClick={() => navigateTo('/pages/share/shareShop/index')}></View>
            <View className='permerter_tab_font'>
              我要推店
            </View>
          </View>
        </View>
        <Favourable></Favourable>
        <View className='permerter_tab_kol'>
          <ScrollView
            scrollLeft={
              selectIndex > 2 ? scroll_left : false}
            scrollX={true}
            scrollWithAnimation={true}
            onScroll={this.setScroll}
            className='permerter_tab_tags'>
            {domainList.map((item, index) => {
              return (
                <View onClick={() => this.setTicName(item, index)} key={index}
                      className={classNames('permerter_kol_domain', selectIndex == index && 'checked')}>
                  {item.domainName}
                </View>
              )
            })}
          </ScrollView>
          <View className='permerter_tip_box'
                style={topicList.length == 0 && {height: Taro.pxTransform(30)}}
          >
            <ScrollView
              scrollX={true}
              className='permerter_tip_tag'
            >
              {
                topicList.map((item, index) => {
                  return (
                    item.topicId !== topicId ?
                      <View onClick={() => this.setTopic(item)} className='tip_noCheck'>{item.topicName}</View> :
                      <View key={index} onClick={() => this.setTopic(item)} className='tip_checked'>
                        {item.topicName}
                        <View className='checked_icon'></View>
                      </View>
                  )
                })}
            </ScrollView>
          </View>
          <View
            className='permerter_userDetails_box'
          >{kolMomentsList.length > 0 ?
            <Waterfall
              list={kolMomentsList}
              createDom={this.createdShareMerchant.bind(this)}
              imgHight={'frontImageHeight'}
              imgWidth={'frontImageWidth'}
              setWidth={335}
              style={{width:Taro.pxTransform(335)}}
            >
            </Waterfall>
            :
            <NallStatus></NallStatus>
          }
          </View>

        </View>
      </View>
    )
  }
}

export default Index
