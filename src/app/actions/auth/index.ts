"use server";

import { removeCookie, setCookie } from "@/app/actions/auth/utils.ts";
import prisma from "@/lib/prisma.ts";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function loginAction(
  prevState: { error: string } | undefined,
  formData: FormData,
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      omit: { password: false },
    });
    if (!user) return { error: "Erreur d'authentification" };
    const res = await bcrypt.compare(password, user.password);
    if (!res) return { error: "Erreur d'authentification" };
    await setCookie(user);
  } catch (e) {
    return { error: `Erreur d'authentification` };
  }
  redirect("/admin");
}

export async function logoutAction() {
  await removeCookie();
  redirect("/");
}
