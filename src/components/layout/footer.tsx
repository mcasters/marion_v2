"use client";

import s from "@/components/layout/layout.module.css";
import { ROUTES } from "@/constants/specific/routes";
import { useSession } from "@/app/context/sessionProvider";
import Link from "next/link";
import { useThemeContext } from "@/app/context/themeProvider";
import { useMetaContext } from "@/app/context/metaProvider";
import { KEY_META } from "@/constants/admin";
import React from "react";

type Props = {
  themePage: "work" | "home" | "other";
};

export default function Footer({ themePage }: Props) {
  const session = useSession();
  const metas = useMetaContext();
  const theme = useThemeContext();

  return (
    <footer
      className={s.footer}
      style={{
        color: theme[themePage].footer.text,
        backgroundColor: theme[themePage].footer.background,
      }}
    >
      <p>{metas.get(KEY_META.FOOTER)}</p>
      {!session?.user && (
        <Link
          href={ROUTES.LOGIN}
          style={{ color: theme[themePage].footer.link }}
        >
          Admin
        </Link>
      )}
    </footer>
  );
}
