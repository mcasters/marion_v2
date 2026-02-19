"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { ROUTES } from "@/constants/specific/routes";
import Header from "./header.tsx";
import Footer from "./footer";
import s from "@/components/layout/layout.module.css";
import { useTheme } from "@/app/context/themeProvider";
import { getHomeLayout } from "@/lib/utils/commonUtils";
import AuthStatus from "@/components/auth/authStatus";
import { useSession } from "@/app/context/sessionProvider";
import AdminNav from "@/components/layout/admin/adminNav";
import { useMetas } from "@/app/context/metaProvider";
import { HomeLayout } from "@/lib/type";
import { hexToRgb } from "@/lib/utils/themeUtils";
import { META } from "@/constants/admin.ts";
import HomeHeader from "@/components/layout/homeHeader.tsx";

interface Props {
  introduction: string;
  children: ReactNode;
}

export default function Layout({ introduction, children }: Props) {
  const theme = useTheme();
  const path = `/${usePathname().split("/")[1]}`;
  const session = useSession();
  const metas = useMetas();
  const isPlainHomeLayout = getHomeLayout(metas) === HomeLayout.PLAIN;
  const isHome = path === ROUTES.HOME;
  const isWork =
    path === ROUTES.PAINTING ||
    path === ROUTES.SCULPTURE ||
    path === ROUTES.DRAWING;
  const themePage = isHome ? "home" : isWork ? "work" : "other";
  const gradientRgbObject = hexToRgb(theme.home.menu1.background);
  const gradientRgb = `${gradientRgbObject?.r},${gradientRgbObject?.g},${gradientRgbObject?.b}`;

  return (
    <div
      className={s.wrapper}
      style={{
        backgroundColor: theme[themePage].main.background,
        color: theme[themePage].main.text,
      }}
    >
      <div
        className={s.line}
        style={{ backgroundColor: theme.general.lineColor }}
      ></div>
      {session?.user && <AuthStatus email={session.user.email} />}
      {isHome && !isPlainHomeLayout && (
        <div
          className={s.gradient}
          style={{
            background: `
          linear-gradient(
            to top,
            rgba(${gradientRgb}, 0) 0%,
            rgba(${gradientRgb}, 0.013) 8.1%,
            rgba(${gradientRgb}, 0.049) 15.5%,
            rgba(${gradientRgb}, 0.104) 22.5%,
            rgba(${gradientRgb}, 0.175) 29%,
            rgba(${gradientRgb}, 0.259) 35.3%,
            rgba(${gradientRgb}, 0.352) 41.2%,
            rgba(${gradientRgb}, 0.45) 47.1%,
            rgba(${gradientRgb}, 0.55) 52.9%,
            rgba(${gradientRgb}, 0.648) 58.8%,
            rgba(${gradientRgb}, 0.741) 64.7%,
            rgba(${gradientRgb}, 0.825) 71%,
            rgba(${gradientRgb}, 0.896) 77.5%,
            rgba(${gradientRgb}, 0.951) 84.5%,
            rgba(${gradientRgb}, 0.987) 91.9%,
            rgb(${gradientRgb}) 100%
          )`,
          }}
        ></div>
      )}
      {path === ROUTES.ADMIN ? (
        <AdminNav />
      ) : isHome ? (
        <HomeHeader
          isPlainHomeLayout={isPlainHomeLayout}
          title={metas.get(META.SITE_TITLE) || ""}
          introduction={introduction}
        />
      ) : (
        <Header themePage={themePage} />
      )}
      <main className={isHome ? undefined : s.main}>{children}</main>
      <Footer themePage={themePage} />
      <style jsx global>{`
        a,
        .buttonLink,
        .iconButton {
          color: ${theme[themePage].main.link};
        }
        .icon {
          fill: ${theme[themePage].main.link};
        }
        a:hover,
        .buttonLink:hover,
        .iconButton:hover {
          color: ${theme[themePage].main.linkHover};
        }
        .icon:hover {
          fill: ${theme[themePage].main.linkHover};
        }
        .selected,
        ::selection {
          background: ${theme[themePage].menu2.link};
          color: antiquewhite;
        }
        .selected .icon {
          fill: antiquewhite;
        }
      `}</style>
    </div>
  );
}
