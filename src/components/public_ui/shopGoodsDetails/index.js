import "./index.scss";
export const shopGoodsDetails = (_this, data, obj) => {
  const list = JSON.parse(data) || [];
  return (
    <View className="goods_boxs">
      <View className="goods_box_details">
        <View className="goods_box_title">套餐详情</View>
        {list.map((item) => {
          const { goodsName, goodsNum, goodsPrice } = item;
          return (
            <View className="goods_box_center">
              <View className="goods_box_font1 font_hide">
                {goodsName}
                <Text className="goods_box_font3">({goodsNum}份)</Text>
              </View>
              <View className="goods_box_font2">¥{goodsPrice}</View>
            </View>
          );
        })}
      </View>
    </View>
  );
};
