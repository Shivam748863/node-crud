import { commomRequest } from "./ApiCall";
import { BASE_URL } from "./helper";

export const registerFunc = async (data, header) => {
  return await commomRequest("POST", `${BASE_URL}/user/register`, data, header);
};

export const userGetFun = async (search, gender, status, sort, page) => {
  return await commomRequest(
    "GET",
    `${BASE_URL}/user/details?search=${search}&gender=${gender}&status=${status}&sort=${sort}&page=${page}`,
    ""
  );
};

export const singleUserDataFunc = async (id) => {
  return await commomRequest("GET", `${BASE_URL}/user/${id}`, "");
};

export const editFunc = async (id, data, header) => {
  return await commomRequest(
    "PUT",
    `${BASE_URL}/user/edit/${id}`,
    data,
    header
  );
};

export const deleteFunc = async (id) => {
  return await commomRequest("DELETE", `${BASE_URL}/user/delete/${id}`, {});
};

export const statusChangeFunc = async (id, data) => {
  return await commomRequest("PUT", `${BASE_URL}/user/status/${id}`, {
    data,
  });
};

export const exportUsersCsvReportFunc = async () => {
  return await commomRequest("GET", `${BASE_URL}/userexport`, "");
};
