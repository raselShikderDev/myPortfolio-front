/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; 

import { useState } from "react";
import { IoIosSend } from "react-icons/io";
import { MotionH2, MotionH3, MotionAextarea } from "@/components/modules/animations/motionElements";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Contact | Rasel Shikder",
  description: "Get in touch with Rasel Shikder for projects, collaborations, or inquiries.",
  keywords: ["Contact", "Rasel Shikder", "Portfolio", "MERN Stack Developer", "Frontend", "Fullstack"],
};

export default function ContactPage() {
  const [result, setResult] = useState("");
  const { theme } = useTheme();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult("Sending...");

    const formData = new FormData(event.currentTarget);
    formData.append("access_key", "YOUR_WEB3FORMS_KEY"); // Replace with your Web3Forms key

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult("Form submitted successfully!");
        event.currentTarget.reset();
      } else {
        setResult(data.message || "An error occurred.");
      }
    } catch (error: any) {
      setResult("Error: " + error.message);
    }
  };

  return (
    <div
      className="relative w-full min-h-screen px-4 sm:px-6 md:px-12 py-16 dark:bg-gray-950"
      style={{
        backgroundImage: theme === "light" ? `url("/footer-bg-color.png")` : "none",
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
        <MotionH3
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-xl md:text-2xl font-ovo mb-2"
        >
          Contact with me
        </MotionH3>

        <MotionH2
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-2xl md:text-5xl font-ovo mb-4"
        >
          Get in touch
        </MotionH2>

        <MotionAextarea
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="text-sm sm:text-lg text-gray-700 dark:text-gray-300 font-ovo mb-10 pointer-events-none"
          value="Have a project in mind or just want to say hello? Feel free to reach out! I’m always open to discussing new opportunities, collaborations, or exciting ideas."
          readOnly
        />

        <form
          onSubmit={handleSubmit}
          className="space-y-6 sm:space-y-8 flex flex-col items-center w-full"
        >
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              required
              className="w-full px-4 py-3 rounded-md border border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 rounded-md border border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:outline-none"
            />
          </div>

          <MotionAextarea
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            name="message"
            placeholder="Enter your message"
            rows={4}
            required
            className="w-full px-4 py-3 rounded-md border border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:outline-none"
          />

          <Button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white hover:bg-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-800 transition-transform transform hover:scale-105"
          >
            Send now <IoIosSend />
          </Button>

          {result && <p className="mt-4 text-center text-gray-800 dark:text-gray-200">{result}</p>}
        </form>
      </div>
    </div>
  );
}
