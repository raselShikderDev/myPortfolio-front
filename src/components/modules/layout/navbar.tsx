"use client";
import { assets } from "@/assets/assets";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GoArrowUpRight } from "react-icons/go";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const [openMobileNav, setOpenMobileNav] = useState(false);
  const [isScroll, setIsScroll] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { theme, setTheme } = useTheme();
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (scrollY > 30) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    });
  }, []);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  return (
    <>
      <div className="-z-10 fixed top-0 w-11/12 right-0 translate-y-[-80%] dark:hidden">
        <Image
          alt="Header bg"
          className="w-full"
          src={assets.header_bg_color}
        />
      </div>
      <nav
        className={`flex top-0 left-0 w-full fixed dark:border-b dark:border-white/10 ${
          isScroll
            ? "bg-[rgba(255,255,255,0.5)] dark:bg-darktheme dark:shadow-white/20 backdrop-blur-xl shadow-sm"
            : ""
        } justify-between px-5 lg:px-7 xl:px-[8%] item-center z-50 py-4`}
      >
        <Link className="flex items-center" href={"/"}>
          <h1
            className={`text-xl dark:text-white/90 md:text-2xl lg:text-[28px] font-semibold`}
          >
            Rasel Shikder<span className="text-red-600">.</span>
          </h1>
        </Link>
        <ul
          className={`hidden text-sm md:text-base md:flex item-center bg-white bg-opacity-50 shadow-sm gap-6 lg:gap-8 px-10 py-2 lg:px-12 lg:py-3 rounded-full dark:bg-[rgba(255,255,255,0.4)]`}
        >
          <li className="font-ovo ">
            <Link href={"#"}>Home</Link>
          </li>
          <li className="font-ovo">
            <Link href={"#"}>About me</Link>
          </li>
          <li>
            <Link href={"#"}>Services</Link>
          </li>
          <li className="font-ovo">
            <Link href={"#"}>My works</Link>
          </li>
          <li className="font-ovo">
            <Link href={"#"}>Testimonials</Link>
          </li>
        </ul>
        <div className="flex item-center gap-6">
          <button onClick={() => setTheme(theme === "dark" ? "dark" : "light")}>
            {theme === "light" ? (
              <Moon className="w-6 cursor-pointer active:scale-105 duration-500 transition" />
            ) : (
              <Sun className="w-6 cursor-pointer active:scale-105 duration-500 transition" />
            )}
          </button>
          <Link
            className="hidden lg:flex item-center active:scale-105 md:px-8 md:py-2 xl:px-10 xl:py-2.5 font-ovo border border-gray-600 rounded-full group ml-4 dark:hover:text-black dark:hover:bg-white duration-500 hover:bg-darktheme group hover:text-white"
            href={"#"}
          >
            Connect{" "}
            <GoArrowUpRight className="self-center text-lg ml-2 text-semibold text-black group-hover:text-white dark:text-white duration-500 dark:group-hover:text-black" />
          </Link>
          <button
            onClick={() => setOpenMobileNav(true)}
            className="block md:hidden ml-3"
          >
            <Image
              alt="Navbar"
              className="w-6 cursor-pointer active:scale-105"
              src={theme ? assets.menu_white : assets.menu_black}
            />
          </button>
        </div>
        {/* Mobile Menu */}
        <ul
          className={`${
            openMobileNav ? "flex" : "hidden"
          } md:hidden bg-rose-50 flex-col w-64 gap-4 py-20 px-10 fixed h-screen top-0 bottom-0 z-50 transition duration-50 shadow-sm right-0 dark:border-b dark:border-white/10 dark:bg-[rgba(0,0,0,0.9)] ${
            isScroll
              ? "bg-[rgba(255,255,255,0.5)] backdrop-blur-xl shadow-sm"
              : ""
          }`}
        >
          <div className="absolute top-6 right-6">
            <button
              onClick={() => setOpenMobileNav(false)}
              className="active:scale-105"
            >
              <Image
                alt="crossBlack"
                src={theme ? assets.close_white : assets.close_black}
                className="w-5 cursor-pointer "
              />
            </button>
          </div>
          <li onClick={() => setOpenMobileNav(false)} className="font-ovo">
            <Link href={"#"}>Home</Link>
          </li>
          <li className="font-ovo" onClick={() => setOpenMobileNav(false)}>
            <Link href={"#"}>About me</Link>
          </li>
          <li className="font-ovo" onClick={() => setOpenMobileNav(false)}>
            <Link href={"#"}>Services</Link>
          </li>
          <li className="font-ovo" onClick={() => setOpenMobileNav(false)}>
            <Link href={"#"}>My works</Link>
          </li>
          <li className="font-ovo" onClick={() => setOpenMobileNav(false)}>
            <Link href={"#"}>Testimonials</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
