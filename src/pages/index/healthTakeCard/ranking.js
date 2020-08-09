import Taro from '@tarojs/taro'
import {View, Text, Swiper, Image, SwiperItem, OpenData} from '@tarojs/components'
import {AtToast,AtTabBar} from "taro-ui"
import Utils from './../../../utils/utils'
import './Ranking.scss'
class Ranking extends Taro.Component{
  defaultProps = {}
  config = {
    navigationBarTitleText: '排行榜 ' ,
  }
  constructor () {
    super(...arguments)
    this.state = {
    }
  }

  componentWillMount() {

  }
  render() {
    return(
      <View className='ranking_box'>
        <View className='ranking_back'>
          <View onClick={() => Utils.goBack()}></View>
        </View>
        <View className='ranking_user clearfix'>
          <View className='ranking_userImg'>
            <OpenData type='userAvatarUrl'></OpenData>
          </View>
          <View className='ranking_userDetails'>
            <View className='ranking_username'>
              <OpenData type='userNickName'></OpenData>
            </View>
            <View className='ranking_footRank'>
              第30名{'  '} 8000步
            </View>
          </View>
        </View>
        <View className='ranking_rankList'>
          <View className='ranking_ListIcon'></View>
          <View className='ranking_rankBox'>
            <View className='ranking_rankscroll'>
              <View className='clearfix ranking_ranklistDetails'>
                <View className='ranking_rankicon ranking_rankbg1'></View>
                <View className='clearfix'>
                  <View className='ranking_rankImg ranking_imgRang1'>
                    <Image src='https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/health/rankList.png'></Image>
                  </View>
                  <View className='ranking_rankDetails'>
                    <View className='ranking_username'>
                      12323
                    </View>
                    <View className='ranking_footRank clearfix'>
                      <View className='ranking_city'>
                        杭州
                      </View>
                      <View className='ranking_sex'>
                        <Image src='https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/health/boySex.png'></Image>
                      </View>
                    </View>
                  </View>
                </View>
                <View className='ranking_ranklistNum'>
                  42000步
                </View>
              </View>
              <View className='clearfix ranking_ranklistDetails'>
                <View className='ranking_rankicon ranking_rankbg2'></View>
                <View className='clearfix'>
                  <View className='ranking_rankImg ranking_imgRang2'>
                    <Image src='https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/health/rankList.png'></Image>
                  </View>
                  <View className='ranking_rankDetails'>
                    <View className='ranking_username'>
                      12323
                    </View>
                    <View className='ranking_footRank clearfix'>
                      <View className='ranking_city'>
                        杭州
                      </View>
                      <View className='ranking_sex'>
                        <Image src='https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/health/girlSex.png'></Image>
                      </View>
                    </View>
                  </View>
                </View>
                <View className='ranking_ranklistNum'>
                  42000步
                </View>
              </View>
              <View className='clearfix ranking_ranklistDetails'>
                <View className='ranking_rankicon ranking_rankbg3'></View>
                <View className='clearfix'>
                  <View className='ranking_rankImg ranking_imgRang3'>
                    <Image src='https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/health/paihangA.png'></Image>
                  </View>
                  <View className='ranking_rankDetails'>
                    <View className='ranking_username'>
                      12323
                    </View>
                    <View className='ranking_footRank clearfix'>
                      <View className='ranking_city'>
                        杭州
                      </View>
                      <View className='ranking_sex'>
                        <Image src='https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/health/boySex.png'></Image>
                      </View>
                    </View>
                  </View>
                </View>
                <View className='ranking_ranklistNum'>
                  42000步
                </View>
              </View>
              <View className='clearfix ranking_ranklistDetails'>
                <View className='clearfix'>
                  <View className='ranking_rankImg'>
                    <Image src='https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/health/rankList.png'></Image>
                  </View>
                  <View className='ranking_rankDetails'>
                    <View className='ranking_username'>
                      12323
                    </View>
                    <View className='ranking_footRank clearfix'>
                      <View className='ranking_city'>
                        杭州
                      </View>
                      <View className='ranking_sex'>
                        <Image src='https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/health/boySex.png'></Image>
                      </View>
                    </View>
                  </View>
                </View>
                <View className='ranking_ranklistNum'>
                  42000步
                </View>
              </View>
              <View className='clearfix ranking_ranklistDetails'>
                <View className='clearfix'>
                  <View className='ranking_rankImg'>
                    <Image src='https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/health/rankList.png'></Image>
                  </View>
                  <View className='ranking_rankDetails'>
                    <View className='ranking_username'>
                      12323
                    </View>
                    <View className='ranking_footRank clearfix'>
                      <View className='ranking_city'>
                        杭州
                      </View>
                      <View className='ranking_sex'>
                        <Image src='https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/health/boySex.png'></Image>
                      </View>
                    </View>
                  </View>
                </View>
                <View className='ranking_ranklistNum'>
                  42000步
                </View>
              </View>
              <View className='clearfix ranking_ranklistDetails'>
              <View className='clearfix'>
                <View className='ranking_rankImg'>
                  <Image src='https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/health/rankList.png'></Image>
                </View>
                <View className='ranking_rankDetails'>
                  <View className='ranking_username'>
                    12323
                  </View>
                  <View className='ranking_footRank clearfix'>
                    <View className='ranking_city'>
                      杭州
                    </View>
                    <View className='ranking_sex'>
                      <Image src='https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/health/boySex.png'></Image>
                    </View>
                  </View>
                </View>
              </View>
              <View className='ranking_ranklistNum'>
                42000步
              </View>
            </View>
              <View className='clearfix ranking_ranklistDetails'>
                <View className='clearfix'>
                  <View className='ranking_rankImg'>
                    <Image src='https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/health/rankList.png'></Image>
                  </View>
                  <View className='ranking_rankDetails'>
                    <View className='ranking_username'>
                      12323
                    </View>
                    <View className='ranking_footRank clearfix'>
                      <View className='ranking_city'>
                        杭州
                      </View>
                      <View className='ranking_sex'>
                        <Image src='https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/health/boySex.png'></Image>
                      </View>
                    </View>
                  </View>
                </View>
                <View className='ranking_ranklistNum'>
                  42000步
                </View>
              </View>
              <View className='clearfix ranking_ranklistDetails'>
                <View className='clearfix'>
                  <View className='ranking_rankImg'>
                    <Image src='https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/health/rankList.png'></Image>
                  </View>
                  <View className='ranking_rankDetails'>
                    <View className='ranking_username'>
                      12323
                    </View>
                    <View className='ranking_footRank clearfix'>
                      <View className='ranking_city'>
                        杭州
                      </View>
                      <View className='ranking_sex'>
                        <Image src='https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/health/boySex.png'></Image>
                      </View>
                    </View>
                  </View>
                </View>
                <View className='ranking_ranklistNum'>
                  42000步
                </View>
              </View>
            </View>
          </View>
          <View className='ranking_explain'>
            <View>达人排名（显示全国前50名）</View>
            <View>严厉打击刷步行为，一经发现，永久屏蔽</View>
          </View>
        </View>
      </View>
    )
  }
}
export default Ranking
