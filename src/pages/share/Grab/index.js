import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Text, WebView } from "@tarojs/components";
import { getRedEnvelopesDetail, saveUserRedEnvelopes } from "@/server/share";
import Login from "@/components/componentView/LoginComponent";
import Template from "./components/grabHandle";
import { toast, loginStatus } from "@/common/utils";
import { fetchUserShareCommission } from "@/server/index";
import "./index.scss";
class Index extends Component {
  defaultProps = {};
  constructor() {
    super(...arguments);
    this.state = {
      redEnvelopesId: getCurrentInstance().router.params.redEnvelopesId,
      redEnvelopesInfo: {},
      redEnvelopesReceiveList: [],
      authFlag: false,
      animate: false,
      configUserLevelInfo: {},
    };
  }
  fetchGradDetails() {
    const { redEnvelopesId } = this.state;
    getRedEnvelopesDetail({ redEnvelopesId }).then((val) => {
      const { redEnvelopesInfo = {}, redEnvelopesReceiveList = [] } = val;
      this.setState({
        redEnvelopesInfo,
        redEnvelopesReceiveList,
      });
    });
  }

  fetchUserShare() {
    fetchUserShareCommission({}, (res) => {
      const { configUserLevelInfo = {} } = res;
      this.setState({
        configUserLevelInfo,
      });
    });
  }

  fakeRedEnvelopes() {
    const { redEnvelopesId, redEnvelopesInfo } = this.state;
    if (!loginStatus()) {
      this.setState({
        authFlag: true,
      });
    } else {
      const { status, userRedEnvelopesReceive } = redEnvelopesInfo;
      this.setState(
        {
          animate: true,
        },
        (res) => {
          setTimeout(() => {
            if (!userRedEnvelopesReceive && status === "0") {
              saveUserRedEnvelopes({ redEnvelopesId })
                .then((val) => {
                  this.fetchGradDetails();
                })
                .catch((val) => {
                  // this.fetchGradDetails();
                });
            }
          }, 1500);
        }
      );
    }
  }
  componentDidShow() {
    this.fetchGradDetails();
    this.fetchUserShare();
  }
  render() {
    const {
      redEnvelopesInfo,
      redEnvelopesReceiveList,
      authFlag,
      animate,
      configUserLevelInfo,
    } = this.state;
    return (
      <View className="Grab_box">
        <Login
          stopVideo={() => {}}
          show={authFlag}
          close={() =>
            this.setState(
              {
                authFlag: false,
              },
              (res) => {}
            )
          }
        ></Login>
        <Template
          configUserLevelInfo={configUserLevelInfo}
          animate={animate}
          data={redEnvelopesInfo}
          list={redEnvelopesReceiveList}
          onChange={this.fakeRedEnvelopes.bind(this)}
        ></Template>
      </View>
    );
  }
}
export default Index;
