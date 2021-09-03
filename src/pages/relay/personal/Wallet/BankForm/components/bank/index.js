import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import Drawer from "@/relay/components/layerlayout";
import { Input } from "@/relay/components/FormCondition";
import { fetchBankList } from "@/server/relay";
import classNames from "classnames";
export default (props) => {
  const { show = false, onClose, onSubmit } = props;
  const [httpData, setHttpData] = useState({
    page: 1,
    limit: 10,
    branchName: "",
  });
  const { branchName, page } = httpData;
  const [bankList, setBankList] = useState([]);
  useEffect(() => {
    if (bankList.length === 0 && show) {
      getBankList();
    }
  }, [show]);
  useEffect(() => {
    getBankList();
  }, [httpData]);
  const getBankList = () => {
    fetchBankList(httpData).then((val) => {
      const { bankBranchList = [] } = val;
      setBankList([...bankList, ...bankBranchList]);
    });
  };
  return (
    <Drawer
      title={"请选择银行支行"}
      show={show}
      height={650}
      overflow={true}
      onClose={onClose}
    >
      <Input
        className={"bank_search"}
        placeholder={"输入银行-城市-支行"}
        type={"text"}
        onBlur={(e) => {
          if (e.detail.value === branchName) {
            return;
          } else {
            setBankList([]);
            Taro.nextTick(() => {
              setHttpData({
                page: 1,
                limit: 10,
                branchName: e.detail.value,
              });
            });
          }
        }}
      ></Input>
      <ScrollView
        scrollY
        onScrollToLower={(e) => {
          setHttpData({
            ...httpData,
            page: page + 1,
          });
        }}
        className="bank_select_box"
      >
        <View className="bank_select_margin">
          {bankList.map((item) => {
            const { bankBranchName } = item;
            return (
              <View
                onClick={() => {
                  onSubmit(item);
                  onClose();
                }}
              >
                <View className="bank_select">{bankBranchName}</View>
                <View className="bank_select_liner"></View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </Drawer>
  );
};
