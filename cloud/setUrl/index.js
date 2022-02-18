// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { path, query } = event;
  switch (event.action) {
    case "setWxUrl": {
      return setWxUrl(path, query);
    }
  }

  return "action not found";
};

async function setWxUrl(path, query) {
  return cloud.openapi.urllink.generate({
    path: path,
    query: query,
    isExpire: false,
    expireType: 1,
    expireInterval: 28,
  });
}
