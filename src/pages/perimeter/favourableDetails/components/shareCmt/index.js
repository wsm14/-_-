import React, { Component, useEffect } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, ScrollView, Image } from "@tarojs/components";
import { filterStrList } from "@/common/utils";
import { getSettingAuth } from "@/common/authority";
import { toast } from "@/common/utils";
import Router from "@/common/router";
import "./index.scss";

export default (props) => {
  const { data, urlLink } = props;

  const { activityGoodsImg, recommendReason } = data;
  const savePhoto = (filterImage) => {
    Taro.showLoading({ mask: true, title: "照片保存中..." });
    filterImage.forEach((val, index) => {
      Taro.getImageInfo({
        src: val,
        success: (sres) => {
          Taro.saveImageToPhotosAlbum({
            filePath: sres.path,
            success: (fres) => {},
          });
        },
        complete: () => {
          if (index === filterImage.length - 1) {
            Taro.hideLoading();
          }
        },
      });
    });
  };
  if (filterStrList(activityGoodsImg).length > 0 || recommendReason !== "") {
    return (
      <View className="shareCmt_box">
        <View>
          <View className="shareCmt_title">图片素材</View>
          <ScrollView scrollX className="shareCmt_image">
            <View className="shareCmt_image_view">
              {filterStrList(activityGoodsImg).map((item, index) => {
                return (
                  <View
                    className="shareCmt_image_content"
                    onClick={() => {
                      Taro.previewImage({
                        urls: filterStrList(activityGoodsImg),
                        current: index,
                      });
                    }}
                  >
                    <Image
                      lazyLoad
                      mode={"aspectFill"}
                      src={item}
                      className="shareCmt_image_info"
                    ></Image>
                  </View>
                );
              })}
            </View>
          </ScrollView>
          <View
            className="shareCmt_btn public_center"
            onClick={() => {
              getSettingAuth({
                key: "photo",
                title: "温馨提示",
                content: "请授权保存相册权限",
                success: () => {
                  savePhoto(filterStrList(activityGoodsImg));
                },
                fail: () => {},
              });
            }}
          >
            保存图片
          </View>
        </View>
        <View>
          <View className="shareCmt_title shareCmt_margin_info">图片素材</View>
          <View className="shareCmt_liner_content">
            {recommendReason}
            {urlLink && (
              <View
                className="shareCmt_cobyLink"
                onClick={(e) => {
                  e.stopPropagation();
                  Taro.setClipboardData({
                    data: urlLink,
                    success: function (res) {
                      toast("复制成功");
                    },
                    fail: function (res) {
                      toast("复制失败");
                    },
                  });
                }}
              >
                商品链接
              </View>
            )}
          </View>
          <View
            className="shareCmt_btn public_center "
            onClick={(e) => {
              e.stopPropagation();
              Taro.setClipboardData({
                data: recommendReason + "商品地址" + urlLink && urlLink,
                success: function (res) {
                  toast("复制成功");
                },
                fail: function (res) {
                  toast("复制失败");
                },
              });
            }}
          >
            复制文案链接
          </View>
        </View>
      </View>
    );
  } else {
    return null;
  }
};
