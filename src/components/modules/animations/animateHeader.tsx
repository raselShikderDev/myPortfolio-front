// components/AnimatedHeader.tsx
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MdArrowRightAlt } from "react-icons/md";
import { GoDownload } from "react-icons/go";
import { assets } from "@/assets/assets";

export default function AnimatedHeader() {
  return (
    <div className="w-8/12 flex flex-col items-center space-y-3 mt-24 sm:mt-0">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          alt="user"
          src={assets.profile_img}
          className="w-32 rounded-full shadow-sm drop-shadow-lg"
        />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex gap-2 items-center text-lg md:text-2xl ovo"
      >
        Hi! I am Rasel Shikder{" "}
        <Image alt="hand" className="w-6" src={assets.hand_icon} />
      </motion.h2>

      <motion.h3
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="text-xl text-center sm:text-4xl lg:text-5xl xl:text-[66px] ovo"
      >
        Mern Stack Developer <br /> based on Dhaka
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="text-gray-700 dark:text-gray-200 sm:text-lg text-sm text-center max-w-2xl mx-auto ovo"
      >
        Transforming Ideas into Stunning, Interactive, and Scalable Web
        Experiences with a Focus on Performance, Aesthetics, and Modern
        Technologies.
      </motion.p>

      <div className="flex flex-col gap-3 sm:gap-0 sm:flex-row items-center space-x-3 mt-7">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <Link
            href={"#"}
            className="flex items-center gap-2 shadow-xl active:scale-105 px-5 sm:px-10 py-1 sm:py-2.5 bg-darkhover text-white hover:bg-black/15 hover:text-black hover:border hover:border-gray-500 dark:bg-black dark:border-gray-500 dark:border dark:hover:bg-darkhover duration-500 transition dark:hover:text-white rounded-full font-ovo"
          >
            Connect with me <MdArrowRightAlt className="text-lg" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <Link
            href="/rasel_resume.pdf"
            download
            className="flex active:scale-105 items-center gap-2 shadow-xl px-5 sm:px-10 py-1 sm:py-2.5 rounded-full text-darkhover hover:text-black hover:bg-black/15 border duration-500 transition dark:bg-white dark:text-black dark:hover:bg-darkhover dark:hover:text-white border-gray-500"
          >
            My resume <GoDownload className="text-lg" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
