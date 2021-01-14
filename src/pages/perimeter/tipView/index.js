import React, {Component} from 'react'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {Text, View} from '@tarojs/components'
import {toast} from "@/common/utils";
import NallStatus from '@/components/nullStatus'
import {createdShareKol} from '@/components/publicShopStyle'
import {getTopicDetail} from '@/server/common'
import {getListKolMoments} from '@/server/perimeter'
import Waterfall from '@/components/waterfall'
import './index.scss'
import {backgroundObj} from "../../../common/utils";
class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      countStatus: true,
      httpData: {
        page: 1,
        limit: 10,
        topicId: getCurrentInstance().router.params.topicId,
      },
      topicId: getCurrentInstance().router.params.topicId,
      topicInfo: {},
      kolMomentsList:[]
    }
  }

  componentWillMount() {
  }

  onReady() {
    // 生命周期函数--监听页面初次渲染完成
  }

  // 获取周边特价
  componentDidShow() {
    this.getTopicDetail()
  }
  componentDidMount() {
    this.getListKolMoments()
  }

  getTopicDetail() {
    const {topicId} = this.state
     getTopicDetail({topicId: topicId},res=>  {
       const  { topicInfo} = res
       this.setState({
         topicInfo
       })
     })
  }
  getListKolMoments() {
    const {httpData} = this.state
    getListKolMoments(httpData,res=>  {
      const  {kolMomentsList} = res
      if (kolMomentsList && kolMomentsList.length > 0) {
        this.setState({
          kolMomentsList: [...this.state.kolMomentsList, ...kolMomentsList]
        })
      } else {
        this.setState({
          countStatus: false,
        })
      }
    })
  }
  onReachBottom() {
    const {httpData, countStatus} = this.state
    if (countStatus) {
      this.setState({
        httpData: {
          ...httpData,
          page: httpData.page + 1
        },
      }, res => {
        this.getListKolMoments()
      })
    } else {
      return toast('暂无数据')
    }

  }//上拉加载
  render() {
    const {topicInfo:
      {
        topicName,
        topicDesc,
        image,
        viewNum,
        participateNum
      },
      kolMomentsList
    } = this.state
    return (
      <View className='tipView_box'>
        <View style={image?backgroundObj(image):{}} className='tipView_banner dakale_nullImage'>
          <View className='tipView_opName bold'>
            {topicName}
          </View>
          <View className='tipView_opDec font_hide'>
            {topicDesc}
          </View>
          <View className='tipView_num'>
            {`${viewNum} 浏览 | ${participateNum} 参与`}
          </View>
        </View>
        <View className='view_padding'>
          {kolMomentsList.length > 0 ?
            <Waterfall
              list={kolMomentsList}
              createDom={createdShareKol}
              imgHight={'frontImageHeight'}
              imgWidth={'frontImageWidth'}
              setWidth={335}
              style={{width: Taro.pxTransform(335)}}
            >
            </Waterfall>
            :
            <View></View>
          }
        </View>

      </View>
    )
  }
}

export default Index
