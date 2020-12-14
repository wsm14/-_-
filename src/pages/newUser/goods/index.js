import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import {View, Text, Image} from '@tarojs/components'
import './index.scss'
import classNames from 'classnames'
import {wxapiGet} from '../../../api/api'
import Ajax from '../../../api/request'
import Utils from './../../../utils/utils'
import Nav from '../../../layout/layoutNav/index'
class Goods extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      listOrder: {
        page: '1',
        orderStatus: '',//数据状态
        limit: '10',
      },
      orderList: []
    }
  }
  componentDidShow() {
    this.getlistOrder()
  }
  getlistOrder() {
    Ajax({
      data: this.state.listOrder,
      url: wxapiGet.wechatListOrder
    },'get').then(
      res=>{
        const {errMsg} = res
       if(errMsg === 'request:ok'){
         const {success,resultDesc} = res.data
         if(success){
           const { content: {orderList}} =res.data
           this.setState({
             orderList:orderList
           })
         }
         else {
           Utils.Toast(resultDesc)
         }
       }
      }
    )
  }
  handleStatus =  (index) =>{
    const { listOrder:{orderStatus} } = this.state
    if(orderStatus === index){
      return
    }
    this.setState({
      listOrder:{
        ...this.state.listOrder,
        orderStatus: index
      }
    },res =>{
      this.getlistOrder()
    })
  }
  render () {
    const {counter ,orderList,listOrder } = this.state
    const filter = (code) => {
      switch (code) {
        case 1: return '待确定'
        case 3: return '交易成功'
        case 4: return '待消费'
        case 2: return '已关闭'
      }
    }
    return (
      <View className='goods_box'>
        <Nav title={'我的订单'}></Nav>
        {/*回退头部*/}
        <View className='goods_tabbar cleanfix'>
          <View className={classNames('goods_tabbarSelect',listOrder.orderStatus === '' && 'goods_checkedfont')} onClick={() =>this.handleStatus('')}>
            {listOrder.orderStatus === '' && <View className='goods_checkedSelect'></View>}
            全部
          </View>
          <View className={classNames('goods_tabbarSelect',listOrder.orderStatus=== 1 && 'goods_checkedfont')} onClick={() => this.handleStatus(1)}>
            {listOrder.orderStatus === 1 && <View className='goods_checkedSelect goods_checkedPosition'></View>}
            待确认
          </View>
          <View className={classNames('goods_tabbarSelect',listOrder.orderStatus=== 4 && 'goods_checkedfont')} onClick={() => this.handleStatus(4)}>
            {listOrder.orderStatus === 4 && <View className='goods_checkedSelect goods_checkedPosition'></View>}
            待消费
          </View>
          <View className={classNames('goods_tabbarSelect',listOrder.orderStatus=== 2 && 'goods_checkedfont')} onClick={() => this.handleStatus(2)}>
            {listOrder.orderStatus === 2 && <View className='goods_checkedSelect goods_checkedPosition'></View>}
            已关闭
          </View>
        </View>
        {/*根据状态显示数据*/}
        <View className='goods_details'>
          {orderList.length>0?
            orderList.map((item,index) =>{
              return (
                <View key={index} className='goods_detailsList'>
                  {/*数据层*/}
                  <View className='goods_listTitle cleanfix'>
                    <View className='goods_listMerchant cleanfix'>
                      <View className='goods_listMerchantImg'>
                        <Image src={item.orderDesc&&JSON.parse(item.orderDesc).merchantImg}></Image>
                      </View>
                      <View className='goods_listMerchantUser'>
                        <View className='goods_listMerchantUserName'><Text>{item.orderDesc&&JSON.parse(item.orderDesc).merchantName}</Text></View>
                        <View className='goods_listMerchantTime'>{item.payTime}</View>
                      </View>
                    </View>
                    <View className='goods_listStatus'>
                      {filter(parseInt(item.status))}
                    </View>
                  </View>
                  {/*数据上面部分*/}
                  <View className='goods_line'></View>
                  {/*线部分*/}
                  <View className='goods_information'>
                    <View className='goods_price'>
                      总价 <Text className='price'> ¥{item.totalFee} </Text>卡豆抵扣<Text className='price'>¥{item.beanFee}  </Text>实付<Text className='price'> ¥{item.payFee}</Text>
                    </View>
                  </View>
                </View>
              )
            }) :
            <View className='goods_null'>没有记录啦...</View>}
        </View>
        {/*数据*/}
      </View>
    )
  }
}

export default Goods
