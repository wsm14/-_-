import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View,Text} from '@tarojs/components'
import classNames from 'classnames'
import {wxapiGet} from '../../../api/api'
import Ajax from '@/api/request'
import Utils from '../../../utils/utils'
import './index.scss'
class lookShare extends Component{
  constructor () {
    super(...arguments)
    this.state = {
      listMoment: {
        contentType: 'video',// video image
        categoryId: '',
        sortType: 'time',//time-时间 bean-卡豆
        distance: '',
        page: 1,
        limit: 10,
        syncType: '',
        syncSubTypeKey: '',
        'district-code': '330101'
      },//请求看分享参数
      userMomentsList: [],//看分享拿到数据的数组
      FreshenType: 0,//底部下拉加载的样式,
      spaceType: false,//距离排序下拉框
      rootList: false,//任务筛选下拉框
      category: false,
      parentId:0,//查询商家类别列表 父类别id，如果查询所有，parentId =0
      keyValueList: [],//看分享的數組
      checkedList: [],//任务筛选标签选中后加入数组
      viewType: false,//展示样式
      root: 'task',//任务筛选的标签
      categoryList:[],
      categoryCheckedList:[]
    }
  }
  componentDidShow() {
    this.getShare()
  }//第一次进页面拿数据
  onPullDownRefresh() {
    this.setState({
      listMoment:{
        ...this.state.listMoment,
        limit:this.state.listMoment.limit = 10
      },
      FreshenType: 1
    },res =>{
      this.getShare()
    })
  }//下拉事件
  onReachBottom(){
    this.setState({
      listMoment:{
        ...this.state.listMoment,
        limit:this.state.listMoment.limit+=10
      },
      FreshenType: 1
    },res =>{
      this.getShare()
    })
  }//上拉加载
  getShare() {
    Ajax({data:this.state.listMoment,url:wxapiGet.wechatShare},'get')
      .then(res => {
        if(res.errMsg !== 'request:ok'||res.statusCode != '200'){
          Utils.Toast(res.data.error||res.errMsg)
        }
        else {
          const {data:{success ,content ,resultDesc} } = res
          if(success){
            this.setState({
              userMomentsList: content.userMomentsList,
              FreshenType: 0
            })
          }
          else {
            Utils.Toast(resultDesc)
          }
        }
      })
  }//http
  getKeyValueList() {
    Ajax({data:{root:this.state.root},url:wxapiGet.wechatByRoot},'get')
      .then(res => {
        if(res.errMsg !== 'request:ok'){
          Utils.Toast(res.errMsg)
        }
        else {
          const {data:{success ,content ,resultDesc} } = res
          if(success){
            this.setState({
              keyValueList: content.keyValueList,
            })
          }
          else {
            Utils.Toast(resultDesc)
          }
        }
      })
  }//看分析的http
  getCategoryList() {
    Ajax({data:{parentId:this.state.parentId},url:wxapiGet.wechatListCategory},'get')
      .then(res => {
        if(res.errMsg !== 'request:ok'){
          Utils.Toast(res.errMsg)
        }
        else {
          const {data:{success ,content ,resultDesc} } = res
          if(success){
            this.setState({
              categoryList: content.categoryList,
            })
          }
          else {
            Utils.Toast(resultDesc)
          }
        }
      })
  }//筛选http
  setType() {
    if(this.state.listMoment.sortType === 'time'){
      this.setState({
        listMoment:{
          ...this.state.listMoment,
          sortType: 'bean',
        },
        spaceType: false,
        rootList:false,
      },res=>{
        this.getShare()
      })
    }
    else{
      this.setState({
        listMoment:{
          ...this.state.listMoment,
          sortType: 'time'
        },
        spaceType: false,
        rootList:false,
      },res =>{
        this.getShare()
      })
    }
  }//根据距离请求数据
  setLayer() {
    this.setState({
       spaceType: !this.state.spaceType,
       rootList: false,
       category: false,
    })
  }//打开距离弹框
  setrootList() {
    this.setState({
      rootList: !this.state.rootList,
      spaceType: false,
      category: false,
      checkedList:[...this.state.listMoment.syncSubTypeKey.split(',')]

    },res =>{
      if(this.state.rootList && this.state.keyValueList.length ===0){
        this.getKeyValueList()
      }
    })
  }//设置任务数据
  bubbling(e) {
    e.stopPropagation()
  }//阻止事件冒泡
  setSyncType(obj){
    this.setState({
        listMoment: {
          ...this.state.listMoment,
          ...obj
        },
      spaceType:false
      },res =>{
         this.getShare();
      }
    )
  }//設置任務賽選彈框
  setChecked(key,arr) {
   if(arr.includes(key)){
     arr.forEach((item,index) =>{
       if(item == key){
        arr.splice(index,1)
         this.setState({
             [arr]:[...arr]
           }
         )
       }
     })
   }
   else{
     arr.push(key)
     this.setState({
       [arr]: [...arr]
     })
   }
  }//任務篩選
  setSync(obj){
    this.setState({
      listMoment:{
        ...this.state.listMoment,
        limit: 10,
        ...obj
      },
      rootList:false,
      category: false,
    }, res => {
      this.getShare();
    })
  }
  setContent(obj){
    this.setState({
      listMoment:{
        ...this.state.listMoment,
        ...obj
      }
    },res =>{
      this.getShare()
    })
  }
  //顶部切换类型
  setCategory(){
    this.setState({
      category : !this.state.category,
      spaceType: false,//距离排序下拉框
      rootList: false,
      categoryCheckedList:[...this.state.listMoment.categoryId.split(',')]
    },res =>{
      if(this.state.categoryList.length === 0 ){
        this.getCategoryList()
      }
    })
  }//设置分类筛选
  golookShareById(Id) {
    const {listMoment:{contentType}} = this.state
    if(contentType ==='video'){
      Utils.navigateTo(`/pages/index/lookShare/shareVideo/index?momentId=${Id}`)
    }
    else {
      Utils.navigateTo(`/pages/index/lookShare/shareImage/index?momentId=${Id}`)
    }
  }
  render () {
    const {
      viewType,//展示样式
      userMomentsList,//看分享拿到数据的数组
      FreshenType ,//加载组件
      listMoment,//请求参数
      spaceType,//弹层
      rootList,//标签层
      keyValueList,//看分享标签的數組
      checkedList,//选中的标签数组
      category,
      categoryList,
      categoryCheckedList
    } = this.state
    return (
      <View className='lookshare_Box' style={spaceType||rootList||category?{overflow:'hidden',height:'100%'}:null}>
        <View className='lookshare_Title cleanfix'>
          <View className='lookshare_backIcon'  onClick={() => Utils.goBack()}></View>
          <View className={classNames('lookshare_navTab',listMoment.contentType==='video' &&'lookshare_ChecknavTab')} onClick={() => this.setContent({contentType:'video'})}>
            视频
            {listMoment.contentType==='video'?<View className='lookshare_ChecknavIcon'></View>:null}
          </View>
          <View className={classNames('lookshare_navTab1',listMoment.contentType==='image' &&'lookshare_ChecknavTab')} onClick={() => this.setContent({contentType:'image'})}>
            <View>图文</View>
            {listMoment.contentType==='image'?<View className='lookshare_ChecknavIcon'></View>:null}
          </View>
        </View>
         {/*导航栏*/}
        <View className='lookshare_select'>
          <View className='lookshare_select_box cleanfix'>
            <View className={spaceType?'lookshare_space lookshare_selectChecked':'lookshare_space lookshare_selectIcon'} onClick={ () => this.setLayer()}>
              距离排序
            </View>
            <View className={classNames('lookshare_getBean',listMoment.sortType==='bean' && 'lookshare_selectColor') } onClick={() =>this.setType() }>
             捡豆排序
            </View>
            <View className={rootList?'lookshare_task lookshare_selectChecked':'lookshare_task lookshare_selectIcon'} onClick={ () => this.setrootList()}>
             任务筛选
            </View>
            <View className={classNames('lookshare_task',category && 'lookshare_task lookshare_selectColor')} onClick={ () => this.setCategory()}>
              分类筛选
            </View>
            <View className={classNames(viewType?'lookshare_style1':'lookshare_style')} onClick={()=>{this.setState({ viewType : ! viewType})}}>
            </View>
          </View>
        </View>
        {/*条件选择框*/}
        {spaceType ?
          <View className='lookshare_layer' onClick={ () => this.setLayer()}>
            <View className='lookshare_layer_space' onClick={this.bubbling}>
              <View className='lookshare_layer_spaceLimit' onClick={() =>this.setSyncType({distance:'500'})}>500m</View>
              <View className='lookshare_layer_spaceLimit' onClick={() =>this.setSyncType({distance:'1000'})}>1km</View>
              <View className='lookshare_layer_spaceLimit' onClick={() =>this.setSyncType({distance:'2000'})}>2km</View>
              <View className='lookshare_layer_spaceLimit' onClick={() =>this.setSyncType({distance:''})}>全部</View>
            </View>
          </View>
          :null
        }
        {/*距离排序弹层*/}
        {rootList ?
          <View className='lookshare_layer' onClick={ () => this.setrootList()}>
            <View className='lookshare_layer_space' onClick={this.bubbling}>
              <View  className='lookshare_layer_task'>
                {keyValueList&&keyValueList.length>0?
                  keyValueList.map(item =>{
                    return (
                      <View  key={item.key}>
                        <View>{item.value}</View>
                        <View className='lookshare_layer_tag cleanfix'>
                          {item.subKeyValueList.map((item1,index) =>{
                            return (
                              <View key={item1.key} className={checkedList.includes(item1.key)?classNames('checkedSelect', (index+1)%4 ==0 && 'checkedFour'):classNames('checkedNoSelect', (index+1)%4 ==0 && 'checkedFour')} onClick={() =>this.setChecked(item1.key,checkedList)}>
                                {item1.value}
                              </View>
                            )
                          })}
                        </View>
                      </View>
                    )
                  })
                  :null}
              </View>
              <View className='lookshare_layer_btn'>
                <View className='btn lookshare_layer_reloadBtn' onClick={() =>{this.setState({checkedList:[]})}}>
                  重置
                </View>
                <View className='btn lookshare_layer_submitBtn' onClick={() =>this.setSync({syncSubTypeKey:this.state.checkedList.join(',')})}>
                  完成
                </View>
              </View>
            </View>
          </View>
          :null
        }
        {/*任务排序弹层*/}

        {category ?
          <View className='lookshare_layer_categoryById' onClick={ () => this.setCategory()}>
            <View className='lookshare_layer_category' onClick={this.bubbling}>
              <View className='lookshare_layer_categoryTitle'>
                <View className='categoryTitle'>筛选</View>
              </View>
              <View className='lookshare_layer_categoryContent'>
                {categoryList  && categoryList.length>0?categoryList.map(item => {
                  return (
                    <View key={item.id} className={classNames('lookshare_layer_categoryTag lookshare_layer_noCheckedselect',categoryCheckedList.includes(item.id) && 'lookshare_layer_Checkedselect')} onClick={() => this.setChecked(item.id,categoryCheckedList)}>
                      {item.categoryName}
                      <View className='lookshare_layer_categoryLine'></View>
                    </View>
                  )
                }):null }
              </View>
              <View className='lookshare_layer_categoryBottom'>
                <View className='lookshare_layer_categoryBtn cleanfix'>
                  <View className='lookshare_layer_categoryButton lookshare_layer_categoryReload' onClick={() =>this.setState({ categoryCheckedList: []})}>
                    重置
                  </View>
                  <View className='lookshare_layer_categoryButton lookshare_layer_categorySubmit' onClick={() =>this.setSync({categoryId:categoryCheckedList.join(',')})}>
                    确定
                  </View>
                </View>
              </View>
            </View>
          </View>
          : null
        }
        <View className='lookshare_body'>
          {!viewType ?
            <View className='lookshare_bodyBox'>
             {userMomentsList.map(item =>{
              if(typeof item.syncSubType === 'string' && item.syncSubType.length > 0 ){
                item.syncSubType = item.syncSubType.split(',')
              }
              const ImgScale = item.frontImageHeight/item.frontImageWidth
              return (
                <View key={item.id} className='lookshare_VideoAll' onClick={() => this.golookShareById(item.momentId)}>
                  <View className='lookshare_Img' style={ImgScale=='1'?{background:`url(${item.frontImage}) no-repeat 100% 100%`} : {backgroundAttachment:'fixed',background:`url(${item.frontImage}) no-repeat 0 center/cover`}}>
                    {item.categoryName.length > 0 ? <View className='lookshare_tagType'>{item.categoryName}</View>: null}
                    {item.contentType==='video'? <View className='lookshare_VideoIcon'></View> : null}
                    {item.beanFlag&&item.watchStatus== '0'&&
                    <View className='lookshare_beanNum'>
                      {listMoment.contentType==='video'?'观看可得':'阅读可得'}<Text className='lookshare_num'>{item.beanAmount}</Text>
                    </View>}
                    {item.beanFlag && item.watchStatus!= '0'&&
                    <View className='lookshare_beanNum' style={{background:'rgba(165, 165, 165, 1)'}}>
                      已领取<Text className='lookshare_num'>{item.beanAmount}</Text>
                    </View>}
                  </View>
                  <View className='lookshare_ImgTitle'>
                    {item.title}
                  </View>
                  {item.address && item.address.length>0? <View className='lookshare_accress'>
                    <View className='lookshare_accressBox'>
                      {item.address}
                    </View>
                  </View> : null }
                  {item.syncSubType.length > 0 ?  <View className='lookshare_tag'>
                    {item.syncSubType.length > 0 && item.syncSubType.map((tag , index) =>{
                      return (
                        <View key={index} className='tag_Details'>
                          {tag}
                        </View>
                      )
                    })}
                  </View> : null }
                  <View className='lookshare_user cleanfix'>
                    <View className='lookshare_userImg' style={{background:`url(${item.userProfile}) no-repeat 0 center/cover`}}></View>
                    <View className='lookshare_username font_hide' style={item.contentType !== 'video'?{  maxWidth: Taro.pxTransform(120),overflowX: 'hidden',whiteSpace: 'nowrap',textOverflow:'ellipsis'}:{}}>{item.username}</View>
                      {item.contentType !== 'video'?
                        <View className='lookshare_imageText lookshare_data'>
                        <View>距你<Text className='lookshare_blue'>{item.distanceRange}</Text></View>
                      </View>
                        :
                        null}
                  </View>
                  {item.contentType==='video'?<View className='lookshare_data cleanfix'>
                    <View>距你<Text className='lookshare_blue'>{item.distanceRange}</Text></View>
                    <View><Text className='lookshare_blue'>{item.viewAmount}人</Text>已观看</View>
                  </View>:null}
                </View>
              )
            })}
             </View>:null
          }
          {/*分享瀑布流*/}
          {viewType && listMoment.contentType==='video'?userMomentsList.map(item =>{
            if(typeof item.syncSubType === 'string' && item.syncSubType.length > 0 ){
              item.syncSubType = item.syncSubType.split(',')
            }
            return (
              <View key={item.momentId} className='lookshare_compose' onClick={() => this.golookShareById(item.momentId)}>
                <View className='lookshare_compose_user cleanfix'>
                  <View className='lookshare_compose_userLeft cleanfix'>
                    <View className='lookshare_compose_userImg' style={{background:`url(${item.userProfile}) no-repeat 0 center/cover`}}>
                    </View>
                    <View className='lookshare_compose_usercontent'>
                      <View className='lookshare_compose_userName'>
                        {item.username}
                      </View>
                      <View className='lookshare_compose_userSpace'>
                        距你{item.distanceRange}m
                      </View>
                    </View>
                    {item.beanFlag && item.watchStatus == '0' && <View className='lookshare_compose_getBean'>
                      <Text className='lookshare_compose_getBeanIcon'>{listMoment.contentType==='video'?'观看可得'+item.beanAmount:'阅读可得'+item.beanAmount}</Text>
                    </View>}
                    {item.beanFlag && item.watchStatus!= '0'&&<View className='lookshare_compose_getBean'>
                      <Text className='lookshare_compose_getBeanIcon' style={{background:'rgba(165, 165, 165, 1)'}}>已领取{item.beanAmount}</Text>
                    </View>}
                  </View>
                  <View className='lookshare_compose_userRight'>
                    <View className='lookshare_compose_share'></View>
                  </View>
                </View>
                {item.syncSubType.length > 0 ?  <View className='lookshare_compose_tag'>
                  {item.syncSubType.length > 0 && item.syncSubType.map((tag , index) =>{
                    return (
                      <View key={index} className='compose_tags'>
                        {tag}
                      </View>
                    )
                  })}
                </View> : null }
                <View className='lookshare_compose_video'
                      style={ {backgroundAttachment:'fixed',background:`url(${item.frontImage}) no-repeat 0 center/cover`}}
                >
                  <View className='lookshare_compose_title'>
                    {item.title}
                  </View>
                  <View className='lookshare_compose_play'>
                    {item.viewAmount}次播放
                  </View>
                  {item.categoryName.length > 0 ? <View className='lookshare_compose_category'>{item.categoryName}</View>: null}
                  <View className='lookshare_compose_playIcon'></View>
                  {item.length?
                   <View className='lookshare_compose_time'>
                     {'0'+(parseInt(item.length/60)>0?parseInt(item.length/60):'0')+':'+((item.length%60)>10?(item.length%60) : '0'+(item.length%60))}
                   </View>:null}
                </View>
              </View>
            )
          }):null}

          {viewType && listMoment.contentType!=='video'?userMomentsList.map(item =>{
            if(typeof item.syncSubType === 'string' && item.syncSubType.length > 0 ){
              item.syncSubType = item.syncSubType.split(',')
            }
            return (
              <View key={item.momentId} className='lookshare_compose' onClick={() => this.golookShareById(item.id)}>
                <View className='lookshare_compose_user cleanfix' style={{border:'0px'}}>
                  <View className='lookshare_compose_userLeft cleanfix'>
                    <View className='lookshare_compose_userImg' style={{background:`url(${item.userProfile}) no-repeat 0 center/cover`}}>
                    </View>
                    <View className='lookshare_compose_usercontent'>
                      <View className='lookshare_compose_userName font_hide'>
                        {item.username}
                      </View>
                      <View className='lookshare_compose_userSpace'>
                        距你{item.distanceRange}m
                      </View>
                    </View>
                    {item.beanFlag&& item.watchStatus == '0' &&
                    <View className='lookshare_compose_getBean'>
                      <Text className='lookshare_compose_getBeanIcon'>{listMoment.contentType==='video'?'观看可得'+item.beanAmount:'阅读可得'+item.beanAmount}</Text>
                    </View>
                      }
                    {item.beanFlag&& item.watchStatus!= '0' &&
                    <View className='lookshare_compose_getBean'>
                      <Text className='lookshare_compose_getBeanIcon' style={{background:'rgba(165, 165, 165, 1)'}}>已领取{item.beanAmount}</Text>
                    </View>
                    }
                  </View>
                  <View className='lookshare_compose_userRight'>

                  </View>
                </View>
                <View className='lookshare_compose_video'
                      style={ {backgroundAttachment:'fixed',background:`url(${item.frontImage}) no-repeat 0 center/cover`}}
                >
                  {item.categoryName.length > 0 ?  <View className='lookshare_compose_imgTitle'>{item.categoryName}</View>: null}
                  {item.imageLength.length > 0 ?  <View className='lookshare_compose_Imgnum'>{parseInt(item.imageLength)+1}张</View>: null}
                </View>
                <View  className='lookshare_compose_ImguserTitle'>
                  {item.title}
                </View>
                {item.address.length>0&&<View className='lookshare_compose_imgAddress'>
                  <Text className='lookshare_compose_Icon'>{item.address}</Text>
                </View>}
                {item.syncSubType.length > 0 ?
                  <View className='lookshare_compose_tag' style={{paddingBottom:'0px'}}>
                  {item.syncSubType.length > 0 && item.syncSubType.map((tag , index) =>{
                    return (
                      <View key={index} className='compose_tags'>
                        {tag}
                      </View>
                    )
                  })}
                </View>
                  : null }
              </View>
            )
          }):null}
          {/*分享单行流*/}
        </View>
        {/*分享内容*/}
      </View>
    )
  }
}

export default lookShare
