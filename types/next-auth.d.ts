import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  export interface Session extends DefaultSession {
    accessToken?: string;
  }
}
