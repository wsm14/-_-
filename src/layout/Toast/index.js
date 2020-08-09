import {useState} from '@tarojs/taro'
import {Text,View,Image} from '@tarojs/components'
import './Toast.scss'
import loading from './loading.png'

function Toast(props) {
  const {type,value} = props
  let obj = {}
  if(type === 0){
     obj = {status: '', text: '加载更多'}
  }
  else if(type === 1){
     obj = {status: '', text: '加载中', isopen:true}
  }
  else if(type === 2){
    obj = {status: '', text: '已经没有数据了~~'}
  }
  const [getupDown,setupDown] = useState({})
  setupDown(obj)
  return(
    <View className='Toast_box'>
      <Text>{getupDown.text}</Text>
      {getupDown.isopen?<Image src={loading} className='aniamtion'></Image>:null}
    </View>);
}
export  default Toast
