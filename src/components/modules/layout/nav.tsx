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
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

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

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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

  const isMenuItemActive = (url: string) => {
    if (url === "/") {
      return pathname === "/";
    }

    return pathname === url || pathname.startsWith(`${url}/`);
  };

  return (
    <>
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 z-50 rounded-md bg-red-600 px-4 py-2 text-white transition-all duration-300"
      >
        Skip to main content
      </a>

      {/* Header background decoration */}
      <div className="-z-50 fixed right-0 top-0 w-11/12 translate-y-[-80%] dark:hidden">
        <Image
          src={assets.header_bg_color}
          alt=""
          className="w-full"
        />
      </div>

      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScroll
            ? "bg-white/50 shadow-sm backdrop-blur-xl dark:bg-darktheme/50 dark:shadow-white/20"
            : "bg-transparent"
          }`}
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-5 md:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-lg font-semibold dark:text-white/90 md:text-xl lg:text-2xl">
              Rasel Shikder<span className="text-red-600">.</span>
            </h1>
          </Link>

          {/* Desktop navigation */}
          <ul className="hidden items-center gap-3 text-xs sm:text-sm md:gap-4 md:text-[14px] lg:flex lg:gap-6 lg:text-base">
            {menu.map((item) => {
              const isActive = isMenuItemActive(item.url);

              return (
                <li
                  key={item.url}
                  className={`font-ovo whitespace-nowrap transition ${isActive
                      ? "font-semibold text-red-600"
                      : "hover:text-red-600"
                    }`}
                >
                  <Link
                    href={item.url}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right side controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ModeToggle />

            {/* Desktop Contact CTA */}
            <Link
              href="/contact"
              className="hidden items-center gap-1 rounded-full border border-gray-600 px-3 py-1 font-ovo text-xs transition hover:bg-darktheme hover:text-white dark:hover:bg-white dark:hover:text-black sm:text-sm md:px-4 md:py-2 md:text-[14px] lg:flex lg:px-6 lg:text-base"
            >
              Contact
              <span className="text-sm md:text-base lg:text-lg">→</span>
            </Link>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="cursor-pointer md:flex lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent className="overflow-y-auto bg-white/50 backdrop-blur-xl dark:bg-darktheme/50">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="/" className="flex items-center gap-2">
                      <h1 className="text-lg font-semibold dark:text-white/90 md:text-xl">
                        Rasel Shikder<span className="text-red-600">.</span>
                      </h1>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-4 flex flex-col gap-2">
                  {menu.map((item) => {
                    const isActive = isMenuItemActive(item.url);

                    return (
                      <Link
                        key={item.url}
                        href={item.url}
                        aria-current={isActive ? "page" : undefined}
                        className={`rounded-md p-2 text-xs font-semibold transition sm:text-sm md:text-[14px] ${isActive
                            ? "bg-gray-100 text-red-600 dark:bg-gray-800"
                            : "hover:bg-gray-200 dark:hover:bg-gray-800"
                          }`}
                      >
                        {item.title}
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </>
  );
};