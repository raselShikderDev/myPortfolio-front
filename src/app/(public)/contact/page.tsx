/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { IoIosSend } from "react-icons/io";
import {
  MotionAextarea,
  MotionButton,
  MotionDiv,
  MotionH2,
  MotionH3,
  MotionP,
} from "@/components/modules/animations/motionElements";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// export const metadata = {
//   title: "Contact | Rasel Shikder",
//   description: "Get in touch with Rasel Shikder for projects, collaborations, or inquiries.",
//   keywords: ["Contact", "Rasel Shikder", "Portfolio", "MERN Stack Developer", "Frontend", "Fullstack"],
// };

export default function ContactPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const { theme } = useTheme();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", "0e603e92-0127-45bf-941a-6fbc380b94f8");

    try {
      setLoading(true);
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Form submitted successfully!", {
          description: "I'll get back to you soon.",
          duration: 5000,
          className:
            "bg-green-600 text-white font-medium border border-green-700 shadow-lg",
        });

        form.reset();
      } else {
        toast.error("Failed to send message!", {
          description: "Please try again later.",
          duration: 5000,
          className:
            "bg-red-600 text-white font-medium border border-red-700 shadow-lg",
        });
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to send message!", {
        description: "Please try again later.",
        duration: 5000,
        className:
          "bg-red-600 text-white font-medium border border-red-700 shadow-lg",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative w-full min-h-screen px-4 sm:px-6 md:px-12 py-16 dark:bg-gray-950"
      style={{
        backgroundImage:
          theme === "light" ? `url("/footer-bg-color.png")` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Optional overlay for light mode */}
      {theme === "light" && (
        <div className="absolute inset-0 bg-white/50 pointer-events-none"></div>
      )}

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <div className="">
          <MotionH3
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-xl md:text-2xl font-ovo mb-2"
          >
            Contact with me
          </MotionH3>

          <MotionH2
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="text-2xl md:text-5xl font-ovo mb-4 md:mb-16"
          >
            Get in touch
          </MotionH2>
          {/* <MotionP initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.6, ease: "easeIn" }} className="text-gray-800 dark:text-gray-200 text-lg md:text-xl font-semibold">
          
          ✨ I love turning ideas into reality! Whether it’s a small project or
          a big vision, let’s build something amazing together.
       
        </MotionP> */}
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 sm:space-y-8 flex flex-col items-center w-full"
        >
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <MotionDiv
              className="w-full"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                required
                className="w-full px-4 py-3 rounded-md border border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:outline-none"
              />
            </MotionDiv>
            <MotionDiv
              className="w-full"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded-md border border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:outline-none"
              />
            </MotionDiv>
          </div>

          <MotionAextarea
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            name="message"
            placeholder="Enter your message"
            rows={4}
            required
            className="w-full px-4 py-3 rounded-md border border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:outline-none"
          />

          <MotionButton
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2 }}
          >
            <Button
              disabled={loading}
              type="submit"
              className="group relative flex cursor-pointer items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white hover:bg-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-300 transition-transform transform hover:scale-105 overflow-hidden"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>Send now</span>
                  <IoIosSend className="relative transition-all duration-300 group-active:translate-x-4 group-active:-translate-y-4 animate-out" />
                </>
              )}
            </Button>
          </MotionButton>
        </form>
      </div>
      <MotionDiv
        className="mt-12 text-center space-y-4"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <MotionP
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 2.0, ease: "easeIn" }}
          className="text-gray-700 dark:text-gray-300 italic"
        >
          I usually reply within 24 hours – but if you don’t hear back, try
          again, because great things are worth persistence 😉
        </MotionP>
        <MotionP
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 2.3, ease: "easeIn" }}
          className="text-gray-800 dark:text-gray-200"
        >
          Or just connect with me on my socials below. Let’s make the web a more
          beautiful place, one project at a time.
        </MotionP>
      </MotionDiv>
    </div>
  );
}
