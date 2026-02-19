"use client";

import { useActionState } from "react";
import s from "./authentication.module.css";
import { loginAction } from "@/app/actions/auth";

export default function LoginForm() {
  const [state, action] = useActionState(loginAction, undefined);

  return (
    <form
      action={action}
      className={s.loginForm}
      style={{ width: "50%", margin: "auto" }}
    >
      <input
        type="email"
        name="email"
        placeholder="Email"
        autoComplete="true"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        autoComplete="true"
        required
      />
      <p className={s.errorMessage}>{state?.error}</p>
      <button type="submit" className="adminButton">
        Login
      </button>
    </form>
  );
}
