import React,{useState} from "react";
import {View} from "@tarojs/components";
import classNames from 'classnames'
export default (props) => {
  const {close,cancel} = props
  const list =  ['买错了/买多了','临时有变','商家表示不可用','没货了','预约失败','其他原因']
  const [str,setStr] = useState(null)
  const handleTouchMove = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
   return (
     <View className='public_fixed animated bounceInUp' onClick={() => close()}  onTouchMove={handleTouchMove}>
       <View className='draw_box' onClick={(e)=> e.stopPropagation()}>
         <View className='draw_top public_auto'>
           <View className='font28 color2' onClick={() =>close()}>取消</View>
           <View className='font32 color1 bold'>选择退款原因</View>
           <View className='font28 color4' onClick={() => cancel(list[str])}>确定</View>
         </View>
         <View className='draw_center'>
           {list.map((item,index) => {
             return (
               <View className='draw_select public_auto' onClick={() => setStr(index)}>
                 <View className='color8 font28'>{item}</View>
                 <View className={classNames('draw_selectIcon',str === index?'kol_drawTrue' : 'kol_drawFalse')}></View>
               </View>
             )
           })}
         </View>
       </View>
     </View>
   )
}
