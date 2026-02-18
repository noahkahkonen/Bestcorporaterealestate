import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

if (process.env.NODE_ENV === "development" && !process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = "dev-secret-min-32-chars-long";
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = process.env.ADMIN_USERNAME ?? "BestCorp";
        const password = process.env.ADMIN_PASSWORD ?? "Rolex123!";
        if (!credentials?.username || !credentials?.password) return null;
        const match =
          credentials.username === username &&
          (password.startsWith("$2")
            ? bcrypt.compare(credentials.password, password)
            : credentials.password === password);
        if (match) {
          return { id: "admin", name: "Admin", email: "admin@bestcre.com" };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  pages: { signIn: "/admin/login" },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = "admin";
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.role = token.role as string;
      return session;
    },
  },
};
