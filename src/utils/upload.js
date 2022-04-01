import Taro from "@tarojs/taro";
import { httpGet, uploadFile } from "@/utils/request";
import crypto from "crypto-js";
import { Base64 } from "js-base64";
import { toast } from "@/utils/utils";

function uuid() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}

function computeSignature(accessKeySecret, canonicalString) {
  return crypto.enc.Base64.stringify(
    crypto.HmacSHA1(canonicalString, accessKeySecret)
  );
}

async function getFormDataParams() {
  const date = new Date();
  date.setHours(date.getHours() + 1);
  const policyText = {
    expiration: date.toISOString(), // 设置policy过期时间。
    conditions: [
      // 限制上传大小。
      ["content-length-range", 0, 1024 * 1024 * 1024],
    ],
  };
  const credentials = await httpGet({
    url: "/common/oss/getOssPolicy",
    data: {
      uploadType: "resource",
    },
  });
  const policy = Base64.encode(JSON.stringify(policyText)); // policy必须为base64的string。
  const { accessKeyId, accessKeySecret, securityToken, folder } = credentials;
  const signature = computeSignature(accessKeySecret, policy);
  const formData = {
    ...credentials,
    OSSAccessKeyId: accessKeyId,
    signature,
    policy,
    "x-oss-security-token": securityToken,
  };
  return formData;
}
// 排序
function compare(property) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  };
}
const updateList = (list, obj) => {
  let length = 0;
  let newObj = {
    ...obj,
  };
  Object.keys(newObj).forEach((item) => {
    if (!newObj[item]) {
      newObj[item] = [];
      return;
    }
    (newObj[item] || []).forEach((items, index) => {
      newObj[item][index] = list[length];
      length += 1;
    });
  });
  return newObj;
};
export const upload = async (fileList = [], obj) => {
  fileList = JSON.parse(JSON.stringify(fileList));
  obj = JSON.parse(JSON.stringify(obj));
  const imgList = [];
  if (fileList && Array.isArray(fileList)) {
    let fromData = await getFormDataParams();
    Taro.showLoading({
      title: "文件上传中...",
      mask: true,
    });
    fileList.forEach((item, index) => {
      if (item.includes("https://")) {
        imgList.push({ url: item, index });
      } else if (item) {
        const { host, folder } = fromData;
        console.log("上传文件数据:", host, folder, item);
        imgList[index] = new Promise((resolve) => {
          let imgKey = folder + "/" + uuid() + ".jpg";
          uploadFile({
            url: host,
            filePath: item,
            name: "file",
            header: {
              "content-type": "multpart/form-data",
            },
            formData: {
              ...fromData,
              key: imgKey,
            },
          })
            .then((res) => {
              resolve({ url: host + imgKey, index });
            })
            .catch((err) => {
              console.log(err);
              toast("上传错误");
            });
        });
      }
    });
    return new Promise((resolve) => {
      Promise.all([...imgList]).then((res) => {
        Taro.hideLoading();
        if (fileList.length == res.length) {
          let urlList = res.sort(compare("index")).map((item) => item.url);
          resolve(updateList(urlList, obj));
        } else {
          toast("上传图片失败");
          return {};
        }
      });
    });
  } else {
    return console.error("数据类型必须为数组");
  }
};
