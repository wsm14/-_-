import React,{useState,useEffect,useRef} from 'react'
import {Canvas, Swiper, SwiperItem, Text, View} from "@tarojs/components";
import QR from 'wxmp-qrcode'
import './../index.scss'
export default (props) => {
  const [list ,setList ] = useState([])
  const [current,setCurrent] = useState(0)
  const arr = ['https://www.baidu.com','https://www.dakale.net','https://www.s8157.com']
  useEffect(() => {
    setList(arr)
  },[])
  useEffect(() => {
      setTimeout(() => {
        list.forEach((item,index) => {
          QR.draw(item, `canvas${index}`)
        })
      },1)
  },[list])
  const setCode = () => {
    return (
      <View className='codeBox public_center'>
        <Swiper
          current={current}
          className='code_swiper'
        >
          {arr.map((item,index) => {
            return (
              <SwiperItem>
                <Canvas id={'canvas'+index} className='tests' canvasId={'canvas'+index}></Canvas>
              </SwiperItem>
            )
          })}
        </Swiper>

        <View onClick={() => onChangeLeft()}  className='code_left codeLeft_icon codePosition'></View>
        <View onClick={() => onChangeRight()} className='code_right codeLeft_right codePosition'></View>
      </View>
    )
  }
  const onChangeLeft = () => {
    if(current === 0){
    return   setCurrent(list.length-1)
    }
    return  setCurrent(current-1)
  }
  const onChangeRight = () => {
    if(current === list.length -1){
      return   setCurrent(0)
    }
    return  setCurrent(current + 1)
  }
  return (
    <View className='descriptionCard_title'>
      <View className='descriptionCard_box'>
        <View className='descriptionCard_merchant'>
          <View className='descriptionCard_profile dakale_nullImage'></View>
          <View className='descriptionCard_merchantTitle font_hide'>必胜客（下沙宝龙店）</View>
          <View className='descriptionCard_goIcon'></View>
        </View>
        <View className='descriptionCard_merchantShop'>
          <View className='descriptionCard_merchantLogo dakale_nullImage'></View>
          <View className='descriptionCard_shop_details'>
            <View className='descriptionCard_goods_name color1 font28 font_noHide'>特价牛排</View>
            <View className='font24 color2 descriptionCard_goods_num'>数量：1</View>
          </View>
          <View className='descriptionCard_shop_price color1 bold'>
            <Text className='font20'>¥</Text>
            <Text className='font32'>10</Text>
            <Text className='font24'>.00</Text>
          </View>
        </View>
        <View className='descriptionCard_goods_liner'></View>
        <View className='descriptionCard_goods_tags public_center'>
          <View className='kolTagBox public_center'>
            <View className='kolTag kolTagIcons'></View>
            <View className='font24 color2 kolTag_font'>免预约</View>
            <View className='kolTag kolTagIcons'></View>
            <View className='font24 color2 kolTag_font'>随时退</View>
            <View className='kolTag kolTagIcons'></View>
            <View className='font24 color2 kolTag_font'>过期退</View>
          </View>
        </View>
        {setCode()}
      </View>
    </View>
  )
}
