"use client";

import Link from "next/link";

import s from "./authentication.module.css";
import { ROUTES } from "@/constants/specific/routes";
import React from "react";
import { logoutAction } from "@/app/admin/authAction.ts";

type Props = {
  email: string;
};

export default function AuthStatus({ email }: Props) {
  const [, formAction] = React.useActionState(logoutAction, null);

  return (
    <div className={s.authStatusWrapper}>
      <div className={s.container}>
        <p>
          <small>Signed in as :</small>
          <br />
          <strong>{email}</strong>
        </p>
        <br />
        <Link href={ROUTES.ADMIN}>Administration du site</Link>
        <br />
        <form className={s.logoutForm}>
          <button formAction={formAction} className="buttonLink">
            Déconnexion
          </button>
        </form>
        <br />
        <Link href={ROUTES.HOME}>Home</Link>
      </div>
    </div>
  );
}
