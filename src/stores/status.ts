import { defineStore } from "pinia";

export const useStatusStore = defineStore({
  persist: true,
  id: "status",
  state: () => ({
    logged: false,
    leftSiderCollapsed: false,
    userInfo: {
      name: "",
    },
    token: "",
    pageSize: 10,
    darkMode: false,
  }),
  getters: {},
  actions: {
    setLoggingStatus(newStatus: boolean, token?: string) {
      this.logged = newStatus;
      this.token = token ?? "";
      if (newStatus === false) {
        this.userInfo = {
          name: "",
        };
      }
    },
    setLeftSiderCollapsed(newStatus: boolean) {
      this.leftSiderCollapsed = newStatus;
    },
    setUserInfo(newInfo: UserInfo) {
      this.userInfo = newInfo;
    },
  },
});
