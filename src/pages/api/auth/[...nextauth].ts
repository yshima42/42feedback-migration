import { NextApiHandler } from "next";
import NextAuth from "next-auth";
import FortyTwoProvider from "next-auth/providers/42-school";

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const options = {
  providers: [
    FortyTwoProvider({
      clientId: process.env.FORTY_TWO_CLIENT_ID as string,
      clientSecret: process.env.FORTY_TWO_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.SECRET,
};
