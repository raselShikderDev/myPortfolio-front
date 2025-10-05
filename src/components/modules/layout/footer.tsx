import Link from "next/link";
import { MotionH1, MotionP } from "../animations/motionElements";
import Image from "next/image";
import { assets } from "@/assets/assets";

const Footer = () => {
  return (
    <div className="w-full px-[12%] py-10 pb-5 md:mt-0 scroll-mt-20 mx-auto">

      <Link className="flex items-center justify-center" href={"/"}>
        <MotionH1
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 100, x: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-3xl md:text-7xl text-center dark:text-white/90 lg:text-[28px] font-semibold"
        >
          Rasel Shikder<span className="text-red-600">.</span>
        </MotionH1>
      </Link>
      <MotionP
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 100, x: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="max-w-3xl mx-auto mt-1 dark:text-gray-400 text-gray-600 flex items-center justify-center gap-3 text-center"
      >
        <Image src={assets.mail_icon} alt="mail" className="w-7" />{" "}
        rasel.sikder777.rk@gmail.com
      </MotionP>
      <div className="mt-8 border-b border-gray-400"></div>
      <div className="flex flex-col gap-3 md:flex-row justify-between my-4">
        <div className="text-gray-600 dark:text-gray-400">
          <p>@ 2025 Rasel Shikder. All rights reserved</p>
        </div>
        <div className="space-x-7 text-center md:space-x-14">
          <Link
            className="text-gray-600 dark:text-gray-400"
            target="_blank"
            href={"https://github.com/raselShikderDev"}
          >
            Github
          </Link>
          <Link
            className="text-gray-600 dark:text-gray-400"
            target="_blank"
            href={"https://www.linkedin.com/in/raseldev"}
          >
            Linkedin
          </Link>
          <Link
            className="text-gray-600 dark:text-gray-400"
            target="_blank"
            href={"https://x.com/raselShikderDev"}
          >
            Twitter
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
