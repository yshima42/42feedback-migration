import { NextApiHandler } from "next";
import NextAuth from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { DefaultJWT, JWT } from "next-auth/jwt";
import { Account, DefaultSession, Profile, Session, User } from "next-auth";
import FortyTwoProvider, {
  FortyTwoProfile,
} from "next-auth/providers/42-school";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends Record<string, unknown>, DefaultJWT {
    accessToken: string;
  }
}

type JwtProps = {
  token: JWT;
  user?: User | AdapterUser;
  account?: Account | null;
  profile?: Profile;
  isNewUser?: boolean;
};

type SessionProps = {
  session: Session;
  token: JWT;
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const options = {
  providers: [
    FortyTwoProvider({
      clientId: process.env.FORTY_TWO_CLIENT_ID as string,
      clientSecret: process.env.FORTY_TWO_CLIENT_SECRET as string,
      profile(profile: FortyTwoProfile) {
        return {
          id: profile.login,
          image: profile.image?.versions?.small,
        };
      },
    }),
  ],
  secret: process.env.SECRET,
  callbacks: {
    async jwt({ token, account }: JwtProps) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: SessionProps) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
};
