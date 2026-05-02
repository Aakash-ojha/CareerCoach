// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      if (account?.provider === "google") {
        try {
          // Connect to database using your cached connection
          await connectDB();

          // Check if the user already exists in your MongoDB database
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // If they don't exist, create a new document
            await User.create({
              name: user.name,
              email: user.email,
              password: "google_oauth_placeholder_password", // Placeholder for password
              avatar: user.image,
            });
          }
          return true;
        } catch (error) {
          console.error("Error creating user during sign in:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session }: { session: any }) {
      try {
        // Connect to database before querying
        await connectDB();

        // Fetch the user's database ID and append it to the session
        const dbUser = await User.findOne({ email: session.user?.email });
        if (dbUser) {
          session.user.id = dbUser._id.toString();
        }
      } catch (error) {
        console.error("Error fetching user data for session:", error);
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
