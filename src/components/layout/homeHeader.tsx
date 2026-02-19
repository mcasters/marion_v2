"use client";

import { LAYOUT as L } from "@/constants/layout.js";
import Nav_1 from "@/components/layout/nav_1/nav_1.tsx";
import Nav_2 from "@/components/layout/nav_2/nav_2.tsx";
import s from "./layout.module.css";
import React from "react";
import useElementIsUpTo from "@/components/hooks/useElementIsUpTo.ts";
import { useTheme } from "@/app/context/themeProvider.tsx";

type Props = {
  isPlainHomeLayout: boolean;
  title: string;
  introduction: string;
};

export default function HomeHeader({
  isPlainHomeLayout,
  title,
  introduction,
}: Props) {
  const theme = useTheme();
  const { isUpTo: titleGone, ref: titleRef } = useElementIsUpTo(L.LINE_HEIGHT);
  const { isUpTo: introGone, ref: introRef } = useElementIsUpTo(
    L.LINE_HEIGHT + L.NAV_1_HEIGHT,
  );

  return (
    <header className={isPlainHomeLayout ? s.plainHomeHeader : s.header}>
      <section ref={titleRef} className={s.siteTitle}>
        <h1
          className={s.title}
          style={{
            color: theme.general.titleColor,
          }}
        >
          {title}
        </h1>
      </section>
      <Nav_1 fixed={titleGone} themePage="home" />
      <div
        style={{
          display: titleGone ? "block" : "none",
          height: L.NAV_1_HEIGHT,
        }}
      />
      <section
        ref={introRef}
        className={s.intro}
        style={{
          color: theme.home.main.text,
        }}
      >
        <p>{introduction}</p>
      </section>
      <Nav_2 fixed={introGone} themePage="home" />
      <div
        style={{
          display: introGone ? "block" : "none",
          height: L.NAV_2_HEIGHT,
        }}
      />
    </header>
  );
}
