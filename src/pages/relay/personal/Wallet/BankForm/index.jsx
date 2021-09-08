import React, { useState, useEffect } from "react";
import { useDidShow } from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";
import {
  Form,
  Input,
  Text as TextBlock,
  Upload,
} from "@/relay/components/FormCondition";
import FooterFixed from "@/relay/components/FooterFixed";
import CitySelect from "@/relay/components/FormCondition/MreCity/CitySelect";
import { upload } from "@/api/upload";
import Bank from "./components/bank";
import TimeRange from "./components/time";
import {
  fetchbankCard,
  fetchCardFront,
  fetchCardBack,
  fetchPersonAccount,
} from "@/server/relay";
import { filterFrom } from "@/relay/common/utils";
import { goBack, toast } from "@/common/utils";
import Router from "@/common/router";
import "./index.scss";
/**
 * 添加银行卡
 */
const bottomBtn = {
  edit: (
    <FooterFixed>
      <Button formType="submit" className="bank_submit public_center">
        提交
      </Button>
    </FooterFixed>
  ),
}["edit"];

const FormItem = Form.Item;
const FormItemGroup = Form.Group;

export default () => {
  const [formData, setFormData] = useState({});
  const [bankVisible, setBankVisible] = useState(false);
  const [cityVisible, setCityVisible] = useState(false);
  const saveData = (val) => {
    setFormData({ ...formData, ...val });
  };

  useDidShow(() => {});
  const saveForm = (val) => {
    let data = val.detail.value;
    const { provinceCode, cityCode } = formData;
    if (
      filterFrom(
        {
          cardId: "请输入银行卡号",
          bankBranchName: "请选择开户行",
          provCode: "请选择开户城市",
          telNo: "请输入银行预留号码",
          certFrontPhoto: "请上传身份证正面照",
          certReversePhoto: "请上传身份证反面照",
          cardName: "请输入姓名",
          certId: "请输入身份证号码",
          certExpireDate: "请选择身份证有效期",
        },
        {
          ...formData,
          ...data,
          provCode: provinceCode,
          areaCode: cityCode,
        }
      )
    ) {
      fetchPersonAccount({
        ...formData,
        ...data,
        provCode: provinceCode,
        areaCode: cityCode,
      }).then((val) => {
        goBack(() => toast("绑定成功"));
      });
    }
  };
  return (
    <View className="BankForm_info_box">
      <Form onSubmit={(e) => saveForm(e)} footer={false}>
        <View className="BankForm_box">
          <FormItemGroup>
            <FormItem label={"银行卡"} linerFlag={false} vertical>
              <Upload
                count={1}
                value={formData.images}
                onChange={(file) => {
                  if (file.length > 0) {
                    upload(file, { img: file }).then((res) => {
                      const { img = [] } = res;
                      saveData({ bankPhoto: img[0] });
                      fetchbankCard({ pic: img[0] }).then((val) => {
                        const { number } = val;
                        saveData({
                          cardId: number,
                        });
                      });
                    });
                  }
                }}
              ></Upload>
            </FormItem>
            <FormItem label={"银行卡号"} required>
              <Input
                name={"cardId"}
                placeholder={"银行卡号"}
                value={formData.cardId}
                maxLength={24}
                type={"number"}
              ></Input>
            </FormItem>
            <FormItem label="开户支行" required>
              <TextBlock
                placeholder={"请选择开户支行"}
                value={formData.bankBranchName}
                disabled={false}
                onClick={() => {
                  setBankVisible(true);
                }}
              ></TextBlock>
            </FormItem>
            <FormItem label={"开户城市"} required>
              <TextBlock
                placeholder={"请选择开户城市"}
                value={formData.provinceName + formData.cityName}
                disabled={false}
                onClick={() => {
                  setCityVisible(true);
                }}
              ></TextBlock>
            </FormItem>
            <FormItem label={"银行预留手机号"} required>
              <Input
                name={"telNo"}
                placeholder={"请输入银行预留手机号"}
                maxLength={11}
                value={formData.telNo}
                type={"number"}
              ></Input>
            </FormItem>
          </FormItemGroup>
        </View>
        <View className="BankForm_box">
          <FormItemGroup>
            <FormItem
              label={"结算人身份信息"}
              vertical
              linerFlag={false}
              required
            >
              <View className="bank_user_box">
                <Upload
                  className={"bank_userImage_box"}
                  classChangeName={"bank_userImage_cell"}
                  count={1}
                  value={formData.certFrontPhoto}
                  toast={"请上传身份证正面"}
                  onChange={(file) => {
                    if (file.length > 0) {
                      upload(file, { img: file }).then((res) => {
                        const { img = [] } = res;
                        saveData({ certFrontPhoto: img[0] });
                        fetchCardFront({ imageUrl: img[0] }).then((val) => {
                          const { name, num } = val;
                          saveData({
                            cardName: name,
                            certId: num,
                          });
                        });
                      });
                    }
                  }}
                ></Upload>
                <Upload
                  className={"bank_userImage_box"}
                  classChangeName={"bank_userImage_cell"}
                  count={1}
                  value={formData.certReversePhoto}
                  toast={"请上传身份证反面 "}
                  onChange={(file) => {
                    if (file.length > 0) {
                      upload(file, { img: file }).then((res) => {
                        const { img = [] } = res;
                        saveData({ certReversePhoto: img[0] });
                        fetchCardBack({ imageUrl: img[0] }).then((val) => {
                          let { endDate, startDate } = val;
                          if (endDate === "长期有效") {
                            endDate = "29991231";
                          }
                          saveData({
                            certExpireDate: endDate,
                          });
                        });
                      });
                    }
                  }}
                ></Upload>
              </View>
            </FormItem>
            <View className="bank_userImage_tip">
              以下字段为自动识别，请先检查再提交
            </View>
            <FormItem label={"姓名"} required>
              <Input
                name={"cardName"}
                value={formData.cardName}
                placeholder={"请输入姓名"}
                maxLength={20}
              ></Input>
            </FormItem>
            <FormItem label={"身份证号码"} required>
              <Input
                name={"certId"}
                value={formData.certId}
                placeholder={"请输入身份证号码"}
              ></Input>
            </FormItem>
            <FormItem label={"有效时间"} required>
              <TimeRange
                value={formData}
                onClick={(e) => {}}
                onChange={(val) => saveData({ certExpireDate: val })}
              ></TimeRange>
            </FormItem>
          </FormItemGroup>
        </View>
        {bottomBtn}
      </Form>
      <Bank
        show={bankVisible}
        onClose={() => {
          setBankVisible(false);
        }}
        onSubmit={(val) => {
          saveData(val);
        }}
      ></Bank>
      <CitySelect
        show={cityVisible}
        cityFlag={false}
        onClose={() => {
          setCityVisible(false);
        }}
        onSubmit={(val) => {
          console.log(val);
          saveData(val.data);
        }}
      ></CitySelect>
    </View>
  );
};
