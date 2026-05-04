import { apiClient } from "./http";
import type { SignInRequest, SignUpRequest } from "../types/auth";

export async function signInApi(data: SignInRequest) {
  const res = await apiClient.post("/auth/login", data);
  return res.data;
}

export async function signUpApi(data: SignUpRequest) {
  const res = await apiClient.post("/auth/signup", data);
  return res.data;
}

export async function logoutApi() {
  const res = await apiClient.get("/auth/logout");
  return res.data;
}
