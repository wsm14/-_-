import { httpGet, httpPost } from "@/api/newRequest";

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
