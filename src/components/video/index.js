import React,{useState,useEffect} from "react";
import Taro from '@tarojs/taro'
import {Video,View} from '@tarojs/components'
import classNames from 'classnames'
import './index.scss'
export default (props) =>{
  const { kolMomentsInfo,onPause , onPlay,oneClick} = props
  const [videoSetting,setVideo] = useState({})

  useEffect(()=>{
      setVideo({...kolMomentsInfo})
  },[kolMomentsInfo])
  return (
      <Video
        src={videoSetting.videoContent&&JSON.parse(videoSetting.videoContent).url}
        poster={videoSetting.frontImage}
        style={{height:Taro.pxTransform(videoSetting.frontImageHeight),width:'100%'}}
        controls={false}
        enableProgressGesture={true}
        autoplay={true}
        showFullscreenBtn={false}
        enablePlayGesture={true}
        loop={true}
        showPlayBtn={false}
        objectFit='cover'
        initialTime='0'
        id='video'
        onPause={onPause}
        onPlay={onPlay}
        muted={false}
        // onClick={() =>oneClick()}
      >
      </Video>
  )
}
