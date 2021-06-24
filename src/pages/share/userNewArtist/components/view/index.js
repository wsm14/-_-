import { View, Text } from '@tarojs/components';
import './index.scss'
export const ShopView = (item) => {
  return (
    <View className='view_shop_box'>
      <View className='view_shop_img'></View>
      <View className='view_shop_content'>
        <View className='view_shopContent_box'>
          <View className='view_shopContent_name font_hide'></View>
          <View className='view_shopContent_user font_hide'>
            <View className='view_shopContent_profile'>

            </View>
            <View className='view_shopContent_username price_margin8 font_hide'>

            </View>

            <View className='view_shopContent_limit'>

            </View>
          </View>
          <View className='view_shopContent_price'>
            <View className='view_shopContent_priceTitle'>原价:</View>
            <View className='view_shopContent_priceNum price_margin4 text_through'></View>
            <View className='view_shopContent_priceTitle price_margin8'>优惠价:</View>
            <View className='view_shopContent_priceNum price_margin4'></View>
          </View>
          <View className='view_shopContent_bean'>
            卡豆抵扣后最低到手价
          </View>
          <View className='view_shopContent_buyPrice'>
            <View className='view_shopContent_info'></View>
            <View className='view_shopContent_money price_margin4'></View>
          </View>
        </View>
        <View className='view_shop_btn'>立即抢购</View>
      </View>
    </View>
  )
}
//分享 商品 或者 券ui

export const CardView = (item) => {
  return (
    <View className='view_card_box'>
      <View className='view_card_content'>
        <View className='view_card_img'></View>
        <View className='view_card_body'>
          <View className='view_card_userName font_hide'></View>
          <View className='view_card_data'>
            <View className='view_card_tag'>
              <View className='view_card_load'>营业中</View>
              <View className='view_card_liner'></View>
              <View className='view_card_time price_margin8'></View>
            </View>
            <View className='view_card_peoplePay'>人均￥89</View>
          </View>
          <View className='view_card_address'>
            <View className='view_card_size'></View>
            <View className='view_card_addressDetails font_hide'></View>
            <View className='view_card_limit'></View>
          </View>
        </View>
        <View className='view_card_golink'></View>
      </View>
    </View>
  )
}
//分享 店铺ui


export const newShopView = (item) => {
  return (
    <View className='newShopView_box'>
      <View className='newShopView_content_box'>
        <View className='newShopView_content_left'>
          <View className='newShopView_img'></View>
        </View>

        <View className='newShopView_details'>
          <View className='newShopView_details_name font_hide'></View>
          <View className='newShopView_shopContent_user font_hide'>
            <View className='newShopView_shopContent_profile'>

            </View>
            <View className='newShopView_shopContent_username price_margin8 font_hide'>

            </View>

            <View className='newShopView_shopContent_limit'>

            </View>
          </View>
          <View className='newShopView_shopContent_price font_hide'>
            <View className='newShopView_shopContent_priceTitle'>原价:</View>
            <View className='newShopView_shopContent_priceNum price_margin4 text_through'></View>
            <View className='newShopView_shopContent_priceTitle price_margin8'>优惠价:</View>
            <View className='newShopView_shopContent_priceNum price_margin4'></View>
          </View>
          <View className='newShopView_shopContent_bean'>
            卡豆抵扣后最低到手价
          </View>
          <View className='newShopView_shopContent_buyPrice'>
            <View className='newShopView_shopContent_info'></View>
            <View className='newShopView_shopContent_money price_margin4'></View>
          </View>
        </View>
      </View>

    </View>
  )
}

// 新手视频商品ui

export const meShopView_box = (item) => {
  return (
    <View className='meShopView_item'>
      <View className='meShopView_item_img'></View>
      <View className='meShopView_item_content'>
        <View className='meShopView_item_title font_hide'></View>
        <View className='meShopView_shopContent_user font_hide'>
          <View className='meShopView_shopContent_profile'>

          </View>
          <View className='meShopView_shopContent_username price_margin8 font_hide'>

          </View>

          <View className='meShopView_shopContent_limit'>

          </View>
        </View>
        <View className='meShopView_shopContent_oldPrice'>
          <View className='font18 text_through price_margin4'></View>
        </View>
        <View className='meShopView_shopContent_realPrice color1'>
          <View className='font18 price_margin4'></View>
          <View className='font20 text_through price_margin4 bold'></View>
        </View>
        <View className='meShopView_shopContent_newPrice'>
          <View className='font18 price_margin4'></View>
          <View className='font20 price_margin4 bold'></View>
        </View>
        <View className='meShopView_shopContent_getBean'>卡豆抵扣后最低到手价</View>
        <View className='meShopView_shopContent_money'>
          <View className='font20 bold'></View>
          <View className='font28 bold'></View>
        </View>
      </View>
    </View>
  )
}