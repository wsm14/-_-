import { httpGet, httpPost } from "@/api/newRequest";

export const fakeBlindBoxHelp = (data) => {
  return httpPost({
    data: data,
    url: "/user/activity/blindBox/help/saveBlindBoxHelp",
  });
};
//盲盒助力
export const fetchBlindBoxHelp = (data) => {
  return httpGet({
    data: data,
    url: "/user/activity/blindBox/help/listBlindBoxHelp",
  });
};
//盲盒助力记录

export const fetchBlindBoxConfig = (data = {}) => {
  return httpGet({
    data: data,
    url: "/user/activity/blindBox/reward/getBlindBoxConfig",
  });
};
//盲盒页面

export const fetchBlindBoxBarrage = (data = {}) => {
  return httpGet({
    data: data,
    url: "/common/dictionary/getBlindBoxBarrage",
  });
};
//盲盒弹幕

export const fetchBlindBoxReward = (data = {}) => {
  return httpPost({
    data: data,
    url: "/user/activity/blindBox/reward/saveBlindBoxReward",
  });
};
//抽取盲盒

export const fetchBlindBoxRewardJackpot = (data = {}) => {
  return httpGet({
    data: data,
    url: "/user/activity/blindBox/reward/listBlindBoxRewardJackpot",
  });
};
//抽取盲盒
