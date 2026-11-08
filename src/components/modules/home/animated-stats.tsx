"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const StatCard = ({ value, label, duration }: { value: number; label: string; duration: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev >= value) return value;
        return prev + 1;
      });
    }, duration);
    return () => clearInterval(interval);
  }, [value, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <div className="text-4xl font-bold">
          {count}
        </div>
        <div className="text-sm text-gray-600">
          {label}
        </div>
      </div>
    </motion.div>
  );
};

export const AnimatedStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard value={50} label="Projects" duration={1000} />
      <StatCard value={20} label="Clients" duration={1500} />
      <StatCard value={3} label="Years" duration={2000} />
      <StatCard value={5000} label="Commits" duration={3000} />
    </div>
  );
};