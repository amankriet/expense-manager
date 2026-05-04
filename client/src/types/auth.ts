export interface AuthUser {
  id: string;
  email: string;
  mobile: string;
  dob: string;
  role: string;
  name: string;
}

export interface SignInSignUpResponse {
  success: boolean;
  message: string;
  user: AuthUser;
  tokens: {
    accessToken: string;
  };
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  dob: string;
  password: string;
  role?: string;
}
