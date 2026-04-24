import Image from "next/image";
import Link from "next/link";
import UserMenu from "@/components/UserMenu";

import React, { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col ">
      {/* Navbar Container */}
      <header className="sticky top-0 z-50 w-full border-b backdrop-blur-md px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <div className="bg-slate-800/80 rounded-full px-2 py-1.5 flex items-center justify-center">
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
            <h2 className="text-xl font-bold tracking-tight ">CareerCoach</h2>
          </Link>

          <div className="flex items-center gap-4">
            <UserMenu />
          </div>
        </nav>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6">{children}</main>

      <footer className="py-6 text-center text-sm text-slate-500 border-t ">
        © {new Date().getFullYear()} CareerCoach. All rights reserved.
      </footer>
    </div>
  );
};

export default RootLayout;
