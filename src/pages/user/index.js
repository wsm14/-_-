import Taro, { Component } from '@tarojs/taro'
import {View, Image, Button} from '@tarojs/components'
import './user.scss'
import {wxapiGet, wxapiPost} from '../../api/api'
import Ajax from '../../api/request'
import Utils from  './../../utils/utils'
import Toast from '../../layout/Toast'
import {inject, observer} from "@tarojs/mobx";
@inject('authStore')
@observer
class Index extends Component {
  defaultProps = {}
  config = {
    navigationBarTitleText: '个人登录',
    // "enablePullDownRefresh": true,
    // onReachBottomDistance:10,
    backgroundTextStyle:'dark',
  }

  constructor () {
    super(...arguments)
    this.state = {
      Toast: {
        status: '',
        text: '',
        isOpened: false,
        duration: 2000
      },
      banner:{
        bannerType: 'person',
      },
      Lovely: {
        limit: 2,
        page: '1',
      },
      bannerList:[],
      userMerchantList:[],
      toastType:0,
      user:{},
      tabbar: [
        {id :1,title:'打卡记录',router:'/pages/user/record/index',classNames:'user_tabTitle user_bgtab2'},
        {id :2,title:'我的订单',router:'/pages/user/goods/index',classNames:'user_tabTitle user_bgtab3'},
        {id :3,title:'关爱打卡',router:'/pages/index/accustomed/expressCard/index',classNames:'user_tabTitle user_bgtab4'},
        {id :4,title:'卡豆权益',router:'/pages/user/beanRule/index',classNames:'user_tabTitle user_bgtab5'},
        {id :5,title:'协议规则',router:'/pages/user/userConceal/index',classNames:'user_tabTitle user_bgtab6'},
      ]
    }
  }
  componentDidShow() {
    this.getuserData()
  }
  saveMark (res){
    this.props.beanStore.setInit()
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
            this.props.beanStore.setMarkInfo(content)
            if(content.resultCode == '3018'){
              this.props.beanStore.setMerchantId({merchantId:merchantId})
              Utils.Toast('无法打卡，不在打卡范围内')
            }
            Utils.navigateTo('/pages/perimeter/beanMark/index')
          }
          else {
            this.props.beanStore.setCode(resultCode)
            this.props.beanStore.setMerchantId({merchantId:merchantId})
            Utils.Toast(resultDesc)
          }
        }
      }
    ).catch(e =>{
      Utils.Toast(e)
    })
  }
  getuserData() {
    const userInfos = Taro.getStorageSync('userInfo')
    if(userInfos && userInfos.mobile.length === 11){
      Ajax({data:{},url:wxapiGet.wechatMain},'get').then(res =>{
        const { errMsg } = res
        if(errMsg && errMsg === "request:fail "){
          this.errorToast('服务器异常')
        }
        else {
          const {success ,content:{userInfo},resultDesc } = res.data
          if(success){
            this.setState({
              user:{...userInfo}
            })
          }
          else {
            this.errorToast(resultDesc)
          }
        }
      }).catch(e =>{
        this.errorToast(e)
      })
   }
    return
  }
  successToast(e) {
    this.setState({
      Toast: {
        status: 'success',
        text: e,
        isOpened: true,
        duration: 0
      }
    })
  }//成功的提示
  errorToast(e) {
    this.setState({
      Toast: {
        status: 'error',
        text: e,
        isOpened: true,
        duration: 2000
      }
    })
  }//错误提示
  loadingToast() {
    this.setState({
      Toast: {
        status: 'loading',
        text: '加载中',
        isOpened: true,
        duration: 5000
      }
    })
  }//加载提示
  closeToast(){
    this.setState({
      Toast: {
        status: 'loading',
        text: '',
        isOpened: false,
        duration: 0
      }
    })
  }//关闭提示框
  render () {
    const { userInfo } = this.props.authStore
    const { tabbar ,user } = this.state
    console.log(user)
    return (
      <View className='user_box'>
        <View className='user_Title'>
          {Object.keys(userInfo).length ===0 ?
           <View className='user_title_Details' onClick={() => Utils.navigateTo('./../auth/index')}>
            <View className='user_title_DetailsImg'>
              <Image src='https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/user/userIcon.png' ></Image>
            </View>
            <View className='user_title_userName'>
              用户登录
            </View>
          </View>:null}
          {Object.keys(userInfo).length >5 && userInfo.mobile.length !==11 ? <View className='user_title_Details' onClick={() => Utils.navigateTo('./../auth/index')}>
            <View className='user_title_DetailsImg'>
              <Image src='https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/user/userIcon.png' ></Image>
            </View>
            <View className='user_title_userName'>
              请绑定手机
            </View>
          </View>:null}
          {Object.keys(userInfo).length >5 && userInfo.mobile.length ===11 ? <View className='user_title_Details'>
            <View className='user_title_DetailsImg'>
              <Image src={userInfo.profile} ></Image>
            </View>
            <View className='user_title_userName'>
              {userInfo.username}
            </View>
          </View>:null}
          <View className='user_title_earnings'>
            <View className='user_Toast'></View>
            <View className='user_code'
            onClick={(e) =>{
              e.preventDefault()
              e.stopPropagation()
              Utils.setHttpCode(this.saveMark.bind(this))}}></View>
            <View className='user_title_earningsBox cleanfix'>
              <View className='user_earnings_bean'>
                {!user.bean && user.bean !== 0 ?'--':user.bean}
                <View className='user_earnings_type'>
                    卡豆余额
                </View>
              </View>
              <View className='user_earnings_getBean'>
                {!user.earningToday && user.earningToday !== 0 ?'--':user.earningToday}
                <View className='user_earnings_type'>
                    今日收益
                </View>
              </View>
            </View>
          </View>
        </View>
        <View className='user_body_context'>

            <View className='user_tab'>
              <Button className='clearAfter' style={{border:'none',padding:'0px'}} openType={"share"}>
              <View className='user_tabInvite cleanfix'>
                <View className='user_tabTitle user_bgtab1'>
                  邀请好友
                </View>
                <View className='user_tabLink'></View>
              </View>
              </Button>
            </View>


          <View className='user_tab user_tabMargin'>
            {tabbar.map(item =>{
              return (
                <View key={item.id} className='user_tabOperate cleanfix' onClick={Object.keys(userInfo).length>5 && userInfo.mobile.length ===11?()=> Utils.navigateTo(item.router):() => Utils.navigateTo('./../auth/index')}>
                  <View className={item.classNames}>
                    {item.title}
                  </View>
                  <View className='user_tabLink'></View>
                </View>
              )
            })}
          </View>
        </View>
      </View>
    )
  }
}

export default Index
