import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import Facebook from "next-auth/providers/facebook";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

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
        console.log('🔐 Intentando login con:', credentials?.email);
        console.log('📝 Password recibido:', credentials?.password);
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Credenciales vacías');
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        console.log('👤 Usuario encontrado:', user ? 'Sí' : 'No');

        if (!user) return null;

        if (!user.password) {
          console.log('❌ Usuario sin password');
          return null;
        }

        console.log('🗝️  Hash almacenado:', user.password);
        console.log('🔑 Comparando passwords...');
        const ok = await bcrypt.compare(credentials.password as string, user.password);
        console.log('✅ Password correcto:', ok);
        
        if (!ok) return null;

        console.log('✅ Login exitoso, role:', user.role);
        
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
    async signIn({ user }) {
      const email = user.email ?? '';

      // SOLO estos emails pueden entrar al backend
      const allowedAdmins = [
        'dantebustos@gmail.com',
        'admin@motolibre.com.ar',
      ];

      // Si el email está en la lista de admins, permitir acceso
      if (allowedAdmins.includes(email)) {
        return true;
      }

      // Si no está en la lista, verificar si es cliente existente
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      // Si es cliente existente o registro nuevo, permitir
      return true;
    },

    async jwt({ token, user, account, profile }) {
      // For OAuth providers, upsert the user and set role based on whitelist
      if (account && profile) {
        const provider = account.provider;
        const email = (profile as any).email as string | undefined;
        const name = (profile as any).name as string | undefined;
        const image = (profile as any).picture as string | undefined;

        if (email) {
          // Determinar role según whitelist
          const allowedAdmins = [
            'dantebustos@gmail.com',
            'admin@motolibre.com.ar',
          ];
          
          const role = allowedAdmins.includes(email) ? 'admin' : 'cliente';

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
              role,
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
