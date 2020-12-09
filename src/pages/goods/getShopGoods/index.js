import React, {Component} from "react";
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {Text, View} from "@tarojs/components";
import './index.scss'
import Title from './components/goodsTitle'
import ShopCard from './components/descriptionCard'
import ShopDetails from './components/goodsCard'
import BtnLayer from './components/bottonBtn'
import StopBean from '@/components/stopBean'
import {getOrderDetails,deleteOrder} from '@/server/goods'
import {toast,goBack} from "@/common/utils";
import Lovely from '@/components/lovely'
class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      httpData: {
        orderSn: getCurrentInstance().router.params.orderSn
      },
      orderInfo: {},
      visible: false
    }
  }


  componentDidShow() {
    this.getGoodsDetails()
  }

  getGoodsDetails() {
    const {httpData} = this.state
    getOrderDetails(httpData, res => {
      this.setState({
        orderInfo: res
      })
    })
  }

  deleteOrder() {
    const {httpData} = this.state
    this.setState({
      visible: false
    }, res => {
      deleteOrder(httpData,res => {
        goBack(() => toast('删除成功'))
      })
    })
  }
  render() {
    const {orderInfo,visible} = this.state
    if (Object.keys(orderInfo).length > 0) {
      return (
        <View className='goods_details_goodsDetails'>
          <Title></Title>
          <ShopCard data={orderInfo}></ShopCard>
          <View>
            <ShopDetails data={orderInfo}></ShopDetails>
          </View>
          <View className='goods_details_margins'>
            <Lovely title={'你可能还喜欢'}></Lovely>
          </View>
          <BtnLayer remove={() => this.setState({visible: true})}></BtnLayer>
          {visible &&
          <StopBean
            content={'确认删除订单？'}
            cancel={() => {this.setState({visible: false})}}
            canfirm={() => this.deleteOrder()}
            cancelText={'确认'}
            canfirmText ={'取消'}>
          </StopBean>}
        </View>
      )
    }
    return null
  }
}

export default Index
