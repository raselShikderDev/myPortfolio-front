/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { IoIosSend } from "react-icons/io";
import { motion } from "framer-motion";
import { MotionAextarea, MotionH2, MotionH3 } from "@/components/modules/animations/motionElements";
import { useTheme } from "next-themes";

const Contact = () => {
  const [result, setResult] = useState("");
  const {theme} = useTheme()

  const onSubmit = async (event:any) => {
    event.preventDefault();
    setResult("Sending....");

    // Creating form data from the form
    const formData = new FormData(event.target);

    // Appending access key
    formData.append("access_key", "0e603e92-0127-45bf-941a-6fbc380b94f8");

    try {
      // Sending the form data to Web3Forms API
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      // Checking for response status
      if (!response.ok) {
        throw new Error("Failed to submit the form");
      }

      const data = await response.json();

      if (data.success) {
        setResult("Form Submitted Successfully");
        event.target.reset();
      } else {
        console.log("Error in form submission:", data);
        setResult(data.message || "An error occurred");
      }
    } catch (error:any) {
      setResult("Error: " + error.message);
      console.error("Error occurred:", error);
    }
  };

  return (
    <div
      style={{
        backgroundImage: theme ? "" : `url("/footer-bg-color.png")`,
        backgroundSize: "90% auto",
      }}
      className="w-full px-[12%] py-10 md:mt-0 dark:bg-darktheme scroll-mt-20 mx-auto bg-no-repeat bg-center"
    >
      <MotionH3
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 100, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-xl md:text-2xl mb-1 ovo font-ovo text-center"
      >
        Contact with me
      </MotionH3>
      <MotionH2
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 100, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="text-2xl md:text-5xl ovo font-ovo text-center"
      >
        Get in touch
      </MotionH2>
      <motion.p
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 100, y: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="max-w-3xl sm:text-lg ovo text-sm mx-auto mt-4 font-ovo text-center"
      >
        Have a project in mind or just want to say hello? Feel free to reach
        out! I’m always open to discussing new opportunities, collaborations, or
        any exciting ideas.
      </motion.p>
      <form
        onSubmit={onSubmit}
        className="my-14 max-w-2xl mx-auto space-y-7 sm:space-y-10"
      >
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <input type="hidden" name="subject" value="Portfolio - Rasel" />
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 100, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="w-full md:w-1/2"
          >
            <input
              type="text"
              className="bg-white w-full  dark:text-white/90 dark:bg-darkhover dark:border-gray-500 px-4 py-2.5 focus-visible:outline-none rounded-sm border-[0.5px] border-gray-400  shadow-sm"
              placeholder="Enter your name"
              name="name"
              required
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 100, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="w-full md:w-1/2"
          >
            <input
              type="email"
              className="bg-white w-full  dark:text-white/90 dark:bg-darkhover dark:border-gray-500 px-4 py-2.5 focus-visible:outline-none rounded-sm border-[0.5px] border-gray-400 shadow-sm"
              placeholder="Enter your email"
              name="email"
              required
            />
          </motion.div>
        </div>
        <MotionAextarea
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 100, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="bg-white w-full dark:text-white/90 dark:bg-darkhover dark:border-gray-500 px-4 py-2.5 focus-visible:outline-none rounded-sm border-[0.5px] border-gray-400 shadow-sm"
          placeholder="Enter your message"
          name="message"
          id="message"
          rows={3}
          required
        ></MotionAextarea>
        <motion.button
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 100, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="flex w-max mx-auto text-center gap-2 items-center px-5 sm:px-10 py-1 sm:py-2.5 font-ovo duration-500 border bg-darkhover text-white hover:text-black hover:bg-lighthover dark:bg-white dark:text-black dark:hover:bg-transparent dark:hover:text-white active:scale-105 border-gray-700 rounded-full"
          type="submit"
        >
          Send now <IoIosSend />
        </motion.button>
        <p className="text-center mt-5">{result}</p>
      </form>
    </div>
  );
};

export default Contact;