"use client";
import { createContext, ReactNode, useContext } from "react";
import { Session } from "@/lib/type";

const SessionContext = createContext<Session | null>(null);

interface Props {
  session: Session | null;
  children: ReactNode;
}

export function SessionProvider({ session, children }: Props) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
