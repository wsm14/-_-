import React, {Component} from "react";
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {Text, View} from "@tarojs/components";
import {goods} from '@/api/api'
import {httpGet, httpPost} from '@/api/newRequest'
import './index.scss'
import {toast, backgroundObj, filterActive,goBack, navigateTo,redirectTo} from "@/common/utils";
import classNames from 'classnames'
class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      httpData: {
        ...getCurrentInstance().router.params,
      },
      merchantId: getCurrentInstance().router.params.merchantId||1,
      useBeanStatus: '0',
      kolGoodsDTO: {
        goodsId: getCurrentInstance().router.params.kolGoodsId||58,
        goodsCount: 1
      },
      kolGoodsInfo: {}

    }
  }
  componentWillUnmount() {
    if(!getCurrentInstance().router.params.merchantId||!getCurrentInstance().router.params.kolGoodsId){
        goBack(() => toast('参数缺失'))
    }
  }

  componentDidShow() {
    this.getKolGoodsOrder()
  }

  computedCount(type) {
    const {kolGoodsDTO, kolGoodsDTO: {goodsCount}} = this.state
    if (type === 'add') {
      this.setState({
        kolGoodsDTO: {
          ...kolGoodsDTO,
          goodsCount: goodsCount + 1
        }
      })
    } else {
      if (goodsCount > 1) {
        this.setState({
          kolGoodsDTO: {
            ...kolGoodsDTO,
            goodsCount: goodsCount - 1
          }
        })
      } else return toast('购买数量不能为0')
    }
  }

  getKolGoodsOrder() {
    const {httpData} = this.state
    const {configOrder: {getKolGoodsOrderPrice}} = goods
    httpGet({
      data: httpData || {},
      url: getKolGoodsOrderPrice
    }, res => {
      const {kolGoodsInfo} = res
      this.setState({
        kolGoodsInfo
      })
    })
  }

  saveKolGoodsOrder() {
    const {merchantId, useBeanStatus, kolGoodsDTO} = this.state
    const {configOrder: {saveKolGoodsOrder}} = goods
    httpPost({
      data: {
        merchantId: merchantId,
        useBeanStatus: useBeanStatus,
        kolMomentsId:getCurrentInstance().router.params.kolMomentsId,
        kolGoodsDTO
      },
      url: saveKolGoodsOrder
    }, res => {
      const {orderSn ,status}  = res
      if(status === '1'){
        return redirectTo(`/pages/goods/paySuccess/index?orderSn=${orderSn}`)
      }
      else {
       return  redirectTo(`/pages/goods/payWeex/index?orderSn=${orderSn}`)
      }
    })
  }

  useBean() {
    const {kolGoodsInfo: {userBean}, useBeanStatus} = this.state
    if (userBean == '0') {
      return toast('卡豆为0')
    } else {
      if (useBeanStatus === '0') {
        return this.setState({
          useBeanStatus: '1'
        })
      } else {
        return this.setState({
          useBeanStatus: '0'
        })
      }

    }
  }
  computedPrice(price,bean){
    if(Number(bean) > price*100){
      return price
    }
    else return Number(bean)/100
  }

  render() {
    const {
      kolGoodsInfo,
      kolGoodsInfo: {
        merchantLogo,
        merchantName,
        goodsImg,
        goodsName,
        kolPrice,
        needOrder,
        allowExpireRefund,
        allowRefund,
        useStartTime,
        useEndTime,
        useTime,
        userBean,
        merchantIdString
      },
      kolGoodsDTO: {
        goodsCount
      },
      useBeanStatus
    } = this.state
      return (
        <View className='order_box'>
          <View className='order_details_box'>
            <View className='order_details_merchant'>
              <View className='order_merchant_details'
                    onClick={() => navigateTo(`/pages/perimeter/merchantDetails/index?merchantId=${merchantIdString}`)}>
                <View className='order_merchant_userProfile dakale_profile'
                      style={{...backgroundObj(merchantLogo)}}></View>
                <View className='order_name font_hide'>
                  {merchantName || ''}
                </View>
                <View className='order_merchant_go'>

                </View>
                <View className='order_accBox' onClick={(e) => {
                  e.stopPropagation()
                }}>
                  <View className='order_city_icon1'></View>
                  <View className='order_city_icon2'></View>
                  <View className='order_city_icon3'></View>
                </View>
              </View>
            </View>
            <View className='order_shopDetails'>
              <View className='order_shopDetails_box'>
                <View className='order_shopDetails_Img dakale_nullImage' style={{...backgroundObj(goodsImg)}}></View>
                <View className='order_shopDetails_dec'>
                  <View className='order_shopDetails_title font_noHide'>
                    {goodsName}
                  </View>

                  <View className='order_toast'>哒卡乐专享价</View>
                  <View className='order_price'>
                    <Text style={{color: 'rgba(51, 51, 51, 1)'}}>¥</Text>{kolPrice}
                  </View>
                </View>
                <View className='order_shopDetails_price'>
                  <View className='order_shop_btnBox order_shop_btn1' onClick={() => this.computedCount()}></View>
                  <View className='order_shop_num'>{goodsCount}</View>
                  <View className='order_shop_btnBox order_shop_btn2' onClick={() => this.computedCount('add')}></View>
                </View>
              </View>
              <View className='order_shopDetails_active'>
                {filterActive([needOrder, allowExpireRefund, allowRefund])}
              </View>
            </View>
            <View className='order_shop_time'>
              使用有效期:<View style={{color: 'rgba(239, 71, 111, 1)',marginTop:Taro.pxTransform(20)}}>{useStartTime}~{useEndTime}</View>
              {useTime &&  <View className='order_shop_after'>
                到店核销时段：<View style={{color: 'rgba(239, 71, 111, 1)',marginTop:Taro.pxTransform(20)}}>{useTime}</View>
              </View>}

            </View>
          </View>
          <View className='order_details_payType' onClick={() =>this.useBean()}>
            <View className='order_payType_box'>
              <View className='order_pay_line order_pay_box'>
                <View className='order_pay_font'>
                  卡豆抵扣
                  <Text className='order_pay_fontToast font_hide'>
                    可用{userBean}卡豆抵扣卡豆{parseInt(userBean) / 100}元
                  </Text>
                </View>
                <View className={classNames('order_pay_iconBox',useBeanStatus ==='1'?'order_pay_icon2':'order_pay_icon1' )}>

                </View>
              </View>
              {/*<View className='order_pay_box'>*/}
              {/*  <View className='order_pay_font'>优惠券</View>*/}
              {/*  <View className='order_get_coupon'>*/}

              {/*  </View>*/}
              {/*</View>*/}
            </View>
          </View>
          <View className='order_details_sumbit'>
            <View className='order_rmb'>
              实付：
              <Text
                style={{fontSize: Taro.pxTransform(20)}}>
                ¥
                <Text style={{fontSize: Taro.pxTransform(32), fontWeight: 'bold'}}>
                  {useBeanStatus === '1' ?
                    ((Number(kolPrice) * goodsCount)-(userBean/100))>0?((Number(kolPrice) * goodsCount)-(userBean/100)):0
                      :
                    Number(kolPrice) * goodsCount
                  }
                </Text>
              </Text>
            </View>
            <View className='order_beanRmb'>
              共抵扣：¥{useBeanStatus === '1' ? this.computedPrice((Number(kolPrice) * goodsCount),userBean) : '0'}
              <Text className='order_computed'>
                共{goodsCount}件
              </Text>
            </View>
            <View className='payBtn' onClick={() => this.saveKolGoodsOrder()}>提交订单</View>
          </View>
        </View>
      )
  }
}

export default Index
