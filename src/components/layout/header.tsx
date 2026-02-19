"use client";

import Nav_1 from "@/components/layout/nav_1/nav_1.tsx";
import Nav_2 from "@/components/layout/nav_2/nav_2.tsx";
import s from "./layout.module.css";
import React from "react";

type Props = {
  themePage: "work" | "other" | "home";
};

export default function Header({ themePage }: Props) {
  return (
    <header className={s.header}>
      <Nav_1 fixed={true} themePage={themePage} />
      <Nav_2 fixed={true} themePage={themePage} />
    </header>
  );
}
