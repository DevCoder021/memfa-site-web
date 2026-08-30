import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";

const authSecret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
if (process.env.NODE_ENV === "production" && !authSecret) {
  throw new Error(
    "NEXTAUTH_SECRET est obligatoire en production. Ajoutez-le dans vos variables d'environnement."
  );
}

export const authOptions: NextAuthOptions = {
  secret: authSecret,
  session: { strategy: "jwt" },
  jwt: { maxAge: 60 * 60 * 8 },
  pages: {
    signIn: "/admin",
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [
    CredentialsProvider({
      name: "Admin MEMFA",
      credentials: {
        username: { label: "Nom d'utilisateur", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const admin = await prisma.admin.findUnique({
          where: { username: credentials.username.trim() },
        });
        if (!admin) return null;

        const valid = await bcrypt.compare(credentials.password, admin.password);
        if (!valid) return null;

        return { id: admin.id, name: admin.username, email: admin.email, role: "ADMIN" as const };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = "ADMIN";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
        session.user.role = "ADMIN";
      }
      return session;
    },
  },
};
