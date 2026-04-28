import Image from "next/image";
import Link from "next/link";
import UserMenu from "@/components/UserMenu";

import React, { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar Container */}
      <header className="sticky top-0 z-50 w-full border-b px-6 py-4 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-90"
          >
            <div className="flex items-center justify-center rounded-full bg-slate-800/80 px-2 py-1.5">
              <Image
                src="/Logo.svg"
                alt="CareerCoach Logo"
                width={24}
                height={24}
                priority
                style={{ width: "30px", height: "auto" }}
                className="brightness-150"
              />
            </div>
            <h2 className="text-xl font-bold tracking-tight">CareerCoach</h2>
          </Link>

          <div className="flex items-center gap-4">
            <UserMenu />
          </div>
        </nav>
      </header>

      <main className="w-full flex-1 px-6 md:px-10 lg:px-16">{children}</main>

      <footer className="border-t py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} CareerCoach. All rights reserved.
      </footer>
    </div>
  );
};

export default RootLayout;
