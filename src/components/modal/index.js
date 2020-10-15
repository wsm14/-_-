import React,{useEffect} from "react";
import { AtModal,} from "taro-ui"
export default (props) =>{
  const {close ,cancel,confirm,visible,content,closeText,checkText,title} = props
  return (
    <AtModal
      isOpened= {visible}
      cancelText= {closeText}
      confirmText= {checkText}
      onClose={() =>close()}
      onCancel={ () =>cancel() }
      onConfirm={ () => confirm()}
      title={title}
      conntent ={content||false}
    >
    </AtModal>
  )
}
