import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const config = {
  providers: [
    Credentials({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials: any) => {
        if (!credentials?.email || !credentials?.password) return null;
        const usuario = await prisma.usuario.findUnique({
          where: { email: credentials.email },
        });
        if (!usuario) return null;
        const ok = await bcrypt.compare(credentials.password, usuario.passwordHash);
        if (!ok) return null;
        return { id: usuario.id, name: usuario.nombre, email: usuario.email, role: usuario.role } as any;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }: any) => {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }: any) => {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(config);
export const GET = handler;
export const POST = handler;
