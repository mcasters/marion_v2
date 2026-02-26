"use server";
import prisma from "@/lib/prisma.ts";
import { Meta } from "@@/prisma/generated/client";

export const getMetas = async (): Promise<Meta[]> =>
  await prisma.meta.findMany();
