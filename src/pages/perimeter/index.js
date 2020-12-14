import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View,Text, Swiper, SwiperItem} from '@tarojs/components'
import './perimeter.scss'
import {wxapiGet,wxapiPost} from './../../api/api'
import Utils from './../../utils/utils'
import classNames from 'classnames'
import Ajax from "../../api/request";
import {inject, observer} from "mobx-react";
const setTag = (string) =>{
   if(typeof string ==='string'){
     return string.split(',').slice(0,2)
   }
}
@inject('store')
@observer
class Index extends Component {
  defaultProps = {}
  config = {
    navigationBarTitleText: '周边',
    // "enablePullDownRefresh": true,
    // onReachBottomDistance:50,
  }
  constructor() {
    super(...arguments)
    this.state = {
      bannerType: 'near',//轮播图参数
      getMerchantAll: {
        filterType: '0', //过滤类型
        page: '1',  //起始页
        limit: 10,  //每页个数
        distance: '',  //距离分类
        categoryIds: ''  //分类
      },
      bannerList: {},//轮播图数组
      userMerchantList: {},//商家列表数组
      scrollTop: false,//头部
      scrollTop_Color:'',//颜色
      FreshenType: 0, //加载动态
      liner: false, //距离选择层
      category: false, //筛选层
      categoryList: [],
      categoryCheckedList: [],
      layerStyle:{}
    }
  }
  getBanner(){
    Ajax({
      data: {bannerType: this.state.bannerType},
      url: wxapiGet.wechatBanner,
    }, 'get').then(
      res => {
        const {errMsg} = res
        if (errMsg === 'request:ok') {
          const {success, resultDesc} = res.data
          if (success) {
            let {content: {bannerList}} = res.data
            this.setState({
              bannerList
            })
          } else {
            Utils.Toast(resultDesc)
          }
        }
      }
    ).catch(e =>{
      Utils.Toast(e)
    })
  }
  //获取轮播图
  getMerchantAll(){
    Ajax({
      data: {...this.state.getMerchantAll},
      url: wxapiGet.wechatConditions
    }, 'get').then(
      res => {
        const {errMsg} = res
        if (errMsg === 'request:ok') {
          const {success, resultDesc} = res.data
          if (success) {
            let {content: {userMerchantList}} = res.data
            this.setState({
              userMerchantList,
              FreshenType: 0
            })
          } else {
            Utils.Toast(resultDesc)
          }
        }
      }
    ).catch(e =>{
      Utils.Toast(e)
    })
  }
  //获取商家列表
  getListCategory() {
    Ajax({
      data: {parentId:'0'},
      url: wxapiGet.wechatListCategory
    }, 'get').then(
      res => {
        const {errMsg} = res
        if (errMsg === 'request:ok') {
          const {success, resultDesc} = res.data
          if (success) {
            let {content: {categoryList}} = res.data
            this.setState({
              categoryList,
              liner: false,
            })
          } else {
            Utils.Toast(resultDesc)
          }
        }
      }
    ).catch(e =>{
      Utils.Toast(e)
    })
  }
  componentDidMount(){
    this.getBanner();
    this.getMerchantAll()
  }
  //初始化
  onPageScroll(Object){
    const {scrollTop} = Object
    let opacity = 0
    let fix = false
    if(scrollTop>16){
      opacity = scrollTop/160
    }
    if(scrollTop>160){
      fix = true
    }
    this.setState({
      scrollTop_Color:`rgba(8, 192, 194,${opacity})`,
      scrollTop: fix
    })
  }
  //卷曲面积调整样式
  setSearch(obj,key){
    if(obj[key] === this.state.getMerchantAll[key]){
      this.setState({
        getMerchantAll: {
          ...this.state.getMerchantAll,
          filterType: '0',
        },
        liner:false
      },res => {
        this.getMerchantAll();
      })
      return
    }
    else{
      this.setState({
       getMerchantAll: {
         ...this.state.getMerchantAll,
         ...obj
       },
        liner:false
      },res => {
         this.getMerchantAll();
      })
    }
  }
  //
  setScroll(){
    const {userMerchantList} = this.state
    const style ={
     position: 'fixed',
     zIndex: 1000,
     top: Taro.pxTransform(508),
     right: 0,
     bottom: 0,
     left: 0,
     background: 'rgba(0,0,0,0.3)',
    }
    const style1 ={
      position: 'fixed',
      zIndex: 1000,
      top: Taro.pxTransform(202),
      right: 0,
      bottom: 0,
      left: 0,
      background: 'rgba(0,0,0,0.3)',
    }
    if(userMerchantList.length<4){
      this.setState({
        liner: !this.state.liner,
        layerStyle: style
      })
    }
    else {
      this.setState({
        liner: !this.state.liner,
        layerStyle: style1,
        scrollTop: true
      },res =>{
        Taro.pageScrollTo({
          scrollTop:161
        })
      })
    }
  }
  onReachBottom(){
    this.setState({
      getMerchantAll:{
        ...this.state.getMerchantAll,
        limit:this.state.getMerchantAll.limit+=10
      },
      FreshenType: 1
    },res =>{
      this.getMerchantAll()
    })
  }//上拉加载
  saveMark (res){
    this.props.store.beanStore.setInit()
    let {result} = res
    result = result.split('?')[1]
    result = result.split('&')
    let merchantId = '';
    result.forEach(item =>{
      if(item.includes('merchantId')){
        merchantId=item.replace('merchantId=','')
      }
    })
    Ajax({
      data: {merchantId: merchantId},
      url: wxapiPost.wechatBeanMark,
    },'post').then(
      res => {
        const {errMsg} = res
        if (errMsg === 'request:ok') {
          const {success,resultCode, resultDesc} = res.data
          if (success) {
            let {content} = res.data
            this.props.store.beanStore.setMarkInfo(content)
            if(content.resultCode == '3018'){
              this.props.store.beanStore.setMerchantId({merchantId:merchantId})
              Utils.Toast('无法打卡，不在打卡范围内')
            }
             Utils.navigateTo('/pages/perimeter/beanMark/index')
          }
          else {
            this.props.store.beanStore.setCode(resultCode)
            this.props.store.beanStore.setMerchantId({merchantId:merchantId})
            Utils.Toast(resultDesc)
          }
        }
      }
    ).catch(e =>{
      Utils.Toast(e)
    })
  }
  bubbling(e) {
    e.stopPropagation()
  }//阻止事件冒泡
  handleTouchMove = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  //阻止View穿透
  setChecked(key,arr) {
    if(arr.includes(key)){
      arr.forEach((item,index) =>{
        if(item == key){
          arr.splice(index,1)
          this.setState({
              [arr]:[...arr]
            }
          )
        }
      })
    }
    else{
      arr.push(key)
      this.setState({
        [arr]: [...arr]
      })
    }
  }
  filterReaplace(str) {
    if(str.includes('https:/')&&!str.includes('https://')){
      return str.replace('https:/','https://')
    }
    return  str
  }
  //任務篩選
  setPreparation() {
     this.setState({
       liner: false,
       category: !this.state.category,
       categoryCheckedList:this.state.getMerchantAll.categoryIds.split(',')
     },res =>{
        if(this.state.categoryList.length === 0){
          this.getListCategory()
        }
        return
     })
  }
  setSync(obj) {
    this.setState({
      getMerchantAll: {
          ...this.state.getMerchantAll,
          ...obj
        },
      category: false,
      },res =>{
        this.getMerchantAll();
      }
    )
  }
  render () {
    const {
      scrollTop,
      scrollTop_Color,
      bannerList ,
      userMerchantList,
      FreshenType,
      getMerchantAll,
      liner,
      category,
      categoryList,
      categoryCheckedList,
      layerStyle} = this.state
    const style ={
      position: 'fixed',
      width: Taro.pxTransform(690),
      margin: '0 auto',
      background: '#FFFFFF',
      zIndex: 10000,
      paddingBottom:Taro.pxTransform(20),
      top:Taro.pxTransform(127)
    }
    return (
      <View
        className='perimeter_box'>
        <View className='perimeter_search f'  style={{background:scrollTop_Color}} onTouchMove={this.handleTouchMove}>
          <View className='perimeter_city'>
            杭州
          </View>
          {/*<View className='perimeter_searchInput'>*/}
          {/*  <View className='perimeter_searchIcon'></View>*/}
          {/*  <Input className='perimeter_Inputseach'  placeholder='搜一下附近玩乐' placeholderClass='placeholderClass'></Input>*/}
          {/*</View>*/}
        </View>
        <Swiper
          circular={true}
          autoplay={true}
          className='perimeter_banner'>
          {bannerList.length>0 &&bannerList.map(item =>{
            return (
              <SwiperItem key={item.id}>
                <View style={{height:'100%',background:`url(${this.filterReaplace(item.coverImg)}) no-repeat center/cover`}}></View>
              </SwiperItem>
            )
          })}
        </Swiper>
        <View className='perimeter_Merchant'>
          <View style={scrollTop?style:{}} className='perimeter_select f page_between'>
            <View className='perimeter_select_left f'>
              <View className={classNames(!liner?'perimeter_space':'perimeter_spaceChecked')} onClick={() => this.setScroll()}>
                距离排序
              </View>
              <View className={classNames(getMerchantAll.filterType==='1'?'perimeter_checkSelect':'perimeter_noCheckSelect')} onClick={() => this.setSearch({filterType:'1'},'filterType')}>
                捡豆数量
              </View>
              <View className={classNames(getMerchantAll.filterType==='2'?'perimeter_checkSelect':'perimeter_noCheckSelect')} onClick={() => this.setSearch({filterType:'2'},'filterType')}>
                人气排行
              </View>
            </View>
            <View className='perimeter_select_right' onClick={() => this.setPreparation()}>
              分类筛选
            </View>
          </View>
          <View className='perimeter_MerchantDetails'>
            {userMerchantList.length> 0 && userMerchantList.map((item,index) =>{
               return (
                 index<3?<View key={item.merchantId} className='MerchantDetails_style f' key={item.merchantId} onClick={ () => Utils.navigateTo(`/pages/perimeter/merchantDetails/index?merchantId=${item.merchantId}`)}>
                   {item.markFlag== '1' &&
                   <View className='MerchantDetails_toastBean MerchantDetails_toastBeanStyle1'>
                     打卡得<Text>{item.markBean}</Text>
                   </View>}
                   {item.markFlag== '1' &&
                   <View className='MerchantDetails_takecard MerchantDetails_takeCardStyle1'
                    onClick={(e) =>{
                     e.preventDefault()
                     e.stopPropagation()
                     Utils.setHttpCode(this.saveMark.bind(this))}}>
                     我要打卡
                   </View>}
                   <View className='MerchantDetails_Img' style={{background:`url(${this.filterReaplace(item.coverImg)}) no-repeat center/cover`}}>

                   </View>
                   <View className='MerchantDetails_information'>
                     <View className='MerchantDetails_name'>
                       {item.merchantName}
                     </View>
                     <View className='MerchantDetails_tag'>
                       {item.tag && setTag(item.tag).map((items,inndex) =>{
                         return (
                           <View key={inndex} className='MerchantDetails_tagStyle MerchantDetails_tagStyleColor1'>{items}</View>
                         )
                       })}
                     </View>
                     <View className='MerchantDetails_takeCardnum'>
                       <Text className='MerchantDetails_numStyleColor1'>{item.markAmount}人</Text>已打卡
                     </View>
                     <View className='MerchantDetails_takeLimit'>
                       距您{item.distanceRange}
                     </View>
                   </View>
                 </View>:<View key={item.id} className='MerchantDetails_style f' key={item.merchantId} onClick={ () => Utils.navigateTo(`/pages/perimeter/merchantDetails/index?merchantId=${item.merchantId}`)}>
                   {item.markFlag== '1' &&
                   <View className='MerchantDetails_toastBean MerchantDetails_toastBeanStyle2'>
                     打卡得<Text>{item.markBean}</Text>
                   </View>}
                   {item.markFlag== '1' &&
                   <View className='MerchantDetails_takecard MerchantDetails_takeCardStyle2'
                    onClick={(e) =>{
                     e.preventDefault()
                     e.stopPropagation()
                     Utils.setHttpCode(this.saveMark.bind(this))}}>
                     我要打卡
                   </View>}
                   <View className='MerchantDetails_Img' style={{background:`url(${this.filterReaplace(item.coverImg)}) no-repeat center/cover`}}>
                   </View>
                   <View className='MerchantDetails_information'>
                     <View className='MerchantDetails_name'>
                       {item.merchantName}
                     </View>
                     <View className='MerchantDetails_tag'>
                       {item.tag && setTag(item.tag).map((items,indexs) =>{
                         return (
                           <View key={indexs} className='MerchantDetails_tagStyle MerchantDetails_tagStyleColor2' >{items}</View>
                         )
                       })}

                     </View>
                     <View className='MerchantDetails_takeCardnum'>
                       <Text className='MerchantDetails_numStyleColor2'>{item.markAmount}人</Text>已打卡
                     </View>
                     <View className='MerchantDetails_takeLimit'>
                       距您{item.distanceRange}
                     </View>
                   </View>
                 </View>
               )
            })}
          </View>
        </View>
        {liner &&<View className='perimeter_layer' style={layerStyle} onClick={() => this.setScolly(0)}  onTouchMove={this.handleTouchMove}>
          <View className='perimeter_layer_space' onClick={this.bubbling}>
            <View className='perimeter_layer_spaceLimit' onClick={() => this.setSearch({distance:'500'},'distance')}>500m</View>
            <View className='perimeter_layer_spaceLimit' onClick={() => this.setSearch({distance:'1000'},'distance')}>1km</View>
            <View className='perimeter_layer_spaceLimit' onClick={() => this.setSearch({distance:'2000'},'distance')}>2km</View>
            <View className='perimeter_layer_spaceLimit' onClick={() => this.setSearch({distance:''},'distance')}>全部</View>
          </View>
        </View>}
        {category ?
          <View className='perimeter_layer_categoryById' onTouchMove={this.handleTouchMove} onClick={ () => this.setPreparation()}>
            <View className='perimeter_layer_category' onClick={this.bubbling}>
              <View className='perimeter_layer_category_data'>
                <View className='perimeter_layer_category_title'></View>
                {categoryList.length>0&&categoryList.map((item,index) =>{
                  return (
                  <View key={item.id} className='perimeter_layer_categoryDetails'>
                    <View className='perimeter_layer_detailsTitle'>
                      {item.categoryName}
                    </View>
                    <View className='perimeter_layer_detailsContext'>
                      {item.categoryDTOList.map((item1,index1) =>{
                        return (
                          <View
                            key={item1.id}
                            className={classNames(categoryCheckedList.includes((item1.id).toString())?'perimeter_layer_detailsCheckBtn':'perimeter_layer_detailsBtn',(index1+1)%3 === 0 && 'perimeter_layer_noMargin')}
                            onClick={() =>this.setChecked((item1.id).toString(),categoryCheckedList)}
                          >
                            {item1.categoryName}
                          </View>
                        )
                      })
                      }
                    </View>
                  </View>
                  )
                })}
              </View>
              <View className='perimeter_layer_categoryBottom'>
                <View className='perimeter_layer_categoryBtn cleanfix'>
                  <View className='perimeter_layer_categoryButton perimeter_layer_categoryReload' onClick={() =>this.setState({ categoryCheckedList: []})}>
                    重置
                  </View>
                  <View className='perimeter_layer_categoryButton perimeter_layer_categorySubmit' onClick={() =>this.setSync({categoryIds:categoryCheckedList.join(',')})}>
                    确定
                  </View>
                </View>
              </View>
            </View>
          </View>
          : null
        }
        {/*<Freshen type={FreshenType}></Freshen>*/}
      </View>
    )
  }
}

export default Index
