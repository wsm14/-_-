import React, {useState, useEffect} from "react";
import {CoverView, View} from '@tarojs/components'
import Taro from '@tarojs/taro'
import {toast} from "@/common/utils";
import './index.scss'

export default (props) => {
  const [list, setList] = useState([])
  const {data, onClose, onCancel, isOpened = false} = props
  useEffect(() => {
    if (data) {
      setList(data)
    }
  }, [data])
  return (
    <View catchMove>
      <CoverView className='pay_telephone_box' onClick={(e) => {
        e.stopPropagation();
        onClose()
      }}>

        <CoverView className='pay_telephone_body' onClick={(e)=> {e.stopPropagation()}}>
          {list.map((item) => {
              return (
                <CoverView className='pay_telephone_btnStyle' onClick={() => Taro.makePhoneCall({
                  phoneNumber: item,
                  fail: res => {
                    toast('拨打失败')
                  },
                  complete: res => {
                    onClose();
                  }
                })}>
                  {item}
                </CoverView>)
            }
          )}
          <CoverView className='pay_telephone_btnStyle pay_telephone_btnTop' onClick={() => {onCancel()}}>
            取消
          </CoverView>
        </CoverView>
      </CoverView>
    </View>

  )
}
