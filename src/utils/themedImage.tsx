"use client";

import { useEffect, useState } from "react";
import Image, { ImageProps } from "next/image";
import { useTheme } from "next-themes";
import type { StaticImageData } from "next/image";

type BaseImageProps = Omit<ImageProps, "src" | "alt">;

type ThemedImageProps = BaseImageProps & {
  icon: string | StaticImageData;
  iconDark?: string | StaticImageData;
  alt: string;
};

export default function ThemedImage({ icon, iconDark, alt, ...rest }: ThemedImageProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const src = mounted && theme === "dark" && iconDark ? iconDark : icon;

  return <Image src={src} alt={alt} {...rest} />;
}