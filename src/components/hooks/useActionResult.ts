"use client";

import { useEffect } from "react";
import { useAlert } from "@/app/context/alertProvider.tsx";

export default function useActionResult(
  state: {
    message: string;
    isError: boolean;
  } | null,
  callbackOnSuccess?: () => void,
  triggerAlert: boolean = true,

  timeout: number = 3000,
) {
  const alert = triggerAlert ? useAlert() : undefined;
  useEffect(() => {
    if (state) {
      if (alert) alert(state.message, state.isError, timeout);
      if (callbackOnSuccess && !state.isError) callbackOnSuccess();
    }
  }, [state]);
  return {};
}
