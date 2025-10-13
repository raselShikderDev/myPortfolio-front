"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { ModeToggle } from "@/components/modeToggler";
import { useEffect, useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";

interface NavbarProps {
  menu?: { title: string; url: string }[];
}

interface AuthResponse {
  user: {
    id: number;
    email: string;
    role: "OWNER";
    iat: number;
    exp: number;
  };
  token: string;
}

export const Navbar2 = ({
  menu = [
    { title: "Home", url: "/" },
    { title: "About me", url: "/about" },
    { title: "Blogs", url: "/blogs" },
    { title: "Projects", url: "/projects" },
    { title: "Contact", url: "/contact" },
  ],
}: NavbarProps) => {
  const [isScroll, setIsScroll] = useState(false);
  const [tokens, setTokens] = useState<null | AuthResponse>(null);
  useEffect(() => {
    fetch("/api/profile")
      .then(async (res) => (res.ok ? res.json() : null))
      .then((data) => setTokens(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScroll(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
      <div className="-z-50 fixed top-0 w-11/12 right-0 translate-y-[-80%] dark:hidden">
        <Image
          alt="Header bg"
          className="w-full"
          src={assets.header_bg_color}
        />
      </div>
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScroll
            ? "bg-white/50 backdrop-blur-xl shadow-sm dark:bg-darktheme/50 dark:shadow-white/20"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center py-4 px-5 lg:px-8">
          {/* Logo */}
          <Link href={"/"} className="flex items-center gap-2">
            <h1 className="text-xl dark:text-white/90 md:text-2xl lg:text-[28px] font-semibold">
              Rasel Shikder<span className="text-red-600">.</span>
            </h1>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-6 text-sm md:text-base">
            {menu.map((item) => (
              <li
                key={item.title}
                className="font-ovo hover:text-red-600 transition"
              >
                <Link href={item.url}>{item.title}</Link>
              </li>
            ))}
          </ul>

          {/* Right side (Mode toggle + Connect + Mobile Menu) */}
          <div className="flex items-center gap-4">
            <ModeToggle />

            <Link
              href={tokens?.user.email ? "/dashboard" : "/login"}
              className="hidden md:flex items-center gap-2 px-6 py-2 font-ovo border md:text-lg border-gray-600 rounded-full hover:bg-darktheme hover:text-white dark:hover:bg-white dark:hover:text-black transition"
            >
              {tokens?.user.email ? "Dashboard" : "Login"}
              <span className="text-lg">
                {tokens?.user.email ? "Dashboard" : "→"}
              </span>
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                className={`overflow-y-auto bg-white/50 backdrop-blur-xl dark:bg-darktheme/50`}
              >
                <SheetHeader>
                  <SheetTitle>
                    <Link href={"/"} className="flex items-center gap-2">
                      <h1 className="text-xl dark:text-white/90 md:text-2xl lg:text-[28px] font-semibold">
                        Rasel Shikder<span className="text-red-600">.</span>
                      </h1>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-4 mt-6">
                  {menu.map((item) => (
                    <Link
                      key={item.title}
                      href={item.url}
                      className="text-md font-semibold p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </>
  );
};
