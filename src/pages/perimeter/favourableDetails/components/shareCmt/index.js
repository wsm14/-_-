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
            fail: () => {
              toast(`图片${index + 1}保存失败`);
            },
          });
        },
        complete: () => {
          if (index === filterImage.length - 1) {
            toast("图片已保存到手机相册");
            Taro.hideLoading();
          }
        },
      });
    });
  };
  if (filterStrList(activityGoodsImg).length > 0 || recommendReason !== "") {
    return (
      <View className="shareCmt_box">
        {filterStrList(activityGoodsImg).length > 0 && (
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
        )}
        {recommendReason !== "" && (
          <View>
            <View className="shareCmt_title shareCmt_margin_info">
              分享文案
            </View>
            <View className="shareCmt_liner_content">
              {recommendReason}

              {urlLink && (
                <View className="shareCmt_cobyLink_title">
                  【商品链接】{" "}
                  <View className="shareCmt_cobyLink">商品链接</View>
                </View>
              )}
            </View>
            <View
              className="shareCmt_btn public_center "
              onClick={(e) => {
                e.stopPropagation();
                Taro.setClipboardData({
                  data: recommendReason + "\r\n【商品链接】" + urlLink,
                  success: function (res) {
                    toast("文案已粘贴到剪贴板");
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
        )}
      </View>
    );
  } else {
    return null;
  }
};
