import React from "react";
import { useRouter } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";

// member 会员充值 phoneBill 话费充值
export default () => {
  const routeParams = useRouter().params;
  const { mode = "phoneBill" } = routeParams;

  return (
    <View className="commerOrder_pay_info">
      <View className="commerOrder_pay_title">购买须知</View>
      {mode === "phoneBill" ? (
        <>
          <View className="commerOrder_pay_desc">
            1.此产品为卡豆特价，充值会员在用户支付完成后预计3小时内到账。具体以充值的平台返回的充值结果为准；
          </View>
          <View className="commerOrder_pay_desc">
            2.支付完成后，用户不能取消订单；
          </View>
          <View className="commerOrder_pay_desc">
            3.账号状态异常的号码（包括但不限于写错、未注册账号）可能无法充值成功；若充值失败，用户支付的款项将原路退回。
          </View>
        </>
      ) : (
        <>
          <View className="commerOrder_pay_desc">
            1.此产品为卡豆特价，充值会员在用户支付完成后预计3小时内到账。具体以充值的平台返回的充值结果为准；
          </View>
          <View className="commerOrder_pay_desc">
            2. 支付完成后，用户不能取消订单；
          </View>
          <View className="commerOrder_pay_desc">
            3.
            账号状态异常的号码（包括但不限于写错、未注册账号）可能无法充值成功；若充值失败，用户支付的款项将原路退回；
          </View>
          <View className="commerOrder_pay_desc">
            4. 腾讯视频充值账号支持QQ账号；
          </View>
          <View className="commerOrder_pay_desc">视频会员适用范围</View>
          <View className="commerOrder_pay_desc">
            · 爱奇艺黄金会员：手机、电脑、ipad使用，不支持TV端；
          </View>
          <View className="commerOrder_pay_desc">
            · 爱奇艺钻石会员：手机、电脑、ipad、TV端；
          </View>
          <View className="commerOrder_pay_desc">
            · 芒果全屏视频会员：手机、电脑、ipad、TV端；
          </View>
          <View className="commerOrder_pay_desc">
            · 优酷视频会员：手机、电脑、ipad使用，不支持TV端；
          </View>
          <View className="commerOrder_pay_desc">
            · 优酷酷喵视频会员：手机、电脑、ipad使用，TV端；{" "}
          </View>
          <View className="commerOrder_pay_desc">
            · 腾讯视频会员：手机、电脑、ipad；{" "}
          </View>
          <View className="commerOrder_pay_desc">
            · 腾讯视频SVIP会员：手机、电脑、ipad使用，TV端。
          </View>
          <View className="commerOrder_pay_desc">
            · 搜狐视频会员：电脑、手机、Pad
          </View>
          <View className="commerOrder_pay_desc">
            · 搜狐视频OTT会员：电脑、手机、Pad、TV端；
          </View>
          <View className="commerOrder_pay_desc">
            · bilibili会员：电脑、手机、Pad端
          </View>
          <View className="commerOrder_pay_desc">音乐会员适用范围</View>
          <View className="commerOrder_pay_desc">
            · 网易云音乐：手机、pad、电脑端。
          </View>
          <View className="commerOrder_pay_desc">
            · QQ音乐：手机、pad、电脑端。
          </View>
          <View className="commerOrder_pay_desc">
            · 酷狗音乐：手机、ipad、电脑端。
          </View>
          <View className="commerOrder_pay_desc">精选会员适用范围</View>
          <View className="commerOrder_pay_desc">
            · 迅雷会员：手机、pad、电脑端。
          </View>
          <View className="commerOrder_pay_desc">· 樊登读书：手机端。</View>
          <View className="commerOrder_pay_desc">
            · 喜马拉雅：手机、pad、电脑端。
          </View>
          <View className="commerOrder_pay_desc">
            · 懒人读书：手机、pad、电脑端。
          </View>
        </>
      )}
    </View>
  );
};
