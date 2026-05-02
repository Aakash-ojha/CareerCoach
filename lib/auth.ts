import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // Runs when JWT is created/updated
    async jwt({ token, user }) {
      await connectDB();

      if (user?.email) {
        // find user in DB
        let dbUser = await User.findOne({ email: user.email });

        // if user doesn't exist, create it
        if (!dbUser) {
          dbUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            provider: "google",
          });
        }

        // attach MongoDB user id to token
        token.id = dbUser._id.toString();
        token.email = dbUser.email;
      }

      return token;
    },

    // Runs when session is accessed (useSession / getServerSession)
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).email = token.email;
      }

      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
