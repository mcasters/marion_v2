"use client";

import { MENU_1_ITEMS } from "@/constants/specific/routes.ts";
import s from "@/components/layout/nav_1/nav_1.module.css";
import { useTheme } from "@/app/context/themeProvider.tsx";

import { getDarkerColor } from "@/lib/utils/themeUtils.ts";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import { useMetas } from "@/app/context/metaProvider.tsx";
import { getHomeLayout } from "@/lib/utils/commonUtils.ts";
import { HomeLayout } from "@/lib/type.ts";

type Props = {
  fixed: boolean;
  themePage: "work" | "home" | "other";
};

export default function Nav_1({ fixed, themePage }: Props) {
  const metas = useMetas();
  const isPlainHomeLayout = getHomeLayout(metas) === HomeLayout.PLAIN;
  const theme = useTheme();
  const path = `/${usePathname().split("/")[1]}`;

  return (
    <nav
      className={fixed ? `${s.fixed} ${s.nav} nav1` : `${s.nav} nav1`}
      style={{
        backgroundColor: fixed ? theme[themePage].menu1.background : undefined,
        borderBottomColor: fixed
          ? getDarkerColor(theme[themePage].menu1.background, -40)
          : undefined,
      }}
    >
      <div className={s.parent}>
        <ul
          className={s.ul}
          style={{
            borderBottomColor: fixed
              ? undefined
              : getDarkerColor(theme.home.menu1.background, -20),
          }}
        >
          {MENU_1_ITEMS.map((item) => {
            return (
              <li key={item.TAG}>
                <Link
                  href={item.ROUTE}
                  className={item.ROUTE === path ? "active" : undefined}
                >
                  {item.TAG}
                </Link>
              </li>
            );
          })}
        </ul>
        {themePage === "home" && !isPlainHomeLayout && (
          <div className={s.shadow} />
        )}
      </div>
      <style jsx global>{`
        .nav1 a {
          color: ${theme[themePage].menu1.link};
        }
        .nav1 a:hover {
          color: ${theme[themePage].menu1.linkHover};
        }
        .nav1 a.active {
          border-bottom: solid 2px ${theme[themePage].menu1.linkHover};
        }
      `}</style>
    </nav>
  );
}
