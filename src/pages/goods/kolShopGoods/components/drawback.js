import React,{useState} from "react";
import {CoverImage, CoverView} from "@tarojs/components";
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
     <CoverView className='public_fixed animated bounceInUp' onClick={() => close()}  onTouchMove={handleTouchMove}>
       <CoverView className='draw_box' onClick={(e)=> e.stopPropagation()}>
         <CoverView className='draw_top public_auto'>
           <CoverView className='font28 color2' onClick={() =>close()}>取消</CoverView>
           <CoverView className='font32 color1 bold'>选择退款原因</CoverView>
           <CoverView className='font28 color4' onClick={() => cancel(list[str])}>确定</CoverView>
         </CoverView>
         <CoverView className='draw_center'>
           {list.map((item,index) => {
             return (
               <CoverView className='draw_select public_auto' onClick={() => setStr(index)}>
                 <CoverView className='color8 font28'>{item}</CoverView>
                 <CoverImage className='draw_selectIcon' src={str === index?'https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/drawTrue.png' : 'https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/drawFlase.png'}></CoverImage>
               </CoverView>
             )
           })}
         </CoverView>
       </CoverView>
     </CoverView>
   )
}
