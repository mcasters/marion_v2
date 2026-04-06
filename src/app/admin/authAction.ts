"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { Session, User } from "@/lib/type.ts";
import { COOKIE_NAME } from "@/constants/admin.ts";
import { db } from "@/db";

const secretKey = process.env.AUTH_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const encryptSession = cookieStore.get(COOKIE_NAME)?.value;
  return encryptSession ? ((await decrypt(encryptSession)) as Session) : null;
}

export async function loginAction(
  prevState: { error: string } | undefined,
  formData: FormData,
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const user = await db.query.user.findFirst({
      where: { email },
    });
    if (!user) return { error: "Erreur d'authentification" };

    const res = await bcrypt.compare(password, user.password);
    if (!res) return { error: "Erreur d'authentification" };

    await setCookie({ id: user.id, email: user.email, isAdmin: user.isAdmin });
  } catch (e) {
    return { error: `Erreur d'authentification` };
  }
  redirect("/admin");
}

export async function logoutAction() {
  await removeCookie();
  redirect("/");
}

async function encrypt(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("4h")
    .sign(key);
}

async function decrypt(input: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

async function setCookie(user: User) {
  const expires = new Date(Date.now() + 60 * 60 * 4 * 1000); // 4h
  const session = await encrypt({ user, expires });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    expires,
    path: "/",
  });
}

async function removeCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
