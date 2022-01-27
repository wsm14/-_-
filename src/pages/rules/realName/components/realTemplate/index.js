/*
 到点打卡,已打卡的异常状态
*/
import React, { useState, useEffect } from "react";
import { View, Input } from "@tarojs/components";
import { fakeSubmitRealName } from "@/server/perimeter";
import { goBack, toast } from "@/utils/utils";
export default (props) => {
  const { data } = props;
  const [form, changeForm] = useState({});
  const { realNameStatus } = form;
  const setForm = (key, val) => {
    const value = val.detail.value;
    changeForm({
      ...form,
      [key]: value,
    });
  };
  useEffect(() => {
    if (Object.keys(data).length) {
      changeForm({
        ...data,
        realNameStatus: "2",
      });
    }
  }, [data]);
  const submit = () => {
    const { cardNumber, realName } = form;
    if (!cardNumber || !realName) {
      toast("请提交完成信息");
      return;
    } else {
      fakeSubmitRealName(form).then((val) => {
        goBack(() => "实名认证成功");
      });
    }
  };
  const template = () => {
    return (
      <View>
        <View className="realTemplate_top_box">
          <View className="realTemplate_title">请认证您的身份</View>
          <View className="realTemplate_content">
            为了您的账户安全，请尽快实名
          </View>
        </View>
        <View className="realTemplate_num_box">
          <View className="realTemplate_inputBox">
            <View className="realTemplate_content_put font32 color1">
              真实姓名
            </View>
            <View className="realTemplate_content_put font28">
              <Input
                placeholderClass="realTemplate_placeholderClass"
                placeholder="请输入您的真实姓名"
                className="text_info"
                value={form.realName}
                onBlur={(val) => setForm("realName", val)}
                onConfirm={(val) => setForm("realName", val)}
                disabled={realNameStatus === "2"}
              />
            </View>
          </View>
          <View className="realTemplate_inputBox">
            <View className="realTemplate_content_put font32 color1">
              身份证号
            </View>
            <View className="realTemplate_content_put font28">
              <Input
                placeholderClass="realTemplate_placeholderClass"
                placeholder="请输入您的身份证号"
                className="text_info"
                value={form.cardNumber}
                disabled={realNameStatus === "2"}
                onBlur={(val) => setForm("cardNumber", val)}
                onConfirm={(val) => setForm("cardNumber", val)}
              />
            </View>
          </View>
        </View>
        {realNameStatus !== "2" && (
          <View onClick={submit} className="realTemplate_btn">
            下一步
          </View>
        )}
      </View>
    );
  };

  return <View className="realTemplate_box">{template()}</View>;
};
