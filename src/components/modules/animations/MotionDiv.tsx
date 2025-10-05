// components/motion/MotionDiv.tsx
"use client";

import { motion, MotionProps } from "framer-motion";
import { HTMLAttributes } from "react";

type Props = MotionProps & HTMLAttributes<HTMLDivElement>;

export const ParentDivMotion = ({ children, ...rest }: Props) => {
  return <motion.div {...rest}>{children}</motion.div>;
};
