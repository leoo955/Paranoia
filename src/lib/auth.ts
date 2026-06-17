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
        token.isMcVerified = (user as any).isMcVerified;
      }
      if (account && account.provider === 'discord' && account.providerAccountId === process.env.ADMIN_DISCORD_ID) {
        token.role = 'ADMIN';
      }
      if (trigger === "update" && token.id) {
        const dbUser = await prisma.user.findUnique({ where: { id: token.id as string } });
        if (dbUser) {
          token.minecraftName = dbUser.minecraftName;
          token.isMcVerified = dbUser.isMcVerified;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.minecraftName = token.minecraftName;
        session.user.isMcVerified = token.isMcVerified;
      }
      return session;
    },
  },
};