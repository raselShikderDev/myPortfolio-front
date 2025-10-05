import Image from "next/image";
import Link from "next/link";
import { MdArrowRightAlt } from "react-icons/md";
import { GoDownload } from "react-icons/go";
import { assets } from "@/assets/assets";
import { MotionDiv, MotionH2, MotionH3, MotionP } from "../animations/motionElements";

const Header = () => {
  return (
    <div className="flex w-11/12 mx-auto items-center my-8 sm:my-44 justify-center gap-4">
      <div className="w-11/12 sm:w-8/12 flex flex-col items-center space-y-3 mt-24 sm:mt-0 mx-auto">
      <MotionDiv
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          alt="user"
          src={assets.profile_img}
          className="w-32 rounded-full shadow-sm drop-shadow-lg"
        />
      </MotionDiv>

      <MotionH2
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex gap-2 items-center text-lg md:text-2xl ovo"
      >
        Hi! I am Rasel Shikder{" "}
        <Image alt="hand" className="w-6" src={assets.hand_icon} />
      </MotionH2>

      <MotionH3
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="text-2xl text-center sm:text-4xl lg:text-5xl xl:text-[66px] ovo"
      >
        Mern Stack Developer <br /> based on Dhaka
      </MotionH3>

      <MotionP
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="text-gray-700 dark:text-gray-200 sm:text-lg text-sm text-center max-w-2xl mx-auto ovo"
      >
        Transforming Ideas into Stunning, Interactive, and Scalable Web
        Experiences with a Focus on Performance, Aesthetics, and Modern
        Technologies.
      </MotionP>

      <div className="flex flex-col sm:flex-row sm:justify-start sm:gap-4 gap-3 items-center mt-7">
        <MotionDiv
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <Link
            href="#"
            className="text-lg flex items-center justify-center gap-2 px-5 py-2 sm:px-8 sm:py-2.5 bg-darkhover text-white rounded-full font-ovo shadow-xl transition duration-500 hover:bg-black/15 hover:text-black hover:border hover:border-gray-500 dark:bg-black dark:border-gray-500 dark:hover:bg-darkhover dark:hover:text-white active:scale-105"
          >
            Connect with me <MdArrowRightAlt className="text-lg" />
          </Link>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <Link
            href="/rasel_resume.pdf"
            download
            className="text-lg flex items-center justify-center gap-2 px-5 py-2 sm:px-8 sm:py-2.5 rounded-full border border-gray-500 text-darkhover dark:text-black dark:bg-white hover:bg-black/15 hover:text-black dark:hover:bg-darkhover dark:hover:text-white shadow-xl transition duration-500 active:scale-105"
          >
            My resume <GoDownload className="text-lg" />
          </Link>
        </MotionDiv>
      </div>
    </div>
    </div>
  );
};

export default Header;
