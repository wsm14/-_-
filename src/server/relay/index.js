import { httpGet, httpPost } from "@/api/newRequest";

export const fetchLiftingCabinetCreate = (data, fn) => {
  return httpPost(
    {
      url: "/user/community/lifting/createCommunityLiftingCabinet",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 团长自提点 - 创建

export const fetchLiftingCabinetEdit = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/community/lifting/updateCommunityLiftingCabinet",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 团长自提点 - 编辑

export const fetchLiftingCabinetDetail = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/community/lifting/communityLiftingCabinetDetail",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 团长自提点 - 详情

export const fetchLiftingCabinetList = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/community/lifting/listCommunityLiftingCabinet",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 团长自提点 - 列表

export const fetchGroupCreate = (data, fn) => {
  return httpPost(
    {
      url: "/user/community/organization/createCommunityOrganization",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 团购 - 创建

export const fetchCommunityUser = (data, fn) => {
  return httpGet(
    {
      url: "/user/community/organization/user/listCommunityOrganization",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//团员-社团首页

export const fetchOrganizationUserDetail = (data, fn) => {
  return httpGet(
    {
      url: "/user/community/organization/user/communityOrganizationUserDetail",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//团员-商家详情

export const fetchOrganizationRecord = (data, fn) => {
  return httpGet(
    {
      url: "/user/community/organization/user/listCommunityOrganizationRecord",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//团员-团购商品详情-团购商品购买记录列表

export const fakeCreateUserAddress = (data, fn) => {
  return httpPost(
    {
      url: "/user/user/address/createUserAddress",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//团员-新增地址

export const fetchAddressList = (data, fn) => {
  return httpGet(
    {
      url: "/user/user/address/listUserAddress",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//团员-获取地址列表

export const fakeRemoveAddress = (data, fn) => {
  return httpPost(
    {
      url: "/user/user/address/deleteUserAddress",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//团员-删除地址

export const fakeUpdateAddress = (data, fn) => {
  return httpPost(
    {
      url: "/user/user/address/updateUserAddress",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//团员-修改地址

export const fetchGoodsOrderPrice = (data, fn) => {
  return httpGet(
    {
      url: "/user/community/organization/user/getCommunityOrganizationGoodsOrderPrice",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//团员-团购商品下单确认页
