"use client";
import { createContext, ReactNode, useContext } from "react";

const MetaContext = createContext<Map<string, string>>(new Map());

interface Props {
  metaMap: Map<string, string>;
  children: ReactNode;
}

export function MetaProvider({ metaMap, children }: Props) {
  return (
    <MetaContext.Provider value={metaMap}>{children}</MetaContext.Provider>
  );
}

export function useMetas() {
  return useContext(MetaContext);
}
