import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { createHmac } from "crypto";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db";

const HASH_SECRET = env.HASH_SECRET || 'SUPER_SECRET_HASH_SECRET'

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true
      if (isAllowedToSignIn) {
        return true
      } else {
        // Return false to display a default error message
        return false
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email Address",
          type: "email",
          placeholder: "Enter your email address..."
        },
        password: {
          label: "Password",
          type: "password"
        }
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const passwordHash = createHmac('sha256', HASH_SECRET).update(credentials.password).digest('hex');
        
        const userCredentials = await prisma.user.findFirst({
          where: {
            AND: [
              {
                email: {
                  equals: credentials.email
                }
              },
              {
                password: {
                  equals: passwordHash
                }
              }
            ]
          },
        });

        if (!userCredentials) {
          return null;
        }

        return userCredentials;
      },
    })
  ],
  pages: {
    signIn: '/admin',
  },
  secret: HASH_SECRET,
  session: {
    strategy: "jwt",
  }
};

export default NextAuth(authOptions);
