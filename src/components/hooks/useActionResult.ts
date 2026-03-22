"use client";

import { useEffect } from "react";
import { useAlert } from "@/app/context/alertProvider.tsx";

export default function useActionResult(
  state: {
    message: string;
    isError: boolean;
  } | null,
  callbackOnSuccess?: () => void,
  timeout: number = 3000,
) {
  const alert = useAlert();
  useEffect(() => {
    if (state) {
      alert(state.message, state.isError, timeout);
      if (callbackOnSuccess && !state.isError) callbackOnSuccess();
    }
  }, [state]);
  return {};
}
