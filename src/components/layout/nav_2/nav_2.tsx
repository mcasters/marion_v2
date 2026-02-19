"use client";

import Link from "next/link";

import { MENU_2 } from "@/constants/specific/routes.ts";
import s from "@/components/layout/nav_2/nav_2.module.css";
import { useTheme } from "@/app/context/themeProvider.tsx";
import { useMetas } from "@/app/context/metaProvider.tsx";
import { META } from "@/constants/admin.ts";
import React from "react";
import LogoIconT from "@/components/icons/logoIconT.tsx";
import LogoIconM from "@/components/icons/logoIconM.tsx";

interface Props {
  fixed: boolean;
  themePage: "work" | "home" | "other";
}

export default function Nav_2({ fixed, themePage }: Props) {
  const theme = useTheme();
  const metas = useMetas();
  const owner = metas.get(META.SITE_TITLE);

  return (
    <nav
      className={fixed ? `${s.fixed} ${s.nav} fixed nav2` : `${s.nav} nav2`}
      style={{
        backgroundColor: fixed
          ? themePage === "home"
            ? theme.home.menu2.background + "aa"
            : theme[themePage].menu2.background
          : undefined,
      }}
    >
      <ul className={s.ul}>
        {MENU_2.map((menuItem) => {
          if (menuItem.TAG === "Home")
            return (
              <li key={menuItem.TAG}>
                <Link href={menuItem.ROUTE} key={menuItem.TAG}>
                  {owner?.startsWith("T") && (
                    <LogoIconT width={30} height={30} />
                  )}
                  {owner?.startsWith("M") && (
                    <LogoIconM width={35} height={35} />
                  )}
                </Link>
              </li>
            );
          return (
            <li key={menuItem.TAG}>
              <Link href={menuItem.ROUTE} key={menuItem.TAG}>
                {menuItem.TAG}
              </Link>
            </li>
          );
        })}
      </ul>
      <style jsx global>{`
        .nav2 a {
          color: ${theme[themePage].menu2.link};
        }
        .nav2 a:hover {
          color: ${theme[themePage].menu2.linkHover};
        }
        .homeIcon {
          fill: ${theme[themePage].menu1.link};
        }
        .homeIcon:hover {
          fill: ${theme[themePage].menu1.linkHover};
        }
      `}</style>
    </nav>
  );
}
