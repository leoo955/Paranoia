import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt"
  },
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.minecraftName = (user as any).minecraftName;
      }
      
      // Upgrade to ADMIN if Discord ID matches
      if (account && account.provider === 'discord' && account.providerAccountId === process.env.ADMIN_DISCORD_ID) {
        token.role = 'ADMIN';
      }
      // Handle session updates (when user sets their pseudo)
      if (trigger === "update" && session?.minecraftName) {
        token.minecraftName = session.minecraftName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.role = token.role;
        // @ts-ignore
        session.user.minecraftName = token.minecraftName;
      }
      return session;
    },
  },
};
