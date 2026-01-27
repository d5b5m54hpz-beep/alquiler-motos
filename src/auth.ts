import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import Facebook from "next-auth/providers/facebook";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

const config = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Apple({
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        if (!user.password) return null;

        const ok = await bcrypt.compare(credentials.password as string, user.password);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phoneVerifiedAt: user.phoneVerifiedAt,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // For OAuth providers, upsert the user and set default role "cliente"
      if (account && profile) {
        const provider = account.provider;
        const email = (profile as any).email as string | undefined;
        const name = (profile as any).name as string | undefined;
        const image = (profile as any).picture as string | undefined;

        if (email) {
          const upserted = await prisma.user.upsert({
            where: { email },
            update: {
              name: name ?? email,
              image,
              provider,
            },
            create: {
              email,
              name: name ?? email,
              image,
              provider,
              role: "cliente",
            },
          });
          token.role = upserted.role;
          token.userId = upserted.id;
          token.phoneVerifiedAt = upserted.phoneVerifiedAt ?? null;
        }
      }
      if (user) {
        token.role = (user as any).role;
        token.userId = (user as any).id;
        token.phoneVerifiedAt = (user as any).phoneVerifiedAt ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.userId;
        (session.user as any).phoneVerifiedAt = token.phoneVerifiedAt ?? null;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      // Auto-create Cliente on first login for role "cliente"
      const u = await prisma.user.findUnique({ where: { id: user.id as string } });
      if (u && u.role === "cliente") {
        const existingCliente = await prisma.cliente.findUnique({ where: { userId: u.id } });
        if (!existingCliente) {
          await prisma.cliente.create({
            data: {
              userId: u.id,
              nombre: u.name,
              email: u.email,
              telefono: u.phone ?? null,
            },
          });
        }
      }
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;

export const { handlers, auth } = NextAuth(config);
