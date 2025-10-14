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

interface IMenuItem {
  title: string;
  url: string;
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

export const Navbar2 = () => {
  const [isScroll, setIsScroll] = useState(false);
  const [tokens, setTokens] = useState<null | AuthResponse>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then(async (res) => (res.ok ? res.json() : null))
      .then((data) => setTokens(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScroll(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menu: IMenuItem[] = [
    { title: "Home", url: "/" },
    { title: "About me", url: "/about" },
    { title: "Blogs", url: "/blogs" },
    { title: "Projects", url: "/projects" },
    { title: "Contact", url: "/contact" },
  ];

  if (tokens?.user.email) {
    menu.push({ title: "Dashboard", url: "/dashboard" });
  } else {
    menu.push({ title: "Login", url: "/login" });
  }

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
        <div className="container mx-auto flex justify-between items-center py-3 px-4 sm:px-5 md:px-6 lg:px-8">
          <Link href={"/"} className="flex items-center gap-2">
            <h1 className="text-lg md:text-xl lg:text-2xl font-semibold dark:text-white/90">
              Rasel Shikder<span className="text-red-600">.</span>
            </h1>
          </Link>

          <ul className="hidden lg:flex items-center gap-3 md:gap-4 lg:gap-6 text-xs sm:text-sm md:text-[14px] lg:text-base">
            {menu.map((item, i) => (
              <li
                key={i}
                className="font-ovo hover:text-red-600 transition whitespace-nowrap"
              >
                <Link href={item.url}>{item.title}</Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <ModeToggle />

            <Link
              href="/contact"
              className="hidden lg:flex items-center gap-1 md:gap-2 px-3 md:px-4 lg:px-6 py-1 md:py-2 text-xs sm:text-sm md:text-[14px] lg:text-base font-ovo border border-gray-600 rounded-full hover:bg-darktheme hover:text-white dark:hover:bg-white dark:hover:text-black transition"
            >
              Contact<span className="text-sm md:text-base lg:text-lg">→</span>
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:flex lg:hidden cursor-pointer"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>

              <SheetContent className="overflow-y-auto bg-white/50 backdrop-blur-xl dark:bg-darktheme/50">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="/" className="flex items-center gap-2">
                      <h1 className="text-lg md:text-xl font-semibold dark:text-white/90">
                        Rasel Shikder<span className="text-red-600">.</span>
                      </h1>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-2 mt-4">
                  {menu.map((item, i) => (
                    <Link
                      key={i}
                      href={item.url}
                      className="text-xs sm:text-sm md:text-[14px] font-semibold p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md"
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
