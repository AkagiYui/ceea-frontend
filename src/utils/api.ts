import request from "@/utils/request";
import sha1 from "sha1";

function getToken(userinfo: { username: string; password: string }) {
  userinfo.password = sha1(userinfo.password + "kenko");
  return request.request<ServerData>({
    method: "post",
    url: "/user/login",
    data: userinfo,
  });
}

function getUserInfo() {
  return request.request<ServerData>({
    method: "get",
    url: "/user/info",
  });
}

function getOverviewInfo() {
  return request.request<ServerData>({
    method: "get",
    url: "/survey/overview",
  });
}

function getSurveyList(pageNum: number, pageSize: number) {
  return request.request<ServerData>({
    method: "get",
    url: `/survey/page/${pageNum}/${pageSize}`,
  });
}

function createSurvey() {
  return request.request<ServerData>({
    method: "post",
    url: `/survey/create`,
  });
}

function deleteSurvey(id: string) {
  return request.request<ServerData>({
    method: "post",
    url: `/survey/delete/${id}`,
  });
}

function setSurveyActive(id: string, active: boolean) {
  return request.request<ServerData>({
    method: "post",
    url: `/survey/switch/${id}/${active}`,
  });
}

function getSurveyDetail(id: string) {
  return request.request<ServerData>({
    method: "get",
    url: `/survey/detail/${id}`,
  });
}

export {
  getToken,
  getUserInfo,
  getOverviewInfo,
  getSurveyList,
  createSurvey,
  deleteSurvey,
  setSurveyActive,
  getSurveyDetail,
};
