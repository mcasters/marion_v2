"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/app/context/themeProvider";
import { SessionProvider } from "@/app/context/sessionProvider";
import { Session, StructTheme } from "@/lib/type";
import { AlertProvider } from "@/app/context/alertProvider";
import { MetaProvider } from "@/app/context/metaProvider";

interface Props {
  session: Session | null;
  theme: StructTheme;
  metaMap: Map<string, string>;
  children: ReactNode;
}

export default function Providers({
  children,
  theme,
  session,
  metaMap,
}: Props) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        <MetaProvider metaMap={metaMap}>
          <AlertProvider>{children}</AlertProvider>
        </MetaProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
