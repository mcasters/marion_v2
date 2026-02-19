"use server";
import prisma from "@/lib/prisma.ts";
import { ContentFull } from "@/lib/type";
import { cacheDatas } from "@/lib/utils/serverUtils";

export async function getContentsFull(): Promise<ContentFull[]> {
  const contents = await cacheDatas(() => queryContents(), "contents");
  return JSON.parse(JSON.stringify(contents));
}

const queryContents = async (): Promise<ContentFull[]> => {
  return await prisma.content.findMany({ include: { images: true } });
};
