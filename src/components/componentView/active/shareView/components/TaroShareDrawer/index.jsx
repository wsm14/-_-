import React, { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import TaroCanvasDrawer from "@/components/taro-plugin-canvas";
import { View, Button, Image } from "@tarojs/components";
import { toast, loginStatus } from "@/common/utils";
import "./index.scss";

/**
 *
 * @param {*} start TaroCanvasDrawer 组件状态
 * @param {*} data TaroCanvasDrawer 渲染数据
 * @param {*} onClose TaroCanvasDrawer 关闭回调
 * @param {*} onSave TaroCanvasDrawer 保存回调
 * @returns
 */
const shareImg = ({ start = false, data = [], onClose, onSave }) => {
  const [shareImage, setShareImage] = useState(null); // 绘制的图片url
  console.log(data, start);
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
    console.log(111);
    Taro.hideLoading();
    if (errMsg === "canvasToTempFilePath:ok") {
      setShareImage(tempFilePath);
      Taro.hideLoading();
    } else {
      onCreateFail();
      Taro.showToast({ icon: "none", title: errMsg || "出现错误" });
      console.log(errMsg);
    }
  };

  // 绘制失败回调函数 （必须实现）=> 接收绘制错误信息、重置 TaroCanvasDrawer 状态
  const onCreateFail = () => {
    console.log(222);
    Taro.hideLoading();
    // 重置 TaroCanvasDrawer 状态，方便下一次调用
    onClose && onClose(); //重置 TaroCanvasDrawer 状态，方便下一次调用
  };

  // 保存图片至本地
  const saveToAlbum = () => {
    Taro.getSetting({
      success: (res) => {
        if (!res.authSetting["scope.writePhotosAlbum"]) {
          Taro.authorize({
            scope: "scope.writePhotosAlbum",
            success: (res) => {
              saveImage();
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
                          saveImage();
                        } else {
                          toast("授权失败");
                        }
                      },
                    });
                  } else if (res.cancel) {
                    toast("授权失败");
                  }
                },
              });
            },
          });
        } else {
          saveImage();
        }
      },
      fail: (res) => {
        toast("授权接口调用失败，请检查网络");
      },
    });
  };
  const saveImage = async () => {
    const res = await Taro.saveImageToPhotosAlbum({ filePath: shareImage });
    console.log(res);
    if (res.errMsg === "saveImageToPhotosAlbum:ok") {
      Taro.showToast({
        title: "保存图片成功",
        icon: "success",
        duration: 2000,
      });
      onClose && onClose(); //重置 TaroCanvasDrawer 状态，方便下一次调用
      onSave && onSave();
    }
  };

  return (
    <>
      <View
        catchMove
        className={`share_image_show_model animated ${
          !start ? "" : "showAction"
        }`}
        onClick={onClose}
      >
        <View catchMove className="share_image_loadBox">
          <View className="share_close" onClick={onClose}>
            {" "}
          </View>
          <Image
            src={shareImage}
            mode="widthFix"
            lazy-load
            className="share_image"
          />
          <View className="share_image_save">
            <View
              onClick={() => saveToAlbum()}
              className="share_bind_image"
            ></View>
            <View
              onClick={() => onClose && onClose()}
              className="share_bind_friend"
            >
              {loginStatus() && (
                <Button
                  style={{ width: "100%", height: "100%", background: "none" }}
                  openType={"share"}
                ></Button>
              )}
            </View>
          </View>
        </View>
      </View>
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
