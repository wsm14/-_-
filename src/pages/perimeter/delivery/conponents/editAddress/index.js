import React, { useMemo, useState } from "react";
import { View, Text, Image, Button } from "@tarojs/components";
import {
  Form,
  Input,
  Text as TextBlock,
  Textarea,
} from "./components/FormCondition";
import Taro from "@tarojs/taro";
import Drawer from "./components/layerlayout";
import CitySelect from "./components/FormCondition/MreCity/CitySelect";
import { computedSize, getLat, getLnt, toast, mapSelect } from "@/utils/utils";
import { resiApiKey } from "@/common/constant";
import FooterFixed from "./components/FooterFixed";
import { getAuthStatus } from "@/common/authority";
import { fetchGetAdderssInfo } from "@/server/common";
import { getRestapiCode, getRestapiAddress } from "@/server/other";
import evens from "@/common/evens";
import cityJson from "@/common/cityJson";
import { useEffect } from "react";
import up from "./up.png";
import down from "./down.png";

const FormItem = Form.Item;
export default (props) => {
  const getCityName = (code) => {
    const cityIndex = cityJson.findIndex((item) => item.id === code);
    return cityIndex !== -1 ? cityJson[cityIndex]?.name : "";
  };

  // 根据城市code获取城市名称
  const checkCityName = (code) => {
    if (!code) return null;
    const codeStr = `${code}`;
    if (codeStr.length === 2) {
      return getCityName(codeStr) ? getCityName(codeStr) : [];
    } else if (codeStr.length === 4) {
      return getCityName(codeStr)
        ? [getCityName(codeStr.slice(0, 2)), getCityName(codeStr)]
        : [];
    } else if (codeStr.length === 6) {
      return getCityName(codeStr)
        ? [
            getCityName(codeStr.slice(0, 2)),
            getCityName(codeStr.slice(0, 4)),
            getCityName(codeStr),
          ]
        : [];
    }
  };
  const {
    show = false,
    onClose,
    type = "edit",
    onSubmit,
    defaultData,
    fakeUpDate,
    fakeRemove,
  } = props;
  const [cityVisible, setCityVisible] = useState(false);
  const [data, setData] = useState({});
  const [hiddenAddress, setHiddenAddress] = useState(false);
  const [cobyAddress, setCobyAddress] = useState("");

  useEffect(() => {
    setData({ ...defaultData });
  }, [defaultData]);

  const {
    address,
    addressName = "",
    mobile = "",
    districtCode = "",
    provinceCode,
    cityCode = "",
    cityName,
    districtName,
    provinceName,
  } = data;

  const setAddress = (e) => {
    const { cobyAddress, ...ohter } = e.detail.value;
    const { addressName = "", mobile = "", address = "" } = ohter;
    if (
      (addressName.length === 0 &&
        mobile.length === 0 &&
        (address.length === 0 || !cityCode)) ||
      !districtCode
    ) {
      return toast("请把信息填写完整后提交");
    } else {
      if (type === "edit") {
        onSubmit({
          ...data,
          ...ohter,
        });
      } else {
        fakeUpDate({
          ...data,
          ...ohter,
        });
      }
    }
  };

  // 智能识别地址信息
  const fetchGetAddress = (cobyAddress) => {
    if (cobyAddress)
      fetchGetAdderssInfo({ address: cobyAddress }, (res = {}) => {
        const { addressInfo = {} } = res;
        const {
          username: addressName,
          phone: mobile,
          districtName,
          provinceName,
          cityName,
          address,
          ...ohter
        } = addressInfo;
        setData({ ...ohter, mobile, addressName });
        // 根据地址获取经纬度
        getRestapiCode(
          {
            address: provinceName + cityName + districtName + address,
            key: resiApiKey,
          },
          (val) => {
            const { geocodes = [] } = val;
            if (geocodes.length > 0) {
              const { location = "" } = geocodes[0];
              setData((old) => ({
                ...old,
                address,
                lat: location.split(",")[1] || getLat(),
                lnt: location.split(",")[0] || getLnt(),
              }));
            } else {
              toast("区县码无法获取，请手动填写信息");
            }
          }
        );
      });
  };

  const checkLntLat = (value) => {
    const { lnt, lat } = value;
    // 逆地理位置解析 获取用户当前所在地省市区
    getRestapiAddress(
      {
        location: `${lnt},${lat}`,
        key: resiApiKey,
      },
      (val) => {
        console.log(val, val.infocode, val.regeocode);
        const { addressComponent } = val.regeocode;
        const { adcode } = addressComponent;
        setData({
          ...data,
          ...value,
          districtCode: adcode,
          provinceCode: adcode.slice(0, 2),
          cityCode: adcode.slice(0, 4),
        });
      }
    );
  };

  const extra = () => {
    return (
      <View
        className="extra_address"
        onClick={(e) => {
          e.stopPropagation();
          getAuthStatus({
            key: "location",
            success: (res) => {
              mapSelect((val) => {
                checkLntLat(val);
              });
            },
            fail: (res) => {
              evens.$emit("setLocation");
            },
          });
        }}
      >
        <View className="extra_address_icon"></View>
        <View className="extra_address_text">定位</View>
      </View>
    );
  };

  const bottomBtn = {
    edit: (
      <FooterFixed>
        <Button formType="submit" className="delivery_submit public_center">
          保存并使用
        </Button>
      </FooterFixed>
    ),
    update: (
      <FooterFixed>
        <View className="public_auto">
          <View
            onClick={() => fakeRemove()}
            className="delivery_submit_twoStyle1 delivery_submit_twoBox public_center"
          >
            删除
          </View>
          <Button
            formType="submit"
            className="delivery_submit_twoStyle2  delivery_submit_twoBox public_center"
          >
            保存并使用
          </Button>
        </View>
      </FooterFixed>
    ),
  }[type];

  const hiddenAiAddress = () => (
    <View className="hiddenAiAddress_box">
      <Image
        src={hiddenAddress ? down : up}
        className="hiddenAiAddress_icon"
        onClick={() => setHiddenAddress(!hiddenAddress)}
      ></Image>
    </View>
  );

  return (
    <>
      <Drawer
        title={type === "edit" ? "添加收货地址" : "编辑地址"}
        show={show}
        height={586}
        overflow={false}
        onClose={() => {
          setHiddenAddress(false);
          setCobyAddress("");
          onClose();
        }}
      >
        <Form onSubmit={(e) => setAddress(e)} footer={false}>
          <FormItem linerFlag={false} label={"收货人"}>
            <Input
              name={"addressName"}
              placeholder={"请输入收货人姓名"}
              style={{ textAlign: "left" }}
              maxLength={20}
              value={addressName}
              suffix={
                <Button
                  className="link_wx public_center"
                  onClick={() =>
                    Taro.chooseAddress({
                      success(res) {
                        const {
                          cityName,
                          countyName,
                          detailInfo,
                          provinceName,
                          telNumber,
                          userName,
                        } = res;
                        console.log(res);
                        getRestapiCode(
                          {
                            address:
                              provinceName + cityName + countyName + detailInfo,
                            key: resiApiKey,
                          },
                          (val) => {
                            const { geocodes = [] } = val;
                            if (geocodes.length > 0) {
                              console.log(geocodes);
                              const {
                                adcode = "",
                                district,
                                location = "",
                              } = geocodes[0];
                              // 钱塘区强行转换编码为正确位置
                              const districtCode =
                                district === "钱塘区" ? "330114" : adcode;
                              setData({
                                ...data,
                                mobile: telNumber,
                                address: detailInfo,
                                districtCode: districtCode,
                                provinceCode: districtCode.slice(0, 2),
                                cityCode: districtCode.slice(0, 4),
                                addressName: userName,
                                lat: location.split(",")[1] || getLat(),
                                lnt: location.split(",")[0] || getLnt(),
                              });
                            } else {
                              toast("区县码无法获取，请手动填写信息");
                            }
                          }
                        );
                      },
                    })
                  }
                >
                  从微信读取
                </Button>
              }
            ></Input>
          </FormItem>
          <FormItem linerFlag={false} label={"联系电话"}>
            <Input
              name={"mobile"}
              placeholder={"请输入联系电话"}
              maxLength={19}
              style={{ textAlign: "left" }}
              type={"number"}
              value={mobile}
            ></Input>
          </FormItem>
          <FormItem linerFlag={false} label="位置">
            <TextBlock
              value={(checkCityName(districtCode) || []).join("")}
              placeholder={"请选择地址"}
              disabled={false}
              style={{ textAlign: "left" }}
              onClick={(e) => {
                setCityVisible(true);
              }}
            ></TextBlock>
          </FormItem>
          <FormItem
            linerFlag={false}
            left={true}
            after={extra}
            label={"详细地址"}
          >
            <Input
              name={"address"}
              placeholder={"请输入详细地址"}
              style={{ textAlign: "left", maxWidth: 227 }}
              value={address}
            ></Input>
          </FormItem>
          <FormItem
            label={"智能填写"}
            linerFlag={false}
            after={hiddenAiAddress}
            vertical
          >
            {hiddenAddress ? null : (
              <Textarea
                name={"cobyAddress"}
                value={cobyAddress}
                className="hiddenAiAddress_Textarea"
                onBlur={fetchGetAddress}
                onConfirm={fetchGetAddress}
                TextExirt={() => (
                  <View
                    className="hiddenAiAddress_coby"
                    onClick={() => {
                      Taro.getClipboardData({
                        success: function (res) {
                          setCobyAddress(res?.data || "");
                          fetchGetAddress(res?.data || "");
                        },
                      });
                    }}
                  >
                    粘贴
                  </View>
                )}
                placeholder="请粘贴收货信息，如“张三 18888888888 广东省广州市天河区西西大街123号”，将自动为您拆分"
              ></Textarea>
            )}
          </FormItem>
          <View className="extra_liners"></View>
          {bottomBtn}
        </Form>
      </Drawer>
      <CitySelect
        show={cityVisible}
        onClose={() => {
          setCityVisible(false);
        }}
        onSubmit={(val) => {
          setData({ ...data, ...val.data });
        }}
      ></CitySelect>
    </>
  );
};
