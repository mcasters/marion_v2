"use client";

import Link from "next/link";

import s from "./authentication.module.css";
import { ROUTES } from "@/constants/specific/routes";
import LogoutForm from "@/components/auth/logoutForm";

type Props = {
  email: string;
};

export default function AuthStatus({ email }: Props) {
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
        <LogoutForm />
        <br />
        <Link href={ROUTES.HOME}>Home</Link>
      </div>
    </div>
  );
}
