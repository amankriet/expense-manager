import axios from "axios";
import type { SignInRequest, SignUpRequest } from "../types/auth";

export async function signInApi(data: SignInRequest) {
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, data);
    return res.data;
}

export async function signUpApi(data: SignUpRequest) {
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, data);
    return res.data;
}