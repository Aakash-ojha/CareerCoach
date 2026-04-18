"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import FormField from "./FormField";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type AuthPageType = "sign-in" | "sign-up";

const authformSchema = (typed: AuthPageType) => {
  return z
    .object({
      name:
        typed === "sign-up"
          ? z
              .string()
              .min(2, "Name must be at least 2 characters.")
              .max(32, "Name must be at most 32 characters.")
          : z.string().optional(),

      email: z.string().email("Invalid email address"),

      password: z.string().min(8, "Password must be at least 8 characters."),

      confirmPassword: z.string().optional(),
    })
    .refine(
      (data) => {
        if (typed === "sign-up") {
          return data.password === data.confirmPassword;
        }
        return true;
      },
      {
        message: "Passwords don't match",
        path: ["confirmPassword"],
      },
    );
};

const AuthForm = ({ typed }: { typed: AuthPageType }) => {
  const router = useRouter();
  const formSchema = authformSchema(typed);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      if (typed === "sign-up") {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
          }),
        });
        const result = await res.json();

        if (!res.ok) {
          toast.error(result.message || "Signup failed");
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else if (typed === "sign-in") {
        const res = await fetch("/api/auth/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        });

        const result = await res.json();

        if (!res.ok) {
          toast.error(result.message || "Login failed");
          return;
        }
        toast.success("Successfully signed in");
        router.refresh();
        router.push("/");
      }
    } catch (err) {
      console.log(err);

      toast.error(`There was an error : ${err}`);
    }
  }

  const isSignUp = typed === "sign-up";

  return (
    <div className="py-4 px-4 border-2 rounded-2xl w-100">
      <div className="flex flex-col gap-2 mb-8 items-center">
        <div className="flex flex-row gap-2 justify-center items-center">
          <Image
            src="/logo.svg"
            alt="logo"
            height={18}
            width={18}
            className="w-9 h-9 rounded-lg bg-black flex items-center justify-center p-1"
          />

          <h2 className="text-xl font-bold">CareerCoach</h2>
        </div>
        <h3 className="text-sm text-slate-400">
          Your AI-powered interview partner
        </h3>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 mt-4 form"
      >
        {isSignUp && (
          <FormField
            control={form.control}
            name="name"
            label="Name"
            placeholder="Enter your Name"
            type="text"
            autoComplete="name"
          />
        )}

        <FormField
          control={form.control}
          name="email"
          label="Email"
          placeholder="Your email address"
          type="email"
          autoComplete="email"
        />
        <div className="flex flex-col gap-3">
          <FormField
            control={form.control}
            name="password"
            label="Password"
            placeholder="Enter your password"
            type="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
          />
          {isSignUp ? (
            ""
          ) : (
            <Link
              href="/"
              className="text-sm justify-end flex text-slate-200 hover:text-white"
            >
              Forget Password?
            </Link>
          )}
        </div>

        {isSignUp && (
          <>
            <FormField
              control={form.control}
              name="confirmPassword"
              label="ConfirmPassword"
              placeholder="Enter your password"
              type="password"
              autoComplete="new-password"
            />
          </>
        )}

        <Button
          type="submit"
          className="w-full h-10 border border-slate-200 rounded-full text-sm text-slate-700 flex items-center justify-center gap-2.5 font-bold hover:bg-slate-50 transition-colors mt-2 cursor-pointer"
        >
          {isSignUp ? "Create Account" : "Login"}
        </Button>
      </form>

      <div className="flex items-center gap-3 mt-2">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400">or continue with</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Google Auth */}
      <Button className="w-full h-10 border border-slate-200 rounded-full text-sm text-slate-700 flex items-center justify-center gap-2.5 hover:bg-slate-50 transition-colors mt-2 cursor-pointer">
        <GoogleIcon />
        Continue with Google
      </Button>

      <p className="text-center text-xs text-slate-400/80 mt-6">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}

        <Link
          href={isSignUp ? "/sign-in" : "sign-up"}
          className="text-slate-300 text-sm font-medium hover:text-white m-1"
        >
          {isSignUp ? "Sign in" : "Create one"}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18">
    <path
      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.706 17.64 9.2z"
      fill="#4285F4"
    />
    <path
      d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
      fill="#34A853"
    />
    <path
      d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
      fill="#EA4335"
    />
  </svg>
);
