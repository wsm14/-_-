import React, { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import TaroCanvasDrawer from "@/components/taro-plugin-canvas";
import { toast } from "@/utils/utils";
import "./index.scss";

/**
 *
 * @param {*} start TaroCanvasDrawer 组件状态
 * @param {*} data TaroCanvasDrawer 渲染数据
 * @param {*} onClose TaroCanvasDrawer 关闭回调
 * @param {*} onSave TaroCanvasDrawer 保存回调
 * @returns
 */
const shareImg = ({ start = false, data = [], type, onClose, onSave }) => {
  useEffect(() => {
    if (start) {
      canvasDrawFunc();
    }
  }, [start]);

  // 调用绘画 => canvasStatus 置为true、同时设置config
  const canvasDrawFunc = () =>
    Taro.showLoading({
      title: "绘制中...",
    });

  // 绘制成功回调函数 （必须实现）=> 接收绘制结果、重置 TaroCanvasDrawer 状态
  const onCreateSuccess = (result) => {
    const { tempFilePath, errMsg } = result;
    Taro.hideLoading();
    if (errMsg === "canvasToTempFilePath:ok") {
      if (type && type === "friend") {
        previewImage(tempFilePath);
      } else if (type && type === "image") {
        saveToAlbum(tempFilePath);
      } else {
      }
    } else {
      onCreateFail();
      Taro.showToast({ icon: "none", title: errMsg || "出现错误" });
    }
  };

  // 绘制失败回调函数 （必须实现）=> 接收绘制错误信息、重置 TaroCanvasDrawer 状态
  const onCreateFail = () => {
    Taro.hideLoading();
    // 重置 TaroCanvasDrawer 状态，方便下一次调用
    onClose && onClose(); //重置 TaroCanvasDrawer 状态，方便下一次调用
  };

  // 保存图片至本地
  const saveToAlbum = (tempFilePath) => {
    Taro.getSetting({
      success: (res) => {
        if (!res.authSetting["scope.writePhotosAlbum"]) {
          Taro.authorize({
            scope: "scope.writePhotosAlbum",
            success: (res) => {
              saveImage(tempFilePath);
            },
            fail: (res) => {
              Taro.showModal({
                title: "是否要打开设置页面",
                content: "需要您设置保存照片权限",
                success: function (res) {
                  if (res.confirm) {
                    Taro.openSetting({
                      success: (dataAu) => {
                        if (
                          dataAu.authSetting["scope.writePhotosAlbum"] == true
                        ) {
                          saveImage(tempFilePath);
                        } else {
                          toast("授权失败");
                          onClose && onClose(); //重置 TaroCanvasDrawer 状态，方便下一次调用
                        }
                      },
                    });
                  } else if (res.cancel) {
                    toast("授权失败");
                    onClose && onClose(); //重置 TaroCanvasDrawer 状态，方便下一次调用
                  }
                },
              });
            },
          });
        } else {
          saveImage(tempFilePath);
        }
      },
      fail: (res) => {
        onClose && onClose(); //重置 TaroCanvasDrawer 状态，方便下一次调用
        toast("授权接口调用失败，请检查网络");
      },
    });
  };
  const previewImage = (path) => {
    if (wx.showShareImageMenu) {
      wx.showShareImageMenu({
        path: path,
        success: (res) => {
          toast("发送成功");
        },
        fail: (res) => {
          toast("发送失败");
        },
      });
    } else {
      Taro.previewImage({
        urls: [path],
      });
    }
    onClose && onClose(); //重置 TaroCanvasDrawer 状态，方便下一次调用
  };
  const saveImage = async (path) => {
    Taro.saveImageToPhotosAlbum({
      filePath: path,
      success: (res) => {
        Taro.showToast({
          title: "保存图片成功",
          icon: "success",
          duration: 2000,
        });
        onClose && onClose(); //重置 TaroCanvasDrawer 状态，方便下一次调用
        onSave && onSave();
      },
      fail: (res) => {
        onClose && onClose(); //重置 TaroCanvasDrawer 状态，方便下一次调用
        onSave && onSave();
      },
    });
  };

  return (
    <>
      {start && ( // 由于部分限制，目前组件通过状态的方式来动态加载
        <TaroCanvasDrawer
          config={data} // 绘制配置
          onCreateSuccess={onCreateSuccess} // 绘制成功回调
          onCreateFail={onCreateFail} // 绘制失败回调
        />
      )}
    </>
  );
};

export default shareImg;
