import { serviceData } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import { MdArrowRightAlt } from "react-icons/md";
import { MotionDiv, MotionH2, MotionH3, MotionP } from "../animations/motionElements";

const Services = () => {
  return (
   <div className="w-full px-4 sm:px-6 lg:px-12 py-10 mt-20 md:mt-0 scroll-mt-20 mx-auto">
  <MotionH3
    initial={{ opacity: 0, y: -50 }}
    whileInView={{ opacity: 100, y: 0 }}
    transition={{ duration: 0.8 }}
    className="text-base md:text-2xl font-ovo ovo text-center"
  >
    What I Offer
  </MotionH3>

  <MotionH2
    initial={{ opacity: 0, y: -40 }}
    whileInView={{ opacity: 100, y: 0 }}
    transition={{ duration: 1, delay: 0.4 }}
    className="text-2xl md:text-5xl font-ovo ovo text-center mb-7"
  >
    My Services
  </MotionH2>

  <MotionP
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 100, y: 0 }}
    transition={{ duration: 1, delay: 0.7 }}
    className="max-w-3xl dark:text-gray-200 ovo sm:text-lg text-sm mx-auto mt-4 font-ovo text-center"
  >
    Building responsive, high-performance web applications with the MERN stack and modern web technologies. From frontend to backend, I create seamless full-stack solutions.
  </MotionP>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 my-16">
    {serviceData.map(({ icon, title, description, delay }, index) => (
      <div key={index} className="flex">
        <MotionDiv
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 100, x: 0 }}
          transition={{ duration: 0.8, delay: delay }}
          className="h-full flex flex-col border-[0.5px] shadow-sm border-gray-300 rounded-xl cursor-pointer px-8 py-12 hover:bg-lighthover hover:shadow-[4px_4px_0_#000] dark:hover:shadow-[4px_4px_0_#fff] dark:hover:bg-darkhover hover:scale-105"
        >
          <Image src={icon} alt={title} className="w-10" />
          <h3 className="text-xl md:text-2xl dark:text-gray-100 text-gray-700 font-semibold my-4 font-ovo">
            {title}
          </h3>
          <p className="font-ovo dark:text-gray-300 text-gray-600 ovo sm:text-lg text-sm leading-5 flex-1">
            {description}
          </p>
          <Link
            style={{ fontFamily: "Ovo, serif" }}
            className="mt-5 gap-2 flex items-center dark:text-gray-300 sm:text-lg text-sm text-gray-600"
            href={"#"}
          >
            Read More <MdArrowRightAlt />
          </Link>
        </MotionDiv>
      </div>
    ))}
  </div>
</div>

  );
};

export default Services;
