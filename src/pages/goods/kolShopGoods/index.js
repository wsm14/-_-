import React, {Component} from "react";
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {Text, View} from "@tarojs/components";
import {goods} from '@/api/api'
import {httpGet, httpPost} from '@/api/newRequest'
import './index.scss'
import {toast, backgroundObj, filterActive, goBack, filterStrList} from "@/common/utils";
import Title from './components/goodsTitle'
import ShopCard from './components/descriptionCard'
import ShopDetails from './components/goodsCard'
import BtnLayer from './components/bottonBtn'
import MakePhone from '@/components/payTelephone'
import Draw from './components/drawback'
import StopBean from '@/components/stopBean'
class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      httpData: {
        orderSn: getCurrentInstance().router.params.orderSn
      },
      orderInfo: {},
      telephone: false,
      draw: false,
      visible: false
    }
  }

  componentWillUnmount() {
    if (!getCurrentInstance().router.params.orderSn) {
      goBack('参数缺失')
    }
  }

  componentDidShow() {
    this.getKolDetails()
  }

  filterPrice(payFee) {
    if (payFee) {
      let str = payFee.split('.')
      if (str.length == 2) {
        return (
          <View className='color3'>
            <Text className='font24'>¥ </Text>
            <Text className='font40'>{' ' + str[0]}</Text>
            <Text className='font28'>{`.${str[1]}`}</Text>
          </View>
        )
      } else {
        return (
          <View className='color3'>
            <Text className='font24'>¥ </Text>
            <Text className='font40'>{payFee}</Text>
          </View>
        )
      }
    } else return null
  }
  updateStatus(str) {
    const {updateKol} = goods
    if(str){
      this.setState({
        draw: false
      },res => {
        httpPost({
          data:{
            orderSn: getCurrentInstance().router.params.orderSn,
            status: '6',
            refundReason: str
          },
          url: updateKol,
        },res => {
          this.getKolDetails()
        })
      })
    }
    else {
      toast('请选择退款原因')
    }
  }
  getDataStatus(){
    const {updateKol} = goods
    httpPost({
      data:{
        orderSn: getCurrentInstance().router.params.orderSn,
        status: '1',
      },
      url: updateKol,
    },res => {
      this.getKolDetails()
    })
  }
  getKolDetails() {
    const {getKolOrderDetail} = goods
    const {httpData} = this.state
    httpGet({
      data: httpData,
      url: getKolOrderDetail
    }, res => {
      const {orderInfo} = res
      console.log(orderInfo)
      this.setState({
        orderInfo
      })
    })
  }

  onError(msg) {
    console.log(msg)
  }

  render() {
    const {
      orderInfo,
      orderInfo: {
        status,
        payFee,
        totalFee,
        merchantMobile
      },
      telephone,
      draw,
      visible
    } = this.state
    if(orderInfo && status === '6'){
      return(
        <View className='kolGoods_details_kolGoodsDetails'>
          <Title onOpen={() =>this.setState({draw: true})} data={orderInfo}></Title>
          <View className='kolGoods_details_refund'>
            <View className='refund_top'>
              <View className='refund_top_box'>
                <View className='refund_icon_box public_center refund_icon_margin1'>
                  <View className='refund_icon refund_icon1'></View>
                </View>
                <View className='refund_icon_liner1 refund_icon_margin2'></View>
                <View className='refund_icon_box public_center refund_icon_margin3'>
                  <View className='refund_icon refund_icon2'></View>
                </View>
                <View  className='refund_icon_liner2 refund_icon_margin4'></View>
                <View className='refund_icon_box refund_icon_bgColor public_center refund_icon_margin5'>
                  <View className='refund_icon refund_icon3'></View>
                </View>
              </View>
              <View className='refund_top_font public_auto'>
                <View className='color4 font24'>退款申请</View>
                <View className='color4 font24'>退款处理中</View>
                <View className='color1 font24'>退款完成</View>
              </View>
              <View className='refund_top_liner'></View>
            </View>
            <View className='refund_text color2 font24'>
              若超过7日内未处理，默认同意退款
            </View>
          </View>
          <ShopCard fn={() => this.getKolDetails()}  style={{margin:`${Taro.pxTransform(24)} auto`}} data={orderInfo}></ShopCard>
          <View className='kolGoods_details'>
            <View className='kolGoods_detailsBox'>
              <View className='font24 color2 public_auto kolGoods_details_height'>
                <View>订单金额</View>
                <View className='color1'>¥ {totalFee}</View>
              </View>
              <View className='kolGoods_details_top font24 color2 public_auto kolGoods_details_height'>
                <View>卡豆抵扣</View>
                <View className='color1'>{Number(totalFee) * 100 + '卡豆'} (¥ {totalFee})</View>
              </View>
              {/*<View className='kolGoods_details_top font24 color2 public_auto kolGoods_details_height'>*/}
              {/*  <View>优惠券</View>*/}
              {/*  <View className='color1'>- ¥ 4.00</View>*/}
              {/*</View>*/}
              <View className='kolGoods_details_liner'></View>
              <View className='kolGoods_details_price public_auto bold'>
                <View className='font28 color1 '>实付金额 </View>
                {this.filterPrice(payFee)}
              </View>
            </View>
          </View>
          <ShopDetails data={orderInfo}/>
          <BtnLayer data={orderInfo}></BtnLayer>
          {visible && <StopBean cancel={} canfirm={}></StopBean>}
        </View>
      )
    }
    else if (orderInfo && status) {
      return (
        <View className='kolGoods_details_kolGoodsDetails'>
          <Title onOpen={() =>this.setState({draw: true})} data={orderInfo}></Title>
          <BtnLayer data={orderInfo}></BtnLayer>
          <ShopCard telephone = {() => this.setState({telephone: true})}  fn={() => this.getKolDetails()} data={orderInfo}></ShopCard>
          <View className='kolGoods_details'>
            <View className='kolGoods_detailsBox'>
              <View className='font24 color2 public_auto kolGoods_details_height'>
                <View>订单金额</View>
                <View className='color1'>¥ {totalFee}</View>
              </View>
              <View className='kolGoods_details_top font24 color2 public_auto kolGoods_details_height'>
                <View>卡豆抵扣</View>
                <View className='color1'>{Number(totalFee) * 100 + '卡豆'} (¥ {totalFee})</View>
              </View>
              {/*<View className='kolGoods_details_top font24 color2 public_auto kolGoods_details_height'>*/}
              {/*  <View>优惠券</View>*/}
              {/*  <View className='color1'>- ¥ 4.00</View>*/}
              {/*</View>*/}
              <View className='kolGoods_details_liner'></View>
              <View className='kolGoods_details_price public_auto bold'>
                <View className='font28 color1 '>待付金额 </View>
                {this.filterPrice(payFee)}
              </View>
            </View>
          </View>
          <ShopDetails data={orderInfo}/>
          {telephone &&
          <MakePhone data={filterStrList(merchantMobile)} onClose={() => this.setState({telephone: false})}
                     onCancel={() => this.setState({telephone: false})}></MakePhone>}
          {draw && <Draw cancel={this.updateStatus.bind(this)} close={() =>this.setState({draw: false})}></Draw>}
        </View>
      )
    }
    else return null
  }
}

export default Index
