import React,{useState,useEffect} from "react";
import {View} from '@tarojs/components'
import {AtActionSheet ,AtActionSheetItem} from 'taro-ui'
import Taro from '@tarojs/taro'
import {toast} from "@/common/utils";
export default (props) =>{
  const [list,setList] = useState([])
  const {data , onClose, onCancel} = props
  useEffect(() =>{
    if(data){
      setList(data)
    }
  },[data])
  return (
    <View style={{color: '#333333'}}>
      <AtActionSheet style={{color: 'black'}} onClose = {onClose} onCancel={onCancel} isOpened cancelText='取消' title=''>
        {list.map((item) => {
          return (
            <AtActionSheetItem onClick={() => Taro.makePhoneCall({
              phoneNumber: item,
              fail: res => {
                toast('拨打失败')
              },
              complete: res => {
                onClose();
              }
            })}>
              {item}
            </AtActionSheetItem>
          )
        })}

      </AtActionSheet>
    </View>

  )
}
