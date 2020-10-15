import React, { Component } from 'react'
import { Provider } from 'mobx-react'
import authStore from "./store/auth";
import beanStore from "./store/beanMark";
import shareStore from "./store/shareImage";
import 'taro-ui/dist/style/index.scss'
import './app.scss'

const store = {
  authStore,
  beanStore,
  shareStore,
}

class App extends Component {
  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}
  fetchCheckUpdate() {
    // 判断目前微信版本是否支持自动更新
    if (Taro.canIUse("getUpdateManager")) {
      const updateManager = Taro.getUpdateManager();
      updateManager.onCheckForUpdate((res) => {
        //检测是否有新版本
        if (res.hasUpdate) {
          updateManager.onUpdateReady(() => {
            Taro.showModal({
              title: "更新提示",
              confirmText: "确定",
              showCancel: false,
              content: "新版本已经准备好，需要重新启动",
              success: function (res) {
                if (res.confirm) {
                  // 更新
                  updateManager.applyUpdate();
                }
              },
            });
          });
        }
      });
    } else {
      Taro.showModal({
        title: "提示",
        content:
          "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
      });
    }
  }

  // this.props.children 就是要渲染的页面
  render () {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App
