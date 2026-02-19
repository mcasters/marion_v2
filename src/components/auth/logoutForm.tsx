"use client";

import React from "react";
import s from "./authentication.module.css";
import { logoutAction } from "@/app/actions/auth";

export default function LogoutForm() {
  const [, formAction] = React.useActionState(logoutAction, null);

  return (
    <form className={s.logoutForm}>
      <button formAction={formAction} className="buttonLink">
        Déconnexion
      </button>
    </form>
  );
}
