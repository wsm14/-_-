import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTextarea ,AtToast } from 'taro-ui'
import Navigation from '../../component/Navigation'
import classNames from 'classnames'
import {wxapiPost} from '../../api/api'
import {HTTP_POST} from '../../api/webRequest'
import request from '../../api/request'
import './feedback.scss'
class Index extends Component {
  defaultProps={}
  config = {
    navigationBarTitleText: '反馈建议'
  }

  constructor () {
    super(...arguments)
    this.state = {
      nav:{
        title:'意见反馈',
        fn:()=>{
           window.history.back(-1)
        }
      },
      feedbackData:{
        feedbackType: '',
        problemDesc: '',
        id: '1'
      },
      Toast:{
        text:'',
        status:'',
        isOpened:false
      },
      visible:false
    }
  }
  setPropsState = (obj) =>{
    this.setState(
      {...obj}
    )
  } //设置state对象
  setSelect = (data) =>{
    if(this.state.feedbackData.feedbackType == data){
      this.setPropsState(
        {
          feedbackData:{
            ...this.state.feedbackData,
            feedbackType:'',
          }
        }
      )
    }
    else {
      this.setPropsState(
        {
          feedbackData:{
            ...this.state.feedbackData,
            feedbackType:data,
          }
        }
      )
    }
  }//单选框
  setTextArea = (value,e) => {
    this.setPropsState({
      feedbackData:{
        ...this.state.feedbackData,
        problemDesc:e.target.value,
      }
    })
  }//多行文本
  setFeedback = () => {
    const {feedbackType,problemDesc} = this.state.feedbackData
    if(feedbackType===''||problemDesc.length<10){
      return this.setPropsState({
        Toast: {
          text:'请按要求填写完整数据',
          status:'error',
          isOpened:true
        }
      })
    }
    else{
      if(process.env.TARO_ENV === 'weapp' ){
          request({url:wxapiPost.userFeedback,data:this.state.feedbackData},'post').
          then(res=>{
            const { data:{success,resultDesc } } = res
            if(success){
              this.setPropsState({
                visible: true
              })
            }
            else {
              this.setPropsState({
                Toast: {
                  text:`提交失败${resultDesc}`,
                  status:'error',
                  isOpened:true
                }
              })
            }
          })
            .catch(e=>{
            this.setPropsState({
              Toast: {
                text:`服务器错误${e}`,
                status:'error',
                isOpened:true
              }
            })
          })
      }
      else if(process.env.TARO_ENV === 'h5' ){
         HTTP_POST(wxapiPost.userFeedback,this.state.feedbackData)
           .then(res=>{
              const { data:{success,resultDesc } } = res
              if(success){
                this.setPropsState({
                   visible: true
                })
              }
              else {
                this.setPropsState({
                  Toast: {
                    text:`提交失败${resultDesc}`,
                    status:'error',
                    isOpened:true
                  }
                })
              }
           }).catch(e=>{
           this.setPropsState({
             Toast: {
               text:`服务器错误${e}`,
               status:'error',
               isOpened:true
             }
           })
         })
      }
    }
  }//提交数据

  componentWillMount () {}

  componentDidMount () {
  }

  componentWillUnmount () { }

  render () {
    // const { counterStore: { counter } } = this.props
    return (
      <View className='Feedback_box'>
        {process.env.TARO_ENV === 'weapp' ?'' : <Navigation navData={this.state.nav}></Navigation>}
        {/*<Navigation navData={this.state.nav}></Navigation>*/}
        {/*页面导航*/}
        <View className='Feedback_Problem'>
          （必选）请选择你想反馈的问题点
        </View>
        <View className='Feedback_select'>
          <View className={classNames('Feedback_option',this.state.feedbackData.feedbackType==='abnormal'&& 'Feedback_optionTrue')}onClick={()=>this.setSelect('abnormal')}>功能异常：功能故障或不可用</View>
          <View className={classNames('Feedback_option',this.state.feedbackData.feedbackType==='advice'&& 'Feedback_optionTrue')} onClick={()=>this.setSelect('advice')}>产品建议：用的不爽，我有建议</View>
          <View className={classNames('Feedback_option',this.state.feedbackData.feedbackType==='safety'&& 'Feedback_optionTrue')} onClick={()=>this.setSelect('safety')}>安全问题：密码、隐私、欺诈等</View>
          <View className={classNames('Feedback_option',this.state.feedbackData.feedbackType==='terminal'&& 'Feedback_optionTrue')} onClick={()=>this.setSelect('terminal')}>商品终端问题：无法支付、支付慢等</View>
          <View className={classNames('Feedback_option',this.state.feedbackData.feedbackType==='other'&& 'Feedback_optionTrue')} onClick={()=>this.setSelect('other')}>其他问题</View>
        </View>
        <View className='Feedback_Problem'>
          请补充详细问题和意见
        </View>
        <View className='Feedback_Textarea'>
          <AtTextarea
            className='Feedback_TextareaStyle'
            placeholder='请输入不少于10个字的描述'
            value={this.state.feedbackData.problemDesc}
            onChange={(value,e)=>this.setTextArea(value,e)}
            maxLength={240}>
          </AtTextarea>
        </View>
        <View className='Feedback_save'>
          <View className='Feedback_btn' onClick={()=>this.setFeedback()}>
            提交
          </View>
        </View>
        {this.state.visible?  <View className='Feedback_float'>
          <View className='Feedback_float_Toast'>
            <View className='Feedback_float_title'>谢谢你的建议，我们将持续为你改进</View>
            <View className='Feedback_float_btn'>确定</View>
          </View>
        </View>:null}
        <AtToast isOpened={this.state.Toast.isOpened} text={this.state.Toast.text} onClose={()=>this.setPropsState({
          Toast: {
            text:'',
            status:'',
            isOpened:false
          }
        })} status={this.state.Toast.status}></AtToast>
      </View>
    )
  }
}

export default Index
