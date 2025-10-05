import { assets, workData } from "@/assets/assets";
import { MotionDiv, MotionH2, MotionH3, MotionP  } from "@/components/modules/animations/motionElements";
import Image from "next/image";
import Link from "next/link";
import { MdArrowRightAlt } from "react-icons/md";


const Projects = () => {
  return (
    <div className="w-full px-[12%] py-10 md:mt-0 scroll-mt-20 mx-auto">
      <MotionH3
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 100, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-base md:text-2xl mb-1 font-ovo ovo text-center"
      >
        My portfolio
      </MotionH3>
      <MotionH2
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 100, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="text-2xl md:text-5xl font-ovo ovo text-center"
      >
        My works
      </MotionH2>
      <MotionP
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 100, y: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="max-w-3xl sm:text-lg dark:text-gray-300 text-sm mx-auto mt-4 font-ovo ovo text-center"
      >
        Explore my collection of MERN stack projects, where modern design meets
        responsive, full-stack functionality and cutting-edge web technologies.
      </MotionP>
      <div className="grid grid-cols-1 my-16 mt-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 items-center">
        {workData.map(({ bgImage, title, description, delay, link }, index) => {
          return (
            <MotionDiv
              style={{
                fontFamily: "Ovo, serif",
                backgroundImage: `url(${bgImage})`,
              }}
              key={index}
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 100, x: 0 }}
              transition={{ duration: 1, delay: delay }}
              className="aspect-square bg-no-repeat bg-center bg-cover rounded-lg relative cursor-pointer group"
            >
              <div className="flex gap-2 justify-between items-center w-10/12 rounded-md bg-white text-black absolute bottom-5 left-1/2 -translate-x-1/2 px-5 py-3 duration-500 group-hover:bottom-7">
                <Link target="_blank" href={link}>
                  <div className="">
                    <h3 className="font-semibold">{title}</h3>
                    <p className="text-sm text-gray-700">{description}</p>
                  </div>
                </Link>
                <div className="flex items-center justify-center rounded-full w-9 border border-black shadow-[2px_2px_0px_#000] aspect-square group-hover:bg-lime-300 transition">
                  <Image
                    src={assets.send_icon}
                    alt="Send Icon"
                    className="w-5"
                  />
                </div>
              </div>
            </MotionDiv>
          );
        })}
      </div>
      <MotionDiv
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 100, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <Link
          className="flex w-max mx-auto text-center gap-2 items-center active:scale-105 px-5 sm:px-10 py-1 sm:py-2.5 font-ovo my-20 border dark:hover:text-black duration-500 hover:bg-lighthover border-gray-700 rounded-full"
          href={"#"}
        >
          Show more <MdArrowRightAlt />
        </Link>
      </MotionDiv>
    </div>
  );
};

export default Projects;
