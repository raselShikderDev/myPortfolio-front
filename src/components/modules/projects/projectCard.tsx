"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import Image from "next/image";
import { BsGithub } from "react-icons/bs";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
}

export default function ProjectCard({
  title,
  description,
  image,
  techStack,
  liveUrl,
  githubUrl,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }}
      className="h-full"
    >
      <Card className="relative overflow-hidden border bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300">
        {/* Image Section */}
        <motion.div className="relative group w-full h-52 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100"
          >
            <Button
              asChild
              size="sm"
              className="bg-white text-black hover:bg-white/90"
            >
              <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                <Globe className="w-4 h-4 mr-1" /> Live
              </a>
            </Button>

            <Button
              asChild
              size="sm"
              variant="secondary"
              className="bg-gray-800 text-white hover:bg-gray-700"
            >
              <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                <BsGithub className="w-4 h-4 mr-1" /> Code
              </a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Content */}
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>

        <CardContent>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-sm text-muted-foreground mb-3 line-clamp-3"
          >
            {description}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.05 },
              },
            }}
          >
            {techStack.map((tech, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Badge variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
