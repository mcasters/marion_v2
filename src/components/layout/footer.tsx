"use client";

import s from "@/components/layout/layout.module.css";
import { ROUTES } from "@/constants/specific/routes";
import { useSession } from "@/app/context/sessionProvider";
import Link from "next/link";
import { useTheme } from "@/app/context/themeProvider";
import { useMetas } from "@/app/context/metaProvider";
import { META } from "@/constants/admin";
import React from "react";

type Props = {
  themePage: "work" | "home" | "other";
};

export default function Footer({ themePage }: Props) {
  const session = useSession();
  const metas = useMetas();
  const theme = useTheme();

  return (
    <footer
      className={s.footer}
      style={{
        color: theme[themePage].footer.text,
        backgroundColor: theme[themePage].footer.background,
      }}
    >
      <p>{metas.get(META.FOOTER)}</p>
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
