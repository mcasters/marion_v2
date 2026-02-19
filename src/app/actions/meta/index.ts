"use server";
import prisma from "@/lib/prisma.ts";
import { Meta } from "@@/prisma/generated/client";

import { cacheDatas } from "@/lib/utils/serverUtils";

export async function getMetas(): Promise<Meta[]> {
  const metas = await cacheDatas(() => queryMetas(), "metas");

  return JSON.parse(JSON.stringify(metas));
}

const queryMetas = async (): Promise<Meta[]> => {
  return await prisma.meta.findMany();
};
