import { httpGet, httpPost } from "@/api/newRequest";

export const getKolLever = (data, fn) => {
  httpGet(
    {
      url: "/user/level/getUserLevelProgress",
      data: data,
    },
    (res) => fn(res)
  );
};
//达人等级
