import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SignInRequest, SignInSignUpResponse } from "../types/auth";
import { signInApi } from "../api/auth";
import { QUERY_KEYS } from "../lib/queryKeys";

export const useSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation<SignInSignUpResponse, Error, SignInRequest>({
    mutationFn: signInApi,
    onSuccess: (data) => {
      // Save user globally in reasct-query cache
      queryClient.setQueryData([QUERY_KEYS.USER], data.user);

      // Persist token in localStorage
      localStorage.setItem("accessToken", data.tokens.accessToken);
    },
    onError: (error) => {
      console.error("Error during sign in:", error);
    },
  });
};
