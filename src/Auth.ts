// @ts-ignore
import { isJwtExpired } from "jwt-check-expiration";

export const Auth = {
  getToken: () => {
    return localStorage.getItem("c200wealth@auth_token");
  },
  setToken: (token: string) => {
    if (!token) {
      localStorage.removeItem("c200wealth@auth_token");
    } else {
      localStorage.setItem("c200wealth@auth_token", token);
    }
  },
  isValidSession: () => {
    let token = localStorage.getItem("c200wealth@auth_token");
    if (token && !isJwtExpired(token)) {
      return true;
    } else {
      localStorage.removeItem("c200wealth@auth_token");
      return false;
    }
  },
};
